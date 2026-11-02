const { promisify } = require('node:util');
const {
  createHash,
  randomBytes,
  randomUUID,
  scrypt: scryptCallback,
  timingSafeEqual
} = require('node:crypto');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const mongoose = require('mongoose');
const AuthSession = require('../models/AuthSession');
const ResumeDraft = require('../models/ResumeDraft');
const User = require('../models/User');
const { normalizeResumeProfile } = require('../services/resumeNormalization');

const scrypt = promisify(scryptCallback);
const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_KEY_LENGTH = 64;
const SCRYPT_OPTIONS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_COOKIE = 'syncskills_session';
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const GOAL_TRACKS = new Set(['company', 'college', 'capstone', 'hackathon']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DUMMY_PASSWORD_HASH = hashPassword(randomBytes(32).toString('hex'));

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, PASSWORD_KEY_LENGTH, SCRYPT_OPTIONS);
  return `scrypt$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

async function verifyPassword(password, encodedHash) {
  const [algorithm, n, r, p, saltValue, keyValue] = String(encodedHash || '').split('$');
  if (algorithm !== 'scrypt' || Number(n) !== SCRYPT_OPTIONS.N || Number(r) !== SCRYPT_OPTIONS.r || Number(p) !== SCRYPT_OPTIONS.p) {
    return false;
  }

  try {
    const salt = Buffer.from(saltValue, 'base64url');
    const expectedKey = Buffer.from(keyValue, 'base64url');
    if (salt.length !== 16 || expectedKey.length !== PASSWORD_KEY_LENGTH) return false;
    const candidateKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH, SCRYPT_OPTIONS);
    return timingSafeEqual(candidateKey, expectedKey);
  } catch {
    return false;
  }
}

function readCookie(req, name) {
  const cookieHeader = req.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    return part.slice(separator + 1).trim();
  }
  return null;
}

function allowedOrigins(env) {
  const configuredOrigins = env.CLIENT_ORIGIN || env.FRONTEND_ORIGINS || 'http://localhost:5173';
  return new Set(configuredOrigins.split(',').map((origin) => origin.trim()).filter(Boolean));
}

function serializeUser(user) {
  const profile = user.profile || {};
  const personal = profile.personalInformation || {};
  return {
    id: String(user._id),
    profileId: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role || personal.headline || '',
    experience: user.experience || '',
    department: '',
    goalTrack: user.goalTrack,
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    previousProjects: Array.isArray(profile.projects) ? profile.projects.map((project) => ({
      title: project.title,
      desc: project.description || '',
      tech: Array.isArray(project.technologies) ? project.technologies.join(', ') : ''
    })) : [],
    skills: Array.isArray(profile.skills) ? profile.skills.map((skill) => ({
      name: skill.name,
      level: skill.proficiency || 'Not specified',
      category: skill.category
    })) : [],
    cvName: null,
    authenticatedAt: new Date().toISOString(),
    profile
  };
}

function createAuthRouter(dependencies = {}) {
  const router = express.Router();
  const env = dependencies.env || process.env;
  const users = dependencies.User || User;
  const sessions = dependencies.AuthSession || AuthSession;
  const drafts = dependencies.ResumeDraft || ResumeDraft;
  const isDatabaseReady = dependencies.isDatabaseReady || (() => mongoose.connection.readyState === 1);
  const logger = dependencies.logger || console;
  const origins = allowedOrigins(env);
  const cookieSecure = env.NODE_ENV === 'production' ? '; Secure' : '';

  router.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('X-Request-Id', req.requestId);
    res.set('Cache-Control', 'no-store');
    next();
  });

  const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many account requests. Please try again later.' },
      requestId: req.requestId
    })
  });
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many sign-in attempts. Please try again later.' },
      requestId: req.requestId
    })
  });

  function verifyRequestOrigin(req, res, next) {
    const origin = req.get('origin');
    if (origin && origins.has(origin)) return next();
    if (!origin && env.NODE_ENV !== 'production') return next();
    return res.status(403).json({
      success: false,
      error: { code: 'ORIGIN_NOT_ALLOWED', message: 'This request origin is not allowed.' },
      requestId: req.requestId
    });
  }

  function requireDatabase(res) {
    if (isDatabaseReady()) return true;
    res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'Account services are unavailable. Please try again later.' },
      requestId: res.get('X-Request-Id')
    });
    return false;
  }

  function setSessionCookie(res, token, rememberMe = false) {
    const maxAge = rememberMe ? `; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}` : '';
    res.append('Set-Cookie', `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax${maxAge}${cookieSecure}`);
  }

  function clearSessionCookie(res) {
    res.append('Set-Cookie', `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${cookieSecure}`);
  }

  function sendUnexpectedError(res, error, event) {
    logger.error(JSON.stringify({
      event,
      requestId: res.get('X-Request-Id'),
      category: error?.name || 'UnknownError'
    }));
    return res.status(503).json({
      success: false,
      error: { code: 'AUTH_SERVICE_UNAVAILABLE', message: 'The account request could not be completed. Please try again.' },
      requestId: res.get('X-Request-Id')
    });
  }

  async function createSession(user, req, res, rememberMe = false) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + (rememberMe ? SESSION_TTL_MS : 12 * 60 * 60 * 1000));
    await sessions.create({
      userId: user._id,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: (req.get('user-agent') || '').slice(0, 300) || null
    });
    setSessionCookie(res, token, rememberMe);
  }

  async function claimResumeDraft(token) {
    if (!TOKEN_PATTERN.test(token)) {
      const error = new Error('The resume draft is invalid. Please upload and extract your resume again.');
      error.status = 404;
      error.code = 'DRAFT_NOT_FOUND';
      throw error;
    }

    const existing = await drafts.findOne({ tokenHash: hashToken(token) });
    if (!existing || existing.status !== 'pending') {
      const error = new Error('The resume draft is unavailable or has already been used.');
      error.status = 409;
      error.code = 'DRAFT_NOT_FOUND';
      throw error;
    }
    if (existing.expiresAt <= new Date()) {
      await drafts.deleteOne({ _id: existing._id });
      const error = new Error('The resume draft expired. Please upload and extract your resume again.');
      error.status = 410;
      error.code = 'DRAFT_EXPIRED';
      throw error;
    }

    const claimed = await drafts.findOneAndUpdate(
      { _id: existing._id, status: 'pending', expiresAt: { $gt: new Date() } },
      { $set: { status: 'consuming' } },
      { new: true }
    );
    if (!claimed) {
      const error = new Error('The resume draft is unavailable or has already been used.');
      error.status = 409;
      error.code = 'DRAFT_NOT_FOUND';
      throw error;
    }
    return claimed;
  }

  async function restoreResumeDraft(draft, error) {
    if (!draft) return;
    try {
      await drafts.updateOne(
        { _id: draft._id, status: 'consuming' },
        { $set: { status: 'pending' } }
      );
    } catch (restoreError) {
      logger.error(JSON.stringify({
        event: 'resume_draft_restore_failed',
        category: restoreError?.name || 'UnknownError',
        originalCategory: error?.name || 'UnknownError'
      }));
    }
  }

  router.post('/register', signupLimiter, verifyRequestOrigin, async (req, res) => {
    if (!requireDatabase(res)) return;
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const role = typeof req.body?.role === 'string' ? req.body.role.trim() : '';
    const experience = typeof req.body?.experience === 'string' ? req.body.experience.trim() : '';
    const goalTrack = typeof req.body?.goalTrack === 'string' ? req.body.goalTrack : 'capstone';

    if (!name || name.length > 120 || !EMAIL_PATTERN.test(email) || email.length > 254) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ACCOUNT', message: 'Enter a valid name and email address.' },
        requestId: req.requestId
      });
    }
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: `Choose a password between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`
        },
        requestId: req.requestId
      });
    }
    if (role.length > 160 || experience.length > 120 || !GOAL_TRACKS.has(goalTrack)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROFILE', message: 'Review the account profile fields and try again.' },
        requestId: req.requestId
      });
    }

    let profile;
    try {
      profile = normalizeResumeProfile(req.body.profileDraft || {
        personalInformation: { fullName: name }
      });
      profile.personalInformation.fullName = name;
      if (role) profile.personalInformation.headline = role;
    } catch {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROFILE', message: 'Review the profile and correct invalid fields before creating your account.' },
        requestId: req.requestId
      });
    }

    let passwordHash;
    try {
      passwordHash = await hashPassword(password);
    } catch (error) {
      return sendUnexpectedError(res, error, 'password_hash_failed');
    }

    let claimedDraft = null;
    let createdUser = null;
    let createdSession = null;
    try {
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { code: 'EMAIL_ALREADY_REGISTERED', message: 'An account with this email already exists. Sign in instead.' },
          requestId: req.requestId
        });
      }

      if (req.body.resumeDraftToken) {
        claimedDraft = await claimResumeDraft(String(req.body.resumeDraftToken));
      }

      createdUser = await users.create({
        name,
        email,
        passwordHash,
        role: role || null,
        experience: experience || null,
        goalTrack,
        profile,
        ...(claimedDraft ? { sourceDraftId: claimedDraft._id } : {})
      });

      const token = randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
      createdSession = await sessions.create({
        userId: createdUser._id,
        tokenHash: hashToken(token),
        expiresAt,
        userAgent: (req.get('user-agent') || '').slice(0, 300) || null
      });

      if (claimedDraft) {
        const consumed = await drafts.updateOne(
          { _id: claimedDraft._id, status: 'consuming' },
          { $set: { status: 'consumed', profile: null } }
        );
        if (consumed.modifiedCount === 0) throw new Error('The resume draft could not be finalized.');
      }

      setSessionCookie(res, token, true);
      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        data: { user: serializeUser(createdUser) },
        requestId: req.requestId
      });
    } catch (error) {
      const cleanupErrors = [];
      if (createdSession) {
        try {
          await sessions.deleteOne({ _id: createdSession._id });
        } catch (cleanupError) {
          cleanupErrors.push(cleanupError);
        }
      }
      if (createdUser) {
        try {
          await users.deleteOne({ _id: createdUser._id });
        } catch (cleanupError) {
          cleanupErrors.push(cleanupError);
        }
      }
      await restoreResumeDraft(claimedDraft, error);
      for (const cleanupError of cleanupErrors) {
        logger.error(JSON.stringify({
          event: 'account_registration_rollback_failed',
          requestId: req.requestId,
          category: cleanupError?.name || 'UnknownError'
        }));
      }

      if (error?.code === 11000) {
        const draftConflict = Boolean(error.keyPattern?.sourceDraftId);
        return res.status(409).json({
          success: false,
          error: draftConflict
            ? { code: 'DRAFT_ALREADY_USED', message: 'This resume draft has already been used to create an account.' }
            : { code: 'EMAIL_ALREADY_REGISTERED', message: 'An account with this email already exists. Sign in instead.' },
          requestId: req.requestId
        });
      }
      if (Number.isInteger(error?.status)) {
        return res.status(error.status).json({
          success: false,
          error: { code: error.code, message: error.message },
          requestId: req.requestId
        });
      }
      return sendUnexpectedError(res, error, 'account_registration_failed');
    }
  });

  router.post('/login', loginLimiter, verifyRequestOrigin, async (req, res) => {
    if (!requireDatabase(res)) return;
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!EMAIL_PATTERN.test(email) || email.length > 254 || !password || password.length > PASSWORD_MAX_LENGTH) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Enter a valid email address and password.' },
        requestId: req.requestId
      });
    }

    try {
      const userQuery = users.findOne({ email });
      const user = await (typeof userQuery.select === 'function' ? userQuery.select('+passwordHash') : userQuery);
      const passwordHash = user?.passwordHash || await DUMMY_PASSWORD_HASH;
      const passwordMatches = await verifyPassword(password, passwordHash);
      if (!user || !passwordMatches) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' },
          requestId: req.requestId
        });
      }

      await createSession(user, req, res, req.body?.rememberMe === true);
      return res.json({
        success: true,
        message: 'Signed in successfully.',
        data: { user: serializeUser(user) },
        requestId: req.requestId
      });
    } catch (error) {
      return sendUnexpectedError(res, error, 'account_login_failed');
    }
  });

  router.get('/me', async (req, res) => {
    if (!requireDatabase(res)) return;
    const token = readCookie(req, SESSION_COOKIE);
    if (!token || !TOKEN_PATTERN.test(token)) {
      clearSessionCookie(res);
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_REQUIRED', message: 'Sign in to continue.' },
        requestId: req.requestId
      });
    }

    try {
      const session = await sessions.findOne({
        tokenHash: hashToken(token),
        expiresAt: { $gt: new Date() }
      });
      if (!session) {
        clearSessionCookie(res);
        return res.status(401).json({
          success: false,
          error: { code: 'AUTHENTICATION_REQUIRED', message: 'Your session expired. Please sign in again.' },
          requestId: req.requestId
        });
      }
      const user = await users.findById(session.userId);
      if (!user) {
        await sessions.deleteOne({ _id: session._id });
        clearSessionCookie(res);
        return res.status(401).json({
          success: false,
          error: { code: 'AUTHENTICATION_REQUIRED', message: 'Your account is unavailable. Please sign in again.' },
          requestId: req.requestId
        });
      }
      return res.json({ success: true, data: { user: serializeUser(user) }, requestId: req.requestId });
    } catch (error) {
      return sendUnexpectedError(res, error, 'account_session_lookup_failed');
    }
  });

  router.post('/logout', verifyRequestOrigin, async (req, res) => {
    if (!requireDatabase(res)) return;
    const token = readCookie(req, SESSION_COOKIE);
    try {
      if (token && TOKEN_PATTERN.test(token)) {
        await sessions.deleteOne({ tokenHash: hashToken(token) });
      }
      clearSessionCookie(res);
      return res.status(204).end();
    } catch (error) {
      return sendUnexpectedError(res, error, 'account_logout_failed');
    }
  });

  return router;
}

module.exports = { createAuthRouter, hashPassword, hashToken, serializeUser, verifyPassword };

const { createHash, randomBytes, randomUUID } = require('node:crypto');
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
const ResumeDraft = require('../models/ResumeDraft');
const StudentProfile = require('../models/StudentProfile');
const { getAIConfig, getResumeConfig } = require('../config/resumeConfig');
const { ResumeProcessingError, createResumeProcessingService } = require('../services/resumeProcessingService');
const { normalizeResumeProfile } = require('../services/resumeNormalization');

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function createResumeRouter(dependencies = {}) {
  const router = express.Router();
  const config = dependencies.config || getResumeConfig(dependencies.env);
  const env = dependencies.env || process.env;
  const drafts = dependencies.ResumeDraft || ResumeDraft;
  const profiles = dependencies.StudentProfile || StudentProfile;
  const isDatabaseReady = dependencies.isDatabaseReady || (() => mongoose.connection.readyState === 1);
  let activeParseCount = 0;
  const processResume = dependencies.processResume || createResumeProcessingService({
    config,
    providerFactory: () => (dependencies.providerFactory
      ? dependencies.providerFactory()
      : require('../services/aiProviderFactory').createAIProvider(env))
  }).process;

  router.use((req, res, next) => {
    req.requestId = randomUUID();
    res.set('X-Request-Id', req.requestId);
    res.set('Cache-Control', 'no-store');
    next();
  });

  const parseLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many resume requests. Please try again later.' },
      requestId: req.requestId
    })
  });
  const draftLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many onboarding requests. Please try again later.' },
      requestId: req.requestId
    })
  });
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: config.maxFileSizeBytes, files: 1, fields: 2, fieldSize: 64 * 1024 }
  });

  function sendError(res, error, fallbackMessage = 'The request could not be completed.') {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === 'LIMIT_FILE_SIZE';
      return res.status(tooLarge ? 413 : 400).json({
        success: false,
        error: {
          code: tooLarge ? 'FILE_TOO_LARGE' : 'INVALID_UPLOAD',
          message: tooLarge
            ? `The resume exceeds the ${Math.floor(config.maxFileSizeBytes / (1024 * 1024))} MB file size limit.`
            : 'Upload one PDF or DOCX resume only.'
        },
        requestId: res.get('X-Request-Id')
      });
    }

    if (error instanceof ResumeProcessingError || Number.isInteger(error?.status)) {
      return res.status(error.status).json({
        success: false,
        error: { code: error.code || 'RESUME_PROCESSING_FAILED', message: error.message },
        requestId: res.get('X-Request-Id')
      });
    }

    (dependencies.logger || console).error(JSON.stringify({
      event: 'onboarding_request_failed',
      requestId: res.get('X-Request-Id'),
      category: error?.name || 'UnknownError'
    }));
    return res.status(503).json({
      success: false,
      error: { code: 'PERSISTENCE_UNAVAILABLE', message: fallbackMessage },
      requestId: res.get('X-Request-Id')
    });
  }

  function requireDatabase(res) {
    if (isDatabaseReady()) return true;
    res.status(503).json({
      success: false,
      error: { code: 'DATABASE_UNAVAILABLE', message: 'Profile storage is unavailable. Please try again later.' },
      requestId: res.get('X-Request-Id')
    });
    return false;
  }

  async function createDraft(source, profile = null, metadata = {}) {
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + config.draftTtlMinutes * 60 * 1000);
    const draft = await drafts.create({
      tokenHash: hashToken(token),
      profile,
      status: 'pending',
      source,
      metadata,
      expiresAt
    });
    return { token, draft };
  }

  router.get('/resumes/config', (req, res) => {
    try {
      const ai = getAIConfig(env, { requireApiKey: false });
      return res.json({
        success: true,
        data: {
          provider: ai.provider,
          providerConfigured: Boolean(ai.apiKey),
          maxFileSizeBytes: config.maxFileSizeBytes,
          allowedExtensions: ['pdf', 'docx']
        }
      });
    } catch (error) {
      return res.json({
        success: true,
        data: {
          provider: null,
          providerConfigured: false,
          maxFileSizeBytes: config.maxFileSizeBytes,
          allowedExtensions: ['pdf', 'docx']
        }
      });
    }
  });

  router.post('/resumes/parse', parseLimiter, upload.single('resume'), async (req, res) => {
    if (req.body.consent !== 'true') {
      return res.status(400).json({
        success: false,
        error: { code: 'CONSENT_REQUIRED', message: 'Consent is required before sending resume text to the selected AI provider.' },
        requestId: req.requestId
      });
    }
    if (!requireDatabase(res)) return;
    if (activeParseCount >= 2) {
      return res.status(503).json({
        success: false,
        error: { code: 'PROCESSING_BUSY', message: 'Resume analysis is busy. Please retry shortly.' },
        requestId: req.requestId
      });
    }

    activeParseCount += 1;
    try {
      const ai = getAIConfig(env);
      const extracted = await processResume(req.file, { requestId: req.requestId });
      const { token } = await createDraft('resume', extracted.profileDraft, {
        filename: extracted.document.filename,
        fileType: extracted.document.fileType,
        schemaVersion: extracted.metadata.schemaVersion,
        provider: ai.provider,
        model: extracted.metadata.model
      });

      return res.status(201).json({
        success: true,
        message: 'Resume processed successfully. Review and edit every section before saving.',
        data: {
          ...extracted,
          draftToken: token
        },
        requestId: req.requestId
      });
    } catch (error) {
      if (error?.message?.includes('AI_API_KEY') || error?.message?.includes('AI_PROVIDER')) {
        error.status = 503;
        error.code = 'AI_NOT_CONFIGURED';
        error.message = 'Resume analysis is not configured. Contact the administrator or continue with manual entry.';
      }
      return sendError(res, error, 'The resume draft could not be saved.');
    } finally {
      activeParseCount -= 1;
    }
  });

  router.post('/onboarding/drafts', draftLimiter, async (req, res) => {
    if (!requireDatabase(res)) return;
    try {
      const { token } = await createDraft('manual');
      return res.status(201).json({
        success: true,
        data: { draftToken: token, expiresInMinutes: config.draftTtlMinutes }
      });
    } catch (error) {
      return sendError(res, error, 'Manual profile storage is unavailable.');
    }
  });

  router.post('/onboarding/drafts/:token/confirm', draftLimiter, async (req, res) => {
    if (!requireDatabase(res)) return;
    if (!TOKEN_PATTERN.test(req.params.token)) {
      return res.status(404).json({
        success: false,
        error: { code: 'DRAFT_NOT_FOUND', message: 'This onboarding draft is unavailable or has expired.' },
        requestId: req.requestId
      });
    }

    let profile;
    try {
      profile = normalizeResumeProfile(req.body?.profileDraft);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROFILE', message: 'Review the profile and correct invalid or incomplete fields before saving.' },
        requestId: req.requestId
      });
    }

    try {
      const tokenHash = hashToken(req.params.token);
      const existing = await drafts.findOne({ tokenHash });
      if (!existing) {
        return res.status(404).json({
          success: false,
          error: { code: 'DRAFT_NOT_FOUND', message: 'This onboarding draft is unavailable or has expired.' },
          requestId: req.requestId
        });
      }
      if (existing.expiresAt <= new Date()) {
        await drafts.deleteOne({ _id: existing._id });
        return res.status(410).json({
          success: false,
          error: { code: 'DRAFT_EXPIRED', message: 'This onboarding draft has expired. Start the profile step again.' },
          requestId: req.requestId
        });
      }
      if (existing.status !== 'pending') {
        return res.status(409).json({
          success: false,
          error: { code: 'DRAFT_ALREADY_USED', message: 'This onboarding draft has already been confirmed.' },
          requestId: req.requestId
        });
      }

      const claimed = await drafts.findOneAndUpdate(
        { _id: existing._id, status: 'pending', expiresAt: { $gt: new Date() } },
        { $set: { status: 'consuming' } },
        { new: true }
      );
      if (!claimed) {
        return res.status(409).json({
          success: false,
          error: { code: 'DRAFT_ALREADY_USED', message: 'This onboarding draft has already been confirmed.' },
          requestId: req.requestId
        });
      }

      let savedProfile;
      try {
        savedProfile = await profiles.create({
          sourceDraftId: claimed._id,
          profile,
          ownerStatus: 'unclaimed',
          extraction: {
            schemaVersion: claimed.metadata?.schemaVersion || '1.0',
            provider: claimed.metadata?.provider || null,
            model: claimed.metadata?.model || null,
            confirmedAt: new Date()
          }
        });
      } catch (error) {
        await drafts.updateOne({ _id: claimed._id, status: 'consuming' }, { $set: { status: 'pending' } });
        throw error;
      }

      await drafts.updateOne(
        { _id: claimed._id, status: 'consuming' },
        { $set: { status: 'consumed', profile: null } }
      );
      return res.status(201).json({
        success: true,
        message: 'Profile saved as a private, unclaimed onboarding profile.',
        data: {
          profileId: String(savedProfile._id),
          ownerStatus: 'unclaimed',
          profile
        },
        requestId: req.requestId
      });
    } catch (error) {
      return sendError(res, error, 'The confirmed profile could not be saved.');
    }
  });

  router.delete('/onboarding/drafts/:token', draftLimiter, async (req, res) => {
    if (!requireDatabase(res)) return;
    if (!TOKEN_PATTERN.test(req.params.token)) {
      return res.status(404).json({
        success: false,
        error: { code: 'DRAFT_NOT_FOUND', message: 'This onboarding draft is unavailable or has expired.' },
        requestId: req.requestId
      });
    }

    try {
      const removed = await drafts.findOneAndDelete({
        tokenHash: hashToken(req.params.token),
        status: 'pending',
        expiresAt: { $gt: new Date() }
      });
      if (!removed) {
        return res.status(404).json({
          success: false,
          error: { code: 'DRAFT_NOT_FOUND', message: 'This onboarding draft is unavailable or has expired.' },
          requestId: req.requestId
        });
      }
      return res.json({ success: true, message: 'Onboarding draft removed.' });
    } catch (error) {
      return sendError(res, error, 'The onboarding draft could not be removed.');
    }
  });

  router.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    return sendError(res, error);
  });

  return router;
}

module.exports = { createResumeRouter, hashToken };

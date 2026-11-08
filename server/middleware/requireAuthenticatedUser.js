const mongoose = require('mongoose');
const AuthSession = require('../models/AuthSession');
const User = require('../models/User');
const { SESSION_TOKEN_PATTERN, hashToken, readSessionToken } = require('../services/authTokens');

function createRequireAuthenticatedUser(dependencies = {}) {
  const sessions = dependencies.AuthSession || AuthSession;
  const users = dependencies.User || User;
  const isDatabaseReady = dependencies.isDatabaseReady || (() => mongoose.connection.readyState === 1);
  const logger = dependencies.logger || console;

  return async function requireAuthenticatedUser(req, res, next) {
    res.set('Cache-Control', 'no-store');
    if (!isDatabaseReady()) {
      return res.status(503).json({
        success: false,
        error: { code: 'DATABASE_UNAVAILABLE', message: 'Account services are unavailable. Please try again later.' }
      });
    }

    const token = readSessionToken(req);
    if (!token || !SESSION_TOKEN_PATTERN.test(token)) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTHENTICATION_REQUIRED', message: 'Sign in to continue.' }
      });
    }

    try {
      const session = await sessions.findOne({
        tokenHash: hashToken(token),
        expiresAt: { $gt: new Date() }
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          error: { code: 'AUTHENTICATION_REQUIRED', message: 'Your session expired. Please sign in again.' }
        });
      }

      const user = await users.findById(session.userId);
      if (!user) {
        await sessions.deleteOne({ _id: session._id });
        return res.status(401).json({
          success: false,
          error: { code: 'AUTHENTICATION_REQUIRED', message: 'Your account is unavailable. Please sign in again.' }
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      logger.error(JSON.stringify({
        event: 'authenticated_user_lookup_failed',
        category: error?.name || 'UnknownError'
      }));
      return res.status(503).json({
        success: false,
        error: { code: 'AUTH_SERVICE_UNAVAILABLE', message: 'The account request could not be completed. Please try again.' }
      });
    }
  };
}

module.exports = { createRequireAuthenticatedUser };

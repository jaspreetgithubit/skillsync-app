const { createHash } = require('node:crypto');

const SESSION_COOKIE = 'syncskills_session';
const SESSION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function readSessionToken(req) {
  const cookieHeader = req.get('cookie') || '';
  for (const part of cookieHeader.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0 || part.slice(0, separator).trim() !== SESSION_COOKIE) continue;
    return part.slice(separator + 1).trim();
  }
  return null;
}

module.exports = { SESSION_COOKIE, SESSION_TOKEN_PATTERN, hashToken, readSessionToken };

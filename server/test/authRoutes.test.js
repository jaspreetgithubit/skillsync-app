const assert = require('node:assert/strict');
const { createHash, randomBytes, randomUUID } = require('node:crypto');
const express = require('express');
const { after, test } = require('node:test');
const { createAuthRouter } = require('../routes/authRoutes');
const { validProfile } = require('../test-support/resumeFixtures');

const servers = [];
const PASSWORD = 'correct horse battery staple';
const ORIGIN = 'http://localhost:5173';

after(async () => {
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
});

async function createHarness({ databaseReady = true } = {}) {
  const usersByEmail = new Map();
  const usersById = new Map();
  const sessionsByHash = new Map();
  const draftsByHash = new Map();

  const users = {
    async findOne({ email }) {
      return usersByEmail.get(email) || null;
    },
    async findById(id) {
      return usersById.get(String(id)) || null;
    },
    async create(input) {
      if (usersByEmail.has(input.email)) {
        const error = new Error('Duplicate email.');
        error.code = 11000;
        error.keyPattern = { email: 1 };
        throw error;
      }
      const user = { _id: randomUUID(), ...input };
      usersByEmail.set(user.email, user);
      usersById.set(String(user._id), user);
      return user;
    },
    async deleteOne({ _id }) {
      const user = usersById.get(String(_id));
      if (user) {
        usersById.delete(String(_id));
        usersByEmail.delete(user.email);
      }
    }
  };
  const sessions = {
    async create(input) {
      const session = { _id: randomUUID(), ...input };
      sessionsByHash.set(session.tokenHash, session);
      return session;
    },
    async findOne({ tokenHash, expiresAt }) {
      const session = sessionsByHash.get(tokenHash);
      return session && session.expiresAt > expiresAt.$gt ? session : null;
    },
    async deleteOne(filter) {
      if (filter.tokenHash) sessionsByHash.delete(filter.tokenHash);
      if (filter._id) {
        for (const [hash, session] of sessionsByHash) {
          if (String(session._id) === String(filter._id)) sessionsByHash.delete(hash);
        }
      }
    }
  };
  const drafts = {
    async findOne({ tokenHash }) {
      return draftsByHash.get(tokenHash) || null;
    },
    async findOneAndUpdate(filter, update) {
      const draft = [...draftsByHash.values()].find((candidate) => (
        String(candidate._id) === String(filter._id)
        && candidate.status === filter.status
        && candidate.expiresAt > filter.expiresAt.$gt
      ));
      if (!draft) return null;
      Object.assign(draft, update.$set);
      return draft;
    },
    async updateOne(filter, update) {
      const draft = [...draftsByHash.values()].find((candidate) => (
        String(candidate._id) === String(filter._id)
        && candidate.status === filter.status
      ));
      if (!draft) return { modifiedCount: 0 };
      Object.assign(draft, update.$set);
      return { modifiedCount: 1 };
    },
    async deleteOne({ _id }) {
      for (const [hash, draft] of draftsByHash) {
        if (String(draft._id) === String(_id)) draftsByHash.delete(hash);
      }
    }
  };

  const app = express();
  app.use(express.json({ limit: '256kb' }));
  app.use('/api/auth', createAuthRouter({
    env: { NODE_ENV: 'test', CLIENT_ORIGIN: ORIGIN },
    User: users,
    AuthSession: sessions,
    ResumeDraft: drafts,
    isDatabaseReady: () => databaseReady,
    logger: { error() {} }
  }));
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  servers.push(server);

  return {
    usersByEmail,
    sessionsByHash,
    draftsByHash,
    baseUrl: `http://127.0.0.1:${server.address().port}`
  };
}

function requestHeaders() {
  return { Origin: ORIGIN, 'Content-Type': 'application/json' };
}

async function readJson(response) {
  return { status: response.status, body: await response.json() };
}

async function register(harness, data = {}) {
  const response = await fetch(`${harness.baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: requestHeaders(),
    body: JSON.stringify({
      name: 'Ada Lovelace',
      email: 'Ada@example.edu',
      password: PASSWORD,
      goalTrack: 'capstone',
      profileDraft: validProfile(),
      ...data
    })
  });
  return {
    status: response.status,
    body: await response.json(),
    setCookie: response.headers.get('set-cookie')
  };
}

test('registration stores a salted password hash and creates a database-backed session', async () => {
  const harness = await createHarness();
  const { status, body, setCookie } = await register(harness);

  assert.equal(status, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.user.name, 'Ada Lovelace');
  assert.equal(body.data.user.email, 'ada@example.edu');
  assert.ok(body.data.user.id);
  assert.equal('passwordHash' in body.data.user, false);

  const storedUser = harness.usersByEmail.get('ada@example.edu');
  assert.match(storedUser.passwordHash, /^scrypt\$32768\$8\$1\$/);
  assert.notEqual(storedUser.passwordHash, PASSWORD);
  assert.equal(harness.sessionsByHash.size, 1);
  assert.equal(body.data.user.profile.personalInformation.fullName, 'Ada Lovelace');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Max-Age=604800/);
  const restored = await readJson(await fetch(`${harness.baseUrl}/api/auth/me`, {
    headers: { Cookie: setCookie.split(';')[0] }
  }));
  assert.equal(restored.status, 200);
  assert.equal(restored.body.data.user.id, body.data.user.id);
});

test('login, session lookup, and logout use the opaque HttpOnly session cookie', async () => {
  const harness = await createHarness();
  await register(harness);

  const response = await fetch(`${harness.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: requestHeaders(),
    body: JSON.stringify({ email: 'ADA@example.edu', password: PASSWORD, rememberMe: true })
  });
  assert.equal(response.status, 200);
  const setCookie = response.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  assert.match(setCookie, /Max-Age=604800/);
  const cookie = setCookie.split(';')[0];

  const currentUser = await readJson(await fetch(`${harness.baseUrl}/api/auth/me`, {
    headers: { Cookie: cookie }
  }));
  assert.equal(currentUser.status, 200);
  assert.equal(currentUser.body.data.user.email, 'ada@example.edu');

  const logout = await fetch(`${harness.baseUrl}/api/auth/logout`, {
    method: 'POST',
    headers: { Origin: ORIGIN, Cookie: cookie }
  });
  assert.equal(logout.status, 204);
  assert.equal(harness.sessionsByHash.size, 1);

  const afterLogout = await readJson(await fetch(`${harness.baseUrl}/api/auth/me`, {
    headers: { Cookie: cookie }
  }));
  assert.equal(afterLogout.status, 401);
});

test('rejects short passwords, duplicate accounts, wrong passwords, and untrusted origins', async () => {
  const harness = await createHarness();
  const shortPassword = await register(harness, { password: 'short' });
  assert.equal(shortPassword.status, 400);
  assert.equal(shortPassword.body.error.code, 'INVALID_PASSWORD');

  await register(harness);
  const duplicate = await register(harness);
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error.code, 'EMAIL_ALREADY_REGISTERED');

  const wrongPassword = await readJson(await fetch(`${harness.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: requestHeaders(),
    body: JSON.stringify({ email: 'ada@example.edu', password: 'not the password' })
  }));
  assert.equal(wrongPassword.status, 401);
  assert.equal(wrongPassword.body.error.code, 'INVALID_CREDENTIALS');

  const untrustedOrigin = await fetch(`${harness.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { ...requestHeaders(), Origin: 'https://unexpected.example' },
    body: JSON.stringify({ email: 'ada@example.edu', password: PASSWORD })
  });
  assert.equal(untrustedOrigin.status, 403);
});

test('registering with a resume draft links its reviewed profile and consumes the one-time token', async () => {
  const harness = await createHarness();
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const draft = {
    _id: randomUUID(),
    tokenHash,
    status: 'pending',
    expiresAt: new Date(Date.now() + 60_000),
    profile: validProfile(),
    metadata: { provider: 'gemini' }
  };
  harness.draftsByHash.set(tokenHash, draft);

  const { status, body } = await register(harness, {
    email: 'resume@example.edu',
    resumeDraftToken: token
  });

  assert.equal(status, 201);
  assert.equal(body.data.user.email, 'resume@example.edu');
  assert.equal(String(harness.usersByEmail.get('resume@example.edu').sourceDraftId), draft._id);
  assert.equal(draft.status, 'consumed');
  assert.equal(draft.profile, null);
});

test('account endpoints report unavailable storage instead of accepting local-only accounts', async () => {
  const harness = await createHarness({ databaseReady: false });
  const { status, body } = await register(harness);
  assert.equal(status, 503);
  assert.equal(body.error.code, 'DATABASE_UNAVAILABLE');
  assert.equal(harness.usersByEmail.size, 0);
});

const assert = require('node:assert/strict');
const { createHash, randomUUID } = require('node:crypto');
const express = require('express');
const { after, test } = require('node:test');
const { createResumeRouter } = require('../routes/resumeRoutes');
const { validProfile, createPdf } = require('../test-support/resumeFixtures');

const servers = [];
after(async () => {
  await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
});

async function createHarness({ databaseReady = true, maxFileSizeBytes = 1024 } = {}) {
  const draftStore = new Map();
  const profileStore = new Map();
  const drafts = {
    async create(draft) {
      const saved = { _id: randomUUID(), ...draft };
      draftStore.set(saved.tokenHash, saved);
      return saved;
    },
    async findOne({ tokenHash }) {
      return draftStore.get(tokenHash) || null;
    },
    async findOneAndUpdate(filter, update) {
      const saved = [...draftStore.values()].find((draft) => (
        String(draft._id) === String(filter._id)
        && draft.status === filter.status
        && draft.expiresAt > filter.expiresAt.$gt
      ));
      if (!saved) return null;
      Object.assign(saved, update.$set);
      return saved;
    },
    async updateOne(filter, update) {
      const saved = [...draftStore.values()].find((draft) => String(draft._id) === String(filter._id));
      if (saved) Object.assign(saved, update.$set);
      return { modifiedCount: saved ? 1 : 0 };
    },
    async deleteOne({ _id }) {
      for (const [hash, draft] of draftStore) {
        if (String(draft._id) === String(_id)) draftStore.delete(hash);
      }
    },
    async findOneAndDelete({ tokenHash, status, expiresAt }) {
      const draft = draftStore.get(tokenHash);
      if (!draft || draft.status !== status || draft.expiresAt <= expiresAt.$gt) return null;
      draftStore.delete(tokenHash);
      return draft;
    }
  };
  const profiles = {
    async create(profile) {
      const saved = { _id: randomUUID(), ...profile };
      profileStore.set(saved.sourceDraftId, saved);
      return saved;
    }
  };
  let processed = 0;
  const app = express();
  app.use(express.json());
  app.use('/api', createResumeRouter({
    env: { AI_PROVIDER: 'gemini', AI_API_KEY: 'test-key' },
    config: {
      maxFileSizeBytes,
      maxPages: 10,
      maxTextChars: 30000,
      draftTtlMinutes: 30
    },
    ResumeDraft: drafts,
    StudentProfile: profiles,
    isDatabaseReady: () => databaseReady,
    processResume: async () => {
      processed += 1;
      return {
        profileDraft: validProfile(),
        warnings: [],
        sectionsExtracted: ['personalInformation', 'skills', 'projects'],
        metadata: { schemaVersion: '1.0', provider: 'gemini', model: 'gemini-test', pageCount: 1 },
        document: { filename: 'resume.pdf', fileType: 'pdf' }
      };
    },
    logger: { error() {}, info() {}, warn() {} }
  }));
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  servers.push(server);

  return {
    draftStore,
    profileStore,
    getProcessedCount: () => processed,
    baseUrl: `http://127.0.0.1:${server.address().port}`
  };
}

function createUpload({ consent = true, content = createPdf('Valid readable resume text'), name = 'resume.pdf', mime = 'application/pdf' } = {}) {
  const form = new FormData();
  if (consent !== null) form.append('consent', String(consent));
  form.append('resume', new Blob([content], { type: mime }), name);
  return form;
}

async function readJson(response) {
  return { status: response.status, body: await response.json() };
}

test('resume parse requires explicit consent and a connected MongoDB', async () => {
  const harness = await createHarness();
  const noConsent = await readJson(await fetch(`${harness.baseUrl}/api/resumes/parse`, {
    method: 'POST',
    body: createUpload({ consent: false })
  }));
  assert.equal(noConsent.status, 400);
  assert.equal(noConsent.body.error.code, 'CONSENT_REQUIRED');

  const offline = await createHarness({ databaseReady: false });
  const noDatabase = await readJson(await fetch(`${offline.baseUrl}/api/resumes/parse`, {
    method: 'POST',
    body: createUpload()
  }));
  assert.equal(noDatabase.status, 503);
  assert.equal(noDatabase.body.error.code, 'DATABASE_UNAVAILABLE');
  assert.equal(offline.getProcessedCount(), 0);
});

test('parse returns a short-lived opaque draft token and stores only its hash', async () => {
  const harness = await createHarness();
  const { status, body } = await readJson(await fetch(`${harness.baseUrl}/api/resumes/parse`, {
    method: 'POST',
    body: createUpload()
  }));

  assert.equal(status, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.profileDraft.personalInformation.email, 'ada@example.edu');
  assert.equal(body.data.draftToken.length, 43);
  assert.equal(body.data.metadata.provider, 'gemini');
  const tokenHash = createHash('sha256').update(body.data.draftToken).digest('hex');
  assert.ok(harness.draftStore.has(tokenHash));
  assert.equal(harness.draftStore.get(tokenHash).tokenHash, tokenHash);
  assert.notEqual(harness.draftStore.get(tokenHash).tokenHash, body.data.draftToken);
});

test('enforces upload size and does not invoke extraction for an oversized file', async () => {
  const harness = await createHarness({ maxFileSizeBytes: 8 });
  const { status, body } = await readJson(await fetch(`${harness.baseUrl}/api/resumes/parse`, {
    method: 'POST',
    body: createUpload({ content: Buffer.alloc(20) })
  }));
  assert.equal(status, 413);
  assert.equal(body.error.code, 'FILE_TOO_LARGE');
  assert.equal(harness.getProcessedCount(), 0);
});

test('manual profile confirmation persists only a validated, unclaimed profile and consumes the token', async () => {
  const harness = await createHarness();
  const draftResponse = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts`, { method: 'POST' }));
  assert.equal(draftResponse.status, 201);
  const token = draftResponse.body.data.draftToken;
  const saved = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts/${token}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileDraft: validProfile() })
  }));

  assert.equal(saved.status, 201);
  assert.equal(saved.body.data.ownerStatus, 'unclaimed');
  assert.equal(saved.body.data.profile.personalInformation.email, 'ada@example.edu');
  assert.equal(harness.profileStore.size, 1);
  assert.equal([...harness.profileStore.values()][0].ownerStatus, 'unclaimed');

  const reused = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts/${token}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileDraft: validProfile() })
  }));
  assert.equal(reused.status, 409);
  assert.equal(reused.body.error.code, 'DRAFT_ALREADY_USED');
  assert.equal(harness.profileStore.size, 1);
});

test('blocks another token, expired drafts, and invalid profile bodies', async () => {
  const harness = await createHarness();
  const createDraft = async () => {
    const response = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts`, { method: 'POST' }));
    return response.body.data.draftToken;
  };
  const token = await createDraft();
  const unknown = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts/${'A'.repeat(43)}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileDraft: validProfile() })
  }));
  assert.equal(unknown.status, 404);

  const invalid = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts/${token}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileDraft: { skills: [{ name: 'React', proficiency: 'Guru' }] } })
  }));
  assert.equal(invalid.status, 400);
  assert.equal(invalid.body.error.code, 'INVALID_PROFILE');
  assert.equal(harness.profileStore.size, 0);

  const expiringToken = await createDraft();
  const expiringHash = createHash('sha256').update(expiringToken).digest('hex');
  harness.draftStore.get(expiringHash).expiresAt = new Date(0);
  const expired = await readJson(await fetch(`${harness.baseUrl}/api/onboarding/drafts/${expiringToken}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileDraft: validProfile() })
  }));
  assert.equal(expired.status, 410);
  assert.equal(expired.body.error.code, 'DRAFT_EXPIRED');
});

test('public resume configuration never returns an API key', async () => {
  const harness = await createHarness();
  const { status, body } = await readJson(await fetch(`${harness.baseUrl}/api/resumes/config`));
  assert.equal(status, 200);
  assert.equal(body.data.provider, 'gemini');
  assert.equal(body.data.providerConfigured, true);
  assert.equal(JSON.stringify(body).includes('test-key'), false);
});

test('rate limits resume parsing requests by client address', async () => {
  const harness = await createHarness();
  const responses = [];
  for (let index = 0; index < 6; index += 1) {
    responses.push(await fetch(`${harness.baseUrl}/api/resumes/parse`, {
      method: 'POST',
      body: createUpload()
    }));
  }
  assert.deepEqual(responses.map((response) => response.status), [201, 201, 201, 201, 201, 429]);
  assert.equal(harness.getProcessedCount(), 5);
});

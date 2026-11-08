const assert = require('node:assert/strict');
const express = require('express');
const { test } = require('node:test');
const { createCompatibilityRouter } = require('../routes/compatibilityRoutes');

const TOKEN = 'a'.repeat(43);
const PROJECT_ID = '507f1f77bcf86cd799439011';

async function createHarness(options = {}) {
  const project = options.project === undefined ? {
    _id: PROJECT_ID,
    projectTitle: 'Web Platform',
    requiredSkills: [{ name: 'React', weight: 5, priority: 'required' }]
  } : options.project;
  const user = options.user === undefined ? {
    _id: 'student-1',
    profile: { skills: [{ name: 'React', proficiency: 'Advanced' }] }
  } : options.user;
  const app = express();
  app.use(express.json());
  app.use('/api/projects', createCompatibilityRouter({
    Project: {
      findById: async () => {
        if (options.projectError) throw options.projectError;
        return project;
      }
    },
    User: { findById: async () => user },
    AuthSession: {
      findOne: async () => options.sessionError ? Promise.reject(options.sessionError) : { userId: 'student-1', _id: 'session-1' },
      deleteOne: async () => ({ deletedCount: 1 })
    },
    isDatabaseReady: () => options.databaseReady !== false,
    findLocalProject: async (id) => (
      id === options.localProject?.id ? options.localProject : null
    ),
    logger: { error() {} },
    env: options.env || {}
  }));
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  return {
    baseUrl,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    })
  };
}

async function readJson(response) {
  return { status: response.status, body: await response.json() };
}

test('authenticated student receives their own explainable project compatibility result', async () => {
  const harness = await createHarness();
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility?studentId=someone-else`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));

    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.data.project.id, PROJECT_ID);
    assert.equal(body.data.compatibility.score, 100);
    assert.deepEqual(body.data.compatibility.matchedSkills.map(({ requiredSkill }) => requiredSkill), ['React']);
    assert.equal(body.data.user, undefined);
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint rejects requests without an authenticated session', async () => {
  const harness = await createHarness();
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility`
    ));
    assert.equal(status, 401);
    assert.equal(body.error.code, 'AUTHENTICATION_REQUIRED');
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint does not calculate with an unconfirmed profile', async () => {
  const harness = await createHarness({ user: { _id: 'student-1', profile: { personalInformation: {} } } });
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 409);
    assert.equal(body.error.code, 'PROFILE_NOT_CONFIRMED');
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint reports a missing student profile', async () => {
  const harness = await createHarness({ user: { _id: 'student-1', profile: null } });
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 404);
    assert.equal(body.error.code, 'PROFILE_NOT_FOUND');
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint handles missing projects and invalid identifiers', async () => {
  const missingProject = await createHarness({ project: null });
  try {
    const { status, body } = await readJson(await fetch(
      `${missingProject.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 404);
    assert.equal(body.error.code, 'PROJECT_NOT_FOUND');
  } finally {
    await missingProject.close();
  }

  const invalidId = await createHarness();
  try {
    const { status, body } = await readJson(await fetch(
      `${invalidId.baseUrl}/api/projects/not-a-project/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 400);
    assert.equal(body.error.code, 'INVALID_PROJECT_ID');
  } finally {
    await invalidId.close();
  }
});

test('compatibility endpoint distinguishes missing project requirements', async () => {
  const harness = await createHarness({ project: { _id: PROJECT_ID, projectTitle: 'No Skills', requiredSkills: [] } });
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 422);
    assert.equal(body.error.code, 'PROJECT_REQUIREMENTS_NOT_CONFIGURED');
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint supports projects returned by the existing local JSON fallback', async () => {
  const localProject = {
    id: 'proj-local-42',
    projectTitle: 'Local fallback project',
    requiredSkills: [{ name: 'React.js', weight: 5 }]
  };
  const harness = await createHarness({ localProject });
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${localProject.id}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 200);
    assert.equal(body.data.compatibility.score, 100);
    assert.equal(body.data.project.id, localProject.id);
  } finally {
    await harness.close();
  }
});

test('compatibility endpoint rejects invalid requirements and reports database errors', async () => {
  const invalidProject = await createHarness({
    project: { _id: PROJECT_ID, projectTitle: 'Invalid', requiredSkills: [{ name: 'React', weight: -2 }] }
  });
  try {
    const { status, body } = await readJson(await fetch(
      `${invalidProject.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 400);
    assert.equal(body.error.code, 'INVALID_PROJECT_REQUIREMENTS');
  } finally {
    await invalidProject.close();
  }

  const unavailable = await createHarness({ sessionError: new Error('database connection unavailable') });
  try {
    const { status, body } = await readJson(await fetch(
      `${unavailable.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 503);
    assert.equal(body.error.code, 'AUTH_SERVICE_UNAVAILABLE');
  } finally {
    await unavailable.close();
  }

  const projectUnavailable = await createHarness({ projectError: new Error('project database unavailable') });
  try {
    const { status, body } = await readJson(await fetch(
      `${projectUnavailable.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 500);
    assert.equal(body.error.code, 'COMPATIBILITY_CALCULATION_FAILED');
  } finally {
    await projectUnavailable.close();
  }
});

test('compatibility endpoint requires a configured database', async () => {
  const harness = await createHarness({ databaseReady: false });
  try {
    const { status, body } = await readJson(await fetch(
      `${harness.baseUrl}/api/projects/${PROJECT_ID}/compatibility`,
      { headers: { Cookie: `syncskills_session=${TOKEN}` } }
    ));
    assert.equal(status, 503);
    assert.equal(body.error.code, 'DATABASE_UNAVAILABLE');
  } finally {
    await harness.close();
  }
});

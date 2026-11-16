const assert = require('node:assert/strict');
const express = require('express');
const { test } = require('node:test');
const { createTeamRouter } = require('../routes/teamRoutes');

const TOKEN = 't'.repeat(43);
const PROJECT_ID = '507f1f77bcf86cd799439011';

function candidate(id, skills) {
  return {
    _id: id,
    name: `Student ${id}`,
    email: `${id}@example.edu`,
    profile: { skills: skills.map((name) => ({ name })) }
  };
}

async function createHarness(options = {}) {
  const project = options.project === undefined ? {
    _id: PROJECT_ID,
    projectTitle: 'Learning platform',
    teamSize: 2,
    requiredSkills: [{ name: 'React', weight: 2 }, { name: 'Node.js', weight: 1 }],
    requiredRoles: [{ role: 'Developer', count: 1, requiredSkills: ['React'] }]
  } : options.project;
  const app = express();
  app.use('/api/projects', createTeamRouter({
    Project: {
      findById: async () => {
        if (options.projectError) throw options.projectError;
        return project;
      }
    },
    User: {
      findById: async () => options.user || { _id: 'requester', profile: {} }
    },
    AuthSession: {
      findOne: async () => ({ _id: 'session', userId: 'requester' }),
      deleteOne: async () => ({ deletedCount: 1 })
    },
    isDatabaseReady: () => options.databaseReady !== false,
    findEligibleCandidates: async () => options.candidates || [
      candidate('student-a', ['React']),
      candidate('student-b', ['Node.js']),
      candidate('student-c', ['React', 'Node.js'])
    ],
    findLocalProject: async () => null,
    logger: { error() {} },
    env: options.env || {}
  }));
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
  };
}

async function request(harness, projectId = PROJECT_ID, authenticated = true) {
  const response = await fetch(`${harness.baseUrl}/api/projects/${projectId}/team-recommendations`, {
    headers: authenticated ? { Cookie: `syncskills_session=${TOKEN}` } : {}
  });
  return { status: response.status, body: await response.json() };
}

test('authenticated recommendation endpoint returns only sanitized, complete teams', async () => {
  const harness = await createHarness();
  try {
    const { status, body } = await request(harness);
    assert.equal(status, 200);
    assert.equal(body.success, true);
    assert.equal(body.teamSize, 2);
    assert.equal(body.eligibleStudentCount, 3);
    assert.equal(body.totalTeamsPossible, 3);
    assert.equal(body.totalTeamsEvaluated, 3);
    assert.equal(body.recommendations.length, 3);
    assert.equal(body.recommendations[0].members.length, 2);
    assert.equal(body.recommendations[0].members[0].email, undefined);
    assert.equal(body.recommendations[0].members[0].id, undefined);
    assert.equal(body.recommendations[0].members[0].profile, undefined);
    assert.equal(body.recommendations[0].uniqueContributions[0].memberId, undefined);
    assert.equal(body.metadata.searchStrategy, 'EXACT');
  } finally {
    await harness.close();
  }
});

test('team recommendations require an authenticated session and valid project id', async () => {
  const harness = await createHarness();
  try {
    assert.equal((await request(harness, PROJECT_ID, false)).status, 401);
    const invalid = await request(harness, 'invalid');
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.error.code, 'INVALID_PROJECT_ID');
  } finally {
    await harness.close();
  }
});

test('team recommendations report a missing project or unconfigured requirements', async () => {
  const missing = await createHarness({ project: null });
  try {
    const result = await request(missing);
    assert.equal(result.status, 404);
    assert.equal(result.body.error.code, 'PROJECT_NOT_FOUND');
  } finally {
    await missing.close();
  }

  const unconfigured = await createHarness({ project: { _id: PROJECT_ID, teamSize: 2, requiredSkills: [] } });
  try {
    const result = await request(unconfigured);
    assert.equal(result.status, 422);
    assert.equal(result.body.error.code, 'PROJECT_REQUIREMENTS_NOT_CONFIGURED');
  } finally {
    await unconfigured.close();
  }
});

test('team recommendations report insufficient students and defaulted legacy team size', async () => {
  const insufficient = await createHarness({
    project: { _id: PROJECT_ID, requiredSkills: [{ name: 'React' }] },
    candidates: [candidate('student-a', ['React']), candidate('student-b', ['Node.js'])]
  });
  try {
    const result = await request(insufficient);
    assert.equal(result.status, 422);
    assert.equal(result.body.error.code, 'INSUFFICIENT_ELIGIBLE_STUDENTS');
  } finally {
    await insufficient.close();
  }

  const defaulted = await createHarness({
    project: { _id: PROJECT_ID, projectTitle: 'Legacy', requiredSkills: [{ name: 'React' }] },
    candidates: [
      candidate('student-a', ['React']),
      candidate('student-b', ['React']),
      candidate('student-c', ['React']),
      candidate('student-d', ['React'])
    ]
  });
  try {
    const result = await request(defaulted);
    assert.equal(result.status, 200);
    assert.equal(result.body.teamSize, 3);
    assert.equal(result.body.teamSizeDefaulted, true);
  } finally {
    await defaulted.close();
  }
});

test('team recommendations return safe errors for database failures', async () => {
  const harness = await createHarness({ projectError: new Error('database connection detail') });
  try {
    const result = await request(harness);
    assert.equal(result.status, 503);
    assert.equal(result.body.error.code, 'TEAM_RECOMMENDATIONS_UNAVAILABLE');
    assert.doesNotMatch(JSON.stringify(result.body), /database connection detail/);
  } finally {
    await harness.close();
  }
});

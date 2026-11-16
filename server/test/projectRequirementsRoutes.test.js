const assert = require('node:assert/strict');
const express = require('express');
const { test } = require('node:test');
const { createProjectRouter } = require('../routes/projectRoutes');

async function createHarness(options = {}) {
  let createdProject;
  const app = express();
  app.use(express.json());
  app.use('/api/projects', createProjectRouter({
    Project: {
      db: { readyState: 1 },
      create: async (project) => {
        createdProject = { _id: '507f1f77bcf86cd799439011', ...project };
        return createdProject;
      }
    },
    isDatabaseReady: () => options.databaseReady !== false,
    readLocalProjects: () => [],
    writeLocalProjects() {}
  }));
  const server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  return {
    baseUrl: `http://127.0.0.1:${server.address().port}`,
    getCreatedProject: () => createdProject,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
    })
  };
}

const validPayload = {
  projectTitle: 'Compatibility Test',
  teamSize: 2,
  requiredSkills: [
    { name: 'React.js', weight: 5, priority: 'required', critical: true },
    { name: 'Docker', weight: 2, priority: 'preferred', critical: false }
  ],
  requiredRoles: [{ role: 'Developer', count: 2 }]
};

test('project creation persists normalized structured skill requirements', async () => {
  const harness = await createHarness();
  try {
    const response = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload)
    });
    const body = await response.json();

    assert.equal(response.status, 201);
    assert.equal(harness.getCreatedProject().requiredSkills[0].name, 'React');
    assert.equal(harness.getCreatedProject().requiredSkills[0].critical, true);
    assert.equal(harness.getCreatedProject().requiredSkills[1].priority, 'preferred');
    assert.equal(body.project.requiredSkills[1].priority, 'preferred');
  } finally {
    await harness.close();
  }
});

test('project creation rejects invalid skill requirement fields', async () => {
  const harness = await createHarness();
  try {
    const response = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPayload,
        requiredSkills: [{ name: 'React', weight: 101, priority: 'optional', critical: 'yes' }]
      })
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.match(body.error, /Skill requirements/);
    assert.equal(harness.getCreatedProject(), undefined);
  } finally {
    await harness.close();
  }
});

test('project creation keeps default required priority for legacy-compatible payloads', async () => {
  const harness = await createHarness();
  try {
    const response = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPayload,
        requiredSkills: [{ name: 'NodeJS', weight: 10 }]
      })
    });
    assert.equal(response.status, 201);
    assert.deepEqual(harness.getCreatedProject().requiredSkills[0], {
      name: 'Node.js',
      priority: 'required',
      weight: 10,
      critical: false
    });
  } finally {
    await harness.close();
  }
});

test('project creation defaults team size to three and permits roles without role-specific skills', async () => {
  const harness = await createHarness();
  try {
    const response = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectTitle: 'Default team size',
        requiredSkills: [{ name: 'React' }],
        requiredRoles: [{ role: 'Frontend Developer', count: 1, requiredSkills: ['React'] }]
      })
    });

    assert.equal(response.status, 201);
    assert.equal(harness.getCreatedProject().teamSize, 3);
    assert.deepEqual(harness.getCreatedProject().requiredRoles[0].requiredSkills, ['React']);
  } finally {
    await harness.close();
  }
});

test('project creation rejects non-integer team sizes and accepts no role requirements', async () => {
  const harness = await createHarness();
  try {
    const invalid = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validPayload, teamSize: 1.5 })
    });
    assert.equal(invalid.status, 400);

    const noRoles = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectTitle: 'No roles', teamSize: 1, requiredSkills: [{ name: 'React' }] })
    });
    assert.equal(noRoles.status, 201);
    assert.deepEqual(harness.getCreatedProject().requiredRoles, []);
  } finally {
    await harness.close();
  }
});

test('project creation rejects duplicate role names ignoring case', async () => {
  const harness = await createHarness();
  try {
    const response = await fetch(`${harness.baseUrl}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validPayload,
        requiredRoles: [
          { role: 'Backend Developer', count: 1, requiredSkills: ['Node.js'] },
          { role: 'backend developer', count: 1, requiredSkills: ['Express'] }
        ]
      })
    });
    assert.equal(response.status, 400);
    assert.equal(harness.getCreatedProject(), undefined);
  } finally {
    await harness.close();
  }
});

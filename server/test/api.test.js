const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const localProjects = require('../../data/projects.json');
const mongoose = require('mongoose');
const app = require('../server');

let server;
let baseUrl;

before(async () => {
  server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, () => resolve(instance));
    instance.once('error', reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
  await mongoose.disconnect();
});

test('health endpoint reports the running API service', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'TeamMatch AI Project Engine');
});

test('projects endpoint returns the established response shape', async () => {
  const response = await fetch(`${baseUrl}/api/projects`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.count, body.projects.length);
  assert.ok(Array.isArray(body.projects));
  const projectIds = new Set(body.projects.map((project) => String(project.id)));
  assert.ok(localProjects.every((project) => projectIds.has(String(project.id))));
});

test('projects endpoint validates incomplete creation requests', async () => {
  const response = await fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.equal(body.error, 'Project Title is required');
});

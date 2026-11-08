import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fetchProjectCompatibility, getCompatibilityErrorMessage } from '../src/lib/compatibilityApi.js';

test('calls the authenticated compatibility route without sending a student identifier', async () => {
  let requestUrl;
  let requestOptions;
  const expected = { project: { id: 'proj-1' }, compatibility: { score: 75 } };
  const result = await fetchProjectCompatibility('proj-1', async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return { ok: true, json: async () => ({ success: true, data: expected }) };
  });

  assert.equal(requestUrl, '/api/projects/proj-1/compatibility');
  assert.deepEqual(requestOptions, { credentials: 'include' });
  assert.deepEqual(result, expected);
});

test('encodes the project identifier and surfaces API errors', async () => {
  await assert.rejects(
    fetchProjectCompatibility('project/one', async (url) => {
      assert.equal(url, '/api/projects/project%2Fone/compatibility');
      return {
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          error: { code: 'PROJECT_REQUIREMENTS_NOT_CONFIGURED', message: 'No requirements.' }
        })
      };
    }),
    (error) => error.code === 'PROJECT_REQUIREMENTS_NOT_CONFIGURED' && error.status === 422
  );
});

test('maps profile and requirement states to actionable UI messages', () => {
  assert.match(getCompatibilityErrorMessage({ code: 'PROFILE_NOT_FOUND' }), /Complete your profile/);
  assert.match(getCompatibilityErrorMessage({ code: 'PROFILE_NOT_CONFIRMED' }), /must be confirmed/);
  assert.match(getCompatibilityErrorMessage({ code: 'PROJECT_REQUIREMENTS_NOT_CONFIGURED' }), /does not have skill requirements/);
});

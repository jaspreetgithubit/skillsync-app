import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  fetchTeamRecommendations,
  getTeamRecommendationsErrorMessage
} from '../src/lib/teamRecommendationsApi.js';

test('calls the authenticated team recommendation route without submitting student identifiers', async () => {
  let requestUrl;
  let requestOptions;
  const expected = { success: true, recommendations: [] };
  const result = await fetchTeamRecommendations('proj-1', async (url, options) => {
    requestUrl = url;
    requestOptions = options;
    return { ok: true, json: async () => expected };
  });

  assert.equal(requestUrl, '/api/projects/proj-1/team-recommendations');
  assert.deepEqual(requestOptions, { credentials: 'include' });
  assert.deepEqual(result, expected);
});

test('encodes project IDs and surfaces structured team recommendation errors', async () => {
  await assert.rejects(
    fetchTeamRecommendations('project/one', async (url) => {
      assert.equal(url, '/api/projects/project%2Fone/team-recommendations');
      return {
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          error: { code: 'INSUFFICIENT_ELIGIBLE_STUDENTS', message: 'Not enough students.' }
        })
      };
    }),
    (error) => error.code === 'INSUFFICIENT_ELIGIBLE_STUDENTS' && error.status === 422
  );
});

test('maps configuration and candidate errors to actionable UI messages', () => {
  assert.match(getTeamRecommendationsErrorMessage({ code: 'PROJECT_REQUIREMENTS_NOT_CONFIGURED' }), /required project skill/);
  assert.match(getTeamRecommendationsErrorMessage({ code: 'INSUFFICIENT_ELIGIBLE_STUDENTS', message: 'Only one student.' }), /confirmed profile/);
});

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { generateTeamRecommendations } = require('../services/teamGenerationService');

const project = {
  projectTitle: 'Project',
  teamSize: 2,
  requiredSkills: [
    { name: 'React', weight: 1 },
    { name: 'Node.js', weight: 1 }
  ]
};

function candidate(id, skills, individualCompatibilityScore = 80) {
  return {
    id,
    name: `Student ${id}`,
    profile: { skills: skills.map((name) => ({ name })) },
    individualCompatibilityScore
  };
}

test('exact team generation evaluates every distinct combination and returns the deterministic top five', async () => {
  const result = await generateTeamRecommendations({
    project,
    candidates: [
      candidate('c', ['React']),
      candidate('a', ['React']),
      candidate('b', ['Node.js']),
      candidate('d', ['Node.js'])
    ]
  });

  assert.equal(result.searchStrategy, 'EXACT');
  assert.equal(result.totalTeamsPossible, 6);
  assert.equal(result.totalTeamsEvaluated, 6);
  assert.equal(result.recommendations.length, 5);
  assert.deepEqual(result.recommendations[0].members.map(({ name }) => name), ['Student a', 'Student b']);
  assert.equal(new Set(result.recommendations.map(({ teamId }) => teamId)).size, 5);
});

test('team generation rejects an undersized candidate pool and invalid team sizes', async () => {
  await assert.rejects(
    generateTeamRecommendations({ project, candidates: [candidate('a', ['React'])] }),
    { code: 'INSUFFICIENT_ELIGIBLE_STUDENTS', status: 422 }
  );
  await assert.rejects(
    generateTeamRecommendations({
      project: { ...project, teamSize: 0 },
      candidates: [candidate('a', ['React']), candidate('b', ['Node.js'])]
    }),
    { code: 'INVALID_TEAM_SIZE', status: 422 }
  );
});

test('bounded beam search is deterministic and reports its non-exact strategy', async () => {
  const candidates = Array.from({ length: 10 }, (_, index) => candidate(
    `student-${index}`,
    index % 2 === 0 ? ['React'] : ['Node.js']
  ));
  const options = {
    project: { ...project, teamSize: 3 },
    candidates,
    config: { ...require('../services/teamScoringConfig').readTeamScoringConfig({}), maxExactCombinations: 1, beamWidth: 20 }
  };

  const first = await generateTeamRecommendations(options);
  const second = await generateTeamRecommendations(options);

  assert.equal(first.searchStrategy, 'BOUNDED_BEAM');
  assert.ok(first.totalTeamsPossible > first.totalTeamsEvaluated);
  assert.ok(first.totalTeamsEvaluated > first.recommendations.length);
  assert.deepEqual(
    first.recommendations.map(({ teamId, compatibilityScore }) => [teamId, compatibilityScore]),
    second.recommendations.map(({ teamId, compatibilityScore }) => [teamId, compatibilityScore])
  );
  for (const recommendation of first.recommendations) {
    assert.equal(recommendation.members.length, 3);
    assert.equal(new Set(recommendation.members.map(({ name }) => name)).size, 3);
  }
});

test('classification thresholds and component weights are configurable', async () => {
  const config = require('../services/teamScoringConfig').readTeamScoringConfig({
    TEAM_COMPATIBILITY_HIGH_THRESHOLD: '95',
    TEAM_COMPATIBILITY_SKILLS_WEIGHT: '70'
  });
  const result = await generateTeamRecommendations({
    project,
    candidates: [candidate('a', ['React', 'Node.js']), candidate('b', ['React'])],
    config
  });

  assert.equal(result.recommendations[0].classification, 'MODERATELY_COMPATIBLE');
});

test('critical requirement satisfaction breaks ties before student ID order', async () => {
  const result = await generateTeamRecommendations({
    project: {
      teamSize: 1,
      requiredSkills: [
        { name: 'React', weight: 1, critical: true },
        { name: 'Node.js', weight: 1 }
      ]
    },
    candidates: [
      candidate('a-missing-critical', ['Node.js'], 75),
      candidate('z-has-critical', ['React'], 75)
    ]
  });

  assert.equal(result.recommendations[0].members[0].name, 'Student z-has-critical');
  assert.equal(result.recommendations[0].criticalRequirementsSatisfied, true);
});

test('individual relevance is taken from Feature 2 compatibility when not precomputed', async () => {
  const { scoreProjectCompatibility } = require('../services/projectCompatibilityService');
  const profile = { skills: [{ name: 'React' }] };
  const result = await generateTeamRecommendations({
    project: { teamSize: 1, requiredSkills: [{ name: 'React', weight: 1 }] },
    candidates: [{ id: 'student', name: 'Student', profile }]
  });

  assert.equal(
    result.recommendations[0].members[0].individualCompatibilityScore,
    scoreProjectCompatibility(profile, { requiredSkills: [{ name: 'React', weight: 1 }] }).score
  );
});

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { evaluateTeamCompatibility } = require('../services/teamCompatibilityService');

const project = {
  projectTitle: 'Learning platform',
  requiredSkills: [
    { name: 'React', weight: 5, priority: 'required', critical: true },
    { name: 'Node.js', weight: 4, priority: 'required' },
    { name: 'Docker', weight: 2, priority: 'preferred' }
  ],
  requiredRoles: [
    { role: 'Frontend Developer', count: 1, requiredSkills: ['React'] },
    { role: 'Backend Developer', count: 1, requiredSkills: ['Node.js', 'Docker'] }
  ]
};

function member(id, skills, individualCompatibilityScore = 80) {
  return {
    id,
    name: `Student ${id}`,
    profile: { skills: skills.map((name) => ({ name })) },
    individualCompatibilityScore
  };
}

test('team coverage combines skills across members without double-counting duplicates', () => {
  const result = evaluateTeamCompatibility(project, [
    member('a', ['React', 'Docker']),
    member('b', ['NodeJS', 'React'])
  ]);

  assert.equal(result.scoreBreakdown.combinedSkillCoverage, 100);
  assert.equal(result.requiredSkillCoverage, 100);
  assert.equal(result.preferredSkillCoverage, 100);
  assert.equal(result.scoreBreakdown.roleCoverage, 100);
  assert.ok(result.roleCoverage.every(({ status }) => status === 'COVERED'));
  assert.deepEqual(result.matchedRequiredSkills.map(({ name }) => name), ['React', 'Node.js']);
  assert.equal(result.combinedSkills.filter((skill) => skill === 'React').length, 1);
});

test('team coverage awards approved partial credit but keeps critical skills unsatisfied', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'Machine Learning', weight: 2, priority: 'required', critical: true }]
  }, [member('a', ['Deep Learning'])]);

  assert.equal(result.requiredSkillCoverage, 35);
  assert.equal(result.criticalRequirementsSatisfied, false);
  assert.deepEqual(result.missingRequiredSkills.map(({ name }) => name), ['Machine Learning']);
  assert.equal(result.partialMatches[0].requiredSkill, 'Machine Learning');
});

test('role coverage reports configured coverage and leaves unconfigured roles unavailable', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'React', weight: 1 }],
    requiredRoles: [
      { role: 'Frontend', count: 1, requiredSkills: ['React', 'CSS'] },
      { role: 'Designer', count: 1 }
    ]
  }, [member('a', ['React'])]);

  assert.equal(result.scoreBreakdown.roleCoverage, 50);
  assert.equal(result.roleCoverage[0].status, 'PARTIALLY_COVERED');
  assert.deepEqual(result.roleCoverage[0].missingSkills, ['CSS']);
  assert.equal(result.roleCoverage[1].coverage, null);
});

test('role component is omitted and remaining score weights are renormalized when no roles have skill requirements', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'React', weight: 1 }],
    requiredRoles: [{ role: 'Frontend', count: 1 }]
  }, [member('a', ['React'], 50)]);

  assert.equal(result.scoreBreakdown.roleCoverage, null);
  assert.equal(result.scoreBreakdown.individualMemberRelevance, 50);
  assert.ok(result.compatibilityScore >= 90);
});

test('skill complementarity rewards distinct relevant contributors but ignores unrelated skills', () => {
  const requirements = {
    requiredSkills: [
      { name: 'React', weight: 1 },
      { name: 'Node.js', weight: 1 }
    ]
  };
  const complementary = evaluateTeamCompatibility(requirements, [
    member('a', ['React', 'Unrelated']),
    member('b', ['Node.js', 'Unrelated'])
  ]);
  const duplicated = evaluateTeamCompatibility(requirements, [
    member('a', ['React', 'Node.js']),
    member('b', ['React', 'Node.js'])
  ]);

  assert.equal(complementary.scoreBreakdown.skillComplementarity, 100);
  assert.equal(duplicated.scoreBreakdown.skillComplementarity, 0);
  assert.deepEqual(complementary.uniqueContributions.map(({ memberName }) => memberName), ['Student a', 'Student b']);
});

test('one student with multiple related skills is still one unique contributor', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'React', weight: 1 }]
  }, [
    member('a', ['React', 'JavaScript']),
    member('b', ['CSS'])
  ]);

  assert.equal(result.scoreBreakdown.skillComplementarity, 100);
  assert.equal(result.uniqueContributions.length, 1);
});

test('preferred-only projects use preferred coverage as the full skill component', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'Docker', weight: 3, priority: 'preferred' }]
  }, [member('a', ['Docker'])]);

  assert.equal(result.requiredSkillCoverage, null);
  assert.equal(result.preferredSkillCoverage, 100);
  assert.equal(result.scoreBreakdown.combinedSkillCoverage, 100);
});

test('no roles makes role coverage unavailable and no project-relevant matches yield zero coverage', () => {
  const result = evaluateTeamCompatibility({
    requiredSkills: [{ name: 'React', weight: 1, critical: true }]
  }, [member('a', ['Java'])]);

  assert.equal(result.scoreBreakdown.roleCoverage, null);
  assert.deepEqual(result.roleCoverage, []);
  assert.equal(result.requiredSkillCoverage, 0);
  assert.equal(result.scoreBreakdown.skillComplementarity, 0);
  assert.equal(result.criticalRequirementsSatisfied, false);
});

test('team scoring rejects missing or invalid skill requirements', () => {
  assert.throws(
    () => evaluateTeamCompatibility({ requiredSkills: [] }, [member('a', ['React'])]),
    { code: 'PROJECT_REQUIREMENTS_NOT_CONFIGURED' }
  );
  assert.throws(
    () => evaluateTeamCompatibility({
      requiredSkills: [{ name: 'React', weight: -1 }]
    }, [member('a', ['React'])]),
    { code: 'INVALID_PROJECT_REQUIREMENTS' }
  );
});

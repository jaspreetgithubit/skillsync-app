const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  CompatibilityError,
  scoreProjectCompatibility
} = require('../services/projectCompatibilityService');

const project = (requiredSkills, extra = {}) => ({ requiredSkills, ...extra });
const profile = (skills = []) => ({ skills });

test('matches canonical skills and trusted aliases exactly', () => {
  const result = scoreProjectCompatibility(profile([
    { name: 'React.js', proficiency: 'Advanced' },
    { name: 'NodeJS', proficiency: 'Intermediate' },
    { name: 'JS' },
    { name: 'Postgres' },
    { name: 'Mongo' },
    { name: 'Python 3' }
  ]), project([
    { name: 'React', weight: 5 },
    { name: 'Node.js', weight: 4 },
    { name: 'JavaScript', weight: 3 },
    { name: 'PostgreSQL', weight: 2 },
    { name: 'MongoDB', weight: 1 },
    { name: 'Python', weight: 1 }
  ]));

  assert.equal(result.score, 100);
  assert.equal(result.classification, 'RELEVANT');
  assert.equal(result.matchedSkills.length, 6);
  assert.deepEqual(result.missingRequiredSkills, []);
});

test('reports absent mandatory and preferred skills and weights required coverage', () => {
  const result = scoreProjectCompatibility(profile([{ name: 'React', proficiency: 'Advanced' }]), project([
    { name: 'React', priority: 'required', weight: 3 },
    { name: 'Python', priority: 'required', weight: 1, critical: true },
    { name: 'Docker', priority: 'preferred', weight: 2 }
  ]));

  assert.equal(result.breakdown.requiredSkillCoverage, 75);
  assert.equal(result.breakdown.preferredSkillCoverage, 0);
  assert.deepEqual(result.missingRequiredSkills.map(({ name }) => name), ['Python']);
  assert.equal(result.criticalRequirementsSatisfied, false);
  assert.equal(result.criticalRequirementsCount, 1);
  assert.match(result.explanation, /Missing required skills: Python/);
});

test('does not subtract points for projects without preferred requirements', () => {
  const result = scoreProjectCompatibility(profile(['React']), project([
    { name: 'React', priority: 'required' }
  ]));

  assert.equal(result.score, 100);
  assert.equal(result.breakdown.preferredSkillCoverage, null);
  assert.equal(result.criticalRequirementsCount, 0);
});

test('returns partial matches without treating related technologies as equivalent', () => {
  const result = scoreProjectCompatibility(profile(['Deep Learning', 'JavaScript']), project([
    { name: 'Machine Learning', weight: 2 },
    { name: 'React', weight: 1 },
    { name: 'Java', weight: 1 },
    { name: 'React Native', weight: 1 }
  ]));

  assert.deepEqual(result.matchedSkills, []);
  assert.equal(result.partialMatches.length, 2);
  assert.deepEqual(result.missingRequiredSkills.map(({ name }) => name), [
    'Machine Learning',
    'React',
    'Java',
    'React Native'
  ]);
  assert.equal(result.partialMatches.find(({ requiredSkill }) => requiredSkill === 'Machine Learning').strength, 0.35);
});

test('applies importance weights instead of counting each required skill equally', () => {
  const result = scoreProjectCompatibility(profile(['React']), project([
    { name: 'React', weight: 9 },
    { name: 'Python', weight: 1 }
  ]));

  assert.equal(result.breakdown.requiredSkillCoverage, 90);
});

test('scores skills only and ignores proficiency metadata in existing records', () => {
  const result = scoreProjectCompatibility(profile([
    { name: 'React', proficiency: 'Beginner' }
  ]), project([
    { name: 'React', minimumProficiency: 'Expert' }
  ]));

  assert.equal(result.score, 100);
  assert.deepEqual(result.breakdown, {
    requiredSkillCoverage: 100,
    preferredSkillCoverage: null
  });
  assert.equal(Object.hasOwn(result, 'proficiencyMismatches'), false);
});

test('profiles with no skills receive a deterministic zero score', () => {
  const result = scoreProjectCompatibility(profile(), project([{ name: 'React' }]));

  assert.equal(result.score, 0);
  assert.equal(result.classification, 'NOT_RELEVANT');
  assert.equal(result.missingRequiredSkills.length, 1);
});

test('uses experience and confirmed project technologies as profile skill evidence', () => {
  const result = scoreProjectCompatibility({
    skills: [],
    experience: [{ technologies: ['NodeJS'] }],
    projects: [{ technologies: ['Mongo DB'] }]
  }, project([{ name: 'Node.js' }, { name: 'MongoDB' }]));

  assert.equal(result.score, 100);
});

test('consolidates duplicate canonical requirements without double counting', () => {
  const result = scoreProjectCompatibility(profile([{ name: 'React', proficiency: 'Advanced' }]), project([
    { name: 'React.js', weight: 3 },
    { name: 'React', weight: 7, critical: true }
  ]));

  assert.equal(result.matchedSkills.length, 1);
  assert.equal(result.breakdown.requiredSkillCoverage, 100);
  assert.equal(result.criticalRequirementsSatisfied, true);
});

test('rejects invalid requirement weights and missing requirement names', () => {
  for (const requiredSkills of [
    [{ name: 'React', weight: -1 }],
    [{ name: 'React', weight: 101 }],
    [{ name: ' ', weight: 1 }],
    [{ name: 'React', priority: 'optional', weight: 1 }],
    [{ name: 'React', critical: 'yes', weight: 1 }]
  ]) {
    assert.throws(
      () => scoreProjectCompatibility(profile(['React']), project(requiredSkills)),
      (error) => error instanceof CompatibilityError && error.code === 'INVALID_PROJECT_REQUIREMENTS'
    );
  }
});

test('reports projects without configured skill requirements', () => {
  assert.throws(
    () => scoreProjectCompatibility(profile(['React']), project([])),
    (error) => error instanceof CompatibilityError && error.code === 'PROJECT_REQUIREMENTS_NOT_CONFIGURED'
  );
});

test('repeated calculations return the same explainable result', () => {
  const inputProfile = profile([{ name: 'React.js', proficiency: 'Advanced' }]);
  const inputProject = project([{ name: 'React', weight: 3 }]);

  assert.deepEqual(
    scoreProjectCompatibility(inputProfile, inputProject),
    scoreProjectCompatibility(inputProfile, inputProject)
  );
});

test('scores required and preferred skills using their configured component weights', () => {
  const result = scoreProjectCompatibility(profile(['React', 'Docker']), project([
    { name: 'React', weight: 1 },
    { name: 'Python', weight: 1 },
    { name: 'Docker', priority: 'preferred', weight: 1 }
  ]));

  assert.equal(result.breakdown.requiredSkillCoverage, 50);
  assert.equal(result.breakdown.preferredSkillCoverage, 100);
  assert.equal(result.score, 61.1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import { matchStudentToProject } from '../src/lib/skillMatching.js';

test('all required skills matched produces 100%', () => {
  const result = matchStudentToProject(
    { skills: ['React', 'Python'] },
    { requiredSkills: ['React', 'Python'] }
  );

  assert.equal(result.compatibilityScore, 100);
  assert.equal(result.matchedRequirementCount, 2);
});

test('three of five equally weighted requirements produces 60%', () => {
  const result = matchStudentToProject(
    { skills: ['React', 'Python', 'Node.js'] },
    { requiredSkills: ['React', 'Python', 'Node.js', 'Docker', 'Java'] }
  );

  assert.equal(result.compatibilityScore, 60);
  assert.equal(result.skillCoveragePercentage, 60);
});

test('no requirements matched produces 0%', () => {
  const result = matchStudentToProject(
    { skills: ['Java'] },
    { requiredSkills: ['Python', 'React'] }
  );

  assert.equal(result.compatibilityScore, 0);
  assert.deepEqual(result.missingRequirements, ['Python', 'React']);
});

test('matching ignores casing and surrounding or repeated whitespace', () => {
  const result = matchStudentToProject(
    { skills: ['  pYtHoN   '] },
    { requiredSkills: [' Python '] }
  );

  assert.equal(result.compatibilityScore, 100);
  assert.equal(result.matchedRequirements[0].matchMethod, 'exact');
});

test('documented aliases match and identify the alias method', () => {
  const result = matchStudentToProject(
    { skills: ['JS', 'React.js', 'NodeJS', 'Postgres', 'Mongo DB', 'ML'] },
    { requiredSkills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Machine Learning'] }
  );

  assert.equal(result.compatibilityScore, 100);
  assert.ok(result.matchedRequirements.every((match) => match.matchMethod === 'known_alias'));
});

test('Java does not match JavaScript', () => {
  const result = matchStudentToProject(
    { skills: ['Java'] },
    { requiredSkills: ['JavaScript'] }
  );

  assert.equal(result.compatibilityScore, 0);
  assert.deepEqual(result.missingRequirements, ['JavaScript']);
});

test('duplicate student skills and project requirements do not inflate the score', () => {
  const result = matchStudentToProject(
    { skills: ['Python', ' python ', 'ML', 'Machine Learning'] },
    { requiredSkills: ['Python', 'PYTHON', 'Machine Learning', 'ML'] }
  );

  assert.equal(result.totalRequirementCount, 2);
  assert.equal(result.matchedRequirementCount, 2);
  assert.equal(result.compatibilityScore, 100);
});

test('configured project weights are used for scoring', () => {
  const result = matchStudentToProject(
    { skills: ['Python'] },
    {
      requiredSkills: [{ name: 'Python' }, { name: 'Java' }],
      skillWeights: { Python: 3, Java: 1 }
    }
  );

  assert.equal(result.compatibilityScore, 75);
});

test('invalid configured weights fall back to required-skill weights', () => {
  const result = matchStudentToProject(
    { skills: ['Python'] },
    {
      requiredSkills: [{ name: 'Python', weight: 3 }, { name: 'Java', weight: 1 }],
      skillWeights: { Python: 'invalid', Java: 0 }
    }
  );

  assert.equal(result.compatibilityScore, 75);
});

test('very large finite weights do not overflow the score', () => {
  const result = matchStudentToProject(
    { skills: ['Python'] },
    {
      requiredSkills: ['Python', 'Java'],
      skillWeights: { Python: Number.MAX_VALUE, Java: Number.MAX_VALUE }
    }
  );

  assert.equal(result.compatibilityScore, 50);
});

test('an empty student skill list safely scores zero for valid requirements', () => {
  const result = matchStudentToProject(
    { skills: [] },
    { requiredSkills: ['Python'] }
  );

  assert.equal(result.compatibilityScore, 0);
  assert.deepEqual(result.missingRequirements, ['Python']);
});

test('projects with no valid requirements have an unavailable score', () => {
  const result = matchStudentToProject(
    { skills: ['Python'] },
    { requiredSkills: ['', null, {}, 3] }
  );

  assert.equal(result.compatibilityScore, null);
  assert.equal(result.totalRequirementCount, 0);
  assert.match(result.explanation, /unavailable/i);
});

test('additional student skills are reported once and exclude matched skills', () => {
  const result = matchStudentToProject(
    { skills: ['Python', 'Docker', 'Docker', 'React'] },
    { requiredSkills: ['Python'] }
  );

  assert.deepEqual(result.additionalSkills, ['Docker', 'React']);
});

test('project skill weights are supported when supplied as a Map', () => {
  const result = matchStudentToProject(
    { skills: ['Python'] },
    {
      requiredSkills: ['Python', 'Java'],
      skillWeights: new Map([['Python', 2], ['Java', 2]])
    }
  );

  assert.equal(result.compatibilityScore, 50);
});

test('malformed input is handled without throwing', () => {
  const result = matchStudentToProject(null, {
    requiredSkills: [{ name: 'Python' }, null]
  });

  assert.equal(result.compatibilityScore, 0);
  assert.deepEqual(result.missingRequirements, ['Python']);
});

test('input records and arrays are not mutated', () => {
  const student = { name: 'Sam', skills: ['JS', 'Python'] };
  const project = {
    projectTitle: 'Demo',
    requiredSkills: [{ name: 'JavaScript', weight: 2 }, { name: 'Python' }],
    skillWeights: { JavaScript: 3 }
  };
  const beforeStudent = structuredClone(student);
  const beforeProject = structuredClone(project);

  matchStudentToProject(student, project);

  assert.deepEqual(student, beforeStudent);
  assert.deepEqual(project, beforeProject);
});

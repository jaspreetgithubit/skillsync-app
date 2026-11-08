const SKILL_ALIASES = require('../../shared/skill-aliases.json');
const ALIASES = new Map(
  Object.entries(SKILL_ALIASES).map(([alias, canonical]) => [skillKey(alias), canonical])
);

const RELATED_SKILL_MATCHES = new Map([
  ['machinelearning|deeplearning', { strength: 0.35, reason: 'Deep learning is a related specialization, not an equivalent skill.' }],
  ['deeplearning|machinelearning', { strength: 0.25, reason: 'Machine learning is related, but does not establish deep-learning experience.' }],
  ['react|javascript', { strength: 0.2, reason: 'JavaScript is used with React, but does not establish React experience.' }],
  ['nodejs|javascript', { strength: 0.2, reason: 'JavaScript is used with Node.js, but does not establish Node.js experience.' }]
]);

function skillKey(value) {
  return value.trim().toLowerCase().replace(/[\s._-]+/g, '');
}

function normalizeSkillName(value) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError('Skill names must be non-empty strings.');
  }
  const trimmed = value.trim();
  return ALIASES.get(skillKey(trimmed)) || trimmed;
}

function getSkillMatch(requirementName, studentName) {
  const requirement = normalizeSkillName(requirementName);
  const student = normalizeSkillName(studentName);
  if (skillKey(requirement) === skillKey(student)) {
    return { type: 'exact', strength: 1, reason: 'Canonical skill names match.' };
  }

  const related = RELATED_SKILL_MATCHES.get(`${skillKey(requirement)}|${skillKey(student)}`);
  return related
    ? { type: 'partial', ...related }
    : { type: 'none', strength: 0, reason: null };
}

module.exports = { getSkillMatch, normalizeSkillName, skillKey };

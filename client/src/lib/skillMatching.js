// Keep aliases deliberately conservative; unrelated technologies must remain distinct.
const ALIASES = new Map([
  ['js', 'JavaScript'],
  ['javascript', 'JavaScript'],
  ['react', 'React'],
  ['react js', 'React'],
  ['node js', 'Node.js'],
  ['nodejs', 'Node.js'],
  ['postgres', 'PostgreSQL'],
  ['postgresql', 'PostgreSQL'],
  ['mongo db', 'MongoDB'],
  ['mongodb', 'MongoDB'],
  ['ml', 'Machine Learning'],
  ['machine learning', 'Machine Learning']
]);

function normalizeSkillKey(value) {
  if (typeof value !== 'string') return '';
  return value
    .normalize('NFKC')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}+#]+/gu, ' ')
    .replace(/\s+/g, ' ');
}

function toSkillEntry(value) {
  const name = typeof value === 'string' ? value : value?.name;
  if (typeof name !== 'string' || !name.trim()) return null;

  const normalizedKey = normalizeSkillKey(name);
  if (!normalizedKey) return null;

  return {
    name: name.trim().replace(/\s+/g, ' '),
    normalizedKey,
    canonicalKey: normalizeSkillKey(ALIASES.get(normalizedKey) || name)
  };
}

function uniqueSkills(values) {
  if (!Array.isArray(values)) return [];

  const seen = new Set();
  const skills = [];

  for (const value of values) {
    const skill = toSkillEntry(value);
    if (!skill || seen.has(skill.canonicalKey)) continue;
    seen.add(skill.canonicalKey);
    skills.push(skill);
  }

  return skills;
}

function getConfiguredWeight(project, requirement) {
  const weights = project?.skillWeights;
  let configuredWeight;

  if (weights instanceof Map) {
    for (const [name, weight] of weights) {
      const entry = toSkillEntry(name);
      if (entry?.canonicalKey === requirement.canonicalKey) {
        configuredWeight = weight;
        break;
      }
    }
  } else if (weights && typeof weights === 'object' && !Array.isArray(weights)) {
    for (const [name, weight] of Object.entries(weights)) {
      const entry = toSkillEntry(name);
      if (entry?.canonicalKey === requirement.canonicalKey) {
        configuredWeight = weight;
        break;
      }
    }
  }

  const parsedConfiguredWeight = Number(configuredWeight);
  if (Number.isFinite(parsedConfiguredWeight) && parsedConfiguredWeight > 0) {
    return parsedConfiguredWeight;
  }

  const originalRequirement = project.requiredSkills.find((item) =>
    toSkillEntry(item)?.canonicalKey === requirement.canonicalKey
  );
  const parsedRequirementWeight = Number(
    originalRequirement && typeof originalRequirement === 'object'
      ? originalRequirement.weight
      : undefined
  );

  // Missing or invalid priorities contribute the baseline weight of 1.
  return Number.isFinite(parsedRequirementWeight) && parsedRequirementWeight > 0
    ? parsedRequirementWeight
    : 1;
}

function getIdentity(record, nameKey) {
  const id = typeof record?.id === 'string' || typeof record?.id === 'number'
    ? record.id
    : null;
  const name = typeof record?.[nameKey] === 'string' && record[nameKey].trim()
    ? record[nameKey].trim()
    : null;

  return { id, name };
}

export function matchStudentToProject(student = {}, project = {}) {
  const studentSkills = uniqueSkills(student?.skills);
  const requirements = uniqueSkills(project?.requiredSkills);
  const studentSkillsByKey = new Map(studentSkills.map((skill) => [skill.canonicalKey, skill]));

  const matchedRequirements = [];
  const missingRequirements = [];
  const scoredRequirements = [];
  let maxWeight = 0;

  for (const requirement of requirements) {
    const weight = getConfiguredWeight(project, requirement);
    maxWeight = Math.max(maxWeight, weight);
    const studentSkill = studentSkillsByKey.get(requirement.canonicalKey);
    scoredRequirements.push({ weight, isMatched: Boolean(studentSkill) });

    if (!studentSkill) {
      missingRequirements.push(requirement.name);
      continue;
    }

    matchedRequirements.push({
      requiredSkill: requirement.name,
      studentSkill: studentSkill.name,
      matchMethod: studentSkill.normalizedKey === requirement.normalizedKey
        ? 'exact'
        : 'known_alias',
      weight
    });
  }

  const hasRequirements = requirements.length > 0;
  // Scale before summing so even very large finite input weights cannot overflow the score.
  const totalWeight = scoredRequirements.reduce((sum, item) => sum + item.weight / maxWeight, 0);
  const matchedWeight = scoredRequirements.reduce(
    (sum, item) => sum + (item.isMatched ? item.weight / maxWeight : 0),
    0
  );
  // Score confirmed matches only: 100 × matched requirement weight / total requirement weight.
  const compatibilityScore = hasRequirements
    ? Math.min(100, Math.max(0, (matchedWeight / totalWeight) * 100))
    : null;
  const matchedKeys = new Set(requirements.map((requirement) => requirement.canonicalKey));
  const additionalSkills = studentSkills
    .filter((skill) => !matchedKeys.has(skill.canonicalKey))
    .map((skill) => skill.name);
  const skillCoveragePercentage = hasRequirements
    ? (matchedRequirements.length / requirements.length) * 100
    : null;

  let explanation;
  if (!hasRequirements) {
    explanation = 'A Skills Compatibility Score is unavailable because this project has no valid required skills.';
  } else {
    explanation = `${matchedRequirements.length} of ${requirements.length} unique required skills matched. The score is weighted by the project's configured skill priorities; it measures skills coverage, not the probability of project success.`;
  }

  return {
    student: getIdentity(student, 'name'),
    project: getIdentity(project, 'projectTitle'),
    compatibilityScore,
    matchedRequirementCount: matchedRequirements.length,
    totalRequirementCount: requirements.length,
    skillCoveragePercentage,
    matchedRequirements,
    missingRequirements,
    additionalSkills,
    explanation
  };
}

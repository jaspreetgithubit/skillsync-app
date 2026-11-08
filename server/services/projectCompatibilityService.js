const { getSkillMatch, normalizeSkillName, skillKey } = require('./skillNormalization');
const { readScoringConfig } = require('./compatibilityScoringConfig');

const VALID_PRIORITIES = new Set(['required', 'preferred']);

class CompatibilityError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'CompatibilityError';
    this.code = code;
    this.status = status;
  }
}

function toRequirement(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'A project skill requirement is invalid.');
  }

  let name;
  try {
    name = normalizeSkillName(raw.name);
  } catch {
    throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Every project skill requirement needs a valid skill name.');
  }

  const priority = raw.priority == null ? 'required' : String(raw.priority).toLowerCase();
  const weight = raw.weight == null ? 1 : Number(raw.weight);
  if (!VALID_PRIORITIES.has(priority)
    || !Number.isFinite(weight) || weight <= 0 || weight > 100
    || (raw.critical != null && typeof raw.critical !== 'boolean')) {
    throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Project skill requirements contain an invalid priority, weight, or critical flag.');
  }

  return {
    name,
    priority,
    weight,
    critical: raw.critical === true
  };
}

function readProjectRequirements(project) {
  const rawRequirements = Array.isArray(project?.requirements?.skills) && project.requirements.skills.length > 0
    ? project.requirements.skills
    : project?.requiredSkills;
  if (!Array.isArray(rawRequirements) || rawRequirements.length === 0) {
    throw new CompatibilityError('PROJECT_REQUIREMENTS_NOT_CONFIGURED', 'This project does not have configured skill requirements.', 422);
  }

  const uniqueRequirements = new Map();
  for (const rawRequirement of rawRequirements) {
    const requirement = toRequirement(rawRequirement);
    const key = skillKey(requirement.name);
    const existing = uniqueRequirements.get(key);
    if (!existing) {
      uniqueRequirements.set(key, requirement);
      continue;
    }

    existing.weight = Math.max(existing.weight, requirement.weight);
    existing.critical ||= requirement.critical;
    if (requirement.priority === 'required') existing.priority = 'required';
  }
  return [...uniqueRequirements.values()];
}

function readProfileSkills(profile) {
  const sources = [];
  if (Array.isArray(profile?.skills)) sources.push(...profile.skills);
  if (Array.isArray(profile?.experience)) {
    for (const experience of profile.experience) {
      if (Array.isArray(experience?.technologies)) sources.push(...experience.technologies);
    }
  }
  if (Array.isArray(profile?.projects)) {
    for (const project of profile.projects) {
      if (Array.isArray(project?.technologies)) sources.push(...project.technologies);
    }
  }

  const uniqueSkills = new Map();
  for (const source of sources) {
    const rawName = typeof source === 'string' ? source : source?.name;
    if (typeof rawName !== 'string' || rawName.trim() === '') continue;
    const name = normalizeSkillName(rawName);
    const key = skillKey(name);
    const existing = uniqueSkills.get(key);
    if (!existing) uniqueSkills.set(key, { name, originalName: rawName.trim() });
  }
  return [...uniqueSkills.values()];
}

function weightedCoverage(requirements, matchedByRequirement) {
  if (requirements.length === 0) return null;
  const totalWeight = requirements.reduce((total, requirement) => total + requirement.weight, 0);
  const achievedWeight = requirements.reduce(
    (total, requirement) => total + requirement.weight * (matchedByRequirement.get(requirement) || 0),
    0
  );
  return achievedWeight / totalWeight * 100;
}

function roundScore(value) {
  return Math.round(value * 10) / 10;
}

function scoreProjectCompatibility(profile, project, options = {}) {
  const { weights, threshold } = options.config || readScoringConfig(options.env);
  const requirements = readProjectRequirements(project);
  const studentSkills = readProfileSkills(profile);
  const exactSkills = [];
  const partialMatches = [];
  const missingRequiredSkills = [];
  const matchedByPriority = {
    required: new Map(),
    preferred: new Map()
  };
  const criticalGaps = [];

  for (const requirement of requirements) {
    const candidates = studentSkills
      .map((studentSkill) => ({
        studentSkill,
        match: getSkillMatch(requirement.name, studentSkill.name)
      }))
      .filter(({ match }) => match.strength > 0)
      .sort((left, right) => right.match.strength - left.match.strength);
    const best = candidates[0];
    matchedByPriority[requirement.priority].set(requirement, best?.match.strength || 0);

    if (best?.match.type === 'exact') {
      exactSkills.push({
        requiredSkill: requirement.name,
        studentSkill: best.studentSkill.originalName,
        priority: requirement.priority,
        weight: requirement.weight
      });
    } else {
      if (requirement.priority === 'required') {
        missingRequiredSkills.push({
          name: requirement.name,
          critical: requirement.critical,
          partiallyMatched: best?.match.type === 'partial'
        });
      }
      if (best?.match.type === 'partial') {
        partialMatches.push({
          requiredSkill: requirement.name,
          studentSkill: best.studentSkill.originalName,
          priority: requirement.priority,
          strength: best.match.strength,
          reason: best.match.reason
        });
      }
      if (requirement.critical) {
        criticalGaps.push({
          skill: requirement.name,
          reason: best?.match.type === 'partial'
            ? `A related skill (${best.studentSkill.originalName}) is not an equivalent skill.`
            : 'No matching skill was found in the confirmed profile.'
        });
      }
    }
  }

  const requiredRequirements = requirements.filter(({ priority }) => priority === 'required');
  const preferredRequirements = requirements.filter(({ priority }) => priority === 'preferred');
  const requiredSkillCoverage = weightedCoverage(requiredRequirements, matchedByPriority.required);
  const preferredSkillCoverage = weightedCoverage(preferredRequirements, matchedByPriority.preferred);

  const availableComponents = [
    { value: requiredSkillCoverage, weight: weights.required },
    { value: preferredSkillCoverage, weight: weights.preferred }
  ].filter(({ value, weight }) => value !== null && weight > 0);
  const totalComponentWeight = availableComponents.reduce((total, item) => total + item.weight, 0);
  if (totalComponentWeight === 0) {
    throw new TypeError('No positive scoring weight is configured for this project’s available score components.');
  }
  const rawScore = availableComponents.reduce((total, item) => total + item.value * item.weight, 0) / totalComponentWeight;
  const score = roundScore(rawScore);
  const criticalRequirementsCount = requirements.filter(({ critical }) => critical).length;
  const criticalRequirementsSatisfied = criticalGaps.length === 0;
  const matchedRequired = exactSkills.filter(({ priority }) => priority === 'required');
  const matchedPreferredSkills = exactSkills.filter(({ priority }) => priority === 'preferred');
  const explanationParts = [
    `${matchedRequired.length} of ${requiredRequirements.length} required skills matched exactly.`,
    `${matchedPreferredSkills.length} of ${preferredRequirements.length} preferred skills matched exactly.`
  ];
  if (missingRequiredSkills.length) {
    explanationParts.push(`Missing required skills: ${missingRequiredSkills.map(({ name }) => name).join(', ')}.`);
  }
  if (partialMatches.length) {
    explanationParts.push('Related skills receive partial credit only and are not treated as equivalent.');
  }
  if (criticalRequirementsCount === 0) {
    explanationParts.push('No critical requirements were configured for this project.');
  } else {
    explanationParts.push(
      criticalRequirementsSatisfied
        ? 'Critical requirements are satisfied.'
        : `Critical requirements are not satisfied: ${criticalGaps.map(({ skill }) => skill).join(', ')}.`
    );
  }

  return {
    algorithmVersion: '2.0.0',
    score,
    classification: score >= threshold ? 'RELEVANT' : 'NOT_RELEVANT',
    threshold,
    criticalRequirementsSatisfied,
    criticalRequirementsCount,
    criticalGaps,
    breakdown: {
      requiredSkillCoverage: requiredSkillCoverage === null ? null : roundScore(requiredSkillCoverage),
      preferredSkillCoverage: preferredSkillCoverage === null ? null : roundScore(preferredSkillCoverage)
    },
    matchedSkills: exactSkills,
    missingRequiredSkills,
    matchedPreferredSkills,
    partialMatches,
    explanation: explanationParts.join(' ')
  };
}

module.exports = {
  CompatibilityError,
  readProfileSkills,
  readProjectRequirements,
  scoreProjectCompatibility
};

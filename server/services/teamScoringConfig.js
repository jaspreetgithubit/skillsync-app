const DEFAULT_TEAM_COMPONENT_WEIGHTS = Object.freeze({
  combinedSkillCoverage: 60,
  roleCoverage: 15,
  individualMemberRelevance: 15,
  skillComplementarity: 10
});

const DEFAULT_TEAM_THRESHOLDS = Object.freeze({
  highlyCompatible: 80,
  moderatelyCompatible: 65,
  lowCompatibility: 50
});

function readPositiveInteger(env, key, fallback) {
  const value = Number(env[key] ?? fallback);
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new TypeError(`${key} must be a positive integer.`);
  }
  return value;
}

function readTeamScoringConfig(env = process.env) {
  const weights = {
    combinedSkillCoverage: Number(env.TEAM_COMPATIBILITY_SKILLS_WEIGHT ?? DEFAULT_TEAM_COMPONENT_WEIGHTS.combinedSkillCoverage),
    roleCoverage: Number(env.TEAM_COMPATIBILITY_ROLES_WEIGHT ?? DEFAULT_TEAM_COMPONENT_WEIGHTS.roleCoverage),
    individualMemberRelevance: Number(env.TEAM_COMPATIBILITY_INDIVIDUAL_WEIGHT ?? DEFAULT_TEAM_COMPONENT_WEIGHTS.individualMemberRelevance),
    skillComplementarity: Number(env.TEAM_COMPATIBILITY_COMPLEMENTARITY_WEIGHT ?? DEFAULT_TEAM_COMPONENT_WEIGHTS.skillComplementarity)
  };
  const thresholds = {
    highlyCompatible: Number(env.TEAM_COMPATIBILITY_HIGH_THRESHOLD ?? DEFAULT_TEAM_THRESHOLDS.highlyCompatible),
    moderatelyCompatible: Number(env.TEAM_COMPATIBILITY_MODERATE_THRESHOLD ?? DEFAULT_TEAM_THRESHOLDS.moderatelyCompatible),
    lowCompatibility: Number(env.TEAM_COMPATIBILITY_LOW_THRESHOLD ?? DEFAULT_TEAM_THRESHOLDS.lowCompatibility)
  };

  if (Object.values(weights).some((weight) => !Number.isFinite(weight) || weight < 0)
    || Object.values(weights).every((weight) => weight === 0)) {
    throw new TypeError('Team compatibility weights must be non-negative, finite, and not all zero.');
  }
  if (Object.values(thresholds).some((threshold) => !Number.isFinite(threshold) || threshold < 0 || threshold > 100)
    || thresholds.highlyCompatible < thresholds.moderatelyCompatible
    || thresholds.moderatelyCompatible < thresholds.lowCompatibility) {
    throw new TypeError('Team compatibility thresholds must be ordered values between 0 and 100.');
  }

  const defaultTeamSize = readPositiveInteger(env, 'TEAM_RECOMMENDATION_DEFAULT_TEAM_SIZE', 3);
  const maxTeamSize = readPositiveInteger(env, 'TEAM_RECOMMENDATION_MAX_TEAM_SIZE', 8);
  if (defaultTeamSize > maxTeamSize) {
    throw new TypeError('The default team size cannot exceed the configured maximum team size.');
  }

  return {
    weights,
    thresholds,
    defaultTeamSize,
    maxTeamSize,
    maxCandidatePool: readPositiveInteger(env, 'TEAM_RECOMMENDATION_MAX_CANDIDATES', 50),
    maxExactCombinations: readPositiveInteger(env, 'TEAM_RECOMMENDATION_MAX_EXACT_COMBINATIONS', 25000),
    beamWidth: readPositiveInteger(env, 'TEAM_RECOMMENDATION_BEAM_WIDTH', 200),
    topK: readPositiveInteger(env, 'TEAM_RECOMMENDATION_TOP_K', 5)
  };
}

module.exports = {
  DEFAULT_TEAM_COMPONENT_WEIGHTS,
  DEFAULT_TEAM_THRESHOLDS,
  readTeamScoringConfig
};

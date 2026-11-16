const { createHash } = require('node:crypto');
const { CompatibilityError, readProfileSkills, scoreProjectCompatibility } = require('./projectCompatibilityService');
const { evaluateTeamCompatibility } = require('./teamCompatibilityService');
const { compareText, rankTeams } = require('./teamRankingService');
const { readTeamScoringConfig } = require('./teamScoringConfig');

class TeamRecommendationError extends Error {
  constructor(code, message, status = 400) {
    super(message);
    this.name = 'TeamRecommendationError';
    this.code = code;
    this.status = status;
  }
}

function combinationCount(size, teamSize) {
  if (teamSize > size) return 0;
  const count = Math.min(teamSize, size - teamSize);
  let total = 1;
  for (let index = 1; index <= count; index += 1) {
    total = total * (size - count + index) / index;
  }
  return Math.round(total);
}

function resolveTeamSize(project, config) {
  const modelDefaulted = typeof project?.$isDefault === 'function' && project.$isDefault('teamSize');
  const hasSize = project?.teamSize != null && Number.isFinite(Number(project.teamSize));
  const teamSizeDefaulted = modelDefaulted || !hasSize;
  const teamSize = teamSizeDefaulted ? config.defaultTeamSize : Number(project.teamSize);
  if (!Number.isSafeInteger(teamSize) || teamSize <= 0 || teamSize > config.maxTeamSize) {
    throw new TeamRecommendationError(
      'INVALID_TEAM_SIZE',
      `The project team size must be a positive integer no greater than ${config.maxTeamSize}.`,
      422
    );
  }
  return { teamSize, teamSizeDefaulted };
}

function candidateId(candidate) {
  return String(candidate.id || candidate._id || '');
}

function stableTeamId(ids) {
  return `team-${createHash('sha256').update([...ids].sort().join('|')).digest('hex').slice(0, 20)}`;
}

function eligibleCandidate(candidate, project, options) {
  const id = candidateId(candidate);
  if (!id || !candidate.profile || typeof candidate.profile !== 'object' || Array.isArray(candidate.profile)) return null;
  if (candidate.status && candidate.status !== 'active') return null;
  if (readProfileSkills(candidate.profile).length === 0) return null;
  const individualCompatibilityScore = Number.isFinite(candidate.individualCompatibilityScore)
    ? candidate.individualCompatibilityScore
    : scoreProjectCompatibility(candidate.profile, project, options).score;
  return {
    id,
    name: typeof candidate.name === 'string' && candidate.name.trim() ? candidate.name.trim() : 'Student',
    profile: candidate.profile,
    individualCompatibilityScore
  };
}

function* enumerateCombinations(candidates, teamSize, start = 0, selected = []) {
  if (selected.length === teamSize) {
    yield selected;
    return;
  }
  const remaining = teamSize - selected.length;
  for (let index = start; index <= candidates.length - remaining; index += 1) {
    yield* enumerateCombinations(candidates, teamSize, index + 1, [...selected, candidates[index]]);
  }
}

function yieldToEventLoop() {
  return new Promise((resolve) => setImmediate(resolve));
}

async function generateTeamRecommendations({ project, candidates, config, env } = {}) {
  if (!Array.isArray(candidates)) {
    throw new TypeError('Eligible student candidates must be provided as an array.');
  }
  const scoringConfig = config || readTeamScoringConfig(env);
  const { teamSize, teamSizeDefaulted } = resolveTeamSize(project, scoringConfig);
  const deduplicated = new Map();
  for (const candidate of candidates) {
    const id = candidateId(candidate);
    if (id && !deduplicated.has(id)) {
      const prepared = eligibleCandidate(candidate, project, { env });
      if (prepared) deduplicated.set(id, prepared);
    }
  }
  const eligible = [...deduplicated.values()].sort((left, right) => compareText(left.id, right.id));

  if (eligible.length > scoringConfig.maxCandidatePool) {
    throw new TeamRecommendationError(
      'SEARCH_LIMIT_EXCEEDED',
      `The eligible student pool exceeds the configured limit of ${scoringConfig.maxCandidatePool}.`,
      422
    );
  }
  if (eligible.length < teamSize) {
    throw new TeamRecommendationError(
      'INSUFFICIENT_ELIGIBLE_STUDENTS',
      `Only ${eligible.length} eligible students are available; ${teamSize} are required.`,
      422
    );
  }

  const totalTeamsPossible = combinationCount(eligible.length, teamSize);
  const exactSearch = totalTeamsPossible <= scoringConfig.maxExactCombinations;
  const recommendations = [];
  let totalTeamsEvaluated = 0;
  let searchNodesEvaluated = 0;

  function evaluateMembers(members) {
    const evaluation = evaluateTeamCompatibility(project, members, { config: scoringConfig, env });
    const ids = members.map(({ id }) => id).sort();
    return {
      teamId: stableTeamId(ids),
      ...evaluation,
      members: evaluation.members,
      memberKey: ids.join('\u0000')
    };
  }

  if (exactSearch) {
    for (const members of enumerateCombinations(eligible, teamSize)) {
      recommendations.push(evaluateMembers(members));
      totalTeamsEvaluated += 1;
      searchNodesEvaluated += 1;
      if (totalTeamsEvaluated % 200 === 0) await yieldToEventLoop();
    }
  } else {
    let beam = eligible.map((candidate) => {
      const evaluated = evaluateMembers([candidate]);
      searchNodesEvaluated += 1;
      return { members: [candidate], lastIndex: eligible.indexOf(candidate), evaluated };
    });
    beam = rankTeams(beam, scoringConfig.beamWidth, (state) => state.evaluated);

    for (let depth = 1; depth < teamSize; depth += 1) {
      const expanded = [];
      let expansionsSinceYield = 0;
      for (const state of beam) {
        const slotsLeft = teamSize - state.members.length;
        const lastIndex = state.lastIndex;
        for (let index = lastIndex + 1; index <= eligible.length - slotsLeft; index += 1) {
          const members = [...state.members, eligible[index]];
          const evaluated = evaluateMembers(members);
          searchNodesEvaluated += 1;
          if (members.length === teamSize) totalTeamsEvaluated += 1;
          expanded.push({ members, lastIndex: index, evaluated });
          expansionsSinceYield += 1;
          if (expansionsSinceYield >= 200) {
            await yieldToEventLoop();
            expansionsSinceYield = 0;
          }
        }
      }
      beam = rankTeams(expanded, scoringConfig.beamWidth, (state) => state.evaluated);
    }
    recommendations.push(...beam.map(({ evaluated }) => evaluated));
  }

  const rankedRecommendations = rankTeams(recommendations, scoringConfig.topK)
    .map(({ memberKey, ...recommendation }, index) => ({ rank: index + 1, ...recommendation }));
  if (rankedRecommendations.length === 0) {
    throw new TeamRecommendationError('NO_VALID_TEAMS', 'No valid teams could be generated for this project.', 422);
  }

  return {
    teamSize,
    teamSizeDefaulted,
    eligibleStudentCount: eligible.length,
    totalTeamsPossible,
    totalTeamsEvaluated,
    searchNodesEvaluated,
    searchStrategy: exactSearch ? 'EXACT' : 'BOUNDED_BEAM',
    recommendations: rankedRecommendations
  };
}

module.exports = {
  TeamRecommendationError,
  combinationCount,
  generateTeamRecommendations,
  resolveTeamSize
};

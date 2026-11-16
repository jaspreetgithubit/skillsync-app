function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareRankedTeams(left, right) {
  return right.compatibilityScore - left.compatibilityScore
    || Number(right.criticalRequirementsSatisfied) - Number(left.criticalRequirementsSatisfied)
    || (right.scoreBreakdown.requiredSkillCoverage || 0) - (left.scoreBreakdown.requiredSkillCoverage || 0)
    || (right.scoreBreakdown.roleCoverage ?? -1) - (left.scoreBreakdown.roleCoverage ?? -1)
    || right.scoreBreakdown.individualMemberRelevance - left.scoreBreakdown.individualMemberRelevance
    || right.scoreBreakdown.skillComplementarity - left.scoreBreakdown.skillComplementarity
    || compareText(left.memberKey, right.memberKey);
}

function rankTeams(teams, maximum = 5, getEvaluation = (team) => team) {
  if (!Array.isArray(teams)) throw new TypeError('Ranked teams must be provided as an array.');
  if (!Number.isSafeInteger(maximum) || maximum <= 0) {
    throw new TypeError('The maximum number of ranked teams must be a positive integer.');
  }
  return [...teams].sort((left, right) => compareRankedTeams(getEvaluation(left), getEvaluation(right))).slice(0, maximum);
}

module.exports = { compareRankedTeams, compareText, rankTeams };

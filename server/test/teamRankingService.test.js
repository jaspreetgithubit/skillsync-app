const assert = require('node:assert/strict');
const { test } = require('node:test');
const { rankTeams } = require('../services/teamRankingService');

function team(id, values = {}) {
  return {
    compatibilityScore: 80,
    criticalRequirementsSatisfied: false,
    scoreBreakdown: {
      requiredSkillCoverage: 60,
      roleCoverage: null,
      individualMemberRelevance: 70,
      skillComplementarity: 50
    },
    memberKey: id,
    ...values
  };
}

test('ranking applies critical, skill, role, relevance, complementarity, then ID tie-breakers', () => {
  const teams = [
    team('z', { criticalRequirementsSatisfied: true }),
    team('a', { scoreBreakdown: { requiredSkillCoverage: 70, roleCoverage: 10, individualMemberRelevance: 70, skillComplementarity: 50 } }),
    team('b', { scoreBreakdown: { requiredSkillCoverage: 70, roleCoverage: 20, individualMemberRelevance: 70, skillComplementarity: 50 } }),
    team('c', { scoreBreakdown: { requiredSkillCoverage: 70, roleCoverage: 20, individualMemberRelevance: 75, skillComplementarity: 50 } }),
    team('d', { scoreBreakdown: { requiredSkillCoverage: 70, roleCoverage: 20, individualMemberRelevance: 75, skillComplementarity: 60 } }),
    team('e', { scoreBreakdown: { requiredSkillCoverage: 70, roleCoverage: 20, individualMemberRelevance: 75, skillComplementarity: 60 } })
  ];

  assert.deepEqual(rankTeams(teams).map(({ memberKey }) => memberKey), ['z', 'd', 'e', 'c', 'b']);
  assert.equal(teams[0].memberKey, 'z');
});

test('ranking can select a bounded beam frontier and validates its inputs', () => {
  const states = [{ result: team('b') }, { result: team('a') }];
  assert.deepEqual(rankTeams(states, 1, (state) => state.result).map(({ result }) => result.memberKey), ['a']);
  assert.throws(() => rankTeams([], 0), /positive integer/);
});

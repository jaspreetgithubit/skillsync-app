const { CompatibilityError, readProfileSkills, readProjectRequirements, scoreProjectCompatibility } = require('./projectCompatibilityService');
const { getSkillMatch, normalizeSkillName, skillKey } = require('./skillNormalization');
const { readTeamScoringConfig } = require('./teamScoringConfig');

function roundScore(value) {
  return Math.round(value * 10) / 10;
}

function scoreClassification(score, thresholds) {
  if (score >= thresholds.highlyCompatible) return 'HIGHLY_COMPATIBLE';
  if (score >= thresholds.moderatelyCompatible) return 'MODERATELY_COMPATIBLE';
  if (score >= thresholds.lowCompatibility) return 'LOW_COMPATIBILITY';
  return 'POOR_COMPATIBILITY';
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeRoleRequirements(project) {
  const roles = project?.requiredRoles ?? project?.roles ?? [];
  if (!Array.isArray(roles)) {
    throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Project role requirements are invalid.');
  }

  const seenRoleNames = new Set();
  return roles.map((role) => {
    if (!role || typeof role !== 'object' || Array.isArray(role)
      || typeof role.role !== 'string' || role.role.trim().length === 0) {
      throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Every project role needs a valid name.');
    }
    const roleKey = role.role.trim().toLowerCase();
    if (seenRoleNames.has(roleKey)) {
      throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Project role names must be unique.');
    }
    seenRoleNames.add(roleKey);

    const count = role.count == null ? 1 : Number(role.count);
    if (!Number.isInteger(count) || count < 1 || count > 100) {
      throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Project role counts must be positive integers.');
    }
    const rawSkills = role.requiredSkills ?? [];
    if (!Array.isArray(rawSkills)) {
      throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', 'Role skill requirements must be a list.');
    }
    const requiredSkills = [];
    const uniqueSkills = new Set();
    for (const rawSkill of rawSkills) {
      try {
        const name = normalizeSkillName(rawSkill);
        const key = skillKey(name);
        if (!uniqueSkills.has(key)) {
          requiredSkills.push(name);
          uniqueSkills.add(key);
        }
      } catch {
        throw new CompatibilityError('INVALID_PROJECT_REQUIREMENTS', `Role "${role.role.trim()}" contains an invalid skill name.`);
      }
    }

    return {
      name: role.role.trim(),
      weight: count,
      requiredSkills
    };
  });
}

function weightedCoverage(requirements, matchedStrengths) {
  const totalWeight = requirements.reduce((total, requirement) => total + requirement.weight, 0);
  if (totalWeight === 0) return null;
  const achievedWeight = requirements.reduce(
    (total, requirement) => total + requirement.weight * (matchedStrengths.get(requirement) || 0),
    0
  );
  return achievedWeight / totalWeight * 100;
}

function resolveIndividualScore(member, project, options) {
  const score = typeof member.individualCompatibilityScore === 'number'
    ? member.individualCompatibilityScore
    : member.individualCompatibility?.score;
  if (Number.isFinite(score) && score >= 0 && score <= 100) return score;
  return scoreProjectCompatibility(member.profile, project, options).score;
}

function getBestTeamMatch(requirementName, memberSkills) {
  const bestByMember = new Map();
  for (const member of memberSkills) {
    for (const skill of member.skills) {
      const match = getSkillMatch(requirementName, skill.name);
      if (match.strength > 0) {
        const candidate = {
          memberId: member.id,
          memberName: member.name,
          studentSkill: skill.originalName,
          match
        };
        const current = bestByMember.get(member.id);
        if (!current || candidate.match.strength > current.match.strength
          || (candidate.match.strength === current.match.strength && compareText(candidate.studentSkill, current.studentSkill) < 0)) {
          bestByMember.set(member.id, candidate);
        }
      }
    }
  }
  return [...bestByMember.values()].sort((left, right) => (
    right.match.strength - left.match.strength
    || compareText(left.memberId, right.memberId)
    || compareText(left.studentSkill, right.studentSkill)
  ));
}

function evaluateTeamCompatibility(project, members, options = {}) {
  const requirements = readProjectRequirements(project);
  const config = options.config || readTeamScoringConfig(options.env);
  const roleRequirements = normalizeRoleRequirements(project);
  if (!Array.isArray(members) || members.length === 0) {
    throw new CompatibilityError('INVALID_TEAM', 'A team must contain at least one eligible student.');
  }

  const teamMembers = members.map((member) => {
    const id = String(member.id || member._id || '');
    if (!id || !member.profile || typeof member.profile !== 'object' || Array.isArray(member.profile)) {
      throw new CompatibilityError('INVALID_TEAM', 'Every team member must have a valid confirmed profile.');
    }
    return {
      id,
      name: typeof member.name === 'string' && member.name.trim() ? member.name.trim() : 'Student',
      profile: member.profile,
      individualCompatibilityScore: resolveIndividualScore(member, project, options),
      skills: readProfileSkills(member.profile)
    };
  });
  if (new Set(teamMembers.map(({ id }) => id)).size !== teamMembers.length) {
    throw new CompatibilityError('INVALID_TEAM', 'A student cannot appear more than once in a team.');
  }

  const requiredSkills = requirements.filter(({ priority }) => priority === 'required');
  const preferredSkills = requirements.filter(({ priority }) => priority === 'preferred');
  const matchedByPriority = { required: new Map(), preferred: new Map() };
  const exactMatches = { required: [], preferred: [] };
  const missingRequiredSkills = [];
  const missingPreferredSkills = [];
  const partialMatches = [];
  const criticalGaps = [];
  const requirementContributors = new Map();
  const allRequirements = [];

  for (const requirement of requirements) {
    allRequirements.push(requirement);
    const matches = getBestTeamMatch(requirement.name, teamMembers);
    const best = matches[0];
    const strength = best?.match.strength || 0;
    matchedByPriority[requirement.priority].set(requirement, strength);
    requirementContributors.set(requirement, matches);

    if (best?.match.type === 'exact') {
      exactMatches[requirement.priority].push({
        name: requirement.name,
        weight: requirement.weight,
        contributors: matches.filter(({ match }) => match.type === 'exact').map(({ memberName, studentSkill }) => ({
          name: memberName,
          skill: studentSkill
        }))
      });
    } else {
      const gap = {
        name: requirement.name,
        critical: requirement.critical,
        partiallyMatched: best?.match.type === 'partial'
      };
      if (requirement.priority === 'required') missingRequiredSkills.push(gap);
      else missingPreferredSkills.push(gap);
      if (requirement.critical) {
        criticalGaps.push({
          skill: requirement.name,
          reason: best?.match.type === 'partial'
            ? `A related skill (${best.studentSkill}) is not an equivalent skill.`
            : 'No matching skill was found in the eligible team profiles.'
        });
      }
    }

    if (best?.match.type === 'partial') {
      partialMatches.push({
        requiredSkill: requirement.name,
        studentSkill: best.studentSkill,
        memberName: best.memberName,
        priority: requirement.priority,
        strength: best.match.strength,
        reason: best.match.reason
      });
    }
  }

  const requiredSkillCoverage = weightedCoverage(requiredSkills, matchedByPriority.required);
  const preferredSkillCoverage = weightedCoverage(preferredSkills, matchedByPriority.preferred);
  const availableSkillComponents = [
    { value: requiredSkillCoverage, weight: 0.8 },
    { value: preferredSkillCoverage, weight: 0.2 }
  ].filter(({ value }) => value !== null);
  const skillWeight = availableSkillComponents.reduce((total, component) => total + component.weight, 0);
  const combinedSkillCoverage = availableSkillComponents.reduce(
    (total, component) => total + component.value * component.weight,
    0
  ) / skillWeight;

  const configuredRoles = roleRequirements.filter(({ requiredSkills: skills }) => skills.length > 0);
  const roleCoverage = roleRequirements.map((role) => {
    if (role.requiredSkills.length === 0) {
      return { name: role.name, weight: role.weight, coverage: null, status: 'UNCONFIGURED', matchedSkills: [], missingSkills: role.requiredSkills };
    }

    const roleMatches = role.requiredSkills.map((requiredSkill) => ({
      requiredSkill,
      matches: getBestTeamMatch(requiredSkill, teamMembers)
    }));
    const achieved = roleMatches.reduce((total, entry) => total + (entry.matches[0]?.match.strength || 0), 0);
    const coverage = achieved / roleMatches.length * 100;
    const allExact = roleMatches.every((entry) => entry.matches[0]?.match.type === 'exact');
    const matchedSkills = roleMatches
      .filter((entry) => entry.matches[0]?.match.type === 'exact')
      .map(({ requiredSkill }) => requiredSkill);
    const missingSkills = roleMatches
      .filter((entry) => entry.matches[0]?.match.type !== 'exact')
      .map(({ requiredSkill }) => requiredSkill);
    return {
      name: role.name,
      weight: role.weight,
      coverage: roundScore(coverage),
      status: allExact ? 'COVERED' : coverage > 0 ? 'PARTIALLY_COVERED' : 'NOT_COVERED',
      matchedSkills,
      missingSkills,
      partialMatches: roleMatches.flatMap(({ requiredSkill, matches }) => (
        matches[0]?.match.type === 'partial'
          ? [{ requiredSkill, studentSkill: matches[0].studentSkill, strength: matches[0].match.strength }]
          : []
      ))
    };
  });
  const roleCoverageScore = configuredRoles.length > 0
    ? configuredRoles.reduce((total, role) => {
      const coverage = roleCoverage.find((entry) => entry.name === role.name);
      return total + coverage.coverage * role.weight;
    }, 0) / configuredRoles.reduce((total, role) => total + role.weight, 0)
    : null;

  const coveredRequirementWeight = requirements.reduce(
    (total, requirement) => total + requirement.weight * (matchedByPriority[requirement.priority].get(requirement) || 0),
    0
  );
  const uniqueContributions = requirements.flatMap((requirement) => {
    const matches = requirementContributors.get(requirement);
    if (matches.length !== 1) return [];
    const [match] = matches;
    return [{
      skill: requirement.name,
      memberName: match.memberName,
      studentSkill: match.studentSkill,
      priority: requirement.priority,
      weight: requirement.weight
    }];
  });
  const uniqueCoveredWeight = uniqueContributions.reduce((total, contribution) => {
    const requirement = requirements.find(({ name, priority }) => (
      name === contribution.skill && priority === contribution.priority
    ));
    return total + contribution.weight * (matchedByPriority[contribution.priority].get(requirement) || 0);
  }, 0);
  const skillComplementarity = coveredRequirementWeight === 0
    ? 0
    : uniqueCoveredWeight / coveredRequirementWeight * 100;

  const individualMemberRelevance = teamMembers.reduce(
    (total, member) => total + member.individualCompatibilityScore,
    0
  ) / teamMembers.length;
  const availableScoreComponents = [
    { key: 'combinedSkillCoverage', value: combinedSkillCoverage, weight: config.weights.combinedSkillCoverage },
    { key: 'roleCoverage', value: roleCoverageScore, weight: config.weights.roleCoverage },
    { key: 'individualMemberRelevance', value: individualMemberRelevance, weight: config.weights.individualMemberRelevance },
    { key: 'skillComplementarity', value: skillComplementarity, weight: config.weights.skillComplementarity }
  ].filter(({ value, weight }) => value !== null && weight > 0);
  const totalScoreWeight = availableScoreComponents.reduce((total, component) => total + component.weight, 0);
  const compatibilityScore = roundScore(availableScoreComponents.reduce(
    (total, component) => total + component.value * component.weight,
    0
  ) / totalScoreWeight);
  const criticalRequirementsSatisfied = criticalGaps.length === 0;
  const criticalRequirementsCount = requirements.filter(({ critical }) => critical).length;
  const memberResults = teamMembers.map((member) => {
    const contributions = requirements.flatMap((requirement) => {
      const contribution = requirementContributors.get(requirement).find(({ memberId }) => memberId === member.id);
      return contribution
        ? [{ requiredSkill: requirement.name, studentSkill: contribution.studentSkill, priority: requirement.priority, matchType: contribution.match.type }]
        : [];
    });
    return {
      name: member.name,
      individualCompatibilityScore: roundScore(member.individualCompatibilityScore),
      skills: [...new Set(contributions.map(({ studentSkill }) => studentSkill))],
      contributions
    };
  });
  const combinedSkills = allRequirements
    .filter((requirement) => (matchedByPriority[requirement.priority].get(requirement) || 0) > 0)
    .map(({ name }) => name);

  const explanationParts = [
    `The team covers ${exactMatches.required.length} of ${requiredSkills.length} required skills exactly and ${exactMatches.preferred.length} of ${preferredSkills.length} preferred skills exactly.`
  ];
  if (missingRequiredSkills.length) {
    explanationParts.push(`Required skill gaps: ${missingRequiredSkills.map(({ name }) => name).join(', ')}.`);
  }
  if (roleCoverageScore === null) {
    explanationParts.push('Role coverage was not included because no role-specific skills are configured.');
  } else {
    const covered = roleCoverage.filter(({ status }) => status === 'COVERED').map(({ name }) => name);
    explanationParts.push(covered.length
      ? `Fully covered roles: ${covered.join(', ')}.`
      : 'No configured role is fully covered.');
  }
  explanationParts.push(`Unique project-relevant contributions account for ${roundScore(skillComplementarity)}% of the covered requirement weight.`);
  if (criticalRequirementsCount === 0) {
    explanationParts.push('No critical skill requirements were configured.');
  } else {
    explanationParts.push(criticalRequirementsSatisfied
      ? 'All critical skill requirements are satisfied.'
      : `Critical requirements are missing: ${criticalGaps.map(({ skill }) => skill).join(', ')}.`);
  }

  return {
    compatibilityScore,
    classification: scoreClassification(compatibilityScore, config.thresholds),
    criticalRequirementsSatisfied,
    criticalRequirementsCount,
    criticalGaps,
    scoreBreakdown: {
      combinedSkillCoverage: roundScore(combinedSkillCoverage),
      requiredSkillCoverage: requiredSkillCoverage === null ? null : roundScore(requiredSkillCoverage),
      preferredSkillCoverage: preferredSkillCoverage === null ? null : roundScore(preferredSkillCoverage),
      roleCoverage: roleCoverageScore === null ? null : roundScore(roleCoverageScore),
      individualMemberRelevance: roundScore(individualMemberRelevance),
      skillComplementarity: roundScore(skillComplementarity),
      activeComponentWeights: Object.fromEntries(availableScoreComponents.map(({ key, weight }) => [key, roundScore(weight / totalScoreWeight * 100)]))
    },
    requiredSkillCoverage: requiredSkillCoverage === null ? null : roundScore(requiredSkillCoverage),
    preferredSkillCoverage: preferredSkillCoverage === null ? null : roundScore(preferredSkillCoverage),
    members: memberResults,
    combinedSkills: [...new Set(combinedSkills)],
    matchedRequiredSkills: exactMatches.required,
    missingRequiredSkills,
    matchedPreferredSkills: exactMatches.preferred,
    missingPreferredSkills,
    partialMatches,
    roleCoverage,
    uniqueContributions,
    explanation: explanationParts.join(' ')
  };
}

module.exports = { evaluateTeamCompatibility, normalizeRoleRequirements };

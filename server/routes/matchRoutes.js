// server/routes/matchRoutes.js
// Pure Node.js & Express API routes for TeamMatch AI Compatibility Engine (No MongoDB)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const LEVEL_WEIGHTS = {
  'basic': 1,
  'beginner': 1,
  'medium': 2,
  'intermediate': 2,
  'strong': 3,
  'advanced': 3,
  'expert': 4
};

// Helper compatibility calculation
const computeCompatibility = (userProfile = {}, project = {}) => {
  const userSkillsMap = new Map();
  (userProfile.skills || []).forEach(s => {
    if (typeof s === 'string') {
      userSkillsMap.set(s.trim().toLowerCase(), 2);
    } else if (s && s.name) {
      const lvl = String(s.level || 'medium').toLowerCase();
      userSkillsMap.set(s.name.trim().toLowerCase(), LEVEL_WEIGHTS[lvl] || 2);
    }
  });

  const projectSkills = project.requiredSkills || [];
  let totalWeight = 0;
  let earnedScore = 0;
  const matchedSkills = [];
  const missingSkills = [];

  projectSkills.forEach(req => {
    const skillName = typeof req === 'string' ? req : (req.name || '');
    if (!skillName) return;

    const weight = req.weight || 20;
    totalWeight += weight;

    const userRank = userSkillsMap.get(skillName.toLowerCase());
    if (userRank) {
      earnedScore += weight * Math.min(1, (userRank / 2));
      matchedSkills.push(skillName);
    } else {
      missingSkills.push(skillName);
    }
  });

  const skillScore = totalWeight > 0 ? Math.round((earnedScore / totalWeight) * 100) : 85;

  // Role alignment check
  const candidateRoles = (userProfile.roles || [userProfile.role || 'Full Stack Developer']).map(r => String(r).toLowerCase());
  const projectRoles = (project.requiredRoles || []).map(r => (typeof r === 'string' ? r : (r.role || '')).toLowerCase());

  let roleScore = 75;
  if (projectRoles.length === 0 || candidateRoles.some(cr => projectRoles.some(pr => pr.includes(cr) || cr.includes(pr)))) {
    roleScore = 95;
  }

  // Experience match
  const candidateExp = Number(userProfile.experience) || 2;
  const expScore = candidateExp >= 3 ? 95 : 85;

  const overallScore = Math.min(99, Math.round(skillScore * 0.55 + roleScore * 0.25 + expScore * 0.20));

  const explainableAI = [];
  if (matchedSkills.length > 0) {
    explainableAI.push(`✓ Matched ${matchedSkills.length} core technical requirements (${matchedSkills.slice(0, 3).join(', ')}).`);
  }
  if (roleScore >= 90) {
    explainableAI.push(`✓ Target sprint role aligns directly with open squad position.`);
  }
  if (missingSkills.length > 0) {
    explainableAI.push(`• Growth opportunity: ${missingSkills.slice(0, 2).join(', ')}.`);
  }

  return {
    overallScore,
    skillMatch: skillScore,
    roleMatch: roleScore,
    experienceMatch: expScore,
    matchedSkills,
    missingSkills,
    explainableAI: explainableAI.length ? explainableAI : ['✓ Verified technical profile ready for team assignment.']
  };
};

// ============================================================================
// 1. POST /api/match - Calculate compatibility between candidate & project
// ============================================================================
router.post('/', (req, res) => {
  try {
    const { userProfile, project } = req.body || {};
    const result = computeCompatibility(userProfile, project);
    return res.status(200).json({
      success: true,
      compatibility: result
    });
  } catch (err) {
    console.error('Match calculation error:', err);
    return res.status(500).json({ success: false, error: 'Failed to calculate compatibility score.' });
  }
});

// ============================================================================
// 2. GET /api/match/health - Service check
// ============================================================================
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TeamMatch AI Compatibility Engine (Pure Node.js)' });
});

module.exports = router;

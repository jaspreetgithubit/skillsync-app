const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const { rateLimit } = require('express-rate-limit');
const Project = require('../models/Project');
const User = require('../models/User');
const AuthSession = require('../models/AuthSession');
const { createRequireAuthenticatedUser } = require('../middleware/requireAuthenticatedUser');
const { CompatibilityError } = require('../services/projectCompatibilityService');
const { generateTeamRecommendations, TeamRecommendationError } = require('../services/teamGenerationService');
const { readTeamScoringConfig } = require('../services/teamScoringConfig');

const dataFilePath = path.resolve(__dirname, '../../data/projects.json');
const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;
const LOCAL_PROJECT_ID_PATTERN = /^proj-[A-Za-z0-9-]+$/;

function readLocalProjects() {
  if (!fs.existsSync(dataFilePath)) return [];
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

async function findEligibleCandidates(users, maxCandidatePool) {
  if (!users || typeof users.find !== 'function') {
    throw new TypeError('The student account repository is unavailable.');
  }
  let query = users.find({
    $or: [
      { 'profile.skills.0': { $exists: true } },
      { 'profile.experience.0.technologies.0': { $exists: true } },
      { 'profile.projects.0.technologies.0': { $exists: true } }
    ]
  });
  if (typeof query.select === 'function') {
    query = query.select('_id name status profile.skills profile.experience.technologies profile.projects.technologies');
  }
  if (typeof query.limit === 'function') query = query.limit(maxCandidatePool + 1);
  if (typeof query.lean === 'function') query = query.lean();
  return query;
}

function createTeamRouter(dependencies = {}) {
  const router = express.Router();
  const projects = dependencies.Project || Project;
  const users = dependencies.User || User;
  const logger = dependencies.logger || console;
  const env = dependencies.env || process.env;
  const requireAuthenticatedUser = createRequireAuthenticatedUser({
    AuthSession: dependencies.AuthSession || AuthSession,
    User: users,
    isDatabaseReady: dependencies.isDatabaseReady,
    logger
  });
  const findLocalProject = dependencies.findLocalProject || (async (id) => (
    readLocalProjects().find((project) => String(project.id) === id) || null
  ));
  const getCandidates = dependencies.findEligibleCandidates || ((max) => findEligibleCandidates(users, max));
  const recommendationLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many team recommendation requests. Please try again shortly.' }
    })
  });

  router.get('/:projectId/team-recommendations', requireAuthenticatedUser, recommendationLimit, async (req, res) => {
    const projectId = req.params.projectId;
    if (!MONGO_ID_PATTERN.test(projectId) && !LOCAL_PROJECT_ID_PATTERN.test(projectId)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PROJECT_ID', message: 'The project ID is invalid.' }
      });
    }

    try {
      let project = MONGO_ID_PATTERN.test(projectId)
        ? await projects.findById(projectId)
        : null;
      if (!project) project = await findLocalProject(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          error: { code: 'PROJECT_NOT_FOUND', message: 'The requested project was not found.' }
        });
      }

      const config = readTeamScoringConfig(env);
      const candidates = await getCandidates(config.maxCandidatePool);
      const result = await generateTeamRecommendations({ project, candidates, config, env });
      return res.status(200).json({
        success: true,
        projectId: String(project.id || project._id),
        projectTitle: project.projectTitle || 'Project',
        teamSize: result.teamSize,
        teamSizeDefaulted: result.teamSizeDefaulted,
        eligibleStudentCount: result.eligibleStudentCount,
        totalTeamsPossible: result.totalTeamsPossible,
        totalTeamsEvaluated: result.totalTeamsEvaluated,
        recommendations: result.recommendations,
        metadata: {
          algorithmVersion: '1.0.0',
          searchStrategy: result.searchStrategy,
          searchNodesEvaluated: result.searchNodesEvaluated,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof TeamRecommendationError || error instanceof CompatibilityError) {
        return res.status(error.status).json({
          success: false,
          error: { code: error.code, message: error.message }
        });
      }
      logger.error(JSON.stringify({
        event: 'team_recommendations_failed',
        category: error?.name || 'UnknownError'
      }));
      return res.status(503).json({
        success: false,
        error: { code: 'TEAM_RECOMMENDATIONS_UNAVAILABLE', message: 'Team recommendations could not be calculated. Please try again.' }
      });
    }
  });

  return router;
}

module.exports = { createTeamRouter, findEligibleCandidates };

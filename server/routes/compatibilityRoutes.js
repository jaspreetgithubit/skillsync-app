const express = require('express');
const fs = require('node:fs');
const path = require('node:path');
const Project = require('../models/Project');
const User = require('../models/User');
const AuthSession = require('../models/AuthSession');
const { createRequireAuthenticatedUser } = require('../middleware/requireAuthenticatedUser');
const { CompatibilityError, scoreProjectCompatibility } = require('../services/projectCompatibilityService');

const dataFilePath = path.resolve(__dirname, '../../data/projects.json');
const MONGO_ID_PATTERN = /^[a-f\d]{24}$/i;
const LOCAL_PROJECT_ID_PATTERN = /^proj-[A-Za-z0-9-]+$/;

function readLocalProjects() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function createCompatibilityRouter(dependencies = {}) {
  const router = express.Router();
  const projects = dependencies.Project || Project;
  const logger = dependencies.logger || console;
  const requireAuthenticatedUser = createRequireAuthenticatedUser({
    AuthSession: dependencies.AuthSession || AuthSession,
    User: dependencies.User || User,
    isDatabaseReady: dependencies.isDatabaseReady,
    logger
  });
  const findLocalProject = dependencies.findLocalProject || (async (id) => (
    readLocalProjects().find((project) => String(project.id) === id) || null
  ));
  const scoreCompatibility = dependencies.scoreProjectCompatibility || scoreProjectCompatibility;

  router.get('/:projectId/compatibility', requireAuthenticatedUser, async (req, res) => {
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

      const profile = req.user?.profile;
      if (!profile || typeof profile !== 'object' || Array.isArray(profile)) {
        return res.status(404).json({
          success: false,
          error: { code: 'PROFILE_NOT_FOUND', message: 'No confirmed student profile is available for this account.' }
        });
      }
      if (!Array.isArray(profile.skills)) {
        return res.status(409).json({
          success: false,
          error: { code: 'PROFILE_NOT_CONFIRMED', message: 'Confirm your student profile before checking project compatibility.' }
        });
      }

      const compatibility = scoreCompatibility(profile, project, { env: dependencies.env });
      return res.json({
        success: true,
        data: {
          project: {
            id: String(project.id || project._id),
            projectTitle: project.projectTitle
          },
          compatibility
        }
      });
    } catch (error) {
      if (error instanceof CompatibilityError) {
        return res.status(error.status).json({
          success: false,
          error: { code: error.code, message: error.message }
        });
      }
      logger.error(JSON.stringify({
        event: 'project_compatibility_calculation_failed',
        category: error?.name || 'UnknownError'
      }));
      return res.status(500).json({
        success: false,
        error: { code: 'COMPATIBILITY_CALCULATION_FAILED', message: 'Compatibility could not be calculated. Please try again.' }
      });
    }
  });

  return router;
}

module.exports = { createCompatibilityRouter };

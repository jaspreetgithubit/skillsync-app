// server/routes/projectRoutes.js
// Express API routes for TeamMatch AI Projects

const express = require('express');
const path = require('path');
const fs = require('fs');
const {
  projectRoleRequirementsSchema,
  projectSkillRequirementsSchema
} = require('../schemas/projectRequirements');
const { normalizeSkillName } = require('../services/skillNormalization');
const { readTeamScoringConfig } = require('../services/teamScoringConfig');

let Project;
try {
  Project = require('../models/Project');
} catch (e) {
  Project = null;
}

const dataFilePath = path.resolve(__dirname, '../../data/projects.json');

const readLocalProjects = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf-8') || '[]');
  } catch (e) {
    return [];
  }
};

const writeLocalProjects = (data) => {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    return false;
  }
};

function createProjectRouter(dependencies = {}) {
  const router = express.Router();
  const projects = dependencies.Project || Project;
  const isDatabaseReady = dependencies.isDatabaseReady || (() => (
    projects && projects.db && projects.db.readyState === 1
  ));
  const localProjects = dependencies.readLocalProjects || readLocalProjects;
  const saveLocalProjects = dependencies.writeLocalProjects || writeLocalProjects;
  const env = dependencies.env || process.env;

  router.get('/', async (req, res) => {
    try {
      if (isDatabaseReady()) {
        const mongoProjects = await projects.find().sort({ createdAt: -1 });
        const mongoProjectIds = new Set(mongoProjects.map((project) => String(project.id || project._id)));
        const otherProjects = localProjects().filter((project) => !mongoProjectIds.has(String(project.id)));
        const allProjects = [...mongoProjects, ...otherProjects];
        return res.status(200).json({ success: true, count: allProjects.length, projects: allProjects });
      }
      const local = localProjects();
      return res.status(200).json({ success: true, count: local.length, projects: local });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { projectTitle, description, requiredSkills, skillWeights, createdBy } = req.body;
      const config = readTeamScoringConfig(env);
      const requestedTeamSize = req.body.teamSize == null || req.body.teamSize === ''
        ? config.defaultTeamSize
        : Number(req.body.teamSize);

    // Validation
    if (!projectTitle || !projectTitle.trim()) {
      return res.status(400).json({ success: false, error: 'Project Title is required' });
    }
    if (!Number.isSafeInteger(requestedTeamSize) || requestedTeamSize <= 0 || requestedTeamSize > config.maxTeamSize) {
      return res.status(400).json({
        success: false,
        error: `Team Size must be a positive whole number no greater than ${config.maxTeamSize}`
      });
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one required skill is required' });
    }
    const skillRequirements = projectSkillRequirementsSchema.safeParse(requiredSkills);
    if (!skillRequirements.success) {
      return res.status(400).json({
        success: false,
        error: 'Skill requirements must include valid names, priorities, weights, and critical flags'
      });
    }
    const normalizedSkills = skillRequirements.data.map((skill) => ({
      ...skill,
      name: normalizeSkillName(skill.name)
    }));
    const roleRequirements = projectRoleRequirementsSchema.safeParse(req.body.requiredRoles ?? []);
    if (!roleRequirements.success) {
      return res.status(400).json({ success: false, error: 'Role requirements must include valid names, counts, and skill lists' });
    }
    const normalizedRoles = roleRequirements.data.map((role) => ({
      ...role,
      requiredSkills: role.requiredSkills.map((skill) => normalizeSkillName(skill))
    }));

    if (isDatabaseReady()) {
      const newProj = await projects.create({
        projectTitle: projectTitle.trim(),
        description: description ? description.trim() : '',
        teamSize: requestedTeamSize,
        requiredSkills: normalizedSkills,
        requiredRoles: normalizedRoles,
        skillWeights: skillWeights || {},
        createdBy: createdBy || 'Admin Lead'
      });
      return res.status(201).json({ success: true, message: 'Project saved to MongoDB', project: newProj });
    }

    // Local JSON Database Fallback
    const local = localProjects();
    const newProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectTitle: projectTitle.trim(),
      description: description ? description.trim() : '',
      teamSize: requestedTeamSize,
      requiredSkills: normalizedSkills,
      requiredRoles: normalizedRoles,
      skillWeights: skillWeights || {},
      createdBy: createdBy || 'Admin Lead',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    local.unshift(newProject);
    saveLocalProjects(local);

    return res.status(201).json({ success: true, message: 'Project saved to Local Store', project: newProject });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });
  return router;
}

module.exports = createProjectRouter();
module.exports.createProjectRouter = createProjectRouter;

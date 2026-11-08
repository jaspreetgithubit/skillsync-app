// server/routes/projectRoutes.js
// Express API routes for TeamMatch AI Projects

const express = require('express');
const path = require('path');
const fs = require('fs');
const { projectSkillRequirementsSchema } = require('../schemas/projectRequirements');
const { normalizeSkillName } = require('../services/skillNormalization');

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
      const { projectTitle, description, teamSize, requiredSkills, requiredRoles, skillWeights, createdBy } = req.body;

    // Validation
    if (!projectTitle || !projectTitle.trim()) {
      return res.status(400).json({ success: false, error: 'Project Title is required' });
    }
    if (!teamSize || Number(teamSize) < 2) {
      return res.status(400).json({ success: false, error: 'Team Size must be at least 2 members' });
    }
    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one required skill is required' });
    }
    const skillRequirements = projectSkillRequirementsSchema.safeParse(requiredSkills);
    if (!skillRequirements.success) {
      return res.status(400).json({
        success: false,
        error: 'Skill requirements must include valid names, priorities, weights, critical flags, and proficiency levels'
      });
    }
    const normalizedSkills = skillRequirements.data.map((skill) => ({
      ...skill,
      name: normalizeSkillName(skill.name)
    }));
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one required role is required' });
    }

    if (isDatabaseReady()) {
      const newProj = await projects.create({
        projectTitle: projectTitle.trim(),
        description: description ? description.trim() : '',
        teamSize: Number(teamSize),
        requiredSkills: normalizedSkills,
        requiredRoles,
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
      teamSize: Number(teamSize),
      requiredSkills: normalizedSkills,
      requiredRoles,
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

// server/routes/projectRoutes.js
// Express API routes for TeamMatch AI Projects

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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

// GET /api/projects - Retrieve all projects
router.get('/', async (req, res) => {
  try {
    if (Project && Project.db && Project.db.readyState === 1) {
      const projects = await Project.find().sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: projects.length, projects });
    }
    const local = readLocalProjects();
    return res.status(200).json({ success: true, count: local.length, projects: local });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/projects - Create a new project
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
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one required role is required' });
    }

    if (Project && Project.db && Project.db.readyState === 1) {
      const newProj = await Project.create({
        projectTitle: projectTitle.trim(),
        description: description ? description.trim() : '',
        teamSize: Number(teamSize),
        requiredSkills,
        requiredRoles,
        skillWeights: skillWeights || {},
        createdBy: createdBy || 'Admin Lead'
      });
      return res.status(201).json({ success: true, message: 'Project saved to MongoDB', project: newProj });
    }

    // Local JSON Database Fallback
    const local = readLocalProjects();
    const newProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      projectTitle: projectTitle.trim(),
      description: description ? description.trim() : '',
      teamSize: Number(teamSize),
      requiredSkills,
      requiredRoles,
      skillWeights: skillWeights || {},
      createdBy: createdBy || 'Admin Lead',
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    local.unshift(newProject);
    writeLocalProjects(local);

    return res.status(201).json({ success: true, message: 'Project saved to Local Store', project: newProject });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;


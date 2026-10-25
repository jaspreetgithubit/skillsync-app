// server/routes/projectRoutes.js
// Pure Node.js & Express API routes for TeamMatch AI Projects (No MongoDB)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

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

// 1. GET /api/projects - Retrieve all projects
router.get('/', (req, res) => {
  try {
    const local = readLocalProjects();
    return res.status(200).json({ success: true, count: local.length, projects: local });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. GET /api/projects/:id - Retrieve specific project by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const local = readLocalProjects();
    const project = local.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    return res.status(200).json({ success: true, project });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. POST /api/projects - Create a new project
router.post('/', (req, res) => {
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

    // Local JSON Database Persistence
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

    console.log(`[Node.js Backend] New Project registered: ${newProject.projectTitle} (${newProject.id})`);

    return res.status(201).json({ success: true, message: 'Project saved successfully', project: newProject });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. DELETE /api/projects/:id - Delete a project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const local = readLocalProjects();
    const initialLen = local.length;
    const filtered = local.filter(p => p.id !== id);

    if (filtered.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    writeLocalProjects(filtered);
    console.log(`[Node.js Backend] Project deleted: ${id}`);
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

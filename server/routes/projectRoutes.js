
const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

// Convert database column names to your existing API field names.
function formatProject(row) {
  return {
    id: row.id,
    projectTitle: row.project_title,
    description: row.description,
    teamSize: row.team_size,
    requiredSkills: row.required_skills,
    requiredRoles: row.required_roles,
    skillWeights: row.skill_weights,
    createdBy: row.created_by,
    status: row.status,
    createdAt: row.created_at
  };
}

// GET /api/projects - Retrieve all projects
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const projects = data.map(formatProject);

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (err) {
    console.error('Fetch projects error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch projects'
    });
  }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
  try {
    const {
      projectTitle,
      description,
      teamSize,
      requiredSkills,
      requiredRoles,
      skillWeights,
      createdBy
    } = req.body;

    if (
      typeof projectTitle !== 'string' ||
      !projectTitle.trim()
    ) {
      return res.status(400).json({
        success: false,
        error: 'Project Title is required'
      });
    }

    if (projectTitle.trim().length > 120) {
      return res.status(400).json({
        success: false,
        error: 'Project title cannot exceed 120 characters'
      });
    }

    if (
      teamSize === undefined ||
      teamSize === null ||
      teamSize === '' ||
      !Number.isInteger(Number(teamSize)) ||
      Number(teamSize) < 2 ||
      Number(teamSize) > 25
    ) {
      return res.status(400).json({
        success: false,
        error: 'Team Size must be between 2 and 25'
      });
    }

    if (
      description !== undefined &&
      description !== null &&
      typeof description !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        error: 'Description must be a string'
      });
    }

    if (typeof description === 'string' && description.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Description cannot exceed 1000 characters'
      });
    }

    if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one required skill is required'
      });
    }

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one required role is required'
      });
    }

    if (
      skillWeights !== undefined &&
      (
        skillWeights === null ||
        typeof skillWeights !== 'object' ||
        Array.isArray(skillWeights)
      )
    ) {
      return res.status(400).json({
        success: false,
        error: 'Skill weights must be an object'
      });
    }

    const newProject = {
      project_title: projectTitle.trim(),
      description: description ? description.trim() : '',
      team_size: Number(teamSize),
      required_skills: requiredSkills,
      required_roles: requiredRoles,
      skill_weights: skillWeights || {},
      created_by:
        typeof createdBy === 'string' && createdBy.trim()
          ? createdBy.trim()
          : 'Admin Lead',
      status: 'active'
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(newProject)
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: 'Project saved to Supabase',
      project: formatProject(data)
    });
  } catch (err) {
    console.error('Create project error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create project'
    });
  }
});

module.exports = router;

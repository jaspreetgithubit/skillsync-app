// server/routes/profileRoutes.js
// Pure Node.js & Express API routes for Profile Setup & Skills Curation (No MongoDB)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dataFilePath = path.resolve(__dirname, '../../data/profiles.json');

// Helper to read profiles from local JSON
const readProfiles = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Seed an initial demo profile
      const seedProfiles = [
        {
          id: 'prof-seed-alex',
          name: 'Alex Chen',
          email: 'alex.chen@university.edu',
          roles: ['Full Stack Developer'],
          role: 'Full Stack Developer',
          experience: 3,
          skills: [
            { name: 'React', level: 'Strong' },
            { name: 'Node.js', level: 'Strong' },
            { name: 'Python', level: 'Medium' },
            { name: 'TypeScript', level: 'Strong' }
          ],
          interests: ['AI / Machine Learning', 'Distributed Systems'],
          projects: [
            {
              id: 'proj-1',
              title: 'Bipartite Matching Engine',
              role: 'Lead Backend & Algorithm Designer',
              techStack: 'Python, FastAPI, Redis, Docker',
              description: 'Engineered a bipartite graph matching pipeline for team formation reducing latency by 45%.'
            },
            {
              id: 'proj-2',
              title: 'Collaborative Code Workspace',
              role: 'Full Stack Engineer',
              techStack: 'React, TypeScript, WebSockets, Node.js',
              description: 'Real-time collaborative editing canvas with operational transform conflict resolution.'
            }
          ],
          isLocked: true,
          updatedAt: new Date().toISOString()
        }
      ];
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(seedProfiles, null, 2), 'utf-8');
      return seedProfiles;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading profiles.json:', err.message);
    return [];
  }
};

// Helper to write profiles to local JSON
const writeProfiles = (data) => {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing profiles.json:', err.message);
    return false;
  }
};

// ============================================================================
// 1. GET /api/profile - Retrieve profile by email (or all profiles)
// ============================================================================
router.get('/', (req, res) => {
  try {
    const { email } = req.query;
    const profiles = readProfiles();

    if (email && typeof email === 'string') {
      const cleanEmail = email.trim().toLowerCase();
      const profile = profiles.find((p) => (p.email || '').toLowerCase() === cleanEmail);
      if (!profile) {
        return res.status(200).json({ success: true, profile: null });
      }
      return res.status(200).json({ success: true, profile });
    }

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles
    });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error fetching profile.' });
  }
});

// ============================================================================
// 2. GET /api/profile/:email - Retrieve specific profile by email path param
// ============================================================================
router.get('/:email', (req, res) => {
  try {
    const email = req.params.email;
    const profiles = readProfiles();
    const cleanEmail = (email || '').trim().toLowerCase();

    const profile = profiles.find((p) => (p.email || '').toLowerCase() === cleanEmail);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found.' });
    }

    return res.status(200).json({ success: true, profile });
  } catch (err) {
    console.error('Get profile by email error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error fetching profile.' });
  }
});

// ============================================================================
// 3. POST /api/profile - Save or Update Curated Skills & Profile
// ============================================================================
router.post('/', (req, res) => {
  try {
    const { name, email, roles, experience, skills, interests, projects } = req.body || {};

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'A valid email is required to save profile.'
      });
    }

    if (!Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select or add at least one technical skill.'
      });
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please select at least one sprint role.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name && typeof name === 'string' ? name.trim() : cleanEmail.split('@')[0];
    const cleanExp = Number(experience) >= 0 ? Number(experience) : 1;
    const cleanRoles = roles.map((r) => String(r).trim()).filter(Boolean);
    const cleanInterests = Array.isArray(interests) ? interests : [];
    const cleanProjects = Array.isArray(projects) ? projects : [];

    // Clean and validate skills
    const cleanSkills = skills.map((s) => {
      if (typeof s === 'string') return { name: s.trim(), level: 'Strong' };
      return {
        name: String(s.name || '').trim(),
        level: s.level || 'Strong'
      };
    }).filter((s) => s.name.length > 0);

    const serializedProjects = cleanProjects
      .filter((p) => p && p.title && p.title.trim())
      .map((p) => `${p.title}${p.role ? ` (${p.role})` : ''}: ${p.description || p.techStack || ''}`)
      .join(' | ');

    const profiles = readProfiles();
    const existingIndex = profiles.findIndex((p) => (p.email || '').toLowerCase() === cleanEmail);

    const profileRecord = {
      id: existingIndex >= 0 ? profiles[existingIndex].id : `prof-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      roles: cleanRoles,
      role: cleanRoles.join(', '),
      experience: cleanExp,
      skills: cleanSkills,
      interests: cleanInterests,
      projects: cleanProjects,
      previousProjects: serializedProjects || 'Engineered scalable full stack systems.',
      isLocked: true,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      profiles[existingIndex] = profileRecord;
    } else {
      profiles.unshift(profileRecord);
    }

    writeProfiles(profiles);

    console.log(`[Node.js Backend] Profile & Skills curated for: ${cleanName} (${cleanEmail}) [${cleanSkills.length} skills, ${cleanRoles.length} roles]`);

    return res.status(200).json({
      success: true,
      message: 'Profile and skills curated and locked successfully!',
      profile: profileRecord
    });
  } catch (err) {
    console.error('Save profile error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error saving profile and skills.'
    });
  }
});

module.exports = router;


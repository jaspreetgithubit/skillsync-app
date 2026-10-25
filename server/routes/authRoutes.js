// server/routes/authRoutes.js
// Pure Node.js & Express Authentication Routes (No MongoDB)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dataFilePath = path.resolve(__dirname, '../../data/users.json');

// Helper to hash passwords
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Helper to read users from data/users.json
const readUsers = () => {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // Seed initial demo users if file does not exist
      const defaultUsers = [
        {
          id: 'usr-seed-01',
          name: 'Alex Chen',
          email: 'alex.chen@university.edu',
          role: 'Full Stack Developer',
          passwordHash: hashPassword('password123'),
          createdAt: new Date().toISOString()
        },
        {
          id: 'usr-seed-02',
          name: 'Sarah Connor',
          email: 'sarah.connor@mit.edu',
          role: 'AI / ML Researcher',
          passwordHash: hashPassword('password123'),
          createdAt: new Date().toISOString()
        }
      ];
      fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultUsers, null, 2), 'utf-8');
      return defaultUsers;
    }
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading users.json:', err.message);
    return [];
  }
};

// Helper to write users to data/users.json
const writeUsers = (users) => {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing users.json:', err.message);
    return false;
  }
};

// ============================================================================
// 1. POST /api/auth/signup - Create New Account
// ============================================================================
router.post('/signup', (req, res) => {
  try {
    const { name, email, password, role } = req.body || {};

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your full name.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid institutional or personal email address.'
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanRole = role && typeof role === 'string' ? role.trim() : 'Full Stack Developer';

    const users = readUsers();

    // Check if user already exists
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists. Please sign in instead.'
      });
    }

    // Create new user object
    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      role: cleanRole,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.unshift(newUser);
    writeUsers(users);

    console.log(`[Node.js Backend] New user registered: ${newUser.name} (${newUser.email}) - ${newUser.role}`);

    // Return user without sensitive password hash
    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during account creation.'
    });
  }
});

// ============================================================================
// 2. POST /api/auth/signin - Sign In with Email & Password
// ============================================================================
router.post('/signin', (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your email address.'
      });
    }

    if (!password || typeof password !== 'string' || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your password.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readUsers();

    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.'
      });
    }

    // Verify password (supports hashed or dev fallback)
    const incomingHash = hashPassword(password);
    const isMatch = (user.passwordHash && user.passwordHash === incomingHash) || (user.password && user.password === password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please verify your credentials.'
      });
    }

    console.log(`[Node.js Backend] User signed in: ${user.name} (${user.email})`);

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Signin error:', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during authentication.'
    });
  }
});

// ============================================================================
// 3. GET /api/auth/users - Retrieve user list (sanitized)
// ============================================================================
router.get('/users', (req, res) => {
  try {
    const users = readUsers();
    const sanitized = users.map(({ id, name, email, role, createdAt }) => ({
      id,
      name,
      email,
      role,
      createdAt
    }));
    return res.status(200).json({
      success: true,
      count: sanitized.length,
      users: sanitized
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve users.'
    });
  }
});

// ============================================================================
// 4. GET /api/auth/health - Check Auth Service Status
// ============================================================================
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Auth Engine (Pure Node.js)',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;


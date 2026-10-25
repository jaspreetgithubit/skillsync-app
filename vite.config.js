import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import crypto from 'node:crypto';

// Unified Pure Node.js API Middleware for Vite Dev Server (Zero DB required)
function apiBackendPlugin() {
  return {
    name: 'api-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Only handle /api endpoints
        if (!url.startsWith('/api') || url.startsWith('/api/chat')) {
          return next();
        }

        const parseBody = (callback) => {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              callback(null, JSON.parse(body || '{}'));
            } catch (e) {
              callback(e, null);
            }
          });
        };

        const sendJson = (status, payload) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        const hashPassword = (password) => {
          return crypto.createHash('sha256').update(password).digest('hex');
        };

        // Paths to local JSON data stores
        const usersFile = path.resolve(process.cwd(), 'data', 'users.json');
        const profilesFile = path.resolve(process.cwd(), 'data', 'profiles.json');
        const projectsFile = path.resolve(process.cwd(), 'data', 'projects.json');
        const feedbacksFile = path.resolve(process.cwd(), 'data', 'feedbacks.json');

        const readData = (filePath) => {
          try {
            if (!fs.existsSync(filePath)) return [];
            return JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
          } catch {
            return [];
          }
        };

        const writeData = (filePath, items) => {
          try {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
            return true;
          } catch {
            return false;
          }
        };

        // 1. AUTH: POST /api/auth/signin
        if (url.startsWith('/api/auth/signin') && req.method === 'POST') {
          return parseBody((err, data) => {
            if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
            const { email, password } = data;
            if (!email || !password) return sendJson(400, { success: false, error: 'Email and password are required.' });

            const cleanEmail = email.trim().toLowerCase();
            const users = readData(usersFile);
            const user = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);
            if (!user) return sendJson(401, { success: false, error: 'Invalid email or password. Please verify your credentials.' });

            const incomingHash = hashPassword(password);
            const isMatch = (user.passwordHash && user.passwordHash === incomingHash) || (user.password && user.password === password);
            if (!isMatch) return sendJson(401, { success: false, error: 'Invalid email or password. Please verify your credentials.' });

            return sendJson(200, {
              success: true,
              message: 'Signed in successfully!',
              user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
            });
          });
        }

        // 2. AUTH: POST /api/auth/signup
        if (url.startsWith('/api/auth/signup') && req.method === 'POST') {
          return parseBody((err, data) => {
            if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
            const { name, email, password, role } = data;
            if (!name || !name.trim()) return sendJson(400, { success: false, error: 'Full name is required.' });
            if (!email || !email.includes('@')) return sendJson(400, { success: false, error: 'Valid email is required.' });
            if (!password || password.length < 6) return sendJson(400, { success: false, error: 'Password must be at least 6 characters.' });

            const cleanEmail = email.trim().toLowerCase();
            const users = readData(usersFile);
            if (users.some((u) => (u.email || '').toLowerCase() === cleanEmail)) {
              return sendJson(409, { success: false, error: 'An account with this email already exists. Please sign in instead.' });
            }

            const newUser = {
              id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              name: name.trim(),
              email: cleanEmail,
              role: role && role.trim() ? role.trim() : 'Full Stack Developer',
              passwordHash: hashPassword(password),
              createdAt: new Date().toISOString()
            };
            users.unshift(newUser);
            writeData(usersFile, users);

            return sendJson(201, {
              success: true,
              message: 'Account created successfully!',
              user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt }
            });
          });
        }

        // 3. PROFILE: /api/profile
        if (url.startsWith('/api/profile')) {
          if (req.method === 'GET') {
            const parsedUrl = new URL(url, 'http://localhost');
            const emailParam = parsedUrl.searchParams.get('email') || url.replace('/api/profile', '').replace('/', '').split('?')[0];
            const profiles = readData(profilesFile);
            if (emailParam && emailParam.includes('@')) {
              const clean = emailParam.trim().toLowerCase();
              const found = profiles.find((p) => (p.email || '').toLowerCase() === clean);
              return sendJson(200, { success: true, profile: found || null });
            }
            return sendJson(200, { success: true, count: profiles.length, profiles });
          }

          if (req.method === 'POST') {
            return parseBody((err, data) => {
              if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
              const { name, email, roles, experience, skills, interests, projects } = data;
              if (!email || !email.includes('@')) return sendJson(400, { success: false, error: 'Valid email is required.' });
              if (!Array.isArray(skills) || skills.length === 0) return sendJson(400, { success: false, error: 'Please select or add at least one technical skill.' });
              if (!Array.isArray(roles) || roles.length === 0) return sendJson(400, { success: false, error: 'Please select at least one sprint role.' });

              const cleanEmail = email.trim().toLowerCase();
              const cleanName = name && typeof name === 'string' ? name.trim() : cleanEmail.split('@')[0];
              const cleanExp = Number(experience) >= 0 ? Number(experience) : 1;
              const cleanRoles = roles.map((r) => String(r).trim()).filter(Boolean);
              const cleanInterests = Array.isArray(interests) ? interests : [];
              const cleanProjects = Array.isArray(projects) ? projects : [];
              const cleanSkills = skills.map((s) => {
                if (typeof s === 'string') return { name: s.trim(), level: 'Strong' };
                return { name: String(s.name || '').trim(), level: s.level || 'Strong' };
              }).filter((s) => s.name.length > 0);

              const serializedProjects = cleanProjects
                .filter((p) => p && p.title && p.title.trim())
                .map((p) => `${p.title}${p.role ? ` (${p.role})` : ''}: ${p.description || p.techStack || ''}`)
                .join(' | ');

              const profiles = readData(profilesFile);
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
              writeData(profilesFile, profiles);

              return sendJson(200, {
                success: true,
                message: 'Profile and skills curated and locked successfully!',
                profile: profileRecord
              });
            });
          }
        }

        // 4. PROJECTS: /api/projects
        if (url.startsWith('/api/projects')) {
          if (req.method === 'GET') {
            const projects = readData(projectsFile);
            const subPath = url.replace('/api/projects', '').replace('/', '').split('?')[0];
            if (subPath) {
              const item = projects.find(p => p.id === subPath);
              if (item) return sendJson(200, { success: true, project: item });
              return sendJson(404, { success: false, error: 'Project not found' });
            }
            return sendJson(200, { success: true, count: projects.length, projects });
          }

          if (req.method === 'DELETE') {
            const subPath = url.replace('/api/projects', '').replace('/', '').split('?')[0];
            if (!subPath) return sendJson(400, { success: false, error: 'Project ID required' });
            const projects = readData(projectsFile);
            const filtered = projects.filter(p => p.id !== subPath);
            writeData(projectsFile, filtered);
            return sendJson(200, { success: true, message: 'Project deleted successfully' });
          }

          if (req.method === 'POST') {
            return parseBody((err, data) => {
              if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
              if (!data.projectTitle || !data.projectTitle.trim()) return sendJson(400, { success: false, error: 'Project Title is required.' });
              if (!data.teamSize || Number(data.teamSize) < 2) return sendJson(400, { success: false, error: 'Team Size must be at least 2 members.' });
              if (!Array.isArray(data.requiredSkills) || data.requiredSkills.length === 0) return sendJson(400, { success: false, error: 'At least one required skill is required.' });
              if (!Array.isArray(data.requiredRoles) || data.requiredRoles.length === 0) return sendJson(400, { success: false, error: 'At least one required role is required.' });

              const projects = readData(projectsFile);
              const newProject = {
                id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                projectTitle: data.projectTitle.trim(),
                description: data.description ? data.description.trim() : '',
                teamSize: Number(data.teamSize),
                requiredSkills: data.requiredSkills,
                requiredRoles: data.requiredRoles,
                skillWeights: data.skillWeights || {},
                createdBy: data.createdBy || 'Admin Lead',
                createdAt: new Date().toISOString(),
                status: 'active'
              };
              projects.unshift(newProject);
              writeData(projectsFile, projects);

              return sendJson(201, { success: true, message: 'Project successfully created and configured.', project: newProject });
            });
          }
        }

        // 5. FEEDBACK: /api/feedback
        if (url.startsWith('/api/feedback')) {
          if (req.method === 'GET') {
            const list = readData(feedbacksFile);
            return sendJson(200, { success: true, count: list.length, feedbacks: list });
          }

          if (req.method === 'POST') {
            return parseBody((err, data) => {
              if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
              const { name, email, contactNo, role, problem } = data;
              if (!name || !name.trim()) return sendJson(400, { success: false, error: 'Full name is required.' });
              if (!email || !email.includes('@')) return sendJson(400, { success: false, error: 'Valid email is required.' });
              if (!problem || !problem.trim()) return sendJson(400, { success: false, error: 'Problem description is required.' });

              const ticketId = `SS-${Math.floor(100000 + Math.random() * 900000)}`;
              const newFeedback = {
                ticketId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                contactNo: contactNo ? contactNo.trim() : '',
                role: role ? role.trim() : 'Student',
                problem: problem.trim(),
                status: 'open',
                createdAt: new Date().toISOString()
              };
              const feedbacks = readData(feedbacksFile);
              feedbacks.unshift(newFeedback);
              writeData(feedbacksFile, feedbacks);

              return sendJson(201, { success: true, message: 'Feedback received successfully!', ticketId, feedback: newFeedback });
            });
          }
        }

        next();
      });
    }
  };
}

export default defineConfig({
  server: {
    proxy: {
      '/api/chat': 'http://localhost:5050'
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    apiBackendPlugin()
  ],
});

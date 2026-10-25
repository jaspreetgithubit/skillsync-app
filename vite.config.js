import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import crypto from 'node:crypto';

// Vite Dev Server API Plugin for /api/projects
function apiProjectsPlugin() {
  return {
    name: 'api-projects-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Match /api/projects endpoint
        if (url.startsWith('/api/projects')) {
          const dataFilePath = path.resolve(process.cwd(), 'data', 'projects.json');

          const readProjects = () => {
            try {
              if (!fs.existsSync(dataFilePath)) {
                fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
                fs.writeFileSync(dataFilePath, '[]', 'utf-8');
                return [];
              }
              const content = fs.readFileSync(dataFilePath, 'utf-8');
              return JSON.parse(content || '[]');
            } catch (e) {
              console.error('Error reading projects.json:', e);
              return [];
            }
          };

          const writeProjects = (projects) => {
            try {
              fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
              fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2), 'utf-8');
              return true;
            } catch (e) {
              console.error('Error writing projects.json:', e);
              return false;
            }
          };

          // GET /api/projects
          if (req.method === 'GET') {
            const projects = readProjects();
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, count: projects.length, projects }));
            return;
          }

          // POST /api/projects
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => {
              body += chunk;
            });

            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');

                if (!data.projectTitle || !data.projectTitle.trim()) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Project Title is required.' }));
                  return;
                }

                if (!data.teamSize || Number(data.teamSize) < 2) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Team Size must be at least 2 members.' }));
                  return;
                }

                if (!Array.isArray(data.requiredSkills) || data.requiredSkills.length === 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'At least one required skill is required.' }));
                  return;
                }

                if (!Array.isArray(data.requiredRoles) || data.requiredRoles.length === 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'At least one required role is required.' }));
                  return;
                }

                const projects = readProjects();
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
                writeProjects(projects);

                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, message: 'Project successfully created and configured.', project: newProject }));
              } catch (err) {
                console.error('Error handling project payload:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Internal Server Error parsing project payload.' }));
              }
            });
            return;
          }
        }

        next();
      });
    }
  };
}

// Vite Dev Server API Plugin for /api/auth and /api/feedback (Pure Node.js, Zero External DB)
function apiAuthAndFeedbackPlugin() {
  return {
    name: 'api-auth-and-feedback-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

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

        const usersFilePath = path.resolve(process.cwd(), 'data', 'users.json');
        const readUsers = () => {
          try {
            if (!fs.existsSync(usersFilePath)) return [];
            return JSON.parse(fs.readFileSync(usersFilePath, 'utf-8') || '[]');
          } catch {
            return [];
          }
        };

        const writeUsers = (users) => {
          try {
            fs.mkdirSync(path.dirname(usersFilePath), { recursive: true });
            fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
            return true;
          } catch {
            return false;
          }
        };

        // POST /api/auth/signin
        if (url.startsWith('/api/auth/signin') && req.method === 'POST') {
          parseBody((err, data) => {
            if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
            const { email, password } = data;
            if (!email || !password) {
              return sendJson(400, { success: false, error: 'Email and password are required.' });
            }
            const cleanEmail = email.trim().toLowerCase();
            const users = readUsers();
            const user = users.find((u) => (u.email || '').toLowerCase() === cleanEmail);
            if (!user) {
              return sendJson(401, { success: false, error: 'Invalid email or password. Please verify your credentials.' });
            }
            const incomingHash = hashPassword(password);
            const isMatch = (user.passwordHash && user.passwordHash === incomingHash) || (user.password && user.password === password);
            if (!isMatch) {
              return sendJson(401, { success: false, error: 'Invalid email or password. Please verify your credentials.' });
            }
            return sendJson(200, {
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
          });
          return;
        }

        // POST /api/auth/signup
        if (url.startsWith('/api/auth/signup') && req.method === 'POST') {
          parseBody((err, data) => {
            if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
            const { name, email, password, role } = data;
            if (!name || !name.trim()) return sendJson(400, { success: false, error: 'Full name is required.' });
            if (!email || !email.includes('@')) return sendJson(400, { success: false, error: 'Valid email is required.' });
            if (!password || password.length < 6) return sendJson(400, { success: false, error: 'Password must be at least 6 characters.' });

            const cleanEmail = email.trim().toLowerCase();
            const users = readUsers();
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
            writeUsers(users);

            return sendJson(201, {
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
          });
          return;
        }

        // GET /api/auth/health
        if (url.startsWith('/api/auth/health') && req.method === 'GET') {
          return sendJson(200, { status: 'ok', service: 'Vite Auth Middleware' });
        }

        // /api/feedback
        if (url.startsWith('/api/feedback')) {
          const feedbackFilePath = path.resolve(process.cwd(), 'data', 'feedbacks.json');
          const readFeedbacks = () => {
            try {
              if (!fs.existsSync(feedbackFilePath)) return [];
              return JSON.parse(fs.readFileSync(feedbackFilePath, 'utf-8') || '[]');
            } catch { return []; }
          };
          const writeFeedbacks = (items) => {
            try {
              fs.mkdirSync(path.dirname(feedbackFilePath), { recursive: true });
              fs.writeFileSync(feedbackFilePath, JSON.stringify(items, null, 2), 'utf-8');
              return true;
            } catch { return false; }
          };

          if (req.method === 'GET') {
            const list = readFeedbacks();
            return sendJson(200, { success: true, count: list.length, feedbacks: list });
          }

          if (req.method === 'POST') {
            parseBody((err, data) => {
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
              const feedbacks = readFeedbacks();
              feedbacks.unshift(newFeedback);
              writeFeedbacks(feedbacks);

              return sendJson(201, {
                success: true,
                message: 'Feedback received successfully!',
                ticketId,
                feedback: newFeedback
              });
            });
            return;
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // Secure Gemini chat backend (server/gemini-chat/chatServer.js). The API key stays on the server.
      '/api/chat': 'http://localhost:5050'
    }
  },
  plugins: [
    tailwindcss(),
    react(),
    apiProjectsPlugin(),
    apiAuthAndFeedbackPlugin()
  ],
});

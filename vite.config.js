import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import process from 'node:process';
import crypto from 'node:crypto';

// Helper to safely read .env variables for Gemini
function getGeminiEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    try {
      const raw = fs.readFileSync(envPath, 'utf-8');
      raw.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            env[trimmed.substring(0, idx).trim()] = trimmed.substring(idx + 1).trim();
          }
        }
      });
    } catch {
      // ignore
    }
  }
  return {
    apiKey: process.env.GEMINI_API_KEY || env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || env.GEMINI_MODEL || 'gemini-3.5-flash'
  };
}

// Native Gemini API call directly from Vite dev server (Zero extra port required)
async function executeGeminiChat(messages, apiKey, configuredModel) {
  const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));

  const SYSTEM_INSTRUCTION =
    'You are SyncSkills AI, a friendly, intelligent, and accurate assistant inside the SyncSkills.AI ' +
    'team-formation platform. Answer any question clearly: maths (show steps), coding ' +
    '(use fenced code blocks), science, general knowledge, and questions about forming ' +
    'balanced project teams. Use concise Markdown formatting.';

  const modelsToTry = Array.from(new Set([
    configuredModel || 'gemini-3.5-flash',
    'gemini-3.5-flash',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash'
  ]));

  let lastError = null;
  for (const currentModel of modelsToTry) {
    try {
      const response = await fetch(`${GEMINI_BASE_URL}/${encodeURIComponent(currentModel)}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
        }),
        signal: AbortSignal.timeout(30000)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 503 || response.status === 404) {
          lastError = new Error(data?.error?.message || `HTTP ${response.status}`);
          continue;
        }
        throw new Error(data?.error?.message || `Gemini API error (HTTP ${response.status})`);
      }

      const text = (data.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || '')
        .join('')
        .trim();

      if (text) return text;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to generate response from Gemini.');
}

// Unified Pure Node.js API Middleware for Vite Dev Server (Zero DB required)
function apiBackendPlugin() {
  return {
    name: 'api-backend-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || '';

        // Only handle /api endpoints
        if (!url.startsWith('/api')) {
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

        // 0. GEMINI CHAT HEALTH: GET /api/chat/health
        if (url.startsWith('/api/chat/health') && req.method === 'GET') {
          const { apiKey, model } = getGeminiEnv();
          return sendJson(200, {
            ok: true,
            keyConfigured: Boolean(apiKey),
            model: model || 'gemini-3.5-flash',
            service: 'SyncSkills Always-Connected Gemini Engine'
          });
        }

        // 0. GEMINI CHAT: POST /api/chat
        if ((url === '/api/chat' || url.startsWith('/api/chat?')) && req.method === 'POST') {
          return parseBody(async (err, data) => {
            if (err) return sendJson(400, { error: 'Invalid JSON request payload.' });
            const { messages } = data || {};
            if (!Array.isArray(messages) || messages.length === 0) {
              return sendJson(400, { error: '`messages` must be a non-empty array.' });
            }

            const { apiKey, model } = getGeminiEnv();
            if (!apiKey) {
              return sendJson(503, { error: 'GEMINI_API_KEY is missing in skillsync-app/.env.' });
            }

            const cleaned = [];
            for (const m of messages.slice(-40)) {
              if (!m || typeof m.text !== 'string' || !['user', 'assistant'].includes(m.role)) {
                return sendJson(400, { error: 'Each message needs a role ("user" | "assistant") and text.' });
              }
              const text = m.text.trim();
              if (!text) continue;
              cleaned.push({ role: m.role, text });
            }

            while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
            if (!cleaned.length || cleaned[cleaned.length - 1].role !== 'user') {
              return sendJson(400, { error: 'The last message must be from the user.' });
            }

            try {
              const reply = await executeGeminiChat(cleaned, apiKey, model);
              return sendJson(200, { reply });
            } catch (apiErr) {
              console.error('[Gemini API Error]:', apiErr.message);
              return sendJson(500, { error: apiErr.message || 'Gemini processing error.' });
            }
          });
        }

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
            const exists = users.some((u) => (u.email || '').toLowerCase() === cleanEmail);
            if (exists) return sendJson(409, { success: false, error: 'An account with this email already exists.' });

            const newUser = {
              id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
              name: name.trim(),
              email: cleanEmail,
              passwordHash: hashPassword(password),
              role: role || 'Full Stack Developer',
              createdAt: new Date().toISOString()
            };
            users.push(newUser);
            writeData(usersFile, users);

            return sendJson(201, {
              success: true,
              message: 'User account created successfully!',
              user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, createdAt: newUser.createdAt }
            });
          });
        }

        // 3. PROFILE: /api/profile
        if (url.startsWith('/api/profile')) {
          if (req.method === 'GET') {
            const urlObj = new URL(url, 'http://localhost');
            const userId = urlObj.searchParams.get('userId');
            const email = urlObj.searchParams.get('email');
            const profiles = readData(profilesFile);

            if (userId) {
              const p = profiles.find((item) => item.userId === userId);
              return sendJson(200, { success: true, profile: p || null });
            }
            if (email) {
              const cleanEmail = email.trim().toLowerCase();
              const p = profiles.find((item) => (item.email || '').toLowerCase() === cleanEmail);
              return sendJson(200, { success: true, profile: p || null });
            }
            return sendJson(200, { success: true, count: profiles.length, profiles });
          }

          if (req.method === 'POST') {
            return parseBody((err, data) => {
              if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
              const { userId, name, email, role, skills, experience, interests, bio, isLocked } = data;
              if (!userId && !email) return sendJson(400, { success: false, error: 'userId or email is required.' });

              const profiles = readData(profilesFile);
              const cleanEmail = email ? email.trim().toLowerCase() : '';
              let index = -1;
              if (userId) index = profiles.findIndex((p) => p.userId === userId);
              if (index === -1 && cleanEmail) index = profiles.findIndex((p) => (p.email || '').toLowerCase() === cleanEmail);

              const now = new Date().toISOString();
              const record = {
                id: index !== -1 ? profiles[index].id : 'prof-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
                userId: userId || (index !== -1 ? profiles[index].userId : 'anon-' + Date.now()),
                name: name ? name.trim() : (index !== -1 ? profiles[index].name : 'Student Engineer'),
                email: cleanEmail || (index !== -1 ? profiles[index].email : ''),
                role: role || (index !== -1 ? profiles[index].role : 'Full Stack Developer'),
                skills: Array.isArray(skills) ? skills : (index !== -1 ? profiles[index].skills : []),
                experience: experience !== undefined ? experience : (index !== -1 ? profiles[index].experience : 2),
                interests: Array.isArray(interests) ? interests : (index !== -1 ? profiles[index].interests : []),
                bio: bio !== undefined ? bio : (index !== -1 ? profiles[index].bio : ''),
                isLocked: isLocked !== undefined ? Boolean(isLocked) : (index !== -1 ? profiles[index].isLocked : false),
                updatedAt: now
              };

              if (index !== -1) {
                profiles[index] = { ...profiles[index], ...record };
              } else {
                record.createdAt = now;
                profiles.push(record);
              }
              writeData(profilesFile, profiles);

              return sendJson(200, { success: true, message: 'Profile saved successfully!', profile: record });
            });
          }
        }

        // 4. PROJECTS: /api/projects
        if (url.startsWith('/api/projects')) {
          if (req.method === 'GET') {
            const projects = readData(projectsFile);
            return sendJson(200, { success: true, count: projects.length, projects });
          }

          if (req.method === 'POST') {
            return parseBody((err, data) => {
              if (err) return sendJson(400, { success: false, error: 'Invalid JSON request payload.' });
              const { projectTitle, description, teamSize, requiredSkills, requiredRoles, skillWeights, createdBy } = data;
              if (!projectTitle || !projectTitle.trim()) {
                return sendJson(400, { success: false, error: 'Project Title is required.' });
              }

              const projects = readData(projectsFile);
              const newProject = {
                id: 'proj-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
                projectTitle: projectTitle.trim(),
                description: description ? description.trim() : '',
                teamSize: Number(teamSize) || 4,
                requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
                requiredRoles: Array.isArray(requiredRoles) ? requiredRoles : [],
                skillWeights: skillWeights || {},
                createdBy: createdBy || 'Admin Lead',
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
  plugins: [
    tailwindcss(),
    react(),
    apiBackendPlugin()
  ],
});

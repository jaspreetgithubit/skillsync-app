import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import process from 'node:process';

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

                // Validation
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    apiProjectsPlugin()
  ],
});

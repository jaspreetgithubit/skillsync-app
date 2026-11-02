// server/server.js
// Standalone Node.js & Express API Server with MongoDB-backed accounts and sessions.

const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const { createResumeRouter } = require('./routes/resumeRoutes');
const { createAuthRouter } = require('./routes/authRoutes');
const User = require('./models/User');
const AuthSession = require('./models/AuthSession');
const ResumeDraft = require('./models/ResumeDraft');

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.CLIENT_ORIGIN || process.env.FRONTEND_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY);
}

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || configuredOrigins.includes(origin));
  },
  credentials: true
}));
app.use(express.json({ limit: '256kb' }));

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api', createResumeRouter());
app.use('/api/auth', createAuthRouter());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TeamMatch AI Project Engine', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

if (require.main === module) {
  const mongoUri = process.env.MONGODB_URI
    || (process.env.NODE_ENV === 'production' ? null : 'mongodb://localhost:27017/teammatch_ai');
  if (!mongoUri) {
    console.error('MONGODB_URI must be configured before starting in production.');
    process.exitCode = 1;
  } else {
    mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 })
      .then(async () => {
        await Promise.all([User.init(), AuthSession.init(), ResumeDraft.init()]);
        console.log('Connected to MongoDB.');
        app.listen(PORT, () => {
          console.log(`TeamMatch AI API Server running on port ${PORT}`);
        });
      })
      .catch(async (error) => {
        console.error(`MongoDB startup failed: ${error.message}`);
        try {
          await mongoose.disconnect();
        } catch (disconnectError) {
          console.error(`MongoDB cleanup failed: ${disconnectError.message}`);
        }
        process.exitCode = 1;
      });
  }
}

module.exports = app;

// server/server.js
// Standalone Node.js & Express API Server with MongoDB connection & local fallback

const express = require('express');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/projects', projectRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'TeamMatch AI Project Engine', timestamp: new Date().toISOString() });
});

// Optional MongoDB initialization
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teammatch_ai';
try {
  const mongoose = require('mongoose');
  mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
    .then(() => console.log('✓ Connected to MongoDB (TeamMatch AI Database)'))
    .catch(() => console.log('ℹ Running with local JSON database persistence (data/projects.json)'));
} catch (e) {
  console.log('ℹ Mongoose not loaded. Running with local JSON persistence.');
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 TeamMatch AI API Server running on port ${PORT}`);
  });
}

module.exports = app;

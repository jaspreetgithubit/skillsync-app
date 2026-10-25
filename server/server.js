// server/server.js
// Standalone Node.js & Express API Server (Pure Node.js, No MongoDB)

const express = require('express');
const cors = require('cors');
const path = require('path');
const projectRoutes = require('./routes/projectRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/projects', projectRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TeamMatch AI Backend Engine',
    timestamp: new Date().toISOString()
  });
});

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

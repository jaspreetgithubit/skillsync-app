// server/routes/feedbackRoutes.js
// Express API routes for Landing Page Feedback & Inquiries

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

let Feedback;
try {
  Feedback = require('../models/Feedback');
} catch (e) {
  Feedback = null;
}

const dataFilePath = path.resolve(__dirname, '../../data/feedbacks.json');

// Helper to read local JSON feedbacks
const readLocalFeedbacks = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Error reading local feedbacks.json:', e.message);
    return [];
  }
};

// Helper to write local JSON feedbacks
const writeLocalFeedbacks = (data) => {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing local feedbacks.json:', e.message);
    return false;
  }
};

// Helper to generate a unique ticket ID: SS-XXXXXX
const generateTicketId = () => {
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `SS-${randomSixDigits}`;
};

// ============================================================================
// 1. POST /api/feedback - Submit new feedback from Landing Page
// ============================================================================
router.post('/', async (req, res) => {
  try {
    const { name, email, contactNo, role, problem } = req.body;

    // Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Full name is required.'
      });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'A valid email address is required.'
      });
    }

    if (!problem || typeof problem !== 'string' || !problem.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please describe your problem or feedback.'
      });
    }

    const ticketId = generateTicketId();
    const cleanRole = role && typeof role === 'string' ? role.trim() : 'Student';
    const cleanContact = contactNo && typeof contactNo === 'string' ? contactNo.trim() : '';

    const newFeedbackData = {
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      contactNo: cleanContact,
      role: cleanRole,
      problem: problem.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };

    // If MongoDB is connected and model available, save to Mongo
    if (Feedback && Feedback.db && Feedback.db.readyState === 1) {
      const savedDoc = await Feedback.create(newFeedbackData);
      return res.status(201).json({
        success: true,
        message: 'Feedback received successfully!',
        ticketId: savedDoc.ticketId,
        feedback: savedDoc,
        storage: 'mongodb'
      });
    }

    // Otherwise, persist to local data/feedbacks.json
    const feedbacks = readLocalFeedbacks();
    feedbacks.unshift(newFeedbackData);
    writeLocalFeedbacks(feedbacks);

    console.log(`[Feedback Received] Ticket: ${ticketId} | From: ${newFeedbackData.name} (${newFeedbackData.email})`);

    return res.status(201).json({
      success: true,
      message: 'Feedback received successfully!',
      ticketId: newFeedbackData.ticketId,
      feedback: newFeedbackData,
      storage: 'local_json'
    });
  } catch (err) {
    console.error('Submit feedback error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while saving feedback.'
    });
  }
});

// ============================================================================
// 2. GET /api/feedback - Retrieve all feedbacks (Admin / Review)
// ============================================================================
router.get('/', async (req, res) => {
  try {
    const { status, role } = req.query;

    if (Feedback && Feedback.db && Feedback.db.readyState === 1) {
      const query = {};
      if (status) query.status = status;
      if (role) query.role = role;

      const docs = await Feedback.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: docs.length,
        feedbacks: docs
      });
    }

    let local = readLocalFeedbacks();
    if (status) {
      local = local.filter(f => f.status === status);
    }
    if (role) {
      local = local.filter(f => f.role === role);
    }

    return res.status(200).json({
      success: true,
      count: local.length,
      feedbacks: local
    });
  } catch (err) {
    console.error('Fetch feedbacks error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to fetch feedbacks.'
    });
  }
});

// ============================================================================
// 3. GET /api/feedback/:ticketId - Lookup status by Ticket ID
// ============================================================================
router.get('/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    if (Feedback && Feedback.db && Feedback.db.readyState === 1) {
      const doc = await Feedback.findOne({ ticketId: ticketId.toUpperCase().trim() });
      if (!doc) {
        return res.status(404).json({ success: false, error: 'Feedback ticket not found.' });
      }
      return res.status(200).json({ success: true, feedback: doc });
    }

    const local = readLocalFeedbacks();
    const found = local.find(f => f.ticketId.toUpperCase() === ticketId.toUpperCase().trim());
    if (!found) {
      return res.status(404).json({ success: false, error: 'Feedback ticket not found.' });
    }

    return res.status(200).json({ success: true, feedback: found });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// 4. PATCH /api/feedback/:ticketId/status - Update feedback status
// ============================================================================
router.patch('/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['open', 'in_review', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be one of: open, in_review, resolved'
      });
    }

    if (Feedback && Feedback.db && Feedback.db.readyState === 1) {
      const updated = await Feedback.findOneAndUpdate(
        { ticketId: ticketId.toUpperCase().trim() },
        { status },
        { new: true }
      );
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Feedback ticket not found.' });
      }
      return res.status(200).json({ success: true, feedback: updated });
    }

    const local = readLocalFeedbacks();
    const idx = local.findIndex(f => f.ticketId.toUpperCase() === ticketId.toUpperCase().trim());
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Feedback ticket not found.' });
    }

    local[idx].status = status;
    local[idx].updatedAt = new Date().toISOString();
    writeLocalFeedbacks(local);

    return res.status(200).json({ success: true, feedback: local[idx] });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

// server/routes/feedbackRoutes.js
// Pure Node.js & Express API routes for Landing Page Feedback (No MongoDB)

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const dataFilePath = path.resolve(__dirname, '../../data/feedbacks.json');

// Helper to read local JSON feedbacks
const readFeedbacks = () => {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const raw = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Error reading feedbacks.json:', e.message);
    return [];
  }
};

// Helper to write local JSON feedbacks
const writeFeedbacks = (data) => {
  try {
    fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing feedbacks.json:', e.message);
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
router.post('/', (req, res) => {
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

    const newFeedback = {
      ticketId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      contactNo: cleanContact,
      role: cleanRole,
      problem: problem.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };

    // Save directly to data/feedbacks.json
    const feedbacks = readFeedbacks();
    feedbacks.unshift(newFeedback);
    writeFeedbacks(feedbacks);

    console.log(`[Node.js Backend] Feedback received: ${ticketId} from ${newFeedback.name} (${newFeedback.email})`);

    return res.status(201).json({
      success: true,
      message: 'Feedback received successfully!',
      ticketId: newFeedback.ticketId,
      feedback: newFeedback
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
router.get('/', (req, res) => {
  try {
    const { status, role } = req.query;
    let feedbacks = readFeedbacks();

    if (status) {
      feedbacks = feedbacks.filter(f => f.status === status);
    }
    if (role) {
      feedbacks = feedbacks.filter(f => f.role === role);
    }

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks
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
router.get('/:ticketId', (req, res) => {
  try {
    const { ticketId } = req.params;
    const feedbacks = readFeedbacks();
    const found = feedbacks.find(f => f.ticketId.toUpperCase() === ticketId.toUpperCase().trim());

    if (!found) {
      return res.status(404).json({
        success: false,
        error: 'Feedback ticket not found.'
      });
    }

    return res.status(200).json({
      success: true,
      feedback: found
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ============================================================================
// 4. PATCH /api/feedback/:ticketId/status - Update feedback status
// ============================================================================
router.patch('/:ticketId/status', (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!['open', 'in_review', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be one of: open, in_review, resolved'
      });
    }

    const feedbacks = readFeedbacks();
    const idx = feedbacks.findIndex(f => f.ticketId.toUpperCase() === ticketId.toUpperCase().trim());

    if (idx === -1) {
      return res.status(404).json({
        success: false,
        error: 'Feedback ticket not found.'
      });
    }

    feedbacks[idx].status = status;
    feedbacks[idx].updatedAt = new Date().toISOString();
    writeFeedbacks(feedbacks);

    return res.status(200).json({
      success: true,
      feedback: feedbacks[idx]
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;

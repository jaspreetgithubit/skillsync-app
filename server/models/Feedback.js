// server/models/Feedback.js
// Optional Mongoose Model for Feedback & Support Inquiries

let mongoose;
try {
  mongoose = require('mongoose');
} catch (e) {
  mongoose = null;
}

let FeedbackModel = null;

if (mongoose && mongoose.models) {
  const feedbackSchema = new mongoose.Schema(
    {
      ticketId: {
        type: String,
        required: true,
        unique: true,
        index: true
      },
      name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
      },
      contactNo: {
        type: String,
        trim: true,
        default: ''
      },
      role: {
        type: String,
        enum: ['Student', 'Team Lead', 'Faculty', 'Corporate Recruiter', 'Other'],
        default: 'Student'
      },
      problem: {
        type: String,
        required: [true, 'Feedback or problem description is required'],
        trim: true,
        maxlength: 2000
      },
      status: {
        type: String,
        enum: ['open', 'in_review', 'resolved'],
        default: 'open'
      }
    },
    {
      timestamps: true
    }
  );

  FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
}

module.exports = FeedbackModel;

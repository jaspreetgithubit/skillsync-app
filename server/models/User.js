const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, default: null, maxlength: 160 },
  experience: { type: String, default: null, maxlength: 120 },
  goalTrack: {
    type: String,
    enum: ['company', 'college', 'capstone', 'hackathon'],
    default: 'capstone',
    required: true
  },
  profile: { type: mongoose.Schema.Types.Mixed, required: true },
  sourceDraftId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResumeDraft',
    sparse: true,
    unique: true
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

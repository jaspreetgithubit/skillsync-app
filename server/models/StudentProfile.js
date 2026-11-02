const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
  sourceDraftId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  profile: { type: mongoose.Schema.Types.Mixed, required: true },
  ownerStatus: { type: String, enum: ['unclaimed'], default: 'unclaimed', required: true },
  extraction: {
    schemaVersion: { type: String, default: '1.0' },
    provider: { type: String, default: null },
    model: { type: String, default: null },
    confirmedAt: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema);

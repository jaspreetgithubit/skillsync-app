const mongoose = require('mongoose');

const ResumeDraftSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true, select: false },
  profile: { type: mongoose.Schema.Types.Mixed, default: null },
  status: { type: String, enum: ['pending', 'consuming', 'consumed'], default: 'pending', required: true },
  source: { type: String, enum: ['resume', 'manual'], required: true },
  metadata: {
    filename: { type: String, default: null },
    fileType: { type: String, default: null },
    schemaVersion: { type: String, default: '1.0' },
    provider: { type: String, default: null },
    model: { type: String, default: null }
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
}, { versionKey: false });

ResumeDraftSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.ResumeDraft || mongoose.model('ResumeDraft', ResumeDraftSchema);

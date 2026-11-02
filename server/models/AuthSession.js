const mongoose = require('mongoose');

const AuthSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true, select: false },
  expiresAt: { type: Date, required: true },
  userAgent: { type: String, default: null, maxlength: 300 },
  createdAt: { type: Date, default: Date.now, required: true }
}, { versionKey: false });

AuthSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.AuthSession || mongoose.model('AuthSession', AuthSessionSchema);

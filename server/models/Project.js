// server/models/Project.js
// MongoDB Mongoose Schema for TeamMatch AI Projects

const mongoose = require('mongoose');

const SkillWeightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, default: 20, min: 1, max: 100 },
  priority: { type: String, enum: ['required', 'preferred'], default: 'required' },
  critical: { type: Boolean, default: false }
}, { _id: false });

const RoleQuantitySchema = new mongoose.Schema({
  role: { type: String, required: true },
  count: { type: Number, default: 1, min: 1 },
  requiredSkills: [{ type: String, trim: true, maxlength: 80 }]
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [120, 'Project title cannot exceed 120 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  teamSize: {
    type: Number,
    default: 3,
    min: [1, 'Team size must be at least 1 member'],
    max: [25, 'Team size cannot exceed 25 members']
  },
  requiredSkills: [SkillWeightSchema],
  requiredRoles: { type: [RoleQuantitySchema], default: [] },
  skillWeights: {
    type: Map,
    of: Number,
    default: {}
  },
  createdBy: {
    type: String,
    default: 'Admin Lead'
  },
  status: {
    type: String,
    enum: ['active', 'matching', 'assembled', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

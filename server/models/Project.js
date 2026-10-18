// server/models/Project.js
// MongoDB Mongoose Schema for TeamMatch AI Projects

const mongoose = require('mongoose');

const SkillWeightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, default: 20 },
  level: { type: String, default: 'Intermediate' }
}, { _id: false });

const RoleQuantitySchema = new mongoose.Schema({
  role: { type: String, required: true },
  count: { type: Number, default: 1, min: 1 }
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
    required: [true, 'Team size is required'],
    min: [2, 'Team size must be at least 2 members'],
    max: [25, 'Team size cannot exceed 25 members']
  },
  requiredSkills: [SkillWeightSchema],
  requiredRoles: [RoleQuantitySchema],
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

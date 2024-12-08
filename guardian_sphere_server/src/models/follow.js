const mongoose = require('mongoose');

const CheckSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TreatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    default: null,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true,
  },
  checks: [CheckSchema],
});

const FollowUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  treatments: [TreatmentSchema],
});

module.exports = mongoose.model('FollowUp', FollowUpSchema);

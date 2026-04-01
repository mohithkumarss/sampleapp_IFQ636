const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  period: {
    type: String, // e.g., "Week 14", "April 2026"
    required: true
  },
  totalEmission: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
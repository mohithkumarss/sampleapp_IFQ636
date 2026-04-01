const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String, // e.g., 'Transport', 'Electricity', 'Food', 'Other'
    required: true
  },
  distance: { 
    type: Number, // The value input by the user (miles, kWh, etc.)
    required: true
  },
  emission: { 
    type: Number, // The calculated carbon footprint for this specific activity
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
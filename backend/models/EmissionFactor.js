const mongoose = require('mongoose');

const emissionFactorSchema = new mongoose.Schema({
  type: {
    type: String, 
    required: true,
    unique: true // We only want one multiplier per category
  },
  factorValue: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('EmissionFactor', emissionFactorSchema);
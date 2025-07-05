const mongoose = require('mongoose');

const CompareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true 
  },
  property1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  property2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Compare', CompareSchema);

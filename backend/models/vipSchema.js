const mongoose = require('mongoose');

const vipSchema = new mongoose.Schema({
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  remainingPosts: {
    gold: { type: Number, default: 0 },
    silver: { type: Number, default: 0 },
    regular: { type: Number, default: 0 },
    push: { type: Number, default: 0 }
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expireDate: {
    type: Date
  }
}, { _id: false }); 

module.exports = vipSchema;

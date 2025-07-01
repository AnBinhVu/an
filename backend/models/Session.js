const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: { type: String, required: true },
  ip: String,
  userAgent: String,
  role: { type: String, enum: ['admin','owner', 'user'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    required: true, 
    index: { expires: 0 } 
  }
});

module.exports = mongoose.model('Session', sessionSchema);

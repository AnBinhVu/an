const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  contactMethod: {
    type: String,
    enum: ['email', 'phone', 'chat'],
    required: true
  }
}, 
{
  timestamps: true 
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);

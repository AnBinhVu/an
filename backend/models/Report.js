const reportSchema = new mongoose.Schema({
  reporter: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  reason: { 
    type: String,
    enum: ['fake_info', 'scam', 'duplicate', 'other'],
    default: 'fake_info'
  },
  message: { 
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

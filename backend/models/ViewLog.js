const viewLogSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  viewedAt: { 
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ViewLog', viewLogSchema);

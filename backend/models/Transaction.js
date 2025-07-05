const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  buyer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: { 
    type: Number,
    required: true
  },
  status: { 
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  paidAt: { 
    type: Date
  }
}, { timestamps: true }); 

module.exports = mongoose.model('Transaction', transactionSchema);

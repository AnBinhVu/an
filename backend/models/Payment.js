const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plan', 
    required: true 
  },
  amount: { // Số tiền
    type: Number,
    required: true,
    min: 0
  },
  method: { // Phương thức thanh toán
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'bank_transfer', 'e_wallet', 'other']
  },
  status: { // Trạng thái
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'], // đang chờ, đã hoàn thành, thất bại, đã hủy
    default: 'pending'
  },
  transactionId: { // Mã giao dịch (nếu có từ cổng thanh toán)
    type: String,
    unique: true,
    sparse: true
  },
  note: { // Ghi chú
    type: String,
    default: ''
  },
  paidAt: { // Thời gian thanh toán thành công
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

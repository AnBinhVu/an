const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'message'], //thông tin, thành công, cảnh báo, lỗi
    default: 'info',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  property:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true 
}
);

module.exports = mongoose.model('Notification', notificationSchema);

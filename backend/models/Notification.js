const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'], //thông tin, thành công, cảnh báo, lỗi
    default: 'info',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // nếu có liên kết với bảng người dùng
  },
  isRead: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true // Tự tạo createdAt và updatedAt
}
);

module.exports = mongoose.model('Notification', notificationSchema);

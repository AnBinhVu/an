const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['approved_property', 'removed_property', 'blocked_user', 'unblocked_user', 'updated_property', 'other']
     // phê duyệt bất động sản, xóa bất động sản, chặn người dùng, bỏ chặn người dùng, cập nhật bất động sản, khác
  },
  description: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);

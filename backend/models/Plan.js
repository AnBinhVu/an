const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }, // giá tiền theo tháng
  salePrice: { type: Number, default: 0 }, // % giảm giá
  duration: { type: Number, required: true }, // thời gian sử dụng gói (tháng)
  maxProperties: { type: Number, required: true }, // số lượng tin đăng tối đa
  vipGold: { type: Number, default: 0 }, // số lượng tin đăng VIP Gold 7 ngày
  vipSilver: { type: Number, default: 0 }, // số lượng tin đăng VIP Silver 7 ngày
  regularPosts: { type: Number, default: 0 }, // số lượng tin đăng thường 10 ngày
  pushPosts: { type: Number, default: 0 }, // số lượt đẩy tin thường
  utilities: {
    schedulePost: { type: Boolean, default: false }, // cho phép đặt lịch hẹn giờ đăng tin
    performanceReport: { type: Boolean, default: false } // cho phép xem báo cáo hiệu suất
  }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);

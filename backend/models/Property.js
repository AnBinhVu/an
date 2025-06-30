const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { //tiêu đề 
    type: String,
    required: true,
    trim: true
  },
  description: { //Mô tả
    type: String,
    required: true
  },
  price: { //Giá
    type: Number,
    required: true
  },
  pricePerSqFt: { //Giá mỗi mét vuông
    type: Number
  },
  location: { //Vị trí
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  category: { //Danh mục
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {//Người dùng đăng tin
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {//Trạng thái
    type: String,
    enum: ['active', 'sold', 'pending'],// đang bán, đã bán, đang chờ
    default: 'active'
  },
  approvalStatus: {//Trạng thái duyệt tin
    type: String,
    enum: ['pending', 'approved', 'rejected'],// đang chờ duyệt, đã duyệt, đã từ chối
    default: 'pending'
  },
  images: {
    type: [String], // Mảng URL ảnh
    default: []
  },
  videos: {
    type: [String], // Danh sách URL video (link YouTube hoặc video upload)
    default: []
  },
  type: { //Loại bất động sản
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  propertyDetails: { //Chi tiết bất động sản
    bedrooms: Number, //Số phòng ngủ
    bathrooms: Number,//Số phòng tắm
    areaSqFt: Number,//Diện tích (m2)
    amenities: [String] // ví dụ: ["Gym", "Parking", "Pool"]
  },
  views: { //Số lượt xem
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);

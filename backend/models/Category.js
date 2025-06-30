const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Không trùng tên danh mục
    trim: true
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // Tự động thêm createdAt & updatedAt

module.exports = mongoose.model('Category', categorySchema);


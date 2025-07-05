const mongoose = require('mongoose');
const vipSchema = require('./vipSchema');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ']
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự'],
    match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số']
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^(?:\+84|0)(3[2-9]|5[689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/, 'Số điện thoại không hợp lệ']
  },
  profileImage: {
    type: String,
    default: ''
  },
  citizenIdImages: {
    front: {
      type: String,
      default: '',
      match: [/\.(jpg|jpeg|png)$/i, 'Ảnh mặt trước CCCD phải có định dạng JPG, JPEG hoặc PNG']
    },
    back: {
      type: String,
      default: '',
      match: [/\.(jpg|jpeg|png)$/i, 'Ảnh mặt sau CCCD phải có định dạng JPG, JPEG hoặc PNG']
    }
  },
  address: {
    type: String,
    trim: true
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'browsing', 'approved'],
    default: 'active'
  },
  vip: [vipSchema]
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

module.exports = mongoose.model('User', userSchema);

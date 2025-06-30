const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
      },
      fullName: {
        type: String,
        required: true,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      },
      profileImage: {
        type: String,
        default: ''
      },
      favorites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Property'
        }
      ],
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
      },
      isBlocked: { //trạng thái người dùng bị chặn hay không
        type: Boolean,
        default: false
      }   
      ,vip: { //trạng thái người dùng VIP hay không
        type: String,
        enum: ['normal', 'copper', 'silver', 'gold', 'platinum'],
        default: 'normal'
      },   
    },
    {
      timestamps: true // Tự tạo createdAt và updatedAt
    }
  );
  
  module.exports = mongoose.model('User', userSchema);

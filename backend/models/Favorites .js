const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // mỗi người dùng chỉ có 1 danh sách yêu thích
  },
  properties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Favorites', favoriteSchema);

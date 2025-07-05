const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // mỗi người dùng có một lịch sử tìm kiếm
  },
  searchHistory: [
    {
      keyword: {
        type: String,
        required: true
      },
      location: {
        city: String,
        district: String
      },
      priceRange: {
        min: Number,
        max: Number
      },
      category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      },
      type: {
        type: String,
        enum: ['sale', 'rent']
      },
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);

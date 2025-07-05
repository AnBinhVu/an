const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  isLiked: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  reviewLabel: {
    type: String,
    enum: ['hữu ích', 'hay', 'tệ'],
    default: ''
  }
}, {
  timestamps: true
});

// Mỗi user chỉ được đánh giá 1 lần trên 1 bài
propertyRatingSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);

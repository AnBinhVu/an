const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { // Tiêu đề bài viết
    type: String,
    required: true
  },
  slug: { // Slug URL
    type: String,
    required: true,
    unique: true
  },
  content: { // Nội dung
    type: String,
    required: true
  },
  author: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: { 
    type: String
  },
  status: { 
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: { 
    type: Date
  },
  images: { 
    type: [String], 
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

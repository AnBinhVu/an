const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200 
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0 
  },
  pricePerSqFt: {
    type: Number,
    min: 0 
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'pending'],
    default: 'active'
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  videos: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  }],
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: true
  },
  propertyDetails: {
    bedrooms: {
      type: Number,
      min: 0 
    },
    bathrooms: {
      type: Number,
      min: 0
    },
    areaSqFt: {
      type: Number,
      min: 0, 
      required: true
    },
    amenities: {
      type: [String],
      default: [] 
    }
  },
  views: {
    type: Number,
    default: 0
  },
 expireAt: {
  type: Date,
  required: true,
  default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
},
vip:{
  type: String,
  enum: ['normal', 'copper', 'silver', 'gold'],
  default: 'normal'
},
}, {
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true }
});

// Thêm index cho các trường thường xuyên tìm kiếm
propertySchema.index({ user: 1 }); // Index cho user để tìm nhanh tin đăng của người dùng
propertySchema.index({ location: 1 }); // Index cho location
propertySchema.index({ approvalStatus: 1 }); // Index cho trạng thái duyệt

propertySchema.virtual('calculatedPricePerSqFt').get(function() {
  if (this.price && this.propertyDetails?.areaSqFt) {
    return this.price / this.propertyDetails.areaSqFt;
  }
  return null;
});

module.exports = mongoose.model('Property', propertySchema);
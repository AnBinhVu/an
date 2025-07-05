const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  commune: { 
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  note: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Tạo chỉ mục duy nhất cho combination của city, district, và commune 
locationSchema.index({ city: 1, district: 1, commune: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);

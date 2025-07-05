const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'properties/videos' : 'properties/images',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4'],
      transformation: !isVideo
        ? [{ width: 1200, crop: 'limit' }]
        : undefined
    };
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Định dạng file không được hỗ trợ'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,   // dùng biến fileFilter đã khai báo
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

module.exports = upload;
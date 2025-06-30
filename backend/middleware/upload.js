const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục nếu chưa tồn tại
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};
ensureDir('backend/uploads/images');
ensureDir('backend/uploads/videos');

// Cấu hình lưu file, giữ nguyên tên gốc và ghi đè nếu trùng
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image');
    const uploadPath = isImage
      ? 'backend/uploads/images'
      : 'backend/uploads/videos';

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // ✅ Giữ nguyên tên file (originalname)
    const uploadPath = file.mimetype.startsWith('image')
      ? 'backend/uploads/images'
      : 'backend/uploads/videos';

    const targetPath = path.join(uploadPath, file.originalname);

    // Nếu file đã tồn tại, xóa nó để ghi đè
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    cb(null, file.originalname);
  }
});

// Middleware multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload ảnh hoặc video.'));
    }
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 2 }
]);

module.exports = upload;

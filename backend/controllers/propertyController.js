const Property = require('../models/Property');
const path = require('path');
const fs = require('fs');
const Notification = require('../models/Notification');

// Ghi đè hoặc thêm file nếu chưa tồn tại
const saveFilesAndGetPaths = (files, folder) => {
  const savedPaths = [];

  files.forEach(file => {
    const filePath = path.join(folder, file.originalname);
    fs.writeFileSync(filePath, file.buffer); // luôn ghi đè
    savedPaths.push(`/uploads/${path.basename(folder)}/${file.originalname}`);
  });

  return savedPaths;
};

// Xóa ảnh và video từ hệ thống
const deleteFiles = (files, folder) => {
  if (!Array.isArray(files)) {
    files = [files]; // Nếu chỉ là một tệp, chuyển thành mảng
  }

  files.forEach((file) => {
    // Tách tên tệp từ URL trong database
    const fileName = path.basename(file); // Lấy tên tệp từ URL

    const filePath = path.join(folder, fileName); // Kết hợp với đường dẫn thư mục

    console.log(`Đang xóa tệp: ${filePath}`); // Kiểm tra đường dẫn trước khi xóa
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Xóa tệp khỏi hệ thống
      console.log(`Đã xóa tệp: ${filePath}`); // Log thông báo đã xóa
    } else {
      console.log(`Tệp không tồn tại: ${filePath}`); // Nếu tệp không tồn tại, log lại
    }
  });
};

// Tạo thông báo cho người dùng
const createNotification = async (message, user, type = 'info') => {
  try {
    const notification = new Notification({
      message,
      user,
      type
    });
    await notification.save();
  } catch (err) {
    console.error('Lỗi khi tạo thông báo:', err);
  }
};

// Lấy tất cả tin đăng
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find()
    .populate('location category user')
    .collation({ locale: 'vi', strength: 1 })
    .sort({ title: 1 });
  
    res.json(properties);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin đăng' });
  }
};

// Tạo mới tin đăng
exports.createProperty = async (req, res) => {
  try {
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    if (images.length > 10) return res.status(400).json({ error: 'Tối đa 10 ảnh' });
    if (videos.length > 2) return res.status(400).json({ error: 'Tối đa 2 video' });

    const savedImages = saveFilesAndGetPaths(images, path.join(__dirname, '../uploads/images'));
    const savedVideos = saveFilesAndGetPaths(videos, path.join(__dirname, '../uploads/videos'));

    // Loại bỏ trùng lặp trong savedImages/savedVideos (đề phòng client gửi file trùng tên nhiều lần)
    const uniqueImages = [...new Set(savedImages)];
    const uniqueVideos = [...new Set(savedVideos)];

    const data = {
      ...req.body,
      images: uniqueImages,
      videos: uniqueVideos,
    };

    if (typeof data.propertyDetails === 'string') {
      data.propertyDetails = JSON.parse(data.propertyDetails);
    }

    if (data.price && data.propertyDetails?.areaSqFt) {
      data.pricePerSqFt = data.price / data.propertyDetails.areaSqFt;
    }

    const property = new Property(data);
    await property.save();

    // Tạo thông báo cho người dùng sau khi tin đăng được tạo
    const message = `Tin đăng "${data.title}" của bạn đang chờ duyệt.`;
    await createNotification(message, property.user, 'info'); // Gửi thông báo

    res.status(201).json({ message: 'Tạo tin đăng thành công', property });
  } catch (err) {
    console.error('Lỗi khi tạo tin đăng:', err);
    res.status(500).json({ error: 'Lỗi khi tạo tin đăng' });
  }
};

// Cập nhật tin đăng
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];
    const deletedImages = req.body.deletedImages || [];
    const deletedVideos = req.body.deletedVideos || [];

    const updateData = { ...req.body };

    if (typeof updateData.propertyDetails === 'string') {
      updateData.propertyDetails = JSON.parse(updateData.propertyDetails);
    }

    const existing = await Property.findById(id);
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy tin đăng' });

    // Xóa các file ảnh và video đã bị xóa từ thư mục
    deleteFiles(deletedImages, path.join(__dirname, '../uploads/images'));
    deleteFiles(deletedVideos, path.join(__dirname, '../uploads/videos'));

    // Cập nhật các file ảnh và video mới
    const savedImages = saveFilesAndGetPaths(images, path.join(__dirname, '../uploads/images'));
    const savedVideos = saveFilesAndGetPaths(videos, path.join(__dirname, '../uploads/videos'));

    // Cập nhật danh sách ảnh/video trong tin đăng
    updateData.images = [...existing.images, ...savedImages];
    updateData.videos = [...existing.videos, ...savedVideos];

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

    res.json(updatedProperty);
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật tin đăng' });
  }
};

// Xóa tin đăng
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: 'Không tìm thấy tin đăng' });

    // Xóa các file ảnh và video khỏi thư mục
    deleteFiles(property.images, path.join(__dirname, '../uploads/images'));
    deleteFiles(property.videos, path.join(__dirname, '../uploads/videos'));

    await property.remove(); // Xóa tin đăng khỏi cơ sở dữ liệu
    res.json({ message: 'Đã xóa thành công' });
  } catch (err) {
    console.error('Lỗi khi xóa:', err);
    res.status(500).json({ error: 'Lỗi khi xóa tin đăng' });
  }
};

// Cập nhật trạng thái duyệt của tin đăng
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    // Kiểm tra giá trị hợp lệ
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const updated = await Property.findByIdAndUpdate(
      id,
      { approvalStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
    }

    res.json({
      message: 'Cập nhật trạng thái duyệt thành công',
      property: updated
    });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái duyệt:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};

// API Xóa ảnh và video
exports.deleteImage = async (req, res) => {
  const { propertyId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Missing imageUrl" });
  }

  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { images: imageUrl } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Image deleted successfully.",
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteVideo = async (req, res) => {
  const { propertyId } = req.params;
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ message: "Missing videoUrl" });
  }

  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $pull: { videos: videoUrl } },
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      message: "Video deleted successfully.",
      property
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//xem chi tiết tin đăng
exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('location')
      .populate('category')
      .populate('user'); // Chỉ lấy tên và email của người dùng
      if (!property){
        return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
      }
      res.json(property);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết:', err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết tin đăng' });
  }
};

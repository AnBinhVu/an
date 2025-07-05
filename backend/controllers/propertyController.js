const Property = require('../models/Property');
const Notification = require('../models/Notification');
const cloudinary = require('../config/cloudinary');

// Tạo thông báo cho người dùng
const createNotification = async (message, user, type = 'info') => {
  try {
    const notification = new Notification({ message, user, type });
    await notification.save();
  } catch (err) {
    console.error('Lỗi khi tạo thông báo:', err);
  }
};

// Lấy tất cả tin đăng chưa hết hạn
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      approvalStatus: 'approved', 
      isBlocked: false, 
      expireAt: { $gt: new Date() },
    })
      .populate('location', 'city district commune') 
      .populate('category', 'name') 
      .populate('user', 'name email') 
      .collation({ locale: 'vi', strength: 1 }) 
      .sort({ title: 1 });

    res.status(200).json(properties);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách tin đăng:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin đăng' });
  }
};
// lấy tất cả tin đăng (bao gồm đã hết hạn)
exports.getAllPropertiesAdmin = async (req, res) => {
  try {
    const properties = await Property.find(
      
    )
      .populate('location category user')
      .collation({ locale: 'vi', strength: 1 })
      .sort({ title: 1 });
    res.json(properties);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin đăng' });
  }
};

// Lấy tin đăng của 1 người dùng
exports.getListProperties = async (req, res) => {
  try {
    const userId = req.userId;
    const properties = await Property.find({ user: userId })
      .populate('location category user')
      .collation({ locale: 'vi', strength: 1 })
      .sort({ title: 1 });
    res.json(properties);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin đăng' });
  }
};

// Tạo tin đăng
exports.createProperty = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Request Files:', req.files);

    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    if (images.length > 10) return res.status(400).json({ error: 'Tối đa 10 ảnh' });
    if (videos.length > 2) return res.status(400).json({ error: 'Tối đa 2 video' });

    const savedImages = images.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    const savedVideos = videos.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    const data = {
      ...req.body,
      images: savedImages,
      videos: savedVideos
    };

    if (typeof data.propertyDetails === 'string') {
      data.propertyDetails = JSON.parse(data.propertyDetails);
    }

    if (data.price && data.propertyDetails?.areaSqFt) {
      data.pricePerSqFt = data.price / data.propertyDetails.areaSqFt;
    }

    const property = new Property(data);
    await property.save();

    const message = `Tin đăng "${property.title}" đang chờ duyệt!`;
    createNotification(message, req.userId, 'success');
    res.status(201).json({ message: 'Tạo tin đăng thành công', property });
  } catch (err) {
    console.error('Lỗi tạo tin đăng:', err);
    res.status(500).json({ error: 'Lỗi khi tạo tin đăng: ' + err.message });
  }
};

// Cập nhật tin đăng
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    // Parse JSON safely
    let deletedImages = [];
    let deletedVideos = [];

    try {
      if (req.body.deletedImages) {
        deletedImages = typeof req.body.deletedImages === 'string'
          ? JSON.parse(req.body.deletedImages)
          : req.body.deletedImages;
      }
      if (req.body.deletedVideos) {
        deletedVideos = typeof req.body.deletedVideos === 'string'
          ? JSON.parse(req.body.deletedVideos)
          : req.body.deletedVideos;
      }
    } catch (err) {
      return res.status(400).json({ error: 'Dữ liệu deletedImages hoặc deletedVideos không hợp lệ' });
    }

    const updateData = { ...req.body };

    // Parse propertyDetails nếu là string
    if (typeof updateData.propertyDetails === 'string') {
      updateData.propertyDetails = JSON.parse(updateData.propertyDetails);
    }

    const existing = await Property.findById(id);
    if (!existing) return res.status(404).json({ error: 'Không tìm thấy tin đăng' });

    // Xoá ảnh song song khỏi Cloudinary
    await Promise.all(
      deletedImages.map(url => {
        const img = existing.images.find(i => i.url === url);
        return img ? cloudinary.uploader.destroy(img.public_id) : null;
      })
    );

    await Promise.all(
      deletedVideos.map(url => {
        const vid = existing.videos.find(v => v.url === url);
        return vid ? cloudinary.uploader.destroy(vid.public_id, { resource_type: 'video' }) : null;
      })
    );

    // Lọc giữ lại ảnh/video không bị xóa
    const remainingImages = existing.images.filter(i => !deletedImages.includes(i.url));
    const remainingVideos = existing.videos.filter(v => !deletedVideos.includes(v.url));

    // Thêm mới từ Cloudinary
    const savedImages = images.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    const savedVideos = videos.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    updateData.images = [...remainingImages, ...savedImages];
    updateData.videos = [...remainingVideos, ...savedVideos];

    // Tính lại giá theo mét vuông nếu cần
    if (updateData.price && updateData.propertyDetails?.areaSqFt) {
      updateData.pricePerSqFt = updateData.price / updateData.propertyDetails.areaSqFt;
    }

    const updated = await Property.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Cập nhật thành công', property: updated });
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    res.status(500).json({ error: 'Lỗi khi cập nhật tin đăng: ' + err.message });
  }
};
// Cập nhật tin đăng
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const images = req.files?.images || [];
    const videos = req.files?.videos || [];

    const updateData = { ...req.body };

    if (typeof updateData.propertyDetails === 'string') {
      updateData.propertyDetails = JSON.parse(updateData.propertyDetails);
    }

    const existing = await Property.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
    }

    const savedImages = images.map(file => ({
      url: file.path,
      public_id: file.filename
    }));
    const savedVideos = videos.map(file => ({
      url: file.path,
      public_id: file.filename
    }));

    updateData.images = [...existing.images, ...savedImages];
    updateData.videos = [...existing.videos, ...savedVideos];

    if (updateData.price && updateData.propertyDetails?.areaSqFt) {
      updateData.pricePerSqFt = updateData.price / updateData.propertyDetails.areaSqFt;
    }

    const updated = await Property.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: 'Cập nhật thành công', property: updated });

    const message = `Tin đăng "${updated.title}" đã được cập nhật thành công!`;
    createNotification(message, req.userId, 'success');
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

    // Xóa ảnh từ Cloudinary
    if (property.images && property.images.length > 0) {
      for (const image of property.images) {
        if (image.public_id) await cloudinary.uploader.destroy(image.public_id);
      }
    }

    // Xóa video từ Cloudinary
    if (property.videos && property.videos.length > 0) {
      for (const video of property.videos) {
        if (video.public_id) await cloudinary.uploader.destroy(video.public_id, { resource_type: 'video' });
      }
    }

    await property.deleteOne();
    res.json({ message: 'Đã xóa thành công' });
    const message = `Tin đăng "${property.title}" đã được xóa thành công!`;
    createNotification(message, req.userId, 'success');
  } catch (err) {
    console.error('Lỗi khi xóa:', err);
    res.status(500).json({ error: 'Lỗi khi xóa tin đăng' });
  }
};

// Xóa ảnh
exports.deleteImage = async (req, res) => {
  const { propertyId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ message: 'Thiếu imageUrl' });

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Không tìm thấy tin đăng' });

    const imageObj = property.images.find(img => img.url === imageUrl);
    if (!imageObj || !imageObj.public_id) return res.status(404).json({ message: 'Không tìm thấy ảnh trong tin đăng' });

    await cloudinary.uploader.destroy(imageObj.public_id);
    property.images = property.images.filter(img => img.url !== imageUrl);
    await property.save();

    res.json({ message: 'Xóa ảnh thành công', property });
  } catch (error) {
    console.error('Lỗi khi xóa ảnh:', error);
    res.status(500).json({ message: 'Lỗi khi xóa ảnh: ' + error.message });
  }
};

// Xóa video
exports.deleteVideo = async (req, res) => {
  const { propertyId } = req.params;
  const { videoUrl } = req.body;

  if (!videoUrl) return res.status(400).json({ message: 'Thiếu videoUrl' });

  try {
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Không tìm thấy tin đăng' });

    const videoObj = property.videos.find(vid => vid.url === videoUrl);
    if (!videoObj || !videoObj.public_id) return res.status(404).json({ message: 'Không tìm thấy video trong tin đăng' });

    await cloudinary.uploader.destroy(videoObj.public_id, { resource_type: 'video' });
    property.videos = property.videos.filter(vid => vid.url !== videoUrl);
    await property.save();

    res.json({ message: 'Xóa video thành công', property });
  } catch (error) {
    console.error('Lỗi khi xóa video:', error);
    res.status(500).json({ message: 'Lỗi khi xóa video: ' + error.message });
  }
};

// Xem chi tiết tin đăng
exports.getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('location')
      .populate('category')
      .populate('user');
    if (!property) return res.status(404).json({ error: 'Không tìm thấy tin đăng' });
    viewProperty(req.params.id);
    res.json(property);
  } catch (err) {
    console.error('Lỗi khi lấy chi tiết:', err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết tin đăng' });
  }
};

// Tăng view khi xem tin đăng
async function viewProperty(propertyId) {
  const property = await Property.findByIdAndUpdate(
    propertyId,
    { $inc: { views: 1 } },
    { new: true }
  );
  return property;
}

// Cập nhật trạng thái duyệt
exports.updateApprovalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
    }

    const updated = await Property.findByIdAndUpdate(id, { approvalStatus }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Không tìm thấy tin đăng' });

    res.json({ message: 'Cập nhật trạng thái duyệt thành công', property: updated });
  } catch (err) {
    console.error('Lỗi khi cập nhật trạng thái duyệt:', err);
    res.status(500).json({ error: 'Lỗi máy chủ' });
  }
};
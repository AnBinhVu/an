const Location = require('../models/Location');
const getCoordinates = require('../utils/geocode');

// Lấy tất cả địa điểm
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find().sort({city: 1, district: 1, commune: 1});
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu địa điểm', error: err.message });
  }
};

// Tạo mới địa điểm
exports.createLocation = async (req, res) => {
  try {
    const { city, district, commune, note } = req.body;
  
    // Kiểm tra trùng lặp địa điểm (city, district, commune)
    const existing = await Location.findOne({ city, district, commune });
    if (existing) {
      return res.status(409).json({ message: 'Địa điểm này đã tồn tại' });
    }
  
    // Gán tọa độ giả (có thể thay thế bằng API thực tế nếu có)
    const coordinates = { latitude: Math.random() * 10 + 10, longitude: Math.random() * 10 + 100 };
   
    // Tạo đối tượng mới với xã và ghi chú
    const newLocation = new Location({ city, district, commune, note, coordinates });
    await newLocation.save();
  
    res.status(201).json(newLocation);
  } catch (err) {
    console.error('Lỗi khi tạo địa điểm:', err);
    res.status(500).json({ message: 'Lỗi server khi tạo địa điểm', error: err.message });
  }
};

// Xóa địa điểm
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Địa điểm không tồn tại' });
    }
    res.json({ message: 'Đã xóa địa điểm' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa địa điểm', error: err.message });
  }
};

// Cập nhật địa điểm
exports.updateLocation = async (req, res) => {
  const { city, district, commune, note } = req.body;
  try {
    // Kiểm tra tồn tại địa điểm trước khi cập nhật
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Địa điểm không tồn tại' });
    }

    // Cập nhật tọa độ (nếu có API cho tọa độ thật)
    const coordinates = await getCoordinates(city, district);
    
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      { city, district, commune, note, coordinates },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật địa điểm', error: err.message });
  }
};

const User = require('../models/User');

// Lấy tất cả user (có thể lọc theo role)
exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Lỗi khi lấy danh sách user' });
    }
  };  

// Lấy chi tiết user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Lỗi khi lấy user' });
  }
};

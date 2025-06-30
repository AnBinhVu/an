const Notification = require('../models/Notification');
const User = require('../models/User');

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { message, type, user } = req.body;
    if (!message || !user) return res.status(400).json({ error: "Thiếu message hoặc user" });

    const newNotification = new Notification({
      message,
      type: type || 'info',
      user,
    });

    await newNotification.save();
    res.status(201).json({ message: 'Thông báo đã được tạo thành công', newNotification });
  } catch (err) {
    console.error('Lỗi khi tạo thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi tạo thông báo' });
  }
};

// Tạo thông báo cho tất cả user (trừ admin)
exports.createNotificationForAllUsers = async (req, res) => {
  try {
    const { message, type } = req.body;
    if (!message) return res.status(400).json({ error: "Thiếu message!" });

    const users = await User.find({ role: { $ne: 'admin' } });
    if (users.length === 0) return res.status(404).json({ error: "Không có user nào để gửi!" });

    const notifications = users.map(user => ({
      message,
      type: type || 'info',
      user: user._id,
    }));

    // Kiểm tra mẫu notification trước khi insert
    if (!notifications[0].message || !notifications[0].user) {
      return res.status(400).json({ error: "Thông báo bị thiếu dữ liệu" });
    }

    await Notification.insertMany(notifications);

    res.json({ message: "Đã gửi thông báo đến tất cả user" });
  } catch (err) {
    console.error("Lỗi khi gửi thông báo hàng loạt:", err);
    res.status(500).json({ error: "Lỗi khi gửi thông báo" });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    // Có thể thêm phân trang nếu dữ liệu lớn:
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20;

    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('user', 'email name'); // Nếu muốn hiện thêm thông tin user

    const total = await Notification.countDocuments();

    res.json({
      data: notifications,
      meta: {
        total,
        page,
        pageSize,
        pageCount: Math.ceil(total / pageSize),
      }
    });
  } catch (err) {
    console.error('Lỗi khi lấy tất cả thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi lấy tất cả thông báo' });
  }
};

// Lấy danh sách thông báo của người dùng
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error('Lỗi khi lấy thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi lấy thông báo' });
  }
};

// Đánh dấu thông báo là đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Thông báo không tồn tại' });
    }

    res.json({ message: 'Thông báo đã được đánh dấu là đã đọc', notification });
  } catch (err) {
    console.error('Lỗi khi đánh dấu thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi đánh dấu thông báo' });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Thông báo không tồn tại' });
    }

    res.json({ message: 'Thông báo đã được xóa thành công' });
  } catch (err) {
    console.error('Lỗi khi xóa thông báo:', err);
    res.status(500).json({ error: 'Lỗi khi xóa thông báo' });
  }
};

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const session = require("../models/Session");

const registerUser = async (req, res) => {
    try {
        const {username, email, password, fullName, phone} = req.body;

        //kiểm tra sự tồn tại
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Người dùng đã tồn tại" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            fullName,
            phone
        });
        await newUser.save();
        res.status(201).json({ message: "Đăng ký người dùng thành công" });
    } catch (error) {
        console.error("Lỗi đăng ký:", error.message);
        res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({ message: 'Email không tồn tại.' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: 'Mật khẩu không đúng.' });
  
      const token = jwt.sign({ id: user._id, role: user.role  }, 'SECRET_KEY', { expiresIn: '30m' });
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000); 
        await session.create({
              userId: user._id,
              token,
              role: user.role,
              ip: req.ip || req.connection.remoteAddress,
              userAgent: req.headers['user-agent'],
              expiresAt
            });
    
      res.status(200).json({ message: 'Đăng nhập thành công', token, user });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server.' });
    }
  };

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({ message: 'Token không được cung cấp' });
    }

    const result = await session.deleteOne({ token });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Không tìm thấy session tương ứng với token' });
    }

    return res.status(200).json({ message: 'Đăng xuất thành công và session đã được xoá' });
  } catch (err) {
    console.error('Lỗi khi xoá session:', err);
    return res.status(500).json({ message: 'Đã xảy ra lỗi khi xoá session' });
  }
};


module.exports = { registerUser, login, logout };

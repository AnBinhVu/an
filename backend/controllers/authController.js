const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require('jsonwebtoken');

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
  
      // Tạo token JWT
      const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '5m' });
    
      res.status(200).json({ message: 'Đăng nhập thành công', token, user });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi server.' });
    }
  };
module.exports = { registerUser, login };

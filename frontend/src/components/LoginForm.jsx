import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(''); // reset lỗi

  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);

    // Kiểm tra dữ liệu trả về
    if (!res.data?.token || !res.data?.user) {
      throw new Error('Thiếu dữ liệu phản hồi từ server');
    }
                                                             
    const now = Date.now();
    const expireTime = now + 30 * 60 * 1000; 

    localStorage.setItem('token', res.data.token);
    localStorage.setItem('userId', res.data.user._id);
    localStorage.setItem('role', res.data.user.role);
    localStorage.setItem('authExpire', expireTime.toString());
    localStorage.setItem('lastActivity', Date.now().toString());

    // setTimeout(() => {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('userId');
    //   localStorage.removeItem('role');
    //   localStorage.removeItem('authExpire');
    //   window.location.reload(); 
    // }, 5 * 60 * 1000);

    alert('Đăng nhập thành công!');

    if (onClose) onClose(); // đóng popup
    window.location.reload(); // làm mới giao diện
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    const msg = err.response?.data?.message || err.message || 'Lỗi đăng nhập';
    setError(msg);
  }};

  return (
    <div className="overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Chào mừng trở lại</h3>
        <h2>Đăng nhập để tiếp tục</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="📞 Nhập email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Nhập mật khẩu"
            onChange={handleChange}
            required
          />
          <button type="submit" className="continue-btn">Đăng nhập</button>
        </form>

        <div className="divider">Hoặc</div>

        <button className="social-btn google">
          <img src="../img/GG.png" alt="Google" />
          Đăng nhập với Google
        </button>

        {error && <p className="error">{error}</p>}

        <p className="terms">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="signup-btn" style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}>
            Đăng ký
          </Link>{" "}
          ngay.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

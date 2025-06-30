import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token); // Lưu token nếu cần
      alert('Đăng nhập thành công!');
      onClose(); // Đóng popup nếu là modal
      navigate('/'); // Điều hướng về HomePage
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi đăng nhập';
      setError(msg);
    }
  };

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
          Bạn chưa có tài khoản? <button className="signup-btn">Đăng ký</button> ngay.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

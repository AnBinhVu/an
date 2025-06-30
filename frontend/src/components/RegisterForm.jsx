import React, { useState } from 'react';
import '../styles/LoginPage.css';

const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === 'test@gmail.com' && formData.password === '12345678') {
      alert('Đăng nhập thành công!');
      onClose();
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="overlay">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Xin chào bạn</h3>
        <h2>Đăng ký tài khoản mới</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="📞 Nhập email hoặc số điện thoại"
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
          <button type="submit" className="continue-btn">Tiếp tục</button>
        </form>

        <div className="divider">Hoặc</div>

        <button className="social-btn google">
          <img src="../img/GG.png" alt="Google" />
          Đăng nhập với Google
        </button>

        {error && <p className="error">{error}</p>}

        <p className="terms">
          Bằng việc tiếp tục, bạn đồng ý với
          <a href="#"> Điều khoản sử dụng</a>, <a href="#">Chính sách bảo mật</a>, <a href="#">Quy chế</a>.
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;

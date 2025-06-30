import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý login tại đây (fake tạm)
    if (formData.email === 'test@gmail.com' && formData.password === '12345678') {
      navigate('/');
    } else {
      setError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
          />
          <button type="submit">Đăng nhập</button>
        </form>
        <p className="google-text">Hoặc</p>
        <button className="google-btn">
          <img src="../img/GG.png" alt="Google" />
          Đăng nhập bằng Google
        </button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', fullName: '', phone: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { password } = formData;
    if (password.length < 8 || !/[a-zA-Z0-9]/.test(password)) {
      setError('Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 chữ hoặc số');
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      setMessage(res.data.message);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="register-container">
  <h2>Đăng ký</h2>
  <form onSubmit={handleSubmit} className="register-form">
    <input name="username" placeholder="Username" onChange={handleChange} required />
    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
    <input type="password" name="password" placeholder="Mật khẩu" onChange={handleChange} required />
    <input name="fullName" placeholder="Họ tên" onChange={handleChange} required />
    <input name="phone" placeholder="Số điện thoại" onChange={handleChange} />
    <button type="submit">Đăng ký</button>
  </form>
  {error && <p className="error-msg">{error}</p>}
  {message && <p className="success-msg">{message}</p>}
</div>
  );
};

export default RegisterPage;
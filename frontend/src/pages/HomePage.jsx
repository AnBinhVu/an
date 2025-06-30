import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Chào mừng đến trang chủ</h1>
      <p>Đây là trang homepage mặc định.</p>

      {/* Nút Đăng ký */}
      <Link to="/register" style={{ textDecoration: 'none', color: 'blue' }}>
        <h2>Đăng ký</h2>
      </Link>

      {/* Nút Đăng nhập */}
      <button
        onClick={() => setShowLogin(true)}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          marginTop: '20px',
          cursor: 'pointer',
        }}
      >
        Đăng nhập
      </button>

      {/* Form đăng nhập popup */}
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </div>
  );
};

export default HomePage;

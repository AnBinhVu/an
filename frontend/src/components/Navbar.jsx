import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './LoginForm'; // Nhớ đúng đường dẫn
import './Navbar.css';

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/user/67fdcd367b5ed18c74c8ed8c`);
        const unread = res.data.filter(notification => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Lỗi khi lấy thông báo:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (menu) => {
    setTimeout(() => {
      setDropdownOpen((prev) => ({
        ...prev,
        [menu]: true,
      }));
    }, 300); // Delay sau hiệu ứng underline
  };

  const handleMouseLeave = (menu) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [menu]: false,
    }));
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div className="navbar-logo">
            <Link to="/">🏠 RealEstate</Link>
          </div>
          <ul className="navbar-links">
            <li
              className={dropdownOpen.properties ? 'hovered' : ''}
              onMouseEnter={() => handleMouseEnter('properties')}
              onMouseLeave={() => handleMouseLeave('properties')}
            >
              <Link to="/#">Nhà Đất Bán</Link>
              <div className="dropdown-content">
                <Link to="/properties/apd">Bán căn hộ, chung cư</Link>
                <Link to="/properties/sale">Bán căn hộ mini, căn hộ dịch vụ</Link>
                <Link to="/properties/apd">Bán nhà riêng</Link>
                <Link to="/properties/sale">Bán biệt thự </Link>
                <Link to="/properties/apd">Bán nhà mặt phố</Link>
                <Link to="/properties/sale">Bán shophouse, nhà phố thương mại</Link>
                <Link to="/properties/apd">Bán đất nền dự án</Link>
                <Link to="/properties/sale">Bán đất</Link>
                <Link to="/properties/apd">Bán bất động sản khác</Link>
              </div>
            </li>

            <li
              className={dropdownOpen.projects ? 'hovered' : ''}
              onMouseEnter={() => handleMouseEnter('projects')}
              onMouseLeave={() => handleMouseLeave('projects')}
            >
              <Link to="/#">Dự Án Bán</Link>
              <div className="dropdown-content">
                <Link to="/locations/project1">Căn hộ</Link>
                <Link to="/locations/project2">Cao ốc văn phòng</Link>
                <Link to="/locations/project1">Biệt thự</Link>
                <Link to="/locations/project2">Khu đô thị mới</Link>
                <Link to="/locations/project1">Nhà mặt phố</Link>
                <Link to="/locations/project2">Shophouse</Link>
                <Link to="/locations/project2">Dự án khác</Link>
              </div>
            </li>

            <li><Link to="/">Tin Tức</Link></li>

            <li
              className={dropdownOpen.predictions ? 'hovered' : ''}
              onMouseEnter={() => handleMouseEnter('predictions')}
              onMouseLeave={() => handleMouseLeave('predictions')}
            >
              <Link to="/#">Phân tích đánh giá</Link>
              <div className="dropdown-content">
                <Link to="/categories/price1">Biểu đồ giá</Link>
                <Link to="/categories/price2">Báo cáo thị trường</Link>
                <Link to="/categories/price2">Góc nhìn chuyên gia</Link>
              </div>
            </li>

            <li><Link to="/notifications/admin">Quản lý Thông Báo</Link></li>
          </ul>
        </div>
        <div className="nav-right">
          <ul className="navbar-links">
            <li>
              <Link to="/notifications" className="notification-link">
                <div className="notification-icon-wrapper">
                  <img src="../img/bell.png" alt="Thông báo" className="navbar-icon" />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </div>
              </Link>
            </li>
            <li>
              <button className="login-text" onClick={() => setShowLogin(true)}>
                Đăng Nhập
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;

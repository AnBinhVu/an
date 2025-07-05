import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoginForm from './LoginForm';
import NotificationListUser from '../components/NotificationList_User';

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [showNotifications, setShowNotifications] = useState(false);
  const timeoutRef = useRef({});

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const isLoggedIn = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    const storedRole = localStorage.getItem('role');
    const expireTime = localStorage.getItem('authExpire');
    const now = Date.now();

    if (storedToken && storedUserId && storedRole && expireTime && now > parseInt(expireTime)) {
      localStorage.clear();
      setToken(null);
      setUserId(null);
      setRole(null);
      window.location.reload();
      return;
    }

    if (storedToken && storedUserId && storedRole && now < parseInt(expireTime)) {
      setToken(storedToken);
      setUserId(storedUserId);
      setRole(storedRole);
    }
  }, []);

  useEffect(() => {
    if (!token || !userId) return;

    const fetchNotifications = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications/user/${userId}`, config);
        const unread = res.data.filter(notification => !notification.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error('Lỗi khi lấy thông báo:', err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [token, userId]);

  const handleMouseEnter = (menu) => {
    clearTimeout(timeoutRef.current[menu]);
    timeoutRef.current[menu] = setTimeout(() => {
      setDropdownOpen(prev => ({ ...prev, [menu]: true }));
    }, 200);
  };

  const handleMouseLeave = (menu) => {
    clearTimeout(timeoutRef.current[menu]);
    timeoutRef.current[menu] = setTimeout(() => {
      setDropdownOpen(prev => ({ ...prev, [menu]: false }));
    }, 100);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn('Không thể xoá session:', err.message);
      }
    }

    localStorage.clear();
    setToken(null);
    setUserId(null);
    setRole(null);
    setUnreadCount(0);
    setShowLogin(false);
    window.location.reload();
  };

  const navLink = "px-4 py-2 hover:text-blue-500 transition";
  const dropdown = (menu) => dropdownOpen[menu] ? 'block' : 'hidden';

  return (
    <>
      <nav className="bg-blue-600 shadow-md w-full z-50 sticky top-0">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-xl font-bold text-white">🏠 RealEstate</Link>
            <div className="relative" onMouseEnter={() => handleMouseEnter('properties')} onMouseLeave={() => handleMouseLeave('properties')}>
              <Link to="/#" className={navLink + " text-white"}>Nhà Đất Bán</Link>
              <div className={`absolute bg-white shadow-md rounded mt-2 w-56 ${dropdown('properties')}`}>
                <Link to="/properties/apd" className="block px-4 py-2 hover:bg-blue-100">Bán căn hộ, chung cư</Link>
                <Link to="/properties/sale" className="block px-4 py-2 hover:bg-blue-100">Bán căn hộ mini, dịch vụ</Link>
                <Link to="/properties/apd" className="block px-4 py-2 hover:bg-blue-100">Bán nhà riêng</Link>
                <Link to="/properties/sale" className="block px-4 py-2 hover:bg-blue-100">Bán biệt thự</Link>
              </div>
            </div>

            <div className="relative" onMouseEnter={() => handleMouseEnter('projects')} onMouseLeave={() => handleMouseLeave('projects')}>
              <Link to="/#" className={navLink + " text-white"}>Dự Án Bán</Link>
              <div className={`absolute bg-white shadow-md rounded mt-2 w-56 ${dropdown('projects')}`}>
                <Link to="/locations/project1" className="block px-4 py-2 hover:bg-blue-100">Căn hộ</Link>
                <Link to="/locations/project2" className="block px-4 py-2 hover:bg-blue-100">Biệt thự</Link>
              </div>
            </div>

            <Link to="/" className={navLink + " text-white"}>Tin Tức</Link>

            <div className="relative" onMouseEnter={() => handleMouseEnter('predictions')} onMouseLeave={() => handleMouseLeave('predictions')}>
              <Link to="/#" className={navLink + " text-white"}>Phân tích đánh giá</Link>
              <div className={`absolute bg-white shadow-md rounded mt-2 w-56 ${dropdown('predictions')}`}>
                <Link to="/categories/price1" className="block px-4 py-2 hover:bg-blue-100">Biểu đồ giá</Link>
                <Link to="/categories/price2" className="block px-4 py-2 hover:bg-blue-100">Góc nhìn chuyên gia</Link>
              </div>
            </div>

            {isLoggedIn && role === 'admin' && (
              <Link to="/notifications/admin" className={navLink + " text-white"}>Quản lý Thông Báo</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <button onClick={() => setShowNotifications(prev => !prev)}>
                    <img src="/img/icons8-notification-50.png" alt="Thông báo" className="w-6 h-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-[360px] max-h-[400px] bg-white border rounded shadow-lg z-50 overflow-y-auto">
                      <NotificationListUser />
                    </div>
                  )}
                </div>

                {role === 'owner' && (
                  <Link to='/properties' className="bg-white hover:bg-blue-100 text-blue-600 px-3 py-1 rounded font-semibold">
                    Đăng tin
                  </Link>
                )}

                <button onClick={handleLogout} className="text-red-200 hover:underline">Đăng Xuất</button>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} className="text-white hover:underline">Đăng Nhập</button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
    </>
  );
};

export default Navbar;
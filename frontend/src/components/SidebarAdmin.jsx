import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SidebarAdmin.css';

const SidebarAdmin = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
                  <Link to="/">🏠 RealEstate</Link>
                </div>
      <nav>
        <ul className="sidebar-nav">
          <li>
            <div className="dropdown-title" onClick={() => toggleDropdown('posts')}>
              Quản lý tin đăng ▾
            </div>
            {activeDropdown === 'posts' && (
              <ul className="submenu">
                <li><Link to="/admin/properties/apd">Tất cả tin đăng</Link></li>
                <li><Link to="/admin/posts/create">Duyệt tin đăng</Link></li>
                <li><Link to="/admin/posts/create">Quán lý dịch vụ đăng tin</Link></li>
              </ul>
            )}
          </li>

          <li>
            <div className="dropdown-title" onClick={() => toggleDropdown('users')}>
             Quản lý người dùng ▾
            </div>
            {activeDropdown === 'users' && (
              <ul className="submenu">
                <li><Link to="/admin/users">Danh sách người dùng</Link></li>
                <li><Link to="/admin/users/roles">Phân quyền và báo cáo vi phạm</Link></li>
              </ul>
            )}
          </li>

          <li>
            <div className="dropdown-title" onClick={() => toggleDropdown('categories')}>
               Quản lý danh mục ▾
            </div>
            {activeDropdown === 'categories' && (
              <ul className="submenu">
                <li><Link to="/admin/categories">Danh sách danh mục</Link></li>
              </ul>
            )}
          </li>

          <li>
            <div className="dropdown-title" onClick={() => toggleDropdown('locations')}>
               Quản lý khu vực ▾
            </div>
            {activeDropdown === 'locations' && (
              <ul className="submenu">
                <li><Link to="/admin/locations">Danh sách khu vực</Link></li>
              </ul>
            )}
          </li>

          <li>
            <div className="dropdown-title" onClick={() => toggleDropdown('notifications')}>
               Quản lý thông báo ▾
            </div>
            {activeDropdown === 'notifications' && (
              <ul className="submenu">
                <li><Link to="/admin/notifications">Danh sách thông báo</Link></li>
                <li><Link to="/admin/notifications">Phát thông báo</Link></li>
              </ul>
            )}
          </li>

          <li><div className="dropdown-title" onClick={() => toggleDropdown('analyze')}>
               Thống kê ▾
            </div>
            {activeDropdown === 'analyze' && (
              <ul className="submenu">
                <li><Link to="/admin/analyze">Thống kê số lượng tin đăng</Link></li>
                <li><Link to="/admin/analyze">Thống kê số lượng nhà đất</Link></li>
              </ul>
            )}</li>
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;

import React from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <SidebarAdmin />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;

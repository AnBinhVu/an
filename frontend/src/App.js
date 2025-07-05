import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
// import SidebarAdmin from './components/SidebarAdmin';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LocationPage from './pages/LocationPage';
import CategoryPage from './pages/CategoryPage';
import PropertyPage from './pages/PropertyPage'; 
import AllPropertiesPage from './pages/AllPropertiesPage';
import PropertyDetail from './pages/Detail-PropertyPage';
import NotificationAdminPage from './pages/NotificationAdminPage';
import HomeAdminPage from './pages/HomeAdminPage';
import AdminLayout from './layouts/AdminLayout';
import PlanManager from './pages/PlanManager';
import ProtectedRoute from './components/ProtectedRoute';
import PlanPage from './pages/PlanPage';
import Success from './pages/Success';

function App() {
  const location = useLocation();

  // Kiểm tra nếu là đường dẫn admin
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/users') || location.pathname.startsWith('/orders');

  return (
    <>
      {/* Chỉ hiện Navbar nếu KHÔNG phải trang admin */}
      {!isAdminRoute && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />        
        <Route path="/properties" element={<ProtectedRoute allowedRoles={['owner']}><PropertyPage /></ProtectedRoute>} />
        <Route path="/properties/detail/:id" element={<PropertyDetail />} />
        <Route path="/plans" element={<ProtectedRoute allowedRoles={['owner']}><PlanPage /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute allowedRoles={['owner']}><Success /></ProtectedRoute>} />
        {/* Trang admin (có sidebar riêng trong từng trang) */}
       <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><HomeAdminPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/plans" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><PlanManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/locations" element={<ProtectedRoute allowedRoles={['admin']}> <AdminLayout><LocationPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}> <AdminLayout><CategoryPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/properties/apd" element={<ProtectedRoute allowedRoles={['admin']}> <AdminLayout><AllPropertiesPage /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}> <AdminLayout><NotificationAdminPage /></AdminLayout></ProtectedRoute>} />
        {/* Có thể thêm các route admin khác tại đây */}
      </Routes>
    </>
  );
}

export default App;

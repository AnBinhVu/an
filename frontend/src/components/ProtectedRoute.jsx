import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const expireTime = localStorage.getItem('authExpire');

  const isExpired = !token || !expireTime || Date.now() > parseInt(expireTime);
  const isUnauthorized = allowedRoles && !allowedRoles.includes(userRole);

  useEffect(() => {
  if (isExpired) {
    toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  } else if (isUnauthorized) {
    toast.error('Bạn không có quyền truy cập vào trang này.');
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
  }
}, [isExpired, isUnauthorized]);

  // Nếu lỗi, không render children
  if (isExpired || isUnauthorized) return null;

  return children;
};

export default ProtectedRoute;

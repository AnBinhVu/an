import axios from 'axios';
import { toast } from 'react-toastify';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; 

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const isSessionExpired = () => {
  const lastActivity = localStorage.getItem('lastActivity');
  if (!lastActivity) return false;
  const diff = Date.now() - parseInt(lastActivity, 10);
  return diff > SESSION_TIMEOUT_MS;
};

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    if (token && isSessionExpired()) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');
      toast.error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      throw new axios.Cancel('Session expired');
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('lastActivity', Date.now().toString());
    }

    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (error.response && error.response.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivity');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

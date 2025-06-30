import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/NotificationList.css';

const API_URL = process.env.REACT_APP_API_URL;
const USER_ID = "67fdcd367b5ed18c74c8ed8c"; // ID user test

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách thông báo
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications/user/${USER_ID}`);
      setNotifications(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Đánh dấu đã đọc
  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  // Xóa thông báo
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thông báo này?")) return;
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  if (loading) return <div className="loading">Đang tải thông báo...</div>;

  if (notifications.length === 0) return <div className="no-notifications">Không có thông báo nào!</div>;

  return (
    <div className="notification-container">
      <h3>Thông báo của tôi</h3>
      <ul className="notification-list">
        {notifications.map(noti => (
          <li key={noti._id} className={`notification-item ${noti.isRead ? 'read' : 'unread'}`}>
            <div className="notification-content">
              <span className="notification-message">{noti.message}</span>
              <span className="notification-status">
              </span>
              <small className="notification-timestamp">
                {new Date(noti.createdAt).toLocaleString()}
              </small>
            </div>
            <div className="notification-actions">
              {!noti.isRead && (
                <button
                  onClick={() => handleMarkAsRead(noti._id)}
                  className="mark-read-btn"
                >
                  Đánh dấu đã đọc
                </button>
              )}
              <button
                onClick={() => handleDelete(noti._id)}
                className="delete-btn"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
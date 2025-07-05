import React, { useEffect, useState } from 'react';
import axios from 'axios';

const USER_ID = localStorage.getItem('userId');
const API_URL = process.env.REACT_APP_API_URL;

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNoti, setActiveNoti] = useState(null);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await axios.get(`${API_URL}/api/notifications/user/${USER_ID}`, config);
      setNotifications(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.put(`${API_URL}/api/notifications/${id}/read`, config);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thông báo này?")) return;
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, config);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  const handleClickNotification = async (noti) => {
    if (!noti.isRead) await handleMarkAsRead(noti._id);
    setActiveNoti({ ...noti, isRead: true }); // đảm bảo hiển thị đúng trạng thái
  };

  const closeModal = () => setActiveNoti(null);

  if (loading) return <div className="text-sm text-gray-500 px-4 py-2">Đang tải thông báo...</div>;
  if (notifications.length === 0) return <div className="text-sm text-gray-600 px-4 py-2">Không có thông báo nào!</div>;

  return (
    <>
      <ul className="divide-y divide-gray-200">
        {notifications.map(noti => (
          <li
            key={noti._id}
            onClick={() => handleClickNotification(noti)}
            className={`px-4 py-3 cursor-pointer hover:bg-gray-50 flex justify-between items-start ${noti.isRead ? 'bg-white' : 'bg-blue-50'}`}
          >
            <div className="flex-1 text-sm text-gray-800">
              <p>{noti.message}</p>
              <p className="text-xs text-gray-500">{new Date(noti.createdAt).toLocaleString()}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(noti._id);
              }}
              className="text-xs text-red-500 hover:underline ml-2"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>

      {activeNoti && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h4 className="text-lg font-semibold mb-2">Chi tiết Thông báo</h4>
            <p className="text-sm text-gray-700 mb-2">{activeNoti.message}</p>
            <p className="text-xs text-gray-500 mb-4">{new Date(activeNoti.createdAt).toLocaleString()}</p>
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationList;

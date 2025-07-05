import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/NotificationAdminPage.css';

const API_URL = process.env.REACT_APP_API_URL;

const NotificationAdminPage = () => {
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastType, setBroadcastType] = useState('info');
  const [sendResult, setSendResult] = useState('');
  const [showBroadcastForm, setShowBroadcastForm] = useState(false);

  const [showUserForm, setShowUserForm] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const [userType, setUserType] = useState('info');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [sendUserResult, setSendUserResult] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/users?role!=admin`)
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return alert("Vui lòng nhập nội dung!");
    try {
      const res = await axios.post(`${API_URL}/api/notifications/broadcast`, {
        message: broadcastMsg,
        type: broadcastType,
      });
      setSendResult(res.data.message || "Đã gửi!");
      setBroadcastMsg('');
      fetchAllNotifications(page);
    } catch {
      setSendResult("Lỗi khi gửi thông báo!");
    }
  };

  const handleSendUser = async (e) => {
    e.preventDefault();
    if (!userMsg.trim() || !userId) return alert("Nhập đủ nội dung và chọn user!");
    try {
      await axios.post(`${API_URL}/api/notifications`, {
        message: userMsg,
        type: userType,
        user: userId
      });
      setSendUserResult("Gửi thành công!");
      setUserMsg('');
      setUserId('');
      fetchAllNotifications(page);
    } catch {
      setSendUserResult("Lỗi khi gửi!");
    }
  };

  const fetchAllNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/notifications/all?page=${pageNum}&pageSize=${pageSize}`);
      setNotifications(res.data.data);
      setMeta(res.data.meta);
      setPage(pageNum);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllNotifications(1);
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa thông báo này?")) return;
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      alert("Lỗi khi xóa thông báo!");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= meta.pageCount) {
      fetchAllNotifications(newPage);
    }
  };

  return (
    <div className="notification-admin-container">
      <h2>Quản trị Thông báo hệ thống</h2>

      <div className="form-toggle-buttons">
        <button
          className="toggle-btn"
          onClick={() => setShowBroadcastForm(s => !s)}
        >
          {showBroadcastForm ? "Ẩn form gửi broadcast" : "+ Gửi broadcast"}
        </button>
        <button
          className="toggle-btn"
          onClick={() => setShowUserForm(s => !s)}
        >
          {showUserForm ? "Ẩn form gửi cá nhân" : "+ Gửi thông báo cá nhân"}
        </button>
      </div>

      {showBroadcastForm && (
        <form className="broadcast-form" onSubmit={handleBroadcast}>
          <h4>Tạo thông báo cho tất cả người dùng (trừ admin)</h4>
          <input
            type="text"
            value={broadcastMsg}
            onChange={e => setBroadcastMsg(e.target.value)}
            placeholder="Nội dung thông báo"
            className="form-input"
            required
          />
          <select
            value={broadcastType}
            onChange={e => setBroadcastType(e.target.value)}
            className="form-select"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <button type="submit" className="submit-btn">Gửi</button>
          {sendResult && <div className="form-result">{sendResult}</div>}
        </form>
      )}

      {showUserForm && (
        <form className="user-form" onSubmit={handleSendUser}>
          <h4>Gửi thông báo cho một người dùng</h4>
          <input
            type="text"
            value={userMsg}
            onChange={e => setUserMsg(e.target.value)}
            placeholder="Nội dung thông báo"
            className="form-input"
            required
          />
          <select
            value={userType}
            onChange={e => setUserType(e.target.value)}
            className="form-select"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
          <select
            value={userId}
            onChange={e => setUserId(e.target.value)}
            className="form-select"
            required
          >
            <option value="">-- Chọn người nhận --</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>
                {u.name || u.email || u._id}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-btn">Gửi</button>
          {sendUserResult && <div className="form-result">{sendUserResult}</div>}
        </form>
      )}

      <h4>Danh sách tất cả thông báo</h4>
      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          <table className="notification-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nội dung</th>
                <th>Loại</th>
                <th>Người nhận</th>
                <th>Thời gian</th>
                <th>Đã đọc?</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n, i) => (
                <tr key={n._id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>{n.message}</td>
                  <td>{n.type}</td>
                  <td>
                    {n.user ? (
                      <>
                        {n.user.name || n.user.email || n.user._id}
                      </>
                    ) : (
                      <span className="undefined-user">(Không xác định)</span>
                    )}
                  </td>
                  <td>{new Date(n.createdAt).toLocaleString()}</td>
                  <td className={n.isRead ? 'read-status' : 'unread-status'}>
                    {n.isRead ? "Đã đọc" : "Chưa đọc"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="delete-btn"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {meta.page > 1 && (
              <button
                onClick={() => handlePageChange(page - 1)}
                className="pagination-btn"
              >
                Trang trước
              </button>
            )}
            <span className="pagination-info">
              Trang {meta.page}/{meta.pageCount || 1}
            </span>
            {meta.page < meta.pageCount && (
              <button
                onClick={() => handlePageChange(page + 1)}
                className="pagination-btn"
              >
                Trang sau
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationAdminPage;
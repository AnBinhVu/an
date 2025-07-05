import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance'; 
import '../styles/AllPropertiesPage.css';

const AllPropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties/admin/allproperty`);
      setProperties(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprovalChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${id}/approval`, {
        approvalStatus: newStatus,
      });
      fetchProperties();
    } catch (err) {
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  return (
    <div className="properties-container">
      <h2>Tất cả Tin đăng</h2>
      {loading ? <p className="loading">Đang tải...</p> : (
        <table className="properties-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Giá</th>
              <th>Loại</th>
              <th>Trạng thái duyệt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop._id}>
                <td>{prop.title}</td>
                <td>{prop.price.toLocaleString()} VNĐ</td>
                <td>{prop.type}</td>
                <td className={`status-${prop.approvalStatus || 'pending'}`}>
                  {prop.approvalStatus || 'pending'}
                </td>
                <td>
                  <select
                    value={prop.approvalStatus || 'pending'}
                    onChange={(e) => handleApprovalChange(prop._id, e.target.value)}
                    className="approval-select"
                  >
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllPropertiesPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/LocationPage.css';

const cityDistrictMap = {
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Cầu Giấy', 'Đống Đa'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận Bình Thạnh'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn'],
  'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng'],
  'Hải Phòng': ['Ngô Quyền', 'Lê Chân', 'Hồng Bàng'],
  'Bình Dương': ['Thủ Dầu Một', 'Dĩ An'],
  'Đồng Nai': ['Biên Hòa', 'Long Khánh'],
  'Khánh Hòa': ['Nha Trang', 'Cam Ranh'],
  'Thừa Thiên Huế': ['Huế', 'Hương Thủy'],
  'Quảng Ninh': ['Hạ Long', 'Cẩm Phả'],
  'Lâm Đồng': ['Đà Lạt', 'Bảo Lộc'],
  'Bình Định': ['Quy Nhơn', 'An Nhơn'],
  'Nghệ An': ['Vinh', 'Cửa Lò'],
  'Thanh Hóa': ['Thanh Hóa', 'Sầm Sơn'],
  'Quảng Nam': ['Tam Kỳ', 'Hội An']
};

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ city: '', district: '', commune: '', note: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility

  // Fetch locations from the API
  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/locations`);
      setLocations(res.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/locations/${editId}`, form);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/locations`, form);
      }
      setForm({ city: '', district: '', commune: '', note: '' });
      setEditId(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Địa điểm này đã tồn tại!');
      } else {
        setError('Lỗi khi gửi dữ liệu.');
      }
      setTimeout(() => setError(''), 5000); // Tự ẩn sau 5 giây
    }
  };

  const handleEdit = (loc) => {
    setForm({ city: loc.city, district: loc.district, commune: loc.commune, note: loc.note });
    setEditId(loc._id);
    setShowForm(true); 
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/locations/${id}`);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };

  return (
    <div className="location-container">
      <h2>Quản lý Địa điểm</h2>

      <button onClick={() => setShowForm(!showForm)} className="add-new-btn">
        {showForm ? 'Hủy thêm mới' : 'Thêm địa chỉ mới'}
      </button>

      {showForm && (
        <form className="location-form" onSubmit={handleSubmit}>
          <select
            value={form.city}
            onChange={(e) => setForm({ city: e.target.value, district: '', commune: '', note: '' })}
            required
          >
            <option value="">Chọn Thành phố</option>
            {Object.keys(cityDistrictMap).map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            required
            disabled={!form.city}
          >
            <option value="">Chọn Quận / Huyện</option>
            {form.city && cityDistrictMap[form.city].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input
            type="text"
            value={form.commune}
            onChange={(e) => setForm({ ...form, commune: e.target.value })}
            placeholder="Nhập xã, Phường"
            required
          />

          <textarea
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Địa chỉ cụ thể"
          />

          <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
          {error && <div className="error-msg">{error}</div>}
        </form>
      )}

      <ul className="location-list">
        {locations.map(loc => (
          <li key={loc._id} className="location-item">
            <span><b>{loc.city} - {loc.district} - {loc.commune}</b><br />
              Tọa độ: {loc.coordinates.latitude}, {loc.coordinates.longitude}<br />
              Ghi chú: {loc.note || 'Không có ghi chú'}
            </span>
            <div className="button-group">
              <button onClick={() => handleEdit(loc)} className="edit-btn">Sửa</button>
              <button onClick={() => handleDelete(loc._id)} className="delete-btn">Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LocationPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false); // Trạng thái hiển thị form

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh mục:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/categories/${editId}`, form);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/categories`, form);
      }
      setForm({ name: '', description: '' });
      setEditId(null);
      setShowForm(false); // Ẩn form sau khi submit
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi gửi form:', err);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description });
    setEditId(cat._id);
    setShowForm(true); // Hiển thị form khi chỉnh sửa
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa danh mục này?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Lỗi khi xóa:', err);
    }
  };  

  return (
    <div className="category-container">
      <h2>Quản lý Danh mục</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="add-new-btn"
      >
        {showForm ? 'Hủy' : 'Thêm danh mục'}
      </button>

      {showForm && (
        <form className="category-form" onSubmit={handleSubmit}>
          <label>
            Tên danh mục:
            <input
              placeholder="Tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>
          <label>
            Mô tả:
            <textarea
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </label>
          <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
        </form>
      )}

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="category-item">
            <span>
              <b>{cat.name}</b>: {cat.description || 'Không có mô tả'}
            </span>
            <div className="action-buttons">
              <button onClick={() => handleEdit(cat)} className="edit-btn">Sửa</button>
              <button onClick={() => handleDelete(cat._id)} className="delete-btn">Xóa</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryPage;
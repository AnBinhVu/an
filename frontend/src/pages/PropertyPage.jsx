import React, { useEffect, useState, useRef } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../styles/PropertyPage.css';

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    title: '', description: '', price: '',
    location: '', category: '', user: '', type: 'sale',
    propertyDetails: { bedrooms: '', bathrooms: '', areaSqFt: '' },
    images: [], videos: []
  });

  const fetchAll = async () => {
    try {
      const [props, locs, cats] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/properties`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/locations`),
        axios.get(`${process.env.REACT_APP_API_URL}/api/categories`)
      ]);
      setProperties(props.data);
      setLocations(locs.data);
      setCategories(cats.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('propertyDetails.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          [key]: value
        }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFiles = Array.from(files);

    if (name === 'images' && selectedFiles.length > 10) {
      return alert('Chỉ được upload tối đa 10 ảnh');
    }
    if (name === 'videos' && selectedFiles.length > 2) {
      return alert('Chỉ được upload tối đa 2 video');
    }

    setForm(prev => ({ ...prev, [name]: selectedFiles }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (key === 'propertyDetails') {
        formData.append('propertyDetails', JSON.stringify(val));
      } else if (key === 'images' || key === 'videos') {
        val.forEach(file => formData.append(key, file));
      } else {
        formData.append(key, val);
      }
    });

    // Thêm ảnh/video đã chọn vào formData
    if (form.images.length === 0 && existingImages.length > 0) {
      existingImages.forEach(url => formData.append('existingImages[]', url));
    }
    if (form.videos.length === 0 && existingVideos.length > 0) {
      existingVideos.forEach(url => formData.append('existingVideos[]', url));
    }

    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/properties/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Tin đăng đã được cập nhật!');
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/properties`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setMessage('Thêm tin đăng thành công!');
      }
      resetForm();
      setShowForm(false); // Hide form sau khi submit
      fetchAll();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    }
  };

  //xóa ảnh
  const handleDeleteImage = async (image) => {
    if (!editId) return;
    if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/properties/${editId}/images`,
        { data: { imageUrl: image } }
      );
      setExistingImages(prevImages => prevImages.filter(img => img !== image));
      setMessage('Đã xóa ảnh thành công!');
    } catch (err) {
      console.error("Lỗi khi xóa ảnh:", err);
      setMessage('Xóa ảnh không thành công!');
    }
  };
  //xóa videos
  const handleDeleteVideo = async (video) => {
    if (!editId) return;
    if (!window.confirm("Bạn có chắc muốn xóa video này?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/properties/${editId}/videos`,
        { data: { videoUrl: video } }
      );
      setExistingVideos(prevVideos => prevVideos.filter(v => v !== video));
      setMessage('Đã xóa video thành công!');
    } catch (err) {
      console.error("Lỗi khi xóa video:", err);
      setMessage('Xóa video không thành công!');
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      location: p.location?._id || '',
      category: p.category?._id || '',
      user: p.user?._id || '',
      type: p.type,
      propertyDetails: {
        bedrooms: p.propertyDetails?.bedrooms || '',
        bathrooms: p.propertyDetails?.bathrooms || '',
        areaSqFt: p.propertyDetails?.areaSqFt || ''
      },
      images: [],
      videos: []
    });
    setExistingImages(p.images || []);
    setExistingVideos(p.videos || []);
    setEditId(p._id);
    setShowForm(true); // show form khi sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/properties/${id}`);
      setMessage('Đã xóa tin đăng thành công!');
      fetchAll();
    }
  };

  const resetForm = () => {
    setForm({
      title: '', description: '', price: '',
      location: '', category: '', user: '', type: 'sale',
      propertyDetails: { bedrooms: '', bathrooms: '', areaSqFt: '' },
      images: [], videos: []
    });
    setExistingImages([]);
    setExistingVideos([]);
    setEditId(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
    if (videoInputRef.current) videoInputRef.current.value = null;
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="property-container">
      <h2>Quản lý Tin đăng</h2>
      {/* Nút thêm mới */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        style={{ marginBottom: "18px" }}
      >
        + Thêm bài đăng mới
      </button>

      {/* Form tạo/sửa tin đăng */}
      {showForm && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" rows="3" />
          <input name="price" value={form.price} onChange={handleChange} placeholder="Giá (VNĐ)" type="number" />

          <input name="user" value={form.user} onChange={handleChange} placeholder="ID người đăng (user._id)" />

          <select name="location" value={form.location} onChange={handleChange}>
            <option value="">-- Địa điểm --</option>
            {locations.map(loc => (
              <option key={loc._id} value={loc._id}>{loc.city} - {loc.district}</option>
            ))}
          </select>

          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">-- Danh mục --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>

          <select name="type" value={form.type} onChange={handleChange}>
            <option value="sale">Bán</option>
            <option value="rent">Cho thuê</option>
          </select>

          <input name="propertyDetails.bedrooms" value={form.propertyDetails.bedrooms} onChange={handleChange} placeholder="Số phòng ngủ" />
          <input name="propertyDetails.bathrooms" value={form.propertyDetails.bathrooms} onChange={handleChange} placeholder="Số phòng tắm" />
          <input name="propertyDetails.areaSqFt" value={form.propertyDetails.areaSqFt} onChange={handleChange} placeholder="Diện tích (m²)" />

          <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} ref={imageInputRef} />
          {form.images.length > 0 && (
            <div className="preview-section">
              <h4>Ảnh đã chọn:</h4>
              <div className="preview-grid">
                {form.images.map((file, idx) => (
                  <img key={idx} src={URL.createObjectURL(file)} alt={`preview-img-${idx}`} className="preview-img" />
                ))}
              </div>
            </div>
          )}
          {existingImages.length > 0 && (
            <div className="preview-section">
              <h4>Ảnh hiện tại:</h4>
              <div className="preview-grid">
                {existingImages.map((url, idx) => {
                  const fullUrl = url.startsWith('/uploads')
                    ? `${process.env.REACT_APP_API_URL}${url}`
                    : url;
                  return (
                    <div key={idx} className="preview-img-container">
                      <img src={fullUrl} alt={`old-img-${idx}`} className="preview-img" />
                      <button type="button" onClick={() => handleDeleteImage(url)}>Xóa</button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <input type="file" name="videos" multiple accept="video/*" onChange={handleFileChange} ref={videoInputRef} />
          {form.videos.length > 0 && (
            <div className="preview-section">
              <h4>Video đã chọn:</h4>
              <div className="preview-grid">
                {form.videos.map((file, idx) => (
                  <video key={idx} controls src={URL.createObjectURL(file)} className="preview-video" />
                ))}
              </div>
            </div>
          )}
          {existingVideos.length > 0 && (
            <div className="preview-section">
              <h4>Video hiện tại:</h4>
              <div className="preview-grid">
                {existingVideos.map((url, idx) => (
                  <div key={idx} className="preview-video-container">
                    <video controls src={`${process.env.REACT_APP_API_URL}${url}`} className="preview-video" />
                    <button type="button" onClick={() => handleDeleteVideo(url)}>Xóa</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
            <button type="submit">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
              className="cancel-btn"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {message && (
        <div className="notification">
          {message}
        </div>
      )}

      <ul>
        {properties.map(p => (
          <li key={p._id}>
            <b>{p.title}</b> ({p.type}) - {p.price.toLocaleString()} VND<br />
            {p.propertyDetails?.areaSqFt} m² - {p.propertyDetails?.bedrooms} phòng ngủ<br />
            <button onClick={() => handleEdit(p)}>Sửa</button>
            <button onClick={() => handleDelete(p._id)}>Xóa</button>
            <Link to={`/properties/detail/${p._id}`}>Xem chi tiết</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyPage;

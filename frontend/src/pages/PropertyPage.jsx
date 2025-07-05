import { useEffect, useState, useRef, useCallback } from 'react';
import axios from '../utils/axiosInstance';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PropertyPage = () => {
  const [properties, setProperties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef();
  const videoInputRef = useRef();
  const userId = localStorage.getItem('userId'); 

  const [form, setForm] = useState({
    title: '', description: '', price: '',
    location: '', category: '', user: userId || '', type: 'sale',vip: 'normal',
    propertyDetails: { bedrooms: '', bathrooms: '', areaSqFt: '' },
    images: [], videos: []
  });

  const navigate = useNavigate();
  const headerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const editParamId = searchParams.get('edit');

  const fetchProperties = useCallback(async () => {
    try {
      const res = await axios.get(`/api/properties/user/${userId}`);
      setProperties(res.data);
    } catch (err) {
      console.error('Lỗi khi tải tin:', err);
    }
  }, [userId]);

  const fetchLocationsAndCategories = useCallback(async () => {
    try {
      const [locs, cats] = await Promise.all([
        axios.get(`/api/locations`),
        axios.get(`/api/categories`)
      ]);
      setLocations(locs.data);
      setCategories(cats.data);
    } catch (err) {
      console.error('Lỗi khi tải địa điểm/danh mục:', err);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
    fetchLocationsAndCategories();
  }, [fetchProperties, fetchLocationsAndCategories]);

  const scrollToHeader = useCallback(() => {
    if (headerRef.current) {
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('propertyDetails.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        propertyDetails: { ...prev.propertyDetails, [key]: value }
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileList = Array.from(files);

    if (name === 'images') {
      setForm(prev => ({ ...prev, images: [...prev.images, ...fileList] }));
    } else if (name === 'videos') {
      setForm(prev => ({ ...prev, videos: [...prev.videos, ...fileList] }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  setLoading(true);

  Object.entries(form).forEach(([key, val]) => {
    if (key === 'propertyDetails') {
      formData.set(key, JSON.stringify(val));
    } else if (key !== 'images' && key !== 'videos') {
      formData.set(key, val); 
    }
  });

  // Thêm file ảnh mới
  if (form.images?.length) {
    form.images.forEach(file => formData.append('images', file)); 
  }

  // Thêm video
  if (form.videos?.length) {
    form.videos.forEach(file => formData.append('videos', file));
  }

  try {
    if (editId) {
      await toast.promise(
        axios.put(`/api/properties/${editId}`, formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        {
          pending: 'Đang cập nhật...',
          success: 'Tin đăng đã được cập nhật!',
          error: 'Lỗi khi cập nhật tin!'
        }
      );
    } else {
      await toast.promise(
        axios.post('/api/properties', formData,{
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }),
        {
          pending: 'Đang thêm tin đăng...',
          success: 'Thêm tin đăng thành công!',
          error: 'Lỗi khi thêm tin!'
        }
      );
    }

    console.log('Thành công');
    resetForm();
    setShowForm(false);
    fetchProperties();
  } catch (err) {
    console.error('Lỗi khi lưu:', err.response?.data || err.message);
    toast.error('Lỗi khi lưu tin đăng: ' + (err.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }

  scrollToHeader();
};

  const handleDeleteImage = async (imageUrl) => {
  if (!editId || !window.confirm('Bạn có chắc muốn xóa ảnh này?')) return;
  try {
    await toast.promise(
      axios.delete(`/api/properties/${editId}/images`, {
        data: { imageUrl }
      }),
      {
        pending: 'Đang xóa ảnh...',
        success: 'Đã xóa ảnh thành công!',
        error: 'Xóa ảnh không thành công!'
      }
    );
    setExistingImages(prev => prev.filter(img => img !== imageUrl));
  } catch (err) {
    console.error('Lỗi khi xóa ảnh:', err);
  }
  scrollToHeader();
};

  const handleDeleteVideo = async (videoUrl) => {
  if (!editId || !window.confirm('Bạn có chắc muốn xóa video này?')) return;
  try {
    await toast.promise(
      axios.delete(`/api/properties/${editId}/videos`, {
        data: { videoUrl }
      }),
      {
        pending: 'Đang xóa video...',
        success: 'Đã xóa video thành công!',
        error: 'Xóa video không thành công!'
      }
    );
    setExistingVideos(prev => prev.filter(v => v !== videoUrl));
  } catch (err) {
    console.error('Lỗi khi xóa video:', err);
  }
  scrollToHeader();
};

  const handleEdit = useCallback((p) => {
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      location: p.location?._id || '',
      category: p.category?._id || '',
      user: p.user?._id || '',
      type: p.type,
      vip: p.vip || 'normal',
      propertyDetails: {
        bedrooms: p.propertyDetails?.bedrooms || '',
        bathrooms: p.propertyDetails?.bathrooms || '',
        areaSqFt: p.propertyDetails?.areaSqFt || ''
      },
      images: [],
      videos: []
    });
    setExistingImages(p.images.map(img => img.url) || []);
    setExistingVideos(p.videos.map(vid => vid.url) || []);
    setEditId(p._id);
    setShowForm(true);
    scrollToHeader();
    navigate(`?edit=${p._id}`);
  }, [scrollToHeader, navigate]);

  const handleDelete = async (id,title) => {
  if (!window.confirm(`Bạn có chắc muốn xóa tin "${title}"?`)) return;
  try {
    await toast.promise(
      axios.delete(`/api/properties/${id}`),
      {
        pending: 'Đang xóa tin đăng...',
        success: 'Đã xóa tin đăng thành công!',
        error: 'Xóa tin đăng không thành công!'
      }
    );
    fetchProperties();
  } catch (err) {
    console.error('Lỗi khi xóa tin đăng:', err);
  }
  scrollToHeader();
};

  const resetForm = () => {
    setForm({
      title: '', description: '', price: '',
      location: '', category: '', user: userId || '', type: 'sale',vip: 'normal',
      propertyDetails: { bedrooms: '', bathrooms: '', areaSqFt: '' },
      images: [], videos: []
    });
    setExistingImages([]);
    setExistingVideos([]);
    setEditId(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
    if (videoInputRef.current) videoInputRef.current.value = null;
    scrollToHeader();
    navigate('/properties');
  };

  useEffect(() => {
    if (editParamId && properties.length > 0) {
      const prop = properties.find(p => p._id === editParamId);
      if (prop) handleEdit(prop);
    }
  }, [editParamId, properties, handleEdit]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {loading && <div className="fixed inset-0 bg-gray-200 bg-opacity-75 z-50"></div>}

      <div className="flex justify-between items-center mb-6" ref={headerRef}>
        <h2 className="text-2xl font-bold">Quản lý Tin đăng</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => {
            resetForm();
            setShowForm(true);
            navigate('?create');
            scrollToHeader();
          }}
        >
          + Thêm bài đăng mới
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="bg-white p-6 rounded shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" required className="w-full border p-2 rounded" />
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={(val) => setForm(prev => ({ ...prev, description: val }))}
              placeholder="Nhập mô tả chi tiết về bất động sản..."
              className="bg-white"
            />
            <input name="price" value={form.price} onChange={handleChange} placeholder="Giá (VNĐ)" type="number" className="w-full border p-2 rounded" />
            <select name="location" value={form.location} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">-- Địa điểm --</option>
              {locations.map(loc => (
                <option key={loc._id} value={loc._id}>{loc.city} - {loc.district}</option>
              ))}
            </select>
            <select name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">-- Danh mục --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select name="type" value={form.type} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="sale">Bán</option>
              <option value="rent">Cho thuê</option>
            </select>
            <input name="propertyDetails.bedrooms" value={form.propertyDetails.bedrooms} onChange={handleChange} placeholder="Số phòng ngủ" className="w-full border p-2 rounded" />
            <input name="propertyDetails.bathrooms" value={form.propertyDetails.bathrooms} onChange={handleChange} placeholder="Số phòng tắm" className="w-full border p-2 rounded" />
            <input name="propertyDetails.areaSqFt" value={form.propertyDetails.areaSqFt} onChange={handleChange} placeholder="Diện tích (m²)" className="w-full border p-2 rounded" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Ảnh đã chọn:</label>
              <input type="file" name="images" multiple accept="image/*" onChange={handleFileChange} ref={imageInputRef} className="w-full" />
              <div className="grid grid-cols-3 gap-2 mt-2">
                {form.images?.map((file, idx) => (
                  <img key={idx} src={URL.createObjectURL(file)} alt="preview" className="w-full h-32 object-cover rounded" />
                ))}
                {existingImages?.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt={`image-${idx}`} className="w-full h-32 object-cover rounded" />
                    <button type="button" onClick={() => handleDeleteImage(url)} className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded">X</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Video đã chọn:</label>
              <input type="file" name="videos" multiple accept="video/*" onChange={handleFileChange} ref={videoInputRef} className="w-full" />
              <div className="grid grid-cols-2 gap-2 mt-2">
                {form.videos?.map((file, idx) => (
                  <video key={idx} controls src={URL.createObjectURL(file)} className="w-full h-40 rounded" />
                ))}
                {existingVideos?.map((url, idx) => (
                  <div key={idx} className="relative">
                    <video controls src={url} className="w-full h-40 rounded" />
                    <button type="button" onClick={() => handleDeleteVideo(url)} className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded">X</button>
                  </div>
                ))}
              </div>
            </div>
            <label className="block font-medium mb-1">Loại VIP tin:</label>
            <select name="vip" value={form.vip} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="normal">Normal</option>
              <option value="copper">Copper</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">{editId ? 'Cập nhật' : 'Thêm mới'}</button>
              <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Danh sách Tin đăng của bạn</h3>
        <ul className="space-y-4">
          {properties.map(p => (
            <li key={p._id} className="flex justify-between items-center border p-4 rounded hover:bg-gray-50">
              <div>
                <p className="font-semibold">{p.title} ({p.type}) - {p.price.toLocaleString()} VND</p>
                <p className="text-sm text-gray-600">{p.propertyDetails?.areaSqFt} m² - {p.propertyDetails?.bedrooms} phòng ngủ</p>
              </div>
              <div className="flex gap-2">
                <img src="../img/edit.png" alt="Edit" width={25} height={25} onClick={() => handleEdit(p)} className="cursor-pointer" />
                <img src="../img/delete.png" alt="Delete" width={25} height={25} onClick={() => handleDelete(p._id,p.title)} className="cursor-pointer" />
                <img src="../img/detail.png" alt="View" width={25} height={25} onClick={() => window.open(`/properties/detail/${p._id}`, '_blank')} className="cursor-pointer" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyPage;
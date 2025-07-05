import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = `/api/plans`;

const PlanManager = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    salePrice: '',
    duration: '',
    maxProperties: '',
    vipGold: '',
    vipSilver: '',
    regularPosts: '',
    pushPosts: '',
    utilities: {
      schedulePost: false,
      performanceReport: false
    }
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(API);
      setPlans(res.data);
    } catch (err) {
      toast.error('Lỗi khi tải danh sách gói!');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('utilities.')) {
      const key = name.split('.')[1];
      setForm(prev => ({
        ...prev,
        utilities: {
          ...prev.utilities,
          [key]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, form);
        toast.success('Gói đã được cập nhật!');
      } else {
        await axios.post(API, form);
        toast.success('Gói mới đã được tạo!');
      }
      resetForm();
      fetchPlans();
    } catch (err) {
      const msg = err.response?.data?.message || 'Lỗi khi lưu gói!';
      toast.error(`${msg}`);
    }
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      price: plan.price || '',
      salePrice: plan.salePrice || '',
      duration: plan.duration || '',
      maxProperties: plan.maxProperties || '',
      vipGold: plan.vipGold || '',
      vipSilver: plan.vipSilver || '',
      regularPosts: plan.regularPosts || '',
      pushPosts: plan.pushPosts || '',
      utilities: {
        schedulePost: plan.utilities?.schedulePost || false,
        performanceReport: plan.utilities?.performanceReport || false
      }
    });
    setEditId(plan._id);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá "${title}"?`)) {
      try {
        await axios.delete(`${API}/${id}`);
        toast.success('Gói đã được xoá');
        fetchPlans();
      } catch (err) {
        toast.error('Lỗi khi xoá!');
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      salePrice: '',
      duration: '',
      maxProperties: '',
      vipGold: '',
      vipSilver: '',
      regularPosts: '',
      pushPosts: '',
      utilities: {
        schedulePost: false,
        performanceReport: false
      }
    });
    setEditId(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-white shadow rounded-xl">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Quản lý gói dịch vụ</h2>
      <ToastContainer theme="colored" />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <input className="border border-gray-300 p-3 rounded-lg" type="text" name="name" placeholder="Tên gói" value={form.name} onChange={handleChange} required />
        <div className="md:col-span-2">
          <ReactQuill className="md:col-span-2 bg-white" value={form.description} onChange={(val) => setForm(prev => ({ ...prev, description: val }))} />
        </div>
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="price" placeholder="Giá (VNĐ)" value={form.price} onChange={handleChange} required />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="salePrice" placeholder="% Giảm giá" value={form.salePrice} onChange={handleChange} />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="duration" placeholder="Thời hạn (ngày)" value={form.duration} onChange={handleChange} required />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="maxProperties" placeholder="Số tin tối đa" value={form.maxProperties} onChange={handleChange} required />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="vipGold" placeholder="Số tin VIP Gold" value={form.vipGold} onChange={handleChange} />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="vipSilver" placeholder="Số tin VIP Silver" value={form.vipSilver} onChange={handleChange} />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="regularPosts" placeholder="Số tin thường" value={form.regularPosts} onChange={handleChange} />
        <input className="border border-gray-300 p-3 rounded-lg" type="number" name="pushPosts" placeholder="Số lượt đẩy tin thường" value={form.pushPosts} onChange={handleChange} />

        <div className="flex items-center gap-3">
          <input type="checkbox" name="utilities.schedulePost" checked={form.utilities.schedulePost} onChange={handleChange} />
          <label className="text-gray-700">Đặt lịch đăng</label>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="utilities.performanceReport" checked={form.utilities.performanceReport} onChange={handleChange} />
          <label className="text-gray-700">Báo cáo hiệu suất</label>
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">{editId ? 'Cập nhật' : 'Tạo mới'}</button>
          {editId && <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium">Huỷ</button>}
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2">Tên</th>
              <th className="border px-4 py-2">Mô tả</th>
              <th className="border px-4 py-2">Giá</th>
              <th className="border px-4 py-2">Giảm</th>
              <th className="border px-4 py-2">Thời hạn</th>
              <th className="border px-4 py-2">Số tin</th>
              <th className="border px-4 py-2">VIP Gold</th>
              <th className="border px-4 py-2">VIP Silver</th>
              <th className="border px-4 py-2">Thường</th>
              <th className="border px-4 py-2">Lịch</th>
              <th className="border px-4 py-2">Báo cáo</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2 font-medium text-gray-800">{plan.name}</td>
                <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: plan.description }} />
                <td className="border px-4 py-2">{plan.price}</td>
                <td className="border px-4 py-2">{plan.salePrice}%</td>
                <td className="border px-4 py-2">{plan.duration} ngày</td>
                <td className="border px-4 py-2">{plan.maxProperties}</td>
                <td className="border px-4 py-2">{plan.vipGold}</td>
                <td className="border px-4 py-2">{plan.vipSilver}</td>
                <td className="border px-4 py-2">{plan.regularPosts}</td>
                <td className="border px-4 py-2">{plan.utilities?.schedulePost ? '✅' : '❌'}</td>
                <td className="border px-4 py-2">{plan.utilities?.performanceReport ? '✅' : '❌'}</td>
                <td className="border px-4 py-2 whitespace-nowrap">
                  <button onClick={() => handleEdit(plan)} className="text-blue-600 hover:underline mr-2">✏️</button>
                  <button onClick={() => handleDelete(plan._id, plan.name)} className="text-red-600 hover:underline">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanManager;
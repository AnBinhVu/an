import { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/properties`);
      setProperties(Array.isArray(res.data) ? res.data : []); // ✅ Kiểm tra là mảng
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bất động sản:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">DANH SÁCH CÁC BẤT ĐỘNG SẢN NỔI BẬT</h2>

      {loading ? (
        <div className="text-center text-gray-500">Đang tải dữ liệu bất động sản...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, index) => {
            const { city, district, commune } = property.location || {};
            const imageUrl = property.images?.[0]?.url || '/img/phieuluu.jpg';

            return (
              <div
                key={property._id || index}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
              >
                <a
                  href={`/properties/detail/${property._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={imageUrl}
                    alt={property.title || 'Ảnh bất động sản'}
                    onError={(e) => { e.target.src = '/img/phieuluu.jpg'; }}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <p className="text-red-500 font-bold mb-1">
                      {property.price?.toLocaleString('vi-VN') || 0} VND
                    </p>
                    <p className="text-sm text-gray-600">
                      Địa chỉ: {city || 'Chưa có thành phố'}, {district || 'Chưa có quận'}, {commune || 'Chưa có xã'}
                    </p>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturedListings;

import React, { useState, useEffect } from 'react';

const FeaturedListings = () => {
  // Khai báo state để lưu danh sách bất động sản
  const [properties, setProperties] = useState([]);

  // Hàm fetch dữ liệu từ API
  const fetchProperties = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/properties`);
      const data = await response.json(); 
      setProperties(data); 
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bất động sản:', error);
    }
  };

  // Sử dụng useEffect để gọi fetch khi component render
  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div style={{ marginBottom: '30px', textAlign: 'center' }}>
      <h2>DANH SÁCH CÁC BẤT ĐỘNG SẢN NỔI BẬT</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {properties.length > 0 ? (
          properties.map((property, index) => {
            // Lấy thông tin địa chỉ từ property
            const { city, district, commune } = property.location || {};

            return (
              <div
                key={index}
                style={{ width: '30%', border: '1px solid #ddd', padding: '10px' }}
              >
                <img
                  src={`${process.env.REACT_APP_API_URL}${property.images[0] || '../img/phieuluu.jpg'}`}
                  alt={property.title}
                  style={{ width: '100%' }}
                />
                <h3>{property.title}</h3>
                <p>{property.price} VND</p>
                <p>
                  Địa chỉ: {city || 'Chưa có thành phố'}, {district || 'Chưa có quận'}, {commune || 'Chưa có xã'}
                </p>
              </div>
            );
          })
        ) : (
          <p>Đang tải dữ liệu bất động sản...</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedListings;

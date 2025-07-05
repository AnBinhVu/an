import React, { useState } from 'react';
import './SearchBar.css'; // Import file CSS cho SearchBar

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = () => {
    console.log("Tìm kiếm với các tiêu chí:", { keyword, propertyType, location, price });
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Từ khóa" 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
          className="search-input"
        />
        <select 
          value={propertyType} 
          onChange={(e) => setPropertyType(e.target.value)} 
          className="search-select"
        >
          <option value="">Loại bất động sản</option>
          <option value="house">Nhà ở</option>
          <option value="apartment">Căn hộ</option>
          <option value="land">Đất nền</option>
        </select>
        <select 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          className="search-select"
        >
          <option value="">Vị trí</option>
          <option value="district1">Quận 1</option>
          <option value="district2">Quận 2</option>
          <option value="district3">Quận 3</option>
        </select>
        <select 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          className="search-select"
        >
          <option value="">Giá</option>
          <option value="under_1billion">Dưới 1 tỷ</option>
          <option value="1to3billion">1 - 3 tỷ</option>
          <option value="above_3billion">Trên 3 tỷ</option>
        </select>
        <button onClick={handleSearch} className="search-button">TÌM KIẾM</button>
      </div>
    </div>
  );
};

export default SearchBar;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
const PropertyDetail = () => {
  const { id } = useParams(); // lấy id từ URL
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch(`${API_URL}/api/properties/detail/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProperty(data);
      } catch {
        setProperty(null);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!property) return <div>Không tìm thấy tin đăng!</div>;

  const fullImg = (url) =>
    url.startsWith("/uploads") ? `${API_URL}${url}` : url;

  return (
    <div className="property-detail">
      <h2>{property.title}</h2>
      <div>
        <b>Giá:</b> {property.price?.toLocaleString()} VNĐ
      </div>
      <div>
        <b>Địa điểm:</b> {property.location?.city} - {property.location?.district}
      </div>
      <div>
        <b>Danh mục:</b> {property.category?.name}
      </div>
      <div>
        <b>Người đăng:</b> {property.user?.email}
      </div>
      <div>
        <b>Mô tả:</b>
        <div>{property.description}</div>
      </div>
      <div>
        <b>Loại:</b> {property.type === "sale" ? "Bán" : "Cho thuê"}
      </div>
      <div>
        <b>Chi tiết:</b>
        <ul>
          <li>Phòng ngủ: {property.propertyDetails?.bedrooms}</li>
          <li>Phòng tắm: {property.propertyDetails?.bathrooms}</li>
          <li>Diện tích: {property.propertyDetails?.areaSqFt} m²</li>
          <li>
            Tiện ích:{" "}
            {property.propertyDetails?.amenities?.join(", ") || "Không có"}
          </li>
        </ul>
      </div>
      <div>
        <b>Ảnh:</b>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {property.images?.map((img, idx) => (
            <img
              key={idx}
              src={fullImg(img)}
              alt="Hình ảnh"
              style={{ maxWidth: 180, borderRadius: 8 }}
            />
          ))}
        </div>
      </div>
      <div>
        <b>Video:</b>
        <div>
          {property.videos?.map((vid, idx) => (
            <video key={idx} src={fullImg(vid)} controls width={360} />
          ))}
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <Link to="/properties">← Quay lại danh sách</Link>
      </div>
    </div>
  );
};

export default PropertyDetail;

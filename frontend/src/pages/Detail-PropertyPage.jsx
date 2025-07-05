import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ThumbnailCarousel from "../components/Property-detail-compose";

const API_URL = process.env.REACT_APP_API_URL;

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 

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

  if (loading)
    return <div className="text-center text-gray-500 mt-10">Đang tải...</div>;
  if (!property)
    return <div className="text-center text-red-500 mt-10">Không tìm thấy tin đăng!</div>;

  const images = property.images || [];
  const videos = property.videos || [];
  const media = [
    ...images.map((img) => ({ url: img.url })),
    ...videos.map((vid) => ({ url: vid.url, isVideo: true })),
  ];
  const currentMedia = media[currentIndex];

  const next = () => setCurrentIndex((currentIndex + 1) % media.length);
  const prev = () => setCurrentIndex((currentIndex - 1 + media.length) % media.length);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-white shadow rounded-lg">
      {/* MEDIA SECTION */}
      <div className="mb-6">
        <div className="relative w-full mb-4">
          <button
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            ▶
          </button>

          {/* Click vào ảnh mở modal */}
          <div
            className="cursor-zoom-in"
            onClick={() => setIsModalOpen(true)}
          >
            {currentMedia?.isVideo ? (
              <video
                src={currentMedia.url}
                controls
                className="w-full h-[400px] object-contain rounded shadow"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt="media"
                className="w-full h-[400px] object-contain rounded shadow"
              />
            )}
          </div>
        </div>

        <ThumbnailCarousel
          media={media}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="max-w-5xl w-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentMedia?.isVideo ? (
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="w-full h-auto max-h-[90vh] object-contain rounded"
              />
            ) : (
              <img
                src={currentMedia.url}
                alt="zoomed"
                className="w-full h-auto max-h-[90vh] object-contain rounded"
              />
            )}
            <div className="text-center mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-white px-4 py-2 rounded shadow hover:bg-gray-200"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THÔNG TIN CHÍNH */}
      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
        <div className="text-xl text-blue-600 font-semibold">
          {property.price?.toLocaleString()} VNĐ
        </div>
        <div className="text-gray-700">Diện tích: <b>{property.propertyDetails?.areaSqFt}</b> m²</div>
        <div className="text-gray-700">Địa chỉ: {property.location?.city} - {property.location?.district}</div>
        <div className="text-gray-700">Danh mục: {property.category?.name}</div>
        <div className="text-gray-700">Loại: {property.type === 'sale' ? 'Bán' : 'Cho thuê'}</div>
      </div>

      {/* MÔ TẢ */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Mô tả chi tiết</h2>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: property.description }} />
      </div>

      {/* THÔNG TIN CHI TIẾT */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Thông tin chi tiết</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>Phòng ngủ: {property.propertyDetails?.bedrooms}</li>
          <li>Phòng tắm: {property.propertyDetails?.bathrooms}</li>
          <li>Tiện ích: {property.propertyDetails?.amenities?.join(', ') || 'Không có'}</li>
        </ul>
      </div>

      {/* BẢN ĐỒ */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Bản đồ</h2>
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(
            property.location?.city + ' ' + property.location?.district
          )}&output=embed`}
          width="100%"
          height="300"
          className="rounded shadow"
          allowFullScreen
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>

      {/* LIÊN HỆ */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Liên hệ</h2>
        <p className="text-gray-700 mb-4">
          <b>Email:</b> {property.user?.email}
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Gọi ngay
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Chat
          </button>
        </div>
      </div>

      {/* GỢI Ý */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Gợi ý tin liên quan</h2>
        <p className="text-gray-500">Đang cập nhật...</p>
      </div>
      <div className="mt-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  );
};

export default PropertyDetail;

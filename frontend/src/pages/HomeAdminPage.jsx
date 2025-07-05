import '../styles/HomeAdminPage.css';

const HomeAdminPage = () => {
  return (
    <div className="admin-dashboard">
      <h1>📊 Trang quản trị</h1>
      <p>Chào mừng đến với trang quản lý của admin!</p>
      <div className="admin-cards">
        <div className="card">👥 Tổng người dùng: 120</div>
        <div className="card">📦 Tổng sản phẩm: 85</div>
        <div className="card">🧾 Đơn hàng hôm nay: 12</div>
        <div className="card">📢 Thông báo mới: 3</div>
      </div>
    </div>
  );
};

export default HomeAdminPage;

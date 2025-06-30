backend/
├── controllers/   # Chứa các hàm xử lý logic cho từng route (API)
├── models/        # Chứa các schema MongoDB sử dụng Mongoose
├── routes/        # Khai báo các endpoint, liên kết tới controller
├── middleware/    # Middleware trung gian: xác thực, phân quyền, xử lý lỗi
├── services/      # Chứa logic nghiệp vụ phức tạp hoặc tích hợp bên ngoài (OAuth, AI, API)
├── utils/         # Các hàm tiện ích dùng lại nhiều nơi (mã hóa, token, validate, upload ảnh)
├── server.js      # File khởi tạo server Express, middleware, route, connect MongoDB
frontend/
├── components/   # Các UI component tái sử dụng (Button, Navbar, Card, Modal...)
├── hooks/        # Các custom React hook (useAuth, useDebounce, useForm...)
├── pages/        # Mỗi trang (route) lớn trong ứng dụng (HomePage, LoginPage, PropertyDetailPage)
├── public/       # Chứa file index.html, favicon và các file tĩnh khác
├── services/     # Các hàm gọi API backend (axios) như authService, propertyService
├── App.js        # Component chính của ứng dụng — định tuyến, layout tổng
├── index.js      # Điểm khởi chạy — render App.js vào #root của index.html
├── .env           # Biến môi trường: MONGO_URI, JWT_SECRET, API_KEY, v.v.
└── package.json   # Khai báo thư viện, script (start, dev, build)

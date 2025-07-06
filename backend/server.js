const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./services/db');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const sessionRoutes = require('./middleware/authMiddleware');
const planRoutes = require('./routes/planRoutes');
const vnpayRoutes = require("./routes/vnpayRoutes");
const path = require('path');

dotenv.config();
const app = express();

// Kết nối database
connectDB();

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

// CORS cấu hình cho frontend ở Azure
app.use(cors({
  origin: process.env.REACT_APP_API_URL?.replace('/api', ''), // lấy gốc URL của frontend
  credentials: true
}));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    maxAge: 600000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production' // dùng cookie secure nếu chạy production
  }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payment', vnpayRoutes);

// Serve React frontend (build từ frontend/build)
const frontendPath = path.join(__dirname, '/frontend');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Server listen
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

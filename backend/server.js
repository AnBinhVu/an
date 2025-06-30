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
const path = require('path');
const notificationRoutes = require('./routes/notificationRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
dotenv.config();
const app = express();

connectDB(); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, maxAge: 600000 }
}));

// api cho đăng ký
app.use('/api/auth', authRoutes);

//api cho danh mục
app.use('/api/categories', categoryRoutes);

//api cho địa điểm
app.use('/api/locations', locationRoutes);

//api cho bất động sản
app.use('/api/properties', propertyRoutes);

// api cho thông báo
app.use('/api/notifications', notificationRoutes);

//api cho user
app.use('/api/users', userRoutes);

//api cho thanh toán
app.use('/api/checkout', paymentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

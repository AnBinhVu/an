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
const sessionRoutes = require('./middleware/authMiddleware');
const planRoutes = require('./routes/planRoutes');
const vnpayRoutes = require("./routes/vnpayRoutes");
const fs = require('fs');

dotenv.config();

if (!process.env.SESSION_SECRET || !process.env.MONGO_URI) {
  console.error('❌ SESSION_SECRET or MONGO_URI is not set in .env');
  process.exit(1);
}

const app = express();
connectDB();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, maxAge: 600000 }
}));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/payment', vnpayRoutes);

// Serve frontend from /public
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  console.warn('⚠️ Warning: Public folder does not exist. Skipping static file serving.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

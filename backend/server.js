const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session'); // ADD THIS
require('dotenv').config(); // MOVE THIS TO TOP

const passport = require('passport');
require('./config/passport'); // Now env vars are loaded

const app = express();
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const slidesRoutes = require('./routes/slideRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production if using https
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', slidesRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
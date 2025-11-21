const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes'); // optional, agar chahiye toh

const app = express();

// CORS
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://whatsappmeta.vercel.app',
    ],
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'WhatsApp Meta Backend API - Running!' });
});

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong on the server!',
  });
});

module.exports = app;
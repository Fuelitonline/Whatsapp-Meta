const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const templateRoutes = require('./routes/templateRoutes');
const messageRoutes = require('./routes/messageRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/messages', messageRoutes);
app.use('/webhook', webhookRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running 🚀',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

module.exports = app;
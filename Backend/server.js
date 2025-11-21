// server.js
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// Required Environment Variables
const requiredEnvs = [
  'MONGODB_URI',
  'JWT_SECRET',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'WHATSAPP_API_VERSION',
  'CLIENT_URL',
  'WHATSAPP_VERIFY_TOKEN'
];

requiredEnvs.forEach(env => {
  if (!process.env[env]) {
    console.error(`Missing required environment variable: ${env}`);
    process.exit(1);
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB Connected Successfully');

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const { startConsumer } = require('./kafka/consumers/message.consumer');
const cron = require('node-cron');
const Message = require('./model/Message/messageModel');
const { publishMessage } = require('./kafka/producers/message.producer');
const User = require('./model/Auth/userModel');

dotenv.config();

// Validate environment variables
const requiredEnvs = [
  'MONGODB_URI',
  'KAFKA_BROKER',
  'JWT_SECRET',
  'WHATSAPP_VERIFY_TOKEN',
  'WHATSAPP_API_VERSION',
  'CLIENT_URL',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET'
];

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    console.error(`Missing required env: ${env}`);
    process.exit(1);
  }
}

// Apply CORS middleware to Express app
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'https://d6ed817b9935.ngrok-free.app',
      'https://whatsappmeta.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Health Check Route - To check if backend is LIVE
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend is LIVE and running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const activeConnections = {};

async function startServer() {
  try {
    await connectDB();
    await Message.createIndexes({ status: 1, scheduledTime: 1 });
    console.log('MongoDB indexes created');

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: [
          process.env.CLIENT_URL,
          'http://localhost:5173',
          'https://d6ed817b9935.ngrok-free.app',
          'https://whatsappmeta.vercel.app'
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      socket.on('authenticate', (userId) => {
        activeConnections[userId] = activeConnections[userId] || [];
        activeConnections[userId].push(socket.id);
        console.log(`User ${userId} authenticated`);
        socket.join(`webhook_${userId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        Object.keys(activeConnections).forEach((userId) => {
          activeConnections[userId] = activeConnections[userId].filter((id) => id !== socket.id);
          if (!activeConnections[userId].length) delete activeConnections[userId];
        });
      });
    });

    app.set('io', io);
    app.set('activeConnections', activeConnections);

    await startConsumer(app);

    const BATCH_SIZE = 100;
    cron.schedule('*/5 * * * *', async () => {
      try {
        const startTime = Date.now();
        console.log('Starting cron job for scheduled messages');
        const now = new Date();
        const messages = await Message.find({ status: 'SCHEDULED', scheduledTime: { $lte: now } })
          .limit(BATCH_SIZE)
          .lean();

        for (const msg of messages) {
          try {
            const user = await User.findById(msg.userId).lean();
            if (!user) {
              console.error(`User not found for message ${msg._id}`);
              continue;
            }

            await publishMessage({
              messageId: msg._id,
              recipients: msg.recipients,
              type: msg.type,
              content: msg.content,
              user: {
                _id: user._id,
                waPhoneNumberId: user.waPhoneNumberId,
                waAccessToken: user.waAccessToken,
              },
            });

            await Message.findByIdAndUpdate(msg._id, { status: 'SENT' });
            console.log(`Processed message ${msg._id}`);
          } catch (err) {
            console.error(`Error processing message ${msg._id}:`, err.message);
          }
        }

        console.log(`Cron job completed in ${Date.now() - startTime}ms, processed ${messages.length} messages`);
      } catch (err) {
        console.error('Cron job error:', err.message);
      }
    });

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();

// Custom 404 handler
app.use((req, res, next) => {
  res.status(404).send('Custom 404 - Page Not Found');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong on the server. Please try again later!');
});
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const messageRoutes = require('./routes/messageRoutes');
const { initializeWebSocket } = require('./websocket/socketHandler');
const { connectKafka } = require('./kafka/kafkaClient');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'message-service' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zalo_messages', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Initialize WebSocket
initializeWebSocket(io);

// Initialize Kafka
connectKafka().catch(console.error);

const PORT = process.env.PORT || 8083;

server.listen(PORT, () => {
  console.log(`🚀 Message Service running on port ${PORT}`);
});

module.exports = { app, io };

import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { arcjetMiddleware } from './middleware/arcjet.js';

import userRoute from './routes/user.js';
import authRoute from './routes/auth.js';
import productRoute from './routes/product.js';
import cartRoute from './routes/cart.js';
import orderRoute from './routes/order.js';
import razorpayRoute from './routes/razorpay.js';
import notificationRoute from './routes/notification.js';
import messageRoute from './routes/message.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      'https://farm2retail.vercel.app',
      'https://farm2retail-admin-panel.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

app.set('io', io);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", 'ws:', 'wss:'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Middleware
app.use(
  cors({
    origin: [
      'https://farm2retail.vercel.app',
      'https://farm2retail-admin-panel.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  }),
);

app.use(express.json());

app.use(arcjetMiddleware);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payment', razorpayRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/messages', messageRoute);

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on('user:join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.broadcast.emit('user:online', { userId });
    console.log(`👤 User ${userId} joined (${socket.id})`);
  });

  socket.on('order:created', (orderData) => {
    io.emit('notification:newOrder', {
      type: 'NEW_ORDER',
      message: `New order #${orderData.orderId} received`,
      data: orderData,
      timestamp: new Date(),
    });
  });

  socket.on('product:updated', (productData) => {
    io.emit('notification:productUpdate', {
      type: 'PRODUCT_UPDATE',
      message: `Product "${productData.title}" updated`,
      data: productData,
      timestamp: new Date(),
    });
  });

  socket.on('price:changed', (priceData) => {
    io.emit('notification:priceChange', {
      type: 'PRICE_CHANGE',
      message: `Price updated for ${priceData.productTitle}`,
      data: priceData,
      timestamp: new Date(),
    });
  });

  socket.on('chat:sendMessage', (messageData) => {
    const { recipientId, message, senderId, senderName } = messageData;
    const recipientSocket = activeUsers.get(recipientId);

    if (recipientSocket) {
      io.to(recipientSocket).emit('chat:receiveMessage', {
        senderId,
        senderName,
        message,
        timestamp: new Date(),
      });
    }

    socket.emit('chat:messageSent', {
      success: true,
      recipientId,
      delivered: !!recipientSocket,
    });
  });

  socket.on('chat:typing', (data) => {
    const { recipientId, isTyping, senderName } = data;
    const recipientSocket = activeUsers.get(recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('chat:userTyping', {
        userId: socket.userId,
        senderName,
        isTyping,
      });
    }
  });

  socket.on('stock:update', (stockData) => {
    io.emit('notification:stockUpdate', {
      type: 'STOCK_UPDATE',
      message: `Stock updated for ${stockData.productTitle}`,
      data: stockData,
      timestamp: new Date(),
    });
  });

  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      socket.broadcast.emit('user:offline', { userId: socket.userId });
      console.log(`👋 User ${socket.userId} disconnected`);
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

app.get('/api/online-users', (req, res) => {
  res.json({
    count: activeUsers.size,
    users: Array.from(activeUsers.keys()),
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('🔌 WebSocket server ready');
  });
}

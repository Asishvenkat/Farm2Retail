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

app.set('trust proxy', 1);

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');

const allowedOrigins = Array.from(
  new Set(
    (process.env.CORS_ORIGINS || '')
      .split(',')
      .map(normalizeOrigin)
      .filter(Boolean),
  ),
);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  return allowedOrigins.includes(normalizeOrigin(origin));
};

const handleCorsOrigin = (label) => (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    return callback(null, true);
  }

  console.error(`${label} blocked: ${origin}`);
  callback(new Error(`Not allowed by ${label}`));
};

if (allowedOrigins.length === 0) {
  console.warn('No CORS_ORIGINS configured. Browser requests will be blocked.');
}

const io = new Server(server, {
  cors: {
    origin: handleCorsOrigin('Socket.io CORS'),
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
        scriptSrc: ["'self'", 'https://*.vercel.app'],
        connectSrc: ["'self'", 'ws:', 'wss:', 'https://*.vercel.app'],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// Middleware
app.use(
  cors({
    origin: handleCorsOrigin('CORS'),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
  }),
);

app.use(express.json());

app.use(arcjetMiddleware);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('[MongoDB] Connected'))
  .catch((err) => console.error('[MongoDB] Connection error:', err));

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
  console.log(`[Socket] User connected: ${socket.id}`);

  socket.on('user:join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    socket.join(String(userId));
    socket.broadcast.emit('user:online', { userId });
    console.log(`[Socket] User ${userId} joined (${socket.id})`);
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
      console.log(`[Socket] User ${socket.userId} disconnected`);
    }
    console.log(`[Socket] Disconnected: ${socket.id}`);
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
    console.log(`[Server] Running on port ${PORT}`);
    console.log('[Socket] WebSocket server ready');
  });
}

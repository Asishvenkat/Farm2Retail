const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config(); 

const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');
const razorpayRoute = require('./routes/razorpay');
const notificationRoute = require('./routes/notification');
const messageRoute = require('./routes/message'); 

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "https://farm2retail.vercel.app",
      "https://farm2retail-admin-panel.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible to routes
app.set('io', io);

// Express CORS
app.use(cors({
  origin: [
    "https://farm2retail.vercel.app",
    "https://farm2retail-admin-panel.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));



mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/payment", razorpayRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/messages", messageRoute); 

// Socket.io connection handling
const activeUsers = new Map(); // Store active users: userId -> socketId

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins with their ID
  socket.on('user:join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
    
    // Notify others about online status
    socket.broadcast.emit('user:online', { userId });
  });

  // Handle new order notification
  socket.on('order:created', (orderData) => {
    // Notify all admins about new order
    io.emit('notification:newOrder', {
      type: 'NEW_ORDER',
      message: `New order #${orderData.orderId} received`,
      data: orderData,
      timestamp: new Date()
    });
  });

  // Handle product updates
  socket.on('product:updated', (productData) => {
    // Broadcast to all users
    io.emit('notification:productUpdate', {
      type: 'PRODUCT_UPDATE',
      message: `Product "${productData.title}" has been updated`,
      data: productData,
      timestamp: new Date()
    });
  });

  // Handle price changes
  socket.on('price:changed', (priceData) => {
    io.emit('notification:priceChange', {
      type: 'PRICE_CHANGE',
      message: `Price updated for ${priceData.productTitle}`,
      data: priceData,
      timestamp: new Date()
    });
  });

  // Chat message handling
  socket.on('chat:sendMessage', (messageData) => {
    const { recipientId, message, senderId, senderName } = messageData;
    
    // Send to specific user if online
    const recipientSocket = activeUsers.get(recipientId);
    if (recipientSocket) {
      io.to(recipientSocket).emit('chat:receiveMessage', {
        senderId,
        senderName,
        message,
        timestamp: new Date()
      });
    }
    
    // Send confirmation to sender
    socket.emit('chat:messageSent', {
      success: true,
      recipientId,
      delivered: !!recipientSocket
    });
  });

  // Typing indicator
  socket.on('chat:typing', (data) => {
    const { recipientId, isTyping, senderName } = data;
    const recipientSocket = activeUsers.get(recipientId);
    
    if (recipientSocket) {
      io.to(recipientSocket).emit('chat:userTyping', {
        userId: socket.userId,
        senderName,
        isTyping
      });
    }
  });

  // Stock update notification
  socket.on('stock:update', (stockData) => {
    io.emit('notification:stockUpdate', {
      type: 'STOCK_UPDATE',
      message: `Stock updated for ${stockData.productTitle}`,
      data: stockData,
      timestamp: new Date()
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeUsers.delete(socket.userId);
      // Notify others about offline status
      socket.broadcast.emit('user:offline', { userId: socket.userId });
      console.log(`👋 User ${socket.userId} disconnected`);
    }
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Endpoint to get online users count
app.get('/api/online-users', (req, res) => {
  res.json({
    count: activeUsers.size,
    users: Array.from(activeUsers.keys())
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});

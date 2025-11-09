import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      if (userId) {
        this.socket.emit('user:join', userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Join with user ID
  joinUser(userId) {
    if (this.socket) {
      this.socket.emit('user:join', userId);
    }
  }

  // Emit events
  emitOrderCreated(orderData) {
    if (this.socket) {
      this.socket.emit('order:created', orderData);
    }
  }

  emitProductUpdated(productData) {
    if (this.socket) {
      this.socket.emit('product:updated', productData);
    }
  }

  emitPriceChanged(priceData) {
    if (this.socket) {
      this.socket.emit('price:changed', priceData);
    }
  }

  emitStockUpdate(stockData) {
    if (this.socket) {
      this.socket.emit('stock:update', stockData);
    }
  }

  // Chat functions
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('chat:sendMessage', messageData);
    }
  }

  sendTypingIndicator(data) {
    if (this.socket) {
      this.socket.emit('chat:typing', data);
    }
  }

  // Listen to events
  onNotification(callback) {
    if (this.socket) {
      this.socket.on('notification:newOrder', callback);
      this.socket.on('notification:productUpdate', callback);
      this.socket.on('notification:priceChange', callback);
      this.socket.on('notification:stockUpdate', callback);
      
      // Store callback for cleanup
      this.listeners.set('notifications', callback);
    }
  }

  onNewOrder(callback) {
    if (this.socket) {
      this.socket.on('notification:newOrder', callback);
      this.listeners.set('newOrder', callback);
    }
  }

  onProductUpdate(callback) {
    if (this.socket) {
      this.socket.on('notification:productUpdate', callback);
      this.listeners.set('productUpdate', callback);
    }
  }

  onPriceChange(callback) {
    if (this.socket) {
      this.socket.on('notification:priceChange', callback);
      this.listeners.set('priceChange', callback);
    }
  }

  onStockUpdate(callback) {
    if (this.socket) {
      this.socket.on('notification:stockUpdate', callback);
      this.listeners.set('stockUpdate', callback);
    }
  }

  onChatMessage(callback) {
    if (this.socket) {
      this.socket.on('chat:receiveMessage', callback);
      this.listeners.set('chatMessage', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('chat:messageSent', callback);
      this.listeners.set('messageSent', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('chat:userTyping', callback);
      this.listeners.set('userTyping', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user:online', callback);
      this.listeners.set('userOnline', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user:offline', callback);
      this.listeners.set('userOffline', callback);
    }
  }

  // Generic event listener methods
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      this.listeners.set(event, callback);
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Remove specific listener
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      const callback = this.listeners.get(event);
      this.socket.off(event, callback);
      this.listeners.delete(event);
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

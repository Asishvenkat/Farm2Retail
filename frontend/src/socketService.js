import { io } from 'socket.io-client';

const notificationEvents = [
  'notification',
  'notification:new',
  'notification:newOrder',
  'notification:productUpdate',
  'notification:priceChange',
  'notification:stockUpdate',
  'notification:newMessage',
];

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connectedUserId = null;
  }

  addListener(event, callback) {
    if (!this.socket || !callback) {
      return;
    }

    this.socket.on(event, callback);

    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);
  }

  removeListener(event, callback) {
    if (!this.socket || !this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);

    if (callback) {
      this.socket.off(event, callback);
      callbacks.delete(callback);
    } else {
      callbacks.forEach((registeredCallback) => {
        this.socket.off(event, registeredCallback);
      });
      callbacks.clear();
    }

    if (callbacks.size === 0) {
      this.listeners.delete(event);
    }
  }

  addListeners(events, callback) {
    events.forEach((event) => this.addListener(event, callback));
  }

  removeListeners(events, callback) {
    events.forEach((event) => this.removeListener(event, callback));
  }

  connect(userId) {
    if (!this.socket) {
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      this.socket.on('connect', () => {
        console.log('[Socket] Connected:', this.socket.id);
        if (this.connectedUserId) {
          this.joinUser(this.connectedUserId);
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('[Socket] Disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    if (userId) {
      this.connectedUserId = userId;
      if (this.socket.connected) {
        this.joinUser(userId);
      }
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.connectedUserId = null;
    }
  }

  joinUser(userId) {
    if (!userId) {
      return;
    }

    this.connectedUserId = userId;

    if (this.socket?.connected) {
      this.socket.emit('user:join', userId);
    }
  }

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

  onNotification(callback) {
    this.addListeners(notificationEvents, callback);
  }

  offNotification(callback) {
    this.removeListeners(notificationEvents, callback);
  }

  onNewOrder(callback) {
    this.addListener('notification:newOrder', callback);
  }

  onProductUpdate(callback) {
    this.addListener('notification:productUpdate', callback);
  }

  onPriceChange(callback) {
    this.addListener('notification:priceChange', callback);
  }

  onStockUpdate(callback) {
    this.addListener('notification:stockUpdate', callback);
  }

  onChatMessage(callback) {
    this.addListener('chat:receiveMessage', callback);
  }

  onMessageSent(callback) {
    this.addListener('chat:messageSent', callback);
  }

  onUserTyping(callback) {
    this.addListener('chat:userTyping', callback);
  }

  onUserOnline(callback) {
    this.addListener('user:online', callback);
  }

  onUserOffline(callback) {
    this.addListener('user:offline', callback);
  }

  on(event, callback) {
    this.addListener(event, callback);
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  off(event, callback) {
    this.removeListener(event, callback);
  }

  removeAllListeners() {
    if (!this.socket) {
      return;
    }

    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket.off(event, callback);
      });
    });

    this.listeners.clear();
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id;
  }
}

const socketService = new SocketService();
export default socketService;

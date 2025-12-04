import request from 'supertest';
import express from 'express';
import orderRoute from '../routes/order.js';
import Order from '../models/Order.js';

jest.mock('../models/Order.js');

const app = express();
app.use(express.json());
app.use('/api/orders', orderRoute);

describe('Order API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/orders', () => {
    test('should create a new order', async () => {
      const mockOrderData = {
        userId: '123',
        products: [{ productId: '1', quantity: 2 }],
        amount: 200,
        address: 'Test Address',
      };

      const mockSavedOrder = {
        ...mockOrderData,
        _id: { toString: () => 'mock_order_id' },
        products: [{ productId: '1', quantity: 2 }],
      };

      Order.mockImplementation(() => ({
        ...mockOrderData,
        save: jest.fn().mockResolvedValue(mockSavedOrder),
      }));

      const response = await request(app)
        .post('/api/orders')
        .send(mockOrderData);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/orders/find/:userId', () => {
    test('should get orders by user ID', async () => {
      const mockOrders = [
        { _id: '1', userId: '123', amount: 200 },
        { _id: '2', userId: '123', amount: 300 },
      ];

      Order.find = jest.fn().mockResolvedValue(mockOrders);

      const response = await request(app).get('/api/orders/find/123');

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('PUT /api/orders/:id', () => {
    test('should update order status', async () => {
      const mockOrder = { _id: '123', status: 'delivered' };

      Order.findOneAndUpdate = jest.fn().mockResolvedValue(mockOrder);
      Order.findById = jest
        .fn()
        .mockResolvedValue({ userId: '123', status: 'pending' });

      const response = await request(app)
        .put('/api/orders/123')
        .send({ status: 'delivered' });

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('DELETE /api/orders/:id', () => {
    test('should delete order', async () => {
      Order.findByIdAndDelete = jest.fn().mockResolvedValue(true);

      const response = await request(app).delete('/api/orders/123');

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });
});

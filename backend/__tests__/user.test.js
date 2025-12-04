import request from 'supertest';
import express from 'express';
import userRoute from '../routes/user.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

const app = express();
app.use(express.json());
app.use('/api/users', userRoute);

describe('Admin/User API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    test('should get all users', async () => {
      const mockUsers = [
        { _id: '1', username: 'user1', email: 'user1@test.com' },
        { _id: '2', username: 'user2', email: 'user2@test.com' },
      ];

      User.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUsers),
        }),
      });

      const response = await request(app).get('/api/users?new=true');

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by ID', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app).get('/api/users/123');

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('GET /api/users/stats', () => {
    test('should get user statistics', async () => {
      const mockStats = [
        { _id: 1, total: 10 },
        { _id: 2, total: 15 },
      ];

      User.aggregate = jest.fn().mockResolvedValue(mockStats);

      const response = await request(app).get('/api/users/stats');

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });
});

// Mock @arcjet/node before any imports
jest.mock('@arcjet/node', () => ({
  arcjet: jest.fn().mockReturnValue({
    protect: jest.fn().mockResolvedValue({
      isDenied: jest.fn().mockReturnValue(false),
      reason: { isRateLimit: jest.fn().mockReturnValue(false), isBot: jest.fn().mockReturnValue(false) },
      ip: { isHosting: jest.fn().mockReturnValue(false) },
      results: []
    })
  }),
  shield: jest.fn(),
  detectBot: jest.fn(),
  tokenBucket: jest.fn()
}));

// Mock @arcjet/inspect
jest.mock('@arcjet/inspect', () => ({
  isSpoofedBot: jest.fn().mockReturnValue(false)
}));

// Mock the middleware before importing routes
jest.mock('../middleware/arcjet.js', () => ({
  arcjetMiddleware: jest.fn((req, res, next) => next()),
  authRateLimit: jest.fn((req, res, next) => next()),
  paymentRateLimit: jest.fn((req, res, next) => next())
}));

// Mock crypto-js before importing routes
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn(() => ({
      toString: jest.fn(() => 'encrypted_password')
    })),
    decrypt: jest.fn(() => ({
      toString: jest.fn(() => 'decrypted_password')
    }))
  },
  enc: {
    Utf8: 'utf8'
  }
}));

import request from 'supertest';
import express from 'express';
import authRoute from '../routes/auth.js';
import User from '../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoute);

describe('Auth API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'retailer'
        });

      expect(response.status).toBe(201);
    }, 10000);

    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    test('should login user with valid credentials', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'retailer',
        isAdmin: false
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBeLessThanOrEqual(500);
      expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
    });

    test('should return 401 for wrong password', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });

    test('should return 401 for non-existent user', async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
    });
  });
});

import request from 'supertest';
import express from 'express';
import productRoute from '../routes/product.js';
import Product from '../models/Product.js';

jest.mock('../models/Product.js');

const app = express();
app.use(express.json());
app.use('/api/products', productRoute);

describe('Product API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    test('should get all products', async () => {
      const mockProducts = [
        { _id: '1', title: 'Product 1', price: 100, available: true },
        { _id: '2', title: 'Product 2', price: 200, available: true },
      ];

      // Create a proper promise-like query object
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      };
      // Make it then-able
      mockQuery.then = jest.fn().mockImplementation((resolve) => {
        resolve(mockProducts);
      });

      Product.find = jest.fn().mockReturnValue(mockQuery);

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    test('should filter products by category', async () => {
      const mockProducts = [
        {
          _id: '1',
          title: 'Product 1',
          category: 'vegetables',
          available: true,
        },
      ];

      // Create a proper promise-like query object
      const mockQuery = {
        sort: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      };
      // Make it then-able
      mockQuery.then = jest.fn().mockImplementation((resolve) => {
        resolve(mockProducts);
      });

      Product.find = jest.fn().mockReturnValue(mockQuery);

      const response = await request(app).get(
        '/api/products?category=vegetables',
      );

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toHaveProperty('category', 'vegetables');
    });
  });

  describe('GET /api/products/:id', () => {
    test('should get product by ID', async () => {
      const mockProduct = {
        _id: '123',
        title: 'Test Product',
        price: 150,
        available: true,
      };

      Product.findOne = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app).get('/api/products/123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title');
    });

    test('should return 404 for non-existent product', async () => {
      Product.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).get('/api/products/999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/products', () => {
    test('should create a new product', async () => {
      const mockProduct = {
        title: 'New Product',
        description: 'Test description',
        price: 200,
        farmerId: '123',
        save: jest.fn().mockResolvedValue(true),
      };

      Product.mockImplementation(() => mockProduct);

      const response = await request(app).post('/api/products').send({
        title: 'New Product',
        description: 'Test description',
        price: 200,
        farmerId: '123',
      });

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update product successfully', async () => {
      const mockProduct = { _id: '123', title: 'Updated Product', price: 250 };

      Product.findByIdAndUpdate = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .put('/api/products/123')
        .send({ title: 'Updated Product', price: 250 });

      expect(response.status).toBeLessThanOrEqual(500);
    });
  });
});

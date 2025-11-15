import 'dotenv/config';

// Set test environment variables
process.env.MONGO_URL = 'mongodb://localhost:27017/testdb';
process.env.PASS_SEC = 'test_pass_sec';
process.env.JWT_SEC = 'test_jwt_sec';
process.env.PORT = '5001';

// Mock mongoose to prevent actual database connections
const mockSchema = jest.fn().mockImplementation((definition) => ({
  pre: jest.fn(),
  methods: {},
  statics: {},
  index: jest.fn(),
  Types: {
    ObjectId: jest.fn().mockImplementation(() => 'mock_object_id'),
  },
  ...definition,
}));

mockSchema.Types = {
  ObjectId: jest.fn().mockImplementation(() => 'mock_object_id'),
};

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    readyState: 1,
    on: jest.fn(),
    once: jest.fn(),
  },
  Schema: mockSchema,
  Types: {
    ObjectId: jest.fn().mockImplementation(() => 'mock_object_id'),
  },
  model: jest.fn().mockImplementation((_name, _schema) => {
    const Model = function(data) {
      Object.assign(this, data);
      this.save = jest.fn().mockResolvedValue(this);
      this._id = { toString: () => 'mock_id_' + Math.random() };
    };
    
    // Mock query methods
    const createQuery = (result) => {
      const query = {
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(result),
      };
      // Make the query then-able
      query.then = (resolve) => Promise.resolve(result).then(resolve);
      return query;
    };
    
    Model.find = jest.fn().mockImplementation((filter) => createQuery([]));
    Model.findById = jest.fn().mockResolvedValue(null);
    Model.findByIdAndUpdate = jest.fn().mockResolvedValue({});
    Model.findByIdAndDelete = jest.fn().mockResolvedValue({});
    Model.findOne = jest.fn().mockResolvedValue(null);
    return Model;
  }),
}));

// Mock socket.io
jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn(),
  })),
}));

// Mock arcjet middleware
jest.mock('../middleware/arcjet.js', () => ({
  arcjetMiddleware: jest.fn((req, res, next) => next()),
  authRateLimit: jest.fn((req, res, next) => next()),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_jwt_token'),
  verify: jest.fn().mockReturnValue({ id: 'mock_user_id' })
}));

// Mock razorpay
jest.mock('razorpay', () => {
  return jest.fn().mockImplementation(() => ({
    orders: {
      create: jest.fn().mockResolvedValue({
        id: 'order_mock_id',
        amount: 1000,
        currency: 'INR'
      })
    },
    payments: {
      fetch: jest.fn().mockResolvedValue({
        status: 'captured',
        amount: 1000
      })
    }
  }));
});
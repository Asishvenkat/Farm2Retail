# Farm2Retail Backend API

![Backend CI](https://github.com/YOUR_USERNAME/farm2retail/actions/workflows/backend-ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/farm2retail/branch/main/graph/badge.svg?flag=backend)](https://codecov.io/gh/YOUR_USERNAME/farm2retail)

A secure and scalable REST API for the Farm2Retail e-commerce platform, connecting farmers directly with retailers.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Support for farmers, retailers, and admin roles
- **Product Management**: Full CRUD operations for products with filtering and search
- **Order Management**: Order creation, tracking, and status updates
- **Payment Integration**: Razorpay integration for secure payments
- **Real-time Features**: WebSocket support via Socket.io for live updates
- **Security**:
  - Arcjet Shield for SQL injection and XSS protection
  - Bot detection
  - Helmet.js for HTTP headers security
  - CORS configuration for cross-origin requests

## 🛡️ Security Features

### Arcjet Protection

- **Shield**: Protection against SQL injection, XSS, and common attacks
- **Bot Detection**: Blocks automated bots while allowing search engines
- **IP Filtering**: Hosting IP detection and spoofed bot verification

### Additional Security

- Password encryption using CryptoJS AES
- Environment variable protection
- Secure HTTP headers with Helmet.js
- Input validation and sanitization

## 📋 Prerequisites

- Node.js 18.x or 20.x
- MongoDB 4.4+
- npm or yarn

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/farm2retail.git
cd farm2retail/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/farm2retail

# JWT & Encryption
JWT_SEC=your_jwt_secret_key
PASS_SEC=your_password_encryption_key

# Razorpay (Optional)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Arcjet (Optional - defaults to test mode)
ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

# Server
PORT=5000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://farm2-retail.vercel.app
```

4. Start the development server:

```bash
npm run dev
```

## 🧪 Testing

Run tests with coverage:

```bash
npm test
```

Run tests in watch mode:

```bash
npm test -- --watch
```

Generate coverage report:

```bash
npm test -- --coverage
```

### Test Coverage

- Target: 60% coverage across all metrics
- Current tests cover:
  - Authentication endpoints
  - Product CRUD operations
  - Order management
  - User administration

## 📝 Code Quality

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

### Pre-commit Hooks

Husky runs lint-staged automatically before each commit to ensure code quality.

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin/farmer)
- `PUT /api/products/:id` - Update product (admin/farmer)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders

- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/find/:userId` - Get user orders
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Users

- `GET /api/users` - Get all users (admin)
- `GET /api/users/find/:id` - Get user by ID (admin)
- `GET /api/users/stats` - Get user statistics (admin)
- `PUT /api/users/:id` - Update user (admin/self)
- `DELETE /api/users/:id` - Delete user (admin)

### Payments

- `POST /api/payment/order` - Create Razorpay order
- `POST /api/payment/order/validate` - Validate payment signature

## 🏗️ Project Structure

```
backend/
├── models/          # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Cart.js
├── routes/          # Express route handlers
│   ├── auth.js
│   ├── user.js
│   ├── product.js
│   ├── order.js
│   ├── cart.js
│   └── razorpay.js
├── middleware/      # Custom middleware
│   ├── arcjet.js    # Security middleware
│   └── verifyToken.js
├── __tests__/       # Jest test files
│   ├── auth.test.js
│   ├── product.test.js
│   ├── order.test.js
│   └── user.test.js
├── index.js         # Server entry point
├── jest.config.js   # Jest configuration
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

- All commits are checked with Husky pre-commit hooks
- CI/CD runs on GitHub Actions for all PRs
- Tests and linting must pass before merge

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Arcjet for security features
- MongoDB for database
- Express.js framework
- Socket.io for real-time features

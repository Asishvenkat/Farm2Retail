# Farm2Market - Farmers E-Commerce Platform

A modern full-stack platform connecting farmers directly with retailers, eliminating middlemen and ensuring fair prices. Built with React, Node.js, MongoDB, and real-time communication.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React](https://img.shields.io/badge/react-19.1.0-blue)
![Backend CI](https://github.com/YOUR_USERNAME/farm2retail/actions/workflows/backend-ci.yml/badge.svg)
![Frontend CI](https://github.com/YOUR_USERNAME/farm2retail/actions/workflows/frontend-ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/farm2retail/branch/main/graph/badge.svg)](https://codecov.io/gh/YOUR_USERNAME/farm2retail)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security](#security)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [CI/CD](#cicd)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [User Roles & Routes](#user-roles--routes)
- [API Endpoints](#api-endpoints)
- [Real-time Features](#real-time-features)
- [Contributing](#contributing)

---

## Overview

**Farm2Market** bridges the gap between farmers and retailers through a comprehensive e-commerce platform.

### What It Does:
- **Farmers**: List products, manage inventory, track orders, receive payments
- **Retailers**: Browse products, place bulk orders, manage cart & wishlist
- **Admin**: Monitor platform, manage users and transactions

### Key Highlights:
- Real-time notifications and messaging
- Razorpay payment integration
- Bulk pricing tiers
- Live order updates (Socket.io)
- Fully responsive design
- Cloudinary image storage

---

## Features

### For Farmers
- Product listing with multiple images  
- Bulk pricing tier management  
- Real-time order notifications  
- Inventory tracking  
- Direct messaging with retailers  
- Order history and analytics  

### For Retailers
- Advanced product search & filtering  
- Shopping cart & wishlist  
- Secure checkout (Razorpay)  
- Order tracking  
- Real-time price/stock updates  
- Chat with farmers  

### Admin Dashboard
- User management  
- Product oversight  
- Transaction monitoring  
- Platform analytics  

---

## Tech Stack

### Frontend
- React 19.1.0 - UI framework
- Redux Toolkit - State management
- Styled Components - CSS-in-JS
- Socket.io Client - Real-time communication
- Axios - HTTP client
- React Router - Navigation
- Vite - Build tool

### Backend
- Node.js + Express - Server
- MongoDB + Mongoose - Database
- Socket.io - WebSocket server
- JWT - Authentication
- Razorpay - Payment gateway
- Cloudinary - Image storage
- **Arcjet** - Security & Bot Protection
- **Helmet.js** - Security Headers

### Testing & Quality
- **Jest** - Testing framework
- **Supertest** - API testing
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit checks

### DevOps
- **GitHub Actions** - CI/CD
- **Vercel** - Frontend deployment
- **Render/Railway** - Backend deployment (suggested)

---

## 🛡️ Security

### Security Features (Arcjet)

Farm2Market implements comprehensive security measures using Arcjet:

#### Bot Detection & Protection
- **Bot Detection**: Blocks malicious bots while allowing legitimate search engines
- **Spoofed Bot Verification**: Advanced verification using IP data to detect fake bots
- **Hosting IP Blocking**: Prevents requests from hosting providers (likely bots)

#### Rate Limiting
- **Global Protection**: Token bucket rate limiting (5 refill/10s, capacity 10)
- **Auth Endpoints**: 5 requests per 15 minutes for login/register
- **Payment Endpoints**: 10 requests per hour for payment operations

#### Security Headers (Helmet.js)
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Cross-Origin policies

#### SQL Injection & XSS Defense
- Shield protection against common web attacks
- Real-time request analysis and blocking

---

## 🧪 Testing

### Backend Tests
Run backend tests with coverage:
```bash
cd backend
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode
```

**Test Coverage Target:** 60% across all metrics (branches, functions, lines, statements)

**Current Test Suite:**
- Authentication endpoints (5 tests)
- Product CRUD operations (5 tests)
- Order management (4 tests)
- User administration (3 tests)

### Frontend Tests
Run frontend component tests:
```bash
cd frontend
npm test                    # Run all tests
npm test -- --coverage      # With coverage report
npm test -- --watch         # Watch mode
```

**Current Test Suite:**
- Navbar component rendering (2 tests)
- Login form interactions (3 tests)
- Footer component (2 tests)

---

## 📝 Code Quality

### Linting
```bash
# Backend
cd backend && npm run lint

# Frontend
cd frontend && npm run lint
```

### Formatting
```bash
# Backend
cd backend && npm run format

# Frontend
cd frontend && npm run format
```

### Pre-commit Hooks
Husky automatically runs before each commit:
- ✅ ESLint with auto-fix on staged files
- ✅ Prettier formatting on staged files
- ✅ Prevents commits with linting errors

Configuration files:
- `.husky/pre-commit` - Husky hook
- `lint-staged` in package.json - Staged files configuration
- `eslint.config.js` - ESLint rules
- `.prettierrc` - Prettier configuration

---

## 🔄 CI/CD

GitHub Actions workflows automatically run on push and pull requests:

### Backend CI (`backend-ci.yml`)
Runs on changes to `backend/**`:
- ✅ **Linting**: ESLint checks
- ✅ **Formatting**: Prettier validation
- ✅ **Testing**: Jest tests with coverage
- ✅ **Build**: Verify server can start
- 📊 **Coverage**: Upload to Codecov
- 🔄 **Matrix**: Test on Node.js 18.x and 20.x

### Frontend CI (`frontend-ci.yml`)
Runs on changes to `frontend/**`:
- ✅ **Linting**: ESLint checks
- ✅ **Formatting**: Prettier validation
- ✅ **Testing**: Jest + React Testing Library
- ✅ **Build**: Vite production build
- 📦 **Artifacts**: Upload build output
- 📊 **Coverage**: Upload to Codecov
- 🔄 **Matrix**: Test on Node.js 18.x and 20.x

### CI/CD Best Practices
- All PRs must pass CI checks
- Coverage reports uploaded to Codecov
- Build artifacts retained for 7 days
- Separate workflows for frontend/backend
- Matrix testing ensures compatibility

---

## Project Structure

```
Farm2Market/
├── frontend/              # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── Pages/        # Common pages (Home, Login, Register, Messages)
│   │   │   ├── farmers/  # Farmer-specific pages
│   │   │   └── retailers/# Retailer-specific pages
│   │   ├── redux/        # State management
│   │   └── socketService.js
│   └── package.json
│
├── backend/              # Node.js API server
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── index.js         # Server entry point
│   └── package.json
│
├── admin/               # Admin dashboard
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
└── package.json         # Root package (runs all services)
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone repository
git clone https://github.com/Asishvenkat/Farmers-Frontend.git
cd Farmers-Frontend

# 2. Install all dependencies
npm install

# 3. Set up environment variables (see below)

# 4. Start all services
npm run dev
```

**Services will run on:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Admin: http://localhost:5174

---

## Environment Setup

### Backend (`backend/.env`)

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/farmersDB
# Or use MongoDB Atlas:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/farmersDB

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api/
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
```

### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Settings → Upload → Add upload preset
3. Create **unsigned** preset: `farmers_preset`
4. Copy credentials to `.env` files

---

## Running the Application

### Run All Services
```bash
npm run dev
```

### Run Individually
```bash
npm run backend    # Backend only
npm run frontend   # Frontend only
npm run admin      # Admin only
```

### Production Build
```bash
cd frontend && npm run build
cd admin && npm run build
```

---

## User Roles & Routes

### Farmer Routes
| Route | Description |
|-------|-------------|
| `/farmer/products` | View/manage products |
| `/farmer/add-product` | Add new product |
| `/farmer/orders` | View received orders |
| `/update-product/:id` | Edit product |

### Retailer Routes
| Route | Description |
|-------|-------------|
| `/products` | Browse all products |
| `/product/:id` | Product details |
| `/cart` | Shopping cart |
| `/wishlist` | Saved products |
| `/orders` | Order history |
| `/messages` | Chat with farmers |

### Admin Routes
| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/users` | Manage users |
| `/products` | Manage products |
| `/transactions` | View transactions |

---

## API Endpoints

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
```

### Products
```
GET    /api/products                      - Get all products
GET    /api/products/:id                  - Get product by ID
POST   /api/products                      - Create product (Farmer)
PUT    /api/products/:id                  - Update product (Farmer)
DELETE /api/products/:id                  - Delete product (Farmer)
GET    /api/products/farmer/my-products   - Get farmer's products
```

### Orders
```
POST /api/orders                       - Create order
GET  /api/orders/:userId               - Get user orders
GET  /api/orders/farmer/:farmerId      - Get farmer orders
PUT  /api/orders/:id                   - Update order status
```

### Cart
```
GET    /api/cart/:userId    - Get user cart
POST   /api/cart            - Add to cart
PUT    /api/cart/:id        - Update cart item
DELETE /api/cart/:id        - Remove from cart
```

### Messages
```
GET  /api/messages/conversations/:userId             - Get conversations
GET  /api/messages/conversation/:userId/:partnerId   - Get messages
POST /api/messages                                    - Send message
```

### Notifications
```
GET    /api/notifications/:userId    - Get notifications
PUT    /api/notifications/:id/read   - Mark as read
DELETE /api/notifications/:id        - Delete notification
```

### Payment
```
POST /api/razorpay/create-order     - Create Razorpay order
POST /api/razorpay/verify-payment   - Verify payment
```

---

## Real-time Features

### Socket.io Events

**Client → Server:**
- `join` - Join user's room
- `sendMessage` - Send chat message

**Server → Client:**
- `notification` - New notification
- `chatMessage` - New message
- `orderUpdate` - Order status changed
- `productUpdate` - Product updated

### Usage Example

```javascript
import socketService from './socketService';

// Connect
socketService.connect(userId);

// Listen for notifications
socketService.onNotification((data) => {
  console.log('New notification:', data);
});

// Send message
socketService.sendMessage({
  senderId: user._id,
  recipientId: farmerId,
  message: 'Hello!'
});
```

---

## Image Upload

```javascript
import { uploadMultipleToCloudinary } from './cloudinaryConfig';

const handleUpload = async (files) => {
  const urls = await uploadMultipleToCloudinary(files);
  // urls = ['https://res.cloudinary.com/...']
};
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run all services (backend + frontend + admin) |
| `npm run backend` | Run backend API server |
| `npm run frontend` | Run frontend React app |
| `npm run admin` | Run admin dashboard |

---

## Database Models

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  role: 'farmer' | 'retailer' | 'admin',
  phone: String,
  address: Object
}
```

### Product
```javascript
{
  title: String,
  description: String,
  images: [String],
  category: String,
  farmerId: ObjectId,
  bulkTiers: [{
    quantity: Number,
    price: Number
  }],
  inStock: Boolean
}
```

### Order
```javascript
{
  userId: ObjectId,
  products: [{
    productId: ObjectId,
    quantity: Number
  }],
  amount: Number,
  address: Object,
  status: 'pending' | 'completed' | 'cancelled',
  paymentId: String
}
```

---

## Security

### Arcjet Security Implementation
Farm2Market implements comprehensive security using Arcjet, providing advanced protection against common web threats and abuse.

#### Features Implemented:
- **Shield Protection**: SQL injection, XSS defense, and other common attacks
- **Bot Detection**: Blocks malicious bots while allowing legitimate search engines
- **Rate Limiting**:
  - Global: 50 tokens per 10 seconds (general protection)
  - Auth endpoints: 5 requests per 15 minutes (login/signup)
  - Payment endpoints: 10 requests per hour
- **IP-based Protection**:
  - Hosting IP detection and blocking
  - Spoofed bot verification
- **Security Headers**: Helmet.js implementation with CSP, HSTS, and other headers

#### Rate Limits:
- **Login/Signup**: 5 attempts per 15 minutes per IP
- **Payments**: 10 requests per hour per IP
- **General API**: 50 requests per 10 seconds per IP

#### Bot Protection:
- Blocks all bots except search engines (Google, Bing, etc.)
- Detects and blocks spoofed bots
- Hosting IP blocking for API endpoints

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## � License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

**Asish Venkat**  
GitHub: [@Asishvenkat](https://github.com/Asishvenkat)

---

## 🙏 Acknowledgments

- React Team
- MongoDB
- Cloudinary
- Razorpay
- Socket.io Community

---

**Made with ❤️ for farmers and retailers**

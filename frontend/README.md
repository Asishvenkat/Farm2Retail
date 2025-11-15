# Frontend - Farm2Retail

![Frontend CI](https://github.com/YOUR_USERNAME/farm2retail/actions/workflows/frontend-ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/YOUR_USERNAME/farm2retail/branch/main/graph/badge.svg?flag=frontend)](https://codecov.io/gh/YOUR_USERNAME/farm2retail)

E-commerce platform frontend for farmers and retailers to trade agricultural products.

## 🚀 Features

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
- Real-time price/stock updates via WebSocket
- Chat with farmers

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Redux Persist** - Persist state across sessions
- **React Router** - Navigation
- **MUI v5** - Material UI components
- **Styled Components** - CSS-in-JS styling
- **Axios** - API requests
- **Socket.io Client** - Real-time notifications
- **Vite** - Build tool
- **Appwrite** - Authentication service
- **Razorpay** - Payment gateway

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Variables

Create a `.env` file in the frontend directory:

```env
# Razorpay
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key

# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/

# Socket.io
VITE_SOCKET_URL=http://localhost:5000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── Pages/           # Route pages
│   │   ├── farmers/     # Farmer-specific pages
│   │   └── retailers/   # Retailer-specific pages
│   ├── redux/           # State management
│   ├── App.jsx
│   ├── requestMethods.js
│   └── socketService.js
├── public/
└── package.json
```

## 🌐 Key Routes

### Public Routes
- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/products/:category` - Product listing
- `/product/:id` - Product details

### Farmer Routes
- `/farmer` - Farmer dashboard
- `/farmer/add` - Add new product
- `/farmer/products` - Manage products
- `/farmer/update/:id` - Update product

### Retailer Routes
- `/cart` - Shopping cart
- `/wishlist` - Wishlist
- `/orders` - Order history

## 🔌 API Integration

```javascript
import { publicRequest, userRequest } from './requestMethods';

// Public request (no auth required)
const products = await publicRequest.get('/products');

// Authenticated request
const orders = await userRequest.get('/orders/find/userId');
```

## 🔔 Real-time Features

Socket.io integration for:
- Order notifications
- Product updates
- Price changes
- Stock updates
- Chat messages

## 💳 Payment Integration

Razorpay integration for secure payments:
- Order creation
- Payment verification
- Transaction tracking

## 📱 Responsive Design

Fully responsive using Styled Components with mobile-first approach.

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- Role-based access (Farmer/Retailer)
- Redux persist for session management

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
Component tests include:
- Navbar rendering and cart badge
- Login form interactions
- Footer links and social media
- User input validation

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

## 🚢 Deployment

Ready for deployment on Vercel, Netlify, or Render.

Build command: `npm run build`  
Output directory: `dist`

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=your_backend_api_url
VITE_SOCKET_URL=your_socket_server_url
VITE_RAZORPAY_KEY=your_razorpay_key
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

MIT


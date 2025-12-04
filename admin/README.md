# Admin Dashboard - Farm2Retail

Admin panel for managing the Farm2Retail e-commerce platform.

## 🚀 Features

### Dashboard Overview

- Key metrics and analytics
- Recent transactions
- User statistics
- Sales charts (Recharts)

### User Management

- View all users (farmers & retailers)
- User details and activity
- Account status management

### Product Management

- View all products across platform
- Product approval/rejection
- Inventory oversight
- Price monitoring

### Transaction Management

- Order history and tracking
- Payment verification
- Transaction analytics
- Revenue reports

### Guest Mode

- Demo access without authentication
- Read-only dashboard preview
- Perfect for testing and demos

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Redux Persist** - Persist state across sessions
- **React Router** - Navigation
- **MUI v5** - Material UI components
- **MUI DataGrid** - Advanced tables
- **Recharts** - Charts and analytics
- **Styled Components** - CSS-in-JS styling
- **Axios** - API requests
- **Vite** - Build tool
- **Appwrite** - Authentication service

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

Create a `.env` file in the admin directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/
```

## 📁 Project Structure

```
admin/
├── src/
│   ├── components/
│   │   ├── topbar/          # Top navigation bar
│   │   ├── sidebar/         # Side navigation
│   │   ├── chart/           # Analytics charts
│   │   ├── featuredInfo/    # Dashboard widgets
│   │   ├── widgetSm/        # Small widgets
│   │   └── widgetLg/        # Large widgets
│   ├── pages/
│   │   ├── home/            # Dashboard home
│   │   ├── login/           # Admin login
│   │   ├── userList/        # User management
│   │   ├── productList/     # Product management
│   │   └── transactions/    # Transaction view
│   ├── redux/
│   │   ├── store.js
│   │   ├── userRedux.js
│   │   └── productRedux.js
│   ├── App.jsx
│   └── requestMethods.js
├── public/
└── package.json
```

## 🌐 Routes

- `/login` - Admin login page
- `/` - Dashboard home (protected)
- `/users` - User management (protected)
- `/products` - Product management (protected)
- `/transactions` - Transaction list (protected)

## 🔐 Authentication

### Admin Login

- Username/password authentication
- JWT token-based sessions
- Protected routes with Redux persist

### Guest Mode

- Click "Continue as Guest" on login page
- Read-only access to all dashboard features
- No authentication required
- Perfect for demos and testing

```javascript
// Guest user is stored in localStorage
const guestUser = {
  _id: "guest_user_id",
  username: "Guest User",
  isAdmin: false,
  isGuest: true,
};
```

## 🔌 API Integration

```javascript
import { publicRequest } from "./requestMethods";

// Fetch all users
const users = await publicRequest.get("/users");

// Fetch all products
const products = await publicRequest.get("/products");

// Fetch transactions
const orders = await publicRequest.get("/orders");
```

## 📊 Analytics & Charts

Using **Recharts** for data visualization:

- Line charts for sales trends
- Bar charts for revenue
- Area charts for user growth
- Responsive and interactive

## 🎨 UI Components

Built with **Material-UI v5**:

- DataGrid for advanced tables
- Icons from `@mui/icons-material`
- Responsive layouts
- Modern design system

## 👥 User Roles

The admin can view:

- **Farmers**: Product sellers
- **Retailers**: Product buyers
- **Admins**: Platform managers

## 🚢 Deployment

Ready for deployment on Vercel, Netlify, or Render.

Build command: `npm run build`  
Output directory: `dist`

## 🔒 Security

- Protected routes
- JWT verification
- Admin-only access
- Guest mode restrictions

## 📄 License

MIT

## 👤 Default Admin Credentials

Contact the backend team for admin credentials or use Guest Mode for demo access.

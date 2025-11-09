# 🛒 E‑commerce Backend API

A secure, modular REST API built with **Node.js**, **Express**, **MongoDB**, **JWT**, and **CryptoJS**.

---

## 🔧 Prerequisites

- Node.js ≥ 14  
- MongoDB Atlas (or local MongoDB)  
- npm (or yarn)  

---

## ⚙️ Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. **Install dependencies**

```bash
npm install
```

3. **Create a `.env` file in the root directory**

```env
PORT=5000
MONGO_URL=<your MongoDB connection string>
JWT_SEC=<your JWT secret>
PASS_SEC=<your CryptoJS secret>
```

4. **Start the server**

```bash
npm run start
# OR for development with hot-reload
npm run dev
```

API runs at `http://localhost:5000`

---

## 🗂️ Project Structure

```
├── models/           # Mongoose schemas (User, Product, Cart, Order)
├── routes/           # Express routers
│   ├── auth.js       # register & login
│   ├── user.js       # user CRUD
│   ├── product.js    # product CRUD & queries
│   ├── cart.js       # cart CRUD
│   └── order.js      # order CRUD & income aggregation
├── middleware/       # JWT verification logic
├── .env              # Environment variables (not committed)
├── server.js         # App entry point
└── package.json
```

---

## 🚀 API Endpoints

All endpoints are prefixed with `/api`

### 🔐 Auth

| Method | Route            | Body                             | Description         |
|--------|------------------|----------------------------------|---------------------|
| POST   | `/auth/register` | `{ username, email, password }`  | Register new user   |
| POST   | `/auth/login`    | `{ username, password }`         | User login + token  |

### 👤 Users

| Method | Route         | Auth            | Description        |
|--------|---------------|-----------------|--------------------|
| GET    | `/users/:id`  | user or admin   | Get user data      |
| PUT    | `/users/:id`  | user or admin   | Update user info   |
| DELETE | `/users/:id`  | user or admin   | Delete user        |

### 📦 Products

| Method | Route                | Auth   | Description                                |
|--------|----------------------|--------|--------------------------------------------|
| POST   | `/products`          | admin  | Create a product                            |
| PUT    | `/products/:id`      | admin  | Update a product                            |
| DELETE | `/products/:id`      | admin  | Delete a product                            |
| GET    | `/products/find/:id` | public | Get single product by ID                    |
| GET    | `/products`          | public | Get all products (filter by new/category)   |

### 🛍️ Cart

| Method | Route                  | Auth            | Description       |
|--------|------------------------|-----------------|-------------------|
| POST   | `/cart`                | user            | Create cart       |
| PUT    | `/cart/:id`            | owner or admin  | Update cart       |
| DELETE | `/cart/:id`            | owner or admin  | Delete cart       |
| GET    | `/cart/find/:userId`   | owner or admin  | Get user’s cart   |
| GET    | `/cart`                | admin           | Get all carts     |

### 📦 Orders

| Method | Route                    | Auth            | Description               |
|--------|--------------------------|-----------------|---------------------------|
| POST   | `/orders`                | user            | Place new order           |
| PUT    | `/orders/:id`            | admin           | Update order              |
| DELETE | `/orders/:id`            | admin           | Delete order              |
| GET    | `/orders/find/:userId`   | owner or admin  | Get user’s orders         |
| GET    | `/orders`                | admin           | Get all orders            |
| GET    | `/orders/income`         | admin           | Monthly income analytics  |

---

## 🛡️ Security & Middleware

- `verifyToken` – Verifies JWT token  
- `verifyTokenAndAuthorization` – Validates user access  
- `verifyTokenAndAdmin` – Admin-only route access  

---

## 📈 Income Aggregation Example

```js
router.get("/orders/income", verifyTokenAndAdmin, async (req, res) => {
  // Groups income by month from the last two months
});
```

---

## 💫 Features

- 🧩 Modular routing with Express  
- 🔐 JWT-based authentication  
- 🛡️ Secure password encryption using CryptoJS  
- 📦 CRUD operations for Users, Products, Cart & Orders  
- 📊 Monthly income analytics for admin  
- ✨ Ready for deployment & testing with Postman  
- 🚀 Easily extendable for payment gateways, shipping, etc.  

---

## 🤝 Contributing

1. Fork the repo  
2. Create your feature branch (`git checkout -b feat/awesome-feature`)  
3. Commit your changes (`git commit -m "feat: add awesome-feature"`)  
4. Push to the branch (`git push origin feat/awesome-feature`)  
5. Open a pull request  

---

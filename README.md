# 🛒 MyStore – Full-Stack E-commerce Web App

Welcome to **MyStore**, a full-featured, responsive e-commerce platform built using the MERN stack (MongoDB, Express, React, Node.js). This application enables users to browse products, place orders, make payments, track deliveries, and manage their wishlist — all through a seamless shopping experience.

![MyStore Banner](https://via.placeholder.com/1200x300.png?text=MyStore+E-Commerce+Platform)

---

## 🚀 Features

### 👤 User Features
- Sign up / Login with JWT authentication
- View and update user profile and address
- Wishlist: Add or remove favorite products
- Add products to cart and place orders
- View order history and track delivery status
- Cancel order (if not shipped)
- Live chat support system (simulated)
- Address is auto-filled if already saved

### 🛍️ Product Features
- Product listing by category
- Clickable product cards
- Detailed product page with:
  - 4 unique product images
  - Product description
  - ₹ Indian Rupee pricing
  - Customer reviews and ratings

### 💳 Payment Features
- Secure checkout with multiple payment methods:
  - UPI
  - Paytm (mock)
  - Stripe (test card)
- Orders only placed on successful payment

### 📦 Order Management
- Backend updates stock on order placement
- Prevents checkout for out-of-stock items
- Cancel order API with status change

### 📱 Responsive UI
- Fully optimized for mobile and tablet views
- Animated transitions using Framer Motion
- Modern UI with Tailwind CSS

---

## 📁 Folder Structure

```bash
MyStore/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Navbar, ProductCard, Wishlist, etc.
│   │   ├── pages/       # Home, ProductDetails, Orders, Profile
│   │   ├── App.js
│   │   └── ...
│   └── package.json
├── server/              # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── .env.example
└── README.md

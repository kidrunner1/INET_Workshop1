# Express MongoDB Shop API

Backend REST API for a simple shop management system built with Node.js, Express, MongoDB, and Mongoose.

This project includes user authentication, user approval, role-based authorization, product management, order management, and stock validation.

---

## Features

- User Registration
- User Login
- User Approval
- Password Hashing with bcrypt
- Authentication with JWT
- Role-based Authorization
  - User
  - Admin
- Product CRUD
- Create Orders
- Get Orders
- Check Product Stock before creating an Order
- Automatically reduce Product stock after a successful Order

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- dotenv
- Postman

---

## Project Structure

```text
src/
├── config/
│   └── database.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── product.controller.js
│   └── order.controller.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   └── order.model.js
│
├── routes/
│   ├── user/
│   │   ├── auth.route.js
│   │   └── user.route.js
│   │
│   └── manager/
│       ├── product.route.js
│       └── order.route.js
│
├── app.js
└── server.js

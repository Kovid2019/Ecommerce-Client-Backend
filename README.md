# 🛒 E-Commerce Client Backend (Node.js + Express + MongoDB)

This is the **Client backend API** for an eCommerce platform. It powers all core functionalities including user authentication, product management, orders, and more. Designed for use with a frontend built in React.

## Introduction

This (MERN) Fullstack Ecommerce system assists the users can easily buy products. They can create their account by submitting first name, last name, email, phone number and password and profile picture. After signup, they can activate account from activation link that comes in valid email account. Then users can log in by email and password. If users forget password they can reset password by providing email and will recieve OTP. After submitting OTP and new password can make new password. When they logged in, they can see shopping homepage. In homepage there will be different categories. Users can select product whatever they like and can add in cart. There will be cart page and users can adjust cart items like increase quantities, remove items, clear items etc. There will be account page where users can update their account. They can proceed to payment where they can choose payment system such as card, paypal etc. After payment is success will be redirect to the order status and order history page.

---

## 🚀 Features

- ✅ User authentication with JWT
- 🔐 Role-based access (admin, user)
- 📦 Product CRUD
- 🛒 Cart and checkout logic
- 📃 Order history and management
- 💬 Product reviews and ratings
- 🖼 Image/file upload (Multer)
- 📊 Admin dashboard endpoints

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for auth
- **bcryptjs** for password hashing
- **Multer** for image upload
- **dotenv**, **cors**, **express-async-handler**

---

## 📁 Folder Structure

```
backend/
├── config/             # DB and environment setup
│   └── db.js
├── controllers/        # Route logic
│   ├── authController.js
│   ├── productController.js
│   └── orderController.js
├── models/             # Mongoose schemas
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
├── routes/             # API route definitions
│   ├── authRoutes.js
│   ├── productRoutes.js
│   └── orderRoutes.js
├── middleware/         # Auth and error handling
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── uploads/            # File/image uploads
├── utils/              # Helper functions
├── server.js           # App entry point
└── .env                # Environment variables
```

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Kovid2019/Ecommerce-Client-Backend.git
cd ecommerce-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
PORT=your port number to use
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 4. Start development server

```bash
npm run dev
```

---

## 🔗 API Base URL

```
http://localhost:your_port_no/api/v1
```

---

## 📡 Core API Endpoints

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | /api/auth/register | Register new user       |
| POST   | /api/auth/login    | Login user              |
| GET    | /api/products      | Get all products        |
| POST   | /api/products      | Add product (admin)     |
| GET    | /api/products/:id  | Get product by ID       |
| PUT    | /api/products/:id  | Update product (admin)  |
| DELETE | /api/products/:id  | Delete product (admin)  |
| GET    | /api/orders        | Get orders (admin/user) |
| POST   | /api/orders        | Place a new order       |
| GET    | /api/users/profile | Get user profile        |
| PUT    | /api/users/profile | Update profile          |

---

## 🧪 Testing

- Use Postman or rest.http for testing API endpoints
- Add unit tests with Jest or other testing frameworks (optional)

---

## ⚠️ Notes

- MongoDB must be running locally or on MongoDB Atlas
- Protect private routes using `authMiddleware.js`
- Sanitize and validate all user input

---

## 📄 License

MIT

### dinesh is testing here

### testing the feature/test shekhar

16a2d34df6cc7a25b9a82eaa8a434c2ee6215bdb

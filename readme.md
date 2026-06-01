# 🌍 Natours - Tour Booking Platform

A modern full-stack tour booking application that enables users to explore, review, and book exciting tours around the world. The platform provides secure authentication, online payment processing, tour management, user reviews, and an intuitive user experience.

## ✨ Features

### User Features
- Browse available tours
- View detailed tour information
- Interactive map locations
- Book tours online
- Secure Stripe payments
- Manage personal profile
- Upload profile photos
- Leave reviews and ratings
- View booking history

### Admin Features
- Manage tours (Create, Update, Delete)
- Manage users
- Manage reviews
- View bookings
- Role-based access control

### Security Features
- JWT Authentication
- Password encryption using bcrypt
- Rate limiting
- Data sanitization
- XSS protection
- NoSQL injection prevention
- Secure HTTP headers with Helmet

## 🛠️ Built With

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- Pug Template Engine
- HTML5
- CSS3
- JavaScript (ES6+)

### Authentication & Security
- JWT
- bcryptjs
- Helmet
- Express Rate Limit
- Validator

### Payments
- Stripe

### Utilities
- Nodemailer
- Multer
- Sharp

## 📂 Project Structure

```text
natours/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── dev-data/
├── app.js
├── server.js
└── package.json
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/JamalAmoudi/Natours.git
```

### Navigate to the project directory

```bash
cd Natours
```

### Install dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `config.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/natours

DATABASE_PASSWORD=your_password

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

STRIPE_SECRET_KEY=your_stripe_secret_key
```

## ▶️ Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## 🌱 Import Development Data

Import sample tours, users, and reviews:

```bash
node dev-data/data/import-dev-data.js --import
```

Delete sample data:

```bash
node dev-data/data/import-dev-data.js --delete
```

## 📡 API Overview

### Authentication

```http
POST /api/v1/users/signup
POST /api/v1/users/login
GET  /api/v1/users/logout
```

### Tours

```http
GET    /api/v1/tours
GET    /api/v1/tours/:id
POST   /api/v1/tours
PATCH  /api/v1/tours/:id
DELETE /api/v1/tours/:id
```

### Reviews

```http
GET    /api/v1/reviews
POST   /api/v1/reviews
PATCH  /api/v1/reviews/:id
DELETE /api/v1/reviews/:id
```

### Bookings

```http
POST /api/v1/bookings/checkout-session/:tourId
```

## 🔒 Authentication Flow

1. User registers or logs in.
2. Server validates credentials.
3. JWT token is generated.
4. Token is stored in an HTTP-only cookie.
5. Protected routes require authentication.
6. Role-based middleware controls access permissions.

## 💳 Payment Integration

Natours uses Stripe Checkout for secure payment processing.

Features:
- Secure card payments
- Checkout Sessions
- Booking confirmation
- Payment verification

## 👨‍💻 Author

**Jamal Amoudi**

GitHub: https://github.com/JamalAmoudi

## 🙏 Acknowledgements

This project is inspired by the Natours application created by Jonas Schmedtmann as part of his Node.js Bootcamp.

## ⭐ Support

If you found this project useful:

- Star the repository ⭐
- Fork the project 🍴
- Submit improvements via Pull Requests 🚀

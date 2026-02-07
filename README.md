# Personal Finance Tracker

A comprehensive personal finance management application built with React, Tailwind CSS, Node.js, Express, and MongoDB. Track your expenses, manage income, set budgets, and gain insights into your financial habits.

## Features

- **User Authentication**: Secure registration and login with email verification
- **Expense Tracking**: Record daily expenses with categories and descriptions
- **Income Management**: Add income sources with frequency and recurring options
- **Budget Setting**: Set monthly budgets for different categories with progress tracking
- **Transaction History**: View all transactions with filtering and search capabilities
- **Dashboard**: Overview of income, expenses, balance, and budget progress

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router
- Axios
- Vite
- React Icons
- date-fns

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Nodemailer for email verification

<img width="1919" height="877" alt="image" src="https://github.com/user-attachments/assets/02ae5ca0-860a-46e3-b948-b0959caf0549" />
<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/365aa9c0-882f-4957-9b20-43e9c2c4f03e" />


## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Personal-Finance-Tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/personal-finance-tracker
JWT_SECRET=your-secret-jwt-key-change-this-in-production
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Note**: For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password (not your regular password)
3. Use that App Password in `EMAIL_PASS`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system. If using MongoDB Atlas, ensure your connection string is correct in the `.env` file.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
Personal-Finance-Tracker/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── expenseController.js
│   │   ├── incomeController.js
│   │   └── budgetController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── userModel.js
│   │   ├── expenseModel.js
│   │   ├── incomeModel.js
│   │   └── budgetModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── incomeRoutes.js
│   │   └── budgetRoutes.js
│   └── server.js              # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expenses.jsx
│   │   │   ├── Income.jsx
│   │   │   ├── Budgets.jsx
│   │   │   └── Transactions.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user (protected)

### Expenses
- `GET /api/expenses` - Get all expenses (protected)
- `POST /api/expenses` - Create expense (protected)
- `GET /api/expenses/:id` - Get single expense (protected)
- `PUT /api/expenses/:id` - Update expense (protected)
- `DELETE /api/expenses/:id` - Delete expense (protected)
- `GET /api/expenses/category/:category` - Get expenses by category (protected)
- <img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/6bb8f5d2-2cd8-496e-a250-592c5f938ab6" />


### Income
- `GET /api/income` - Get all income entries (protected)
- `POST /api/income` - Create income entry (protected)
- `GET /api/income/:id` - Get single income entry (protected)
- `PUT /api/income/:id` - Update income entry (protected)
- `DELETE /api/income/:id` - Delete income entry (protected)
- <img width="1919" height="874" alt="image" src="https://github.com/user-attachments/assets/b377acc4-6a33-4148-bc98-334e60cb9fdc" />


### Budgets
- `GET /api/budget?month=&year=` - Get budgets for month/year (protected)
- `POST /api/budget` - Create budget (protected)
- `GET /api/budget/:id` - Get single budget (protected)
- `PUT /api/budget/:id` - Update budget (protected)
- `DELETE /api/budget/:id` - Delete budget (protected)
- <img width="1919" height="864" alt="image" src="https://github.com/user-attachments/assets/5c817704-5493-4465-819f-f55281480d6e" />


## Usage

1. **Register**: Create a new account with your email and password
2. **Verify Email**: Check your email for verification link (if email is configured)
3. **Add Expenses**: Record your daily expenses with categories
4. **Add Income**: Track your income sources with frequency settings
5. **Set Budgets**: Create monthly budgets for different categories
6. **View Dashboard**: See your financial overview and budget progress
7. **Transaction History**: Browse and filter all your transactions

## Expense Categories

- Groceries
- Utilities
- Entertainment
- Dining
- Transportation
- Clothing
- Healthcare
- Education
- Housing
- Other
<img width="1919" height="858" alt="image" src="https://github.com/user-attachments/assets/874f34b6-7711-44c2-8638-a2b4cfb8f339" />


## Income Frequency Options

- One-time
- Weekly
- Bi-weekly
- Monthly
- Yearly

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Email verification
- Protected API routes
- Input validation

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite development server with hot reload
```

## Production Build

### Frontend Build
```bash
cd frontend
npm run build
```

## 🌐 Live Demo

🚀 Application is live at:  
👉 https://personal-finance-tracker-2-y69e.onrender.com

---

## 🚀 Deployment (Render)

This project is deployed on **Render** as a full-stack application (Frontend + Backend on same server).

###  Build Command

```bash
cd frontend && npm install --include=dev && npm run build && cd ../backend && npm install


The built files will be in the `frontend/dist` directory.

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!

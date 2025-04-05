# Stock & HR Management System

A comprehensive Stock and HR Management System built with React, Node.js, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Detailed Installation Guide](#detailed-installation-guide)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Setup](#step-by-step-setup)
  - [Configuration](#configuration)
- [Usage Guide](#usage-guide)
  - [Dashboard](#dashboard)
  - [Inventory Management](#inventory-management)
  - [Contract Management](#contract-management)
  - [Invoice Management](#invoice-management)
  - [User Management](#user-management)
  - [Settings](#settings)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 📊 Dashboard with analytics and charts
- 👥 User Management
- 📝 Contract Management
- 📄 Invoice Generation
- 🌐 Multi-language Support (English, French, Arabic)
- 🎨 Modern UI with Material-UI
- 🔒 Secure Authentication
- 📱 Responsive Design

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI
- Redux Toolkit
- React Query
- i18n for translations
- Chart.js/Recharts for visualizations
- Formik & Yup for form validation
- React Router for navigation

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- JWT Authentication
- Socket.IO for real-time updates
- Winston for logging

## 🚀 Quick Start

For experienced developers who want to get started quickly:

```bash
# Clone the repository
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr

# Install dependencies
npm install
cd frontend && npm install
cd ../backend && npm install

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Start development servers
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm start
```

## 📚 Detailed Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v14 or higher)
   - Windows: [Download installer from nodejs.org](https://nodejs.org/)
   - macOS: `brew install node` or [download installer](https://nodejs.org/)
   - Linux: `sudo apt install nodejs npm` or equivalent

2. **MongoDB** (v4.4 or higher)
   - Windows: [Download MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - macOS: `brew install mongodb-community`
   - Linux: [Follow MongoDB installation guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

3. **Git** (Optional, for cloning the repository)
   - Windows: [Download Git for Windows](https://gitforwindows.org/)
   - macOS: `brew install git` or comes with Xcode Command Line Tools
   - Linux: `sudo apt install git` or equivalent

### Step-by-Step Setup

#### 1. Get the Code

**Option A: Clone with Git**
```bash
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr
```

**Option B: Download ZIP**
1. Download the ZIP file from the repository
2. Extract it to your preferred location
3. Open a terminal/command prompt in the extracted folder

#### 2. Install Root Dependencies

```bash
npm install
```

This will install the dependencies required for the root project.

#### 3. Set Up Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env
```

> 💡 **Tip for Beginners**: The `cd` command changes your current directory. The `npm install` command downloads all the necessary packages for the application.

#### 4. Set Up Backend

```bash
# Navigate to backend directory
cd ../backend

# Install backend dependencies
npm install

# Create environment file
cp .env.example .env
```

#### 5. Configure Environment Variables

Edit the `.env` files in both frontend and backend directories to match your environment:

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stockhr
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

> 💡 **Tip for Beginners**: Environment variables are like configuration settings for your application. They keep sensitive information separate from your code.

#### 6. Start MongoDB

Ensure MongoDB is running on your system:

**Windows**
1. MongoDB should be running as a service if you used the installer
2. If not, open Command Prompt as Administrator and run: `net start MongoDB`

**macOS/Linux**
```bash
sudo systemctl start mongod
# Or for macOS with brew:
brew services start mongodb-community
```

#### 7. Start Development Servers

**Terminal 1: Start Backend Server**
```bash
cd backend
npm run dev
```

You should see output indicating the server is running on port 5000.

**Terminal 2: Start Frontend Server**
```bash
cd frontend
npm start
```

Your default browser should automatically open to http://localhost:3000

## 🧭 Usage Guide

### Dashboard

The dashboard provides a quick overview of your business metrics:

1. Log in using your credentials
2. View key performance indicators:
   - Total Users
   - Inventory Items
   - Active Contracts
   - Total Invoices
3. Access quick actions for common tasks
4. View recent activity feed

### Inventory Management

To manage your inventory:

1. Navigate to the Inventory page from the sidebar
2. View existing inventory items in a tabular format
3. Add new inventory items using the "Add Item" button
4. Edit or delete items using the action buttons
5. Filter and search for specific items

### Contract Management

To manage contracts:

1. Navigate to the Contracts page
2. View existing contracts
3. Generate a new contract using the "Generate Contract" button
4. Fill in contract details in the form
5. Preview and finalize the contract
6. Download the contract as PDF

### Invoice Management

To create and manage invoices:

1. Navigate to the Invoices page
2. View existing invoices
3. Create a new invoice using the "Add Invoice" button
4. Select client and add line items
5. Set payment terms and dates
6. Generate and send invoice

### User Management

To manage system users:

1. Navigate to Users page (admin access required)
2. View existing users
3. Add new users with "Add User" button
4. Set roles and permissions
5. Edit or deactivate user accounts

### Settings

To configure your application:

1. Navigate to Settings page
2. Toggle dark/light mode
3. Enable/disable notifications
4. Select preferred language (English, French, or Arabic)

## 📂 Project Structure

```
stock-hr/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── features/       # Feature-specific components
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   ├── i18n/           # Internationalization
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── backend/
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
└── docs/                   # Documentation
```

## 📝 API Documentation

Our API follows RESTful principles. Base URL: `http://localhost:5000/api`

| Endpoint               | Method | Description                       | Auth Required |
|------------------------|--------|-----------------------------------|---------------|
| /auth/login            | POST   | User login                        | No            |
| /auth/register         | POST   | User registration                 | No            |
| /users                 | GET    | Get all users                     | Yes           |
| /users/:id             | GET    | Get user by ID                    | Yes           |
| /inventory             | GET    | Get all inventory items           | Yes           |
| /inventory             | POST   | Create inventory item             | Yes           |
| /contracts             | GET    | Get all contracts                 | Yes           |
| /contracts/:id         | GET    | Get contract by ID                | Yes           |
| /invoices              | GET    | Get all invoices                  | Yes           |
| /invoices/:id          | GET    | Get invoice by ID                 | Yes           |

## ❓ Troubleshooting

### Common Issues

**Backend fails to start**
- Check MongoDB is running: `systemctl status mongod`
- Verify .env configuration is correct
- Check port 5000 is not in use by another application

**Frontend fails to start**
- Ensure Node.js version is 14+: `node -v`
- Verify all dependencies are installed: `npm install`
- Check .env configuration points to correct API URL

**Authentication issues**
- Clear browser cookies and local storage
- Verify JWT_SECRET is consistent
- Check token expiration settings

### Get Help

If you encounter issues not covered here:
1. Check the issue tracker on GitHub
2. Submit a new issue with detailed information about your problem
3. Contact support at support@stockhr.example.com

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Your Company Name
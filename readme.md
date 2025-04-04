# Stock & HR Management System

A comprehensive management system for handling inventory, human resources, and business operations in compliance with Algerian regulations.

## Features

- 📦 Inventory Management
- 👥 Human Resources Management
- 📄 Contract Management
- 💰 Invoice Management
- 🌐 Multi-language Support (English, French, Arabic)
- 📱 Responsive Design
- 🔒 Secure Authentication
- 📊 Dashboard Analytics

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4.4 or higher)
- Git

## Installation Guide

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/stock-hr-management.git
cd stock-hr-management
```

### Step 2: Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-hr
JWT_SECRET=your_jwt_secret
```

5. Start the backend server:
```bash
npm run dev
```

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm start
```

### Step 4: Database Setup

1. Ensure MongoDB is running on your system
2. The application will automatically create the necessary collections on first run

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Log in with your credentials
3. Navigate through the dashboard and various modules

## Language Support

The application supports three languages:
- English (en)
- French (fr)
- Arabic (ar)

To change the language:
1. Click on the language selector in the top navigation bar
2. Select your preferred language
3. The interface will update automatically, including RTL support for Arabic

## Development

### Backend Development
```bash
cd backend
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Project Structure

```
stock-hr-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── locales/
│   └── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team or create an issue in the repository. 
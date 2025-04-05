# Stock & HR Management System

A modern, full-stack application for managing inventory, invoices, and human resources. Built with React, Node.js, and MongoDB.

## Features

- 🚀 Modern, responsive UI with Material-UI
- 🌍 Internationalization support (English & Arabic)
- 🌙 Light/Dark theme support
- 📊 Real-time inventory management
- 📝 Invoice generation and management
- 👥 HR management with employee profiles
- 📈 Performance analytics and insights
- 🔒 Secure authentication and authorization
- 🔄 Real-time updates via WebSocket
- 📱 Mobile-responsive design

## Tech Stack

### Frontend
- React with TypeScript
- Material-UI for UI components
- Redux Toolkit for state management
- Socket.io-client for real-time updates
- i18next for internationalization
- Axios for API communication

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time communication
- Winston for logging

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Set up environment variables:
```bash
# In the root directory
cp .env.example .env

# In the frontend directory
cp .env.example .env

# In the backend directory
cp .env.example .env
```

4. Update the environment variables in each .env file with your configuration.

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Access the application at http://localhost:3000

## Project Structure

```
stock-hr/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices and features
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── services/      # API services
│   │   ├── theme/         # Theme configuration
│   │   └── i18n/          # Internationalization
│   └── public/            # Static assets
├── backend/                # Node.js backend application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   └── utils/         # Utility functions
│   └── logs/              # Application logs
└── shared/                # Shared types and utilities
```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the beautiful UI components
- The React and Node.js communities for their excellent documentation
- All contributors who have helped shape this project

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
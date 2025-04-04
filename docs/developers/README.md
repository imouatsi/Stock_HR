# Stock & HR Management System - Developer Documentation

## Architecture Overview

### Tech Stack
- Frontend: React, TypeScript, Material-UI, Redux Toolkit
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose
- Authentication: JWT, WebAuthn
- Caching: Redis
- Testing: Jest, React Testing Library

### Project Structure
```
stock-hr/
├── backend/               # Backend API server
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   └── tests/            # Backend tests
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Redux slices and hooks
│   │   ├── pages/        # Page components
│   │   ├── services/     # API clients
│   │   └── utils/        # Helper functions
│   └── tests/            # Frontend tests
└── docs/                 # Documentation
```

## Getting Started

### Prerequisites
- Node.js >= 14
- MongoDB >= 4.4
- Redis (optional)
- Git

### Development Setup
1. Clone the repository
2. Install dependencies:
```bash
# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

3. Set up environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. Start development servers:
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/mfa/enable` - Enable 2FA
- `POST /api/auth/webauthn/register` - Register security key

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user details
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

[Full API Documentation](./api.md)

## Database Schema
[Database Schema Documentation](./schema.md)

## Testing
```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## Deployment
[Deployment Guide](./deployment.md)

## Contributing
[Contributing Guidelines](./contributing.md)

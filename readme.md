# Stock HR System

A comprehensive HR management system built with Electron, TypeScript, and MongoDB.

## Features

### Authentication
- Username-based authentication
- Role-based access control
- Secure password hashing
- JWT token management

### User Management
- User registration
- Admin authorization
- Profile management
- Role assignment

### Security
- Password encryption
- Session management
- Input validation
- Error handling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_hr
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start the application
```bash
npm start
```

## Usage

### User Roles
- Superadmin (SA00000)
- Admin (UA00001)
- User (U00002)

### Authentication
1. Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username": "U00001", "password": "Test@123"}'
```

2. Login with credentials
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "U00001", "password": "Test@123"}'
```

### Admin Functions
1. Get all users
```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer your_token"
```

2. Authorize a user
```bash
curl -X PATCH http://localhost:3000/api/v1/users/user_id/authorize \
  -H "Authorization: Bearer your_token"
```

## Development

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

### Testing
```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### Documentation
```bash
# Generate API documentation
npm run docs:api

# Generate technical documentation
npm run docs:tech
```

## Security

### Authentication
- Username format validation
- Password strength requirements
- JWT token expiration
- Session management

### Authorization
- Role-based access control
- Permission checks
- Resource protection
- Audit logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.
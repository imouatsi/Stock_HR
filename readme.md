# 404 ENTERPRISE

A comprehensive Stock and HR management system built with Electron, TypeScript, and MongoDB. 404 ENTERPRISE is designed to help businesses manage their inventory, human resources, accounting, and more in a single integrated platform.

## Features

### Authentication & User Management
- Username-based authentication
- Role-based access control
- Secure password hashing
- JWT token management
- User registration and profile management
- Admin authorization
- Role assignment

### Stock Management
- Inventory tracking
- Stock movements
- Purchase orders
- Suppliers management
- Low stock alerts

### HR Management
- Employee records
- Department management
- Position tracking
- Leave requests
- Performance reviews

### Accounting
- Invoices and billing
- Proforma invoices
- Contracts management
- Journal entries
- Chart of accounts
- Financial statements

### Security
- Password encryption
- Session management
- Input validation
- Error handling
- Audit logging

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Setup
1. Clone the repository
```bash
git clone https://github.com/imouatsi/Stock_HR.git
cd Stock_HR
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/404enterprise
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

For support, create an issue in the repository or contact the development team.

## About

404 ENTERPRISE is designed specifically for businesses in Algeria, with full support for the Algerian Dinar (DZD) as the default currency throughout the application.
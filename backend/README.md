# Stock HR Backend

A backend service for the Stock HR application, built with Node.js, Express, and TypeScript.

## Features

- Username-based authentication (SA00000 for Superadmin, UA00001 for Admin, U00002 for User)
- Role-based access control
- User authorization system
- Secure password hashing
- JWT-based authentication
- MongoDB database integration
- Error handling and logging
- Input validation
- Security best practices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stock-hr.git
cd stock-hr/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stock_hr
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login with username and password

### User Management

- `GET /api/v1/users/profile` - Get current user profile
- `PUT /api/v1/users/profile` - Update current user profile
- `GET /api/v1/users` - Get all users (admin only)
- `POST /api/v1/users` - Create a new user (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `PUT /api/v1/users/:id` - Update user by ID (admin only)
- `DELETE /api/v1/users/:id` - Delete user by ID (admin only)
- `PATCH /api/v1/users/:id/authorize` - Authorize a user (admin only)

## Username Format

- Superadmin: SA00000
- Admin: UA00001
- User: U00002

## Security

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting
- CORS protection
- XSS protection
- NoSQL injection protection
- Parameter pollution protection
- Helmet for security headers

## Error Handling

- Custom error handling middleware
- Validation errors
- Authentication errors
- Authorization errors
- Database errors
- JWT errors

## Logging

- Winston logger
- Error logging
- Request logging
- Development logging

## Testing

```bash
npm test
```

## Production

```bash
npm run build
npm start
```

## License

MIT 
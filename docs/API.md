# API Documentation

## Authentication
All endpoints except `/auth/login` and `/auth/register` require Bearer token.

### Headers
```http
Authorization: Bearer <token>
Content-Type: application/json
Accept-Language: en|fr|ar
```

### Endpoints

#### Authentication
```typescript
POST /api/auth/login
{
  email: string
  password: string
  mfaCode?: string
}

POST /api/auth/register
{
  email: string
  password: string
  firstName: string
  lastName: string
}
```

#### Inventory Management
```typescript
GET /api/inventory
GET /api/inventory/:id
POST /api/inventory
PUT /api/inventory/:id
DELETE /api/inventory/:id

// Query Parameters
?search=string
?category=string
?sort=name|price|quantity
?order=asc|desc
?page=number
?limit=number
```

### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "username": "U00001",
  "password": "Test@123",
  "role": "user"
}
```

Response:
```json
{
  "status": "success",
  "message": "User registered successfully. Waiting for admin authorization.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "U00001",
      "role": "user",
      "isAuthorized": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "username": "U00001",
  "password": "Test@123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "U00001",
      "role": "user",
      "isAuthorized": true,
      "firstName": "John",
      "lastName": "Doe",
      "settings": {
        "theme": "light",
        "language": "en",
        "notifications": true
      }
    }
  }
}
```

## User Profile

### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "U00001",
      "role": "user",
      "isAuthorized": true,
      "firstName": "John",
      "lastName": "Doe",
      "settings": {
        "theme": "light",
        "language": "en",
        "notifications": true
      },
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Update Profile
```http
PATCH /api/v1/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "settings": {
    "theme": "dark",
    "language": "fr",
    "notifications": false
  }
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "U00001",
      "role": "user",
      "isAuthorized": true,
      "firstName": "Jane",
      "lastName": "Smith",
      "settings": {
        "theme": "dark",
        "language": "fr",
        "notifications": false
      }
    }
  }
}
```

## Admin Endpoints

### Get All Users
```http
GET /api/v1/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "username": "U00001",
        "role": "user",
        "isAuthorized": true,
        "firstName": "Jane",
        "lastName": "Smith",
        "createdAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439012",
        "username": "U00002",
        "role": "user",
        "isAuthorized": false,
        "createdAt": "2024-01-02T00:00:00.000Z"
      }
    ]
  }
}
```

### Get User by ID
```http
GET /api/v1/users/507f1f77bcf86cd799439011
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "U00001",
      "role": "user",
      "isAuthorized": true,
      "firstName": "Jane",
      "lastName": "Smith",
      "settings": {
        "theme": "dark",
        "language": "fr",
        "notifications": false
      },
      "lastLogin": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Authorize User
```http
PATCH /api/v1/users/507f1f77bcf86cd799439012/authorize
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response:
```json
{
  "status": "success",
  "message": "User authorized successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "username": "U00002",
      "role": "user",
      "isAuthorized": true
    }
  }
}
```

## Error Responses

### Bad Request (400)
```json
{
  "status": "error",
  "message": "Invalid username format"
}
```

### Unauthorized (401)
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

### Forbidden (403)
```json
{
  "status": "error",
  "message": "Access denied"
}
```

### Not Found (404)
```json
{
  "status": "error",
  "message": "User not found"
}
```

### Conflict (409)
```json
{
  "status": "error",
  "message": "Username already exists"
}
```

### Internal Server Error (500)
```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

## Rate Limiting
- Maximum 100 requests per hour
- Headers:
  - X-RateLimit-Limit: 100
  - X-RateLimit-Remaining: 99
  - X-RateLimit-Reset: 3600

## Security
- JWT authentication
- Password hashing
- Input validation
- CORS enabled
- XSS protection
- NoSQL injection prevention

### Error Codes
| Code    | Description           |
|---------|----------------------|
| AUTH001 | Invalid credentials  |
| AUTH002 | Token expired        |
| INV001  | Item not found      |
| INV002  | Insufficient stock  |

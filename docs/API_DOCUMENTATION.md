# API Documentation

This document provides detailed information about the Stock & HR Management System's API endpoints, request/response formats, and authentication requirements.

## Base URL

The base URL for all API endpoints is:

```
https://your-domain.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

```
POST /auth/login
```

Request body:
```json
{
  "username": "superadmin",
  "password": "Admin@123"
}
```

Response:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "67f3fe7ff90730ad3fe7b7b6",
      "username": "superadmin",
      "role": "superadmin",
      "isAuthorized": true,
      "isActive": true
    }
  }
}
```

### Get Current User
```
GET /auth/me
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "67f3fe7ff90730ad3fe7b7b6",
      "username": "superadmin",
      "role": "superadmin",
      "isAuthorized": true,
      "isActive": true
    }
  }
}
```

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "password": "Test@123",
  "role": "user"
}
```

Response:
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "newuser",
      "role": "user",
      "isAuthorized": false,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

### Logout
```
POST /auth/logout
```

Response:
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## Error Responses

All API endpoints follow a consistent error response format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Pagination

Endpoints that return lists of items support pagination using query parameters:

```
GET /api/items?page=1&limit=10
```

Response:
```json
{
  "status": "success",
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Data Formats

### Dates
All dates are returned in ISO 8601 format:
```
"2024-01-01T00:00:00.000Z"
```

### Numbers
All numbers are returned as integers or floating-point numbers, not strings.

### Boolean Values
Boolean values are returned as `true` or `false`, not strings.

## WebSocket Events

The API supports real-time updates through WebSocket connections:

```
ws://your-domain.com/api/ws
```

Events:
- `item_updated`: Sent when an item is updated
- `item_created`: Sent when a new item is created
- `item_deleted`: Sent when an item is deleted

Event format:
```json
{
  "event": "item_updated",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Item",
    "quantity": 10
  }
}
```

## API Versioning

The API is versioned through the URL path:
```
/api/v1/...
```

Current version: v1

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:
- Allowed Origins: *
- Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
- Allowed Headers: Content-Type, Authorization
- Max Age: 86400 (24 hours)

## Compression

All responses are compressed using gzip when the client supports it.

## Security Headers

The API includes the following security headers:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000; includeSubDomains
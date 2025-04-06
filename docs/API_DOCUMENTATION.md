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
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
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

## API Endpoints

### Authentication

#### Login

```
POST /auth/login
```

Request body:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "admin"
  }
}
```

#### Register

```
POST /auth/register
```

Request body:
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "role": "user"
}
```

Response:
```json
{
  "message": "User registered successfully",
  "userId": "60d21b4667d0d8992e610c86"
}
```

#### Logout

```
POST /auth/logout
```

Response:
```json
{
  "message": "Logged out successfully"
}
```

### Users

#### Get All Users

```
GET /users
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name or email

Response:
```json
{
  "users": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin",
      "createdAt": "2023-04-21T18:25:43.511Z"
    },
    // More users...
  ],
  "pagination": {
    "total": 25,
    "pages": 3,
    "currentPage": 1,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get User by ID

```
GET /users/:id
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "admin",
  "createdAt": "2023-04-21T18:25:43.511Z"
}
```

#### Create User

```
POST /users
```

Request body:
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "name": "New User",
  "role": "user"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c86",
  "email": "newuser@example.com",
  "name": "New User",
  "role": "user",
  "createdAt": "2023-04-22T14:30:22.123Z"
}
```

#### Update User

```
PUT /users/:id
```

Request body:
```json
{
  "name": "Updated Name",
  "role": "admin"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c85",
  "email": "user@example.com",
  "name": "Updated Name",
  "role": "admin",
  "createdAt": "2023-04-21T18:25:43.511Z",
  "updatedAt": "2023-04-22T15:40:12.345Z"
}
```

#### Delete User

```
DELETE /users/:id
```

Response:
```json
{
  "message": "User deleted successfully"
}
```

### Inventory Items

#### Get All Inventory Items

```
GET /inventory
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name or description
- `category`: Filter by category
- `sort`: Sort by field (name, price, quantity, createdAt)
- `order`: Sort order (asc, desc)

Response:
```json
{
  "items": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "name": "Product A",
      "description": "High-quality product",
      "category": "Electronics",
      "price": 99.99,
      "quantity": 50,
      "sku": "PROD-A-001",
      "createdAt": "2023-04-20T10:15:32.123Z"
    },
    // More items...
  ],
  "pagination": {
    "total": 120,
    "pages": 12,
    "currentPage": 1,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Inventory Item by ID

```
GET /inventory/:id
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c87",
  "name": "Product A",
  "description": "High-quality product",
  "category": "Electronics",
  "price": 99.99,
  "quantity": 50,
  "sku": "PROD-A-001",
  "images": ["url1", "url2"],
  "supplier": "Supplier Inc.",
  "location": "Warehouse A, Shelf B4",
  "createdAt": "2023-04-20T10:15:32.123Z",
  "updatedAt": "2023-04-21T08:30:45.678Z"
}
```

#### Create Inventory Item

```
POST /inventory
```

Request body:
```json
{
  "name": "New Product",
  "description": "New product description",
  "category": "Office Supplies",
  "price": 29.99,
  "quantity": 100,
  "sku": "PROD-B-002",
  "supplier": "Supplier Inc.",
  "location": "Warehouse B, Shelf C1"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "name": "New Product",
  "description": "New product description",
  "category": "Office Supplies",
  "price": 29.99,
  "quantity": 100,
  "sku": "PROD-B-002",
  "supplier": "Supplier Inc.",
  "location": "Warehouse B, Shelf C1",
  "createdAt": "2023-04-22T16:45:33.123Z"
}
```

#### Update Inventory Item

```
PUT /inventory/:id
```

Request body:
```json
{
  "price": 32.99,
  "quantity": 85,
  "location": "Warehouse B, Shelf D2"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c88",
  "name": "New Product",
  "description": "New product description",
  "category": "Office Supplies",
  "price": 32.99,
  "quantity": 85,
  "sku": "PROD-B-002",
  "supplier": "Supplier Inc.",
  "location": "Warehouse B, Shelf D2",
  "createdAt": "2023-04-22T16:45:33.123Z",
  "updatedAt": "2023-04-23T09:12:45.678Z"
}
```

#### Delete Inventory Item

```
DELETE /inventory/:id
```

Response:
```json
{
  "message": "Inventory item deleted successfully"
}
```

### Contracts

#### Get All Contracts

```
GET /contracts
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (draft, active, expired, terminated)
- `clientId`: Filter by client ID
- `from`: Start date filter (YYYY-MM-DD)
- `to`: End date filter (YYYY-MM-DD)

Response:
```json
{
  "contracts": [
    {
      "id": "60d21b4667d0d8992e610c89",
      "title": "Service Agreement",
      "clientId": "60d21b4667d0d8992e610c90",
      "clientName": "Client Company Inc.",
      "startDate": "2023-05-01T00:00:00.000Z",
      "endDate": "2024-04-30T23:59:59.999Z",
      "status": "active",
      "value": 25000.00,
      "createdAt": "2023-04-15T14:22:33.123Z"
    },
    // More contracts...
  ],
  "pagination": {
    "total": 45,
    "pages": 5,
    "currentPage": 1,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Contract by ID

```
GET /contracts/:id
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c89",
  "title": "Service Agreement",
  "description": "Annual IT service and support contract",
  "clientId": "60d21b4667d0d8992e610c90",
  "clientName": "Client Company Inc.",
  "startDate": "2023-05-01T00:00:00.000Z",
  "endDate": "2024-04-30T23:59:59.999Z",
  "status": "active",
  "value": 25000.00,
  "termsAndConditions": "Detailed terms and conditions...",
  "attachments": ["url1", "url2"],
  "notes": "Contract negotiations completed on April 10",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-04-15T14:22:33.123Z",
  "updatedAt": "2023-04-18T09:45:12.345Z"
}
```

#### Create Contract

```
POST /contracts
```

Request body:
```json
{
  "title": "New Contract",
  "description": "Software development contract",
  "clientId": "60d21b4667d0d8992e610c91",
  "startDate": "2023-06-01",
  "endDate": "2023-12-31",
  "value": 50000.00,
  "termsAndConditions": "Contract terms...",
  "notes": "Preliminary agreement reached"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c92",
  "title": "New Contract",
  "description": "Software development contract",
  "clientId": "60d21b4667d0d8992e610c91",
  "clientName": "Another Client LLC",
  "startDate": "2023-06-01T00:00:00.000Z",
  "endDate": "2023-12-31T23:59:59.999Z",
  "status": "draft",
  "value": 50000.00,
  "termsAndConditions": "Contract terms...",
  "notes": "Preliminary agreement reached",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-04-25T11:30:45.678Z"
}
```

#### Update Contract

```
PUT /contracts/:id
```

Request body:
```json
{
  "status": "active",
  "value": 52000.00,
  "notes": "Contract finalized and signed on April 27"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c92",
  "title": "New Contract",
  "description": "Software development contract",
  "clientId": "60d21b4667d0d8992e610c91",
  "clientName": "Another Client LLC",
  "startDate": "2023-06-01T00:00:00.000Z",
  "endDate": "2023-12-31T23:59:59.999Z",
  "status": "active",
  "value": 52000.00,
  "termsAndConditions": "Contract terms...",
  "notes": "Contract finalized and signed on April 27",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-04-25T11:30:45.678Z",
  "updatedAt": "2023-04-27T14:15:22.345Z"
}
```

#### Delete Contract

```
DELETE /contracts/:id
```

Response:
```json
{
  "message": "Contract deleted successfully"
}
```

### Invoices

#### Get All Invoices

```
GET /invoices
```

Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (draft, sent, paid, overdue, cancelled)
- `clientId`: Filter by client ID
- `contractId`: Filter by contract ID
- `from`: Issue date filter (YYYY-MM-DD)
- `to`: Due date filter (YYYY-MM-DD)

Response:
```json
{
  "invoices": [
    {
      "id": "60d21b4667d0d8992e610c93",
      "invoiceNumber": "INV-2023-001",
      "clientId": "60d21b4667d0d8992e610c90",
      "clientName": "Client Company Inc.",
      "contractId": "60d21b4667d0d8992e610c89",
      "issueDate": "2023-05-05T00:00:00.000Z",
      "dueDate": "2023-06-04T23:59:59.999Z",
      "status": "sent",
      "amount": 5000.00,
      "createdAt": "2023-05-05T10:15:22.123Z"
    },
    // More invoices...
  ],
  "pagination": {
    "total": 38,
    "pages": 4,
    "currentPage": 1,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Invoice by ID

```
GET /invoices/:id
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c93",
  "invoiceNumber": "INV-2023-001",
  "clientId": "60d21b4667d0d8992e610c90",
  "clientName": "Client Company Inc.",
  "clientEmail": "accounting@clientcompany.com",
  "clientAddress": "123 Client Street, City, Country",
  "contractId": "60d21b4667d0d8992e610c89",
  "contractTitle": "Service Agreement",
  "issueDate": "2023-05-05T00:00:00.000Z",
  "dueDate": "2023-06-04T23:59:59.999Z",
  "status": "sent",
  "items": [
    {
      "description": "Monthly IT Support - May 2023",
      "quantity": 1,
      "unitPrice": 5000.00,
      "amount": 5000.00
    }
  ],
  "subtotal": 5000.00,
  "taxRate": 0,
  "taxAmount": 0,
  "total": 5000.00,
  "notes": "Payment due within 30 days",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-05-05T10:15:22.123Z",
  "updatedAt": "2023-05-05T10:20:33.456Z"
}
```

#### Create Invoice

```
POST /invoices
```

Request body:
```json
{
  "clientId": "60d21b4667d0d8992e610c91",
  "contractId": "60d21b4667d0d8992e610c92",
  "issueDate": "2023-06-05",
  "dueDate": "2023-07-05",
  "items": [
    {
      "description": "Software Development - Milestone 1",
      "quantity": 1,
      "unitPrice": 15000.00
    }
  ],
  "taxRate": 10,
  "notes": "First invoice for the software development project"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c94",
  "invoiceNumber": "INV-2023-002",
  "clientId": "60d21b4667d0d8992e610c91",
  "clientName": "Another Client LLC",
  "clientEmail": "finance@anotherclient.com",
  "clientAddress": "456 Client Avenue, Town, Country",
  "contractId": "60d21b4667d0d8992e610c92",
  "contractTitle": "New Contract",
  "issueDate": "2023-06-05T00:00:00.000Z",
  "dueDate": "2023-07-05T23:59:59.999Z",
  "status": "draft",
  "items": [
    {
      "description": "Software Development - Milestone 1",
      "quantity": 1,
      "unitPrice": 15000.00,
      "amount": 15000.00
    }
  ],
  "subtotal": 15000.00,
  "taxRate": 10,
  "taxAmount": 1500.00,
  "total": 16500.00,
  "notes": "First invoice for the software development project",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-06-01T09:30:45.678Z"
}
```

#### Update Invoice

```
PUT /invoices/:id
```

Request body:
```json
{
  "status": "sent",
  "notes": "Invoice sent via email on June 5"
}
```

Response:
```json
{
  "id": "60d21b4667d0d8992e610c94",
  "invoiceNumber": "INV-2023-002",
  "clientId": "60d21b4667d0d8992e610c91",
  "clientName": "Another Client LLC",
  "clientEmail": "finance@anotherclient.com",
  "clientAddress": "456 Client Avenue, Town, Country",
  "contractId": "60d21b4667d0d8992e610c92",
  "contractTitle": "New Contract",
  "issueDate": "2023-06-05T00:00:00.000Z",
  "dueDate": "2023-07-05T23:59:59.999Z",
  "status": "sent",
  "items": [
    {
      "description": "Software Development - Milestone 1",
      "quantity": 1,
      "unitPrice": 15000.00,
      "amount": 15000.00
    }
  ],
  "subtotal": 15000.00,
  "taxRate": 10,
  "taxAmount": 1500.00,
  "total": 16500.00,
  "notes": "Invoice sent via email on June 5",
  "createdBy": "60d21b4667d0d8992e610c85",
  "createdAt": "2023-06-01T09:30:45.678Z",
  "updatedAt": "2023-06-05T14:22:33.456Z"
}
```

#### Delete Invoice

```
DELETE /invoices/:id
```

Response:
```json
{
  "message": "Invoice deleted successfully"
}
```

### Dashboard Analytics

#### Get Dashboard Metrics

```
GET /analytics/dashboard
```

Query parameters:
- `period`: Time period (day, week, month, year) - default: month
- `from`: Start date (YYYY-MM-DD)
- `to`: End date (YYYY-MM-DD)

Response:
```json
{
  "totalRevenue": 75000.00,
  "invoicingMetrics": {
    "totalInvoiced": 85000.00,
    "totalPaid": 75000.00,
    "totalOverdue": 10000.00,
    "invoicesByStatus": {
      "draft": 3,
      "sent": 5,
      "paid": 15,
      "overdue": 2,
      "cancelled": 1
    }
  },
  "inventoryMetrics": {
    "totalItems": 250,
    "lowStockItems": 15,
    "topCategories": [
      { "category": "Electronics", "count": 85 },
      { "category": "Office Supplies", "count": 72 },
      { "category": "Furniture", "count": 45 }
    ]
  },
  "contractMetrics": {
    "activeContracts": 18,
    "expiringContracts": 3,
    "totalContractValue": 450000.00
  },
  "revenueChart": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "data": [12000, 15000, 10000, 14000, 12000, 12000]
  }
}
```

## Webhook Notifications

The API supports webhook notifications for important events. Configure your webhook endpoints in the settings.

### Available Events

- `invoice.created`
- `invoice.paid`
- `invoice.overdue`
- `contract.created`
- `contract.expiringSoon`
- `contract.expired`
- `inventory.lowStock`

### Webhook Payload Example

```json
{
  "event": "invoice.paid",
  "timestamp": "2023-06-10T15:30:45.123Z",
  "data": {
    "invoiceId": "60d21b4667d0d8992e610c94",
    "invoiceNumber": "INV-2023-002",
    "clientId": "60d21b4667d0d8992e610c91",
    "clientName": "Another Client LLC",
    "amount": 16500.00,
    "paidDate": "2023-06-10T15:25:33.456Z"
  }
}
```

## Rate Limiting

API requests are rate limited to:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in API responses:
- `X-RateLimit-Limit`: Maximum requests allowed in the time window
- `X-RateLimit-Remaining`: Requests remaining in the current time window
- `X-RateLimit-Reset`: Time (in seconds) until the rate limit resets

## API Versioning

The API uses URL versioning. The current version is v1:

```
/api/v1/resource
```

When a new version is released, both versions will be maintained for a deprecation period.

## Testing the API

You can test the API using tools like Postman or cURL.

Example cURL command:

```bash
curl -X GET \
  https://your-domain.com/api/users \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
  -H 'Content-Type: application/json'
```
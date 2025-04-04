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

### Error Codes
| Code    | Description           |
|---------|----------------------|
| AUTH001 | Invalid credentials  |
| AUTH002 | Token expired        |
| INV001  | Item not found      |
| INV002  | Insufficient stock  |

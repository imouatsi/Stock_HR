# Database Documentation

## Collections

### Users
```typescript
interface User {
  _id: ObjectId;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  lastLogin: Date;
}

Indexes:
- email (unique)
- role
- lastLogin
```

### Inventory
```typescript
interface InventoryItem {
  _id: ObjectId;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  category: string;
  supplier: string;
  reorderPoint: number;
}

Indexes:
- sku (unique)
- category
- supplier
```

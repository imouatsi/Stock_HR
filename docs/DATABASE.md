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

## Schema

### User Schema
```typescript
interface IUser {
  username: string;      // Format: SA00000, UA00001, U00002
  password: string;      // Hashed
  role: 'superadmin' | 'admin' | 'user';
  isAuthorized: boolean;
  firstName?: string;
  lastName?: string;
  permissions: string[];
  settings: {
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  };
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### User Model
```typescript
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    match: [/^(SA|UA|U)\d{5}$/, 'Invalid username format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin', 'user'],
    default: 'user'
  },
  isAuthorized: {
    type: Boolean,
    default: false
  },
  firstName: String,
  lastName: String,
  permissions: [String],
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: String,
    notifications: Boolean
  },
  lastLogin: Date
}, {
  timestamps: true
});
```

## Indexes

### User Indexes
```typescript
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isAuthorized: 1 });
userSchema.index({ createdAt: 1 });
```

## Validation

### Username Validation
- Format: SA00000 (Superadmin), UA00001 (Admin), U00002 (User)
- Required field
- Unique constraint
- Regex pattern: /^(SA|UA|U)\d{5}$/

### Password Validation
- Required field
- Minimum length: 8 characters
- Must contain:
  - At least one number
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one special character

## Security

### Password Hashing
- Algorithm: bcrypt
- Salt rounds: 12
- Pre-save middleware

### Data Protection
- Password field excluded from queries
- Sensitive data encryption
- Access control
- Audit logging

## Queries

### User Queries
```typescript
// Find user by username
User.findOne({ username });

// Find authorized users
User.find({ isAuthorized: true });

// Find users by role
User.find({ role });

// Update user authorization
User.findByIdAndUpdate(id, { isAuthorized: true });

// Update user profile
User.findByIdAndUpdate(id, { firstName, lastName });

// Update user settings
User.findByIdAndUpdate(id, { 'settings.theme': theme });
```

## Maintenance

### Backups
1. Schedule regular backups
2. Store backups securely
3. Test restore process
4. Monitor backup status

### Optimization
1. Regular index maintenance
2. Query optimization
3. Performance monitoring
4. Resource usage tracking

## Best Practices

### Data Management
- Regular backups
- Data validation
- Access control
- Audit logging

### Performance
- Index optimization
- Query optimization
- Resource monitoring
- Regular maintenance

### Security
- Password hashing
- Data encryption
- Access control
- Security audits

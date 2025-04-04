export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'superadmin' | 'admin' | 'manager' | 'seller' | 'stock_clerk';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
} 
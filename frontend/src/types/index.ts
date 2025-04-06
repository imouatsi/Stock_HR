export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = 
  | 'superadmin'
  | 'admin'
  | 'manager'
  | 'seller'
  | 'stock_clerk'
  | 'hr_manager'
  | 'accountant'
  | 'stock_manager'
  | 'employee'
  | 'finance_manager';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: UserProfile;
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
} 
export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  HR_MANAGER = 'hr_manager',
  ACCOUNTANT = 'accountant',
  FINANCE_MANAGER = 'finance_manager',
  EMPLOYEE = 'employee'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  position?: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface UserProfile extends User {
  subscription?: {
    features: string[];
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 
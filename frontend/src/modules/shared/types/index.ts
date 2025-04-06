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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  settings: {
    emailNotifications: boolean;
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    accessibility: {
      highContrast: boolean;
      fontSize: 'small' | 'medium' | 'large';
    };
    workspace: {
      defaultView: string;
      sidebarCollapsed: boolean;
    };
  };
  organization: {
    department?: string;
    position?: string;
    employeeId?: string;
    joinDate?: Date;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  settings: {
    theme: 'light' | 'dark';
    language: string;
  };
} 
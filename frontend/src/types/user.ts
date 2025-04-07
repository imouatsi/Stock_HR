export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  HR = 'hr',
  ACCOUNTING = 'accounting',
  STOCK = 'stock'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
  };
}

export interface UserProfile {
  id: string;
  username: string;
  role: UserRole;
  email?: string;
  firstName?: string;
  lastName?: string;
  department?: string;
  position?: string;
  permissions: string[];
  settings?: {
    workspace?: {
      analytics?: {
        kpis?: {
          performance?: {
            skillMatrix?: {
              technical: Array<{ skill: string; level: number }>;
              soft: Array<{ skill: string; level: number }>;
            };
          };
        };
        gamification?: {
          enabled: boolean;
          points: number;
        };
      };
      collaboration?: {
        teams: Array<{
          id: string;
          name: string;
          members: string[];
        }>;
      };
    };
  };
  subscription?: {
    features: string[];
  };
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UserProfileFormData = Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
} 
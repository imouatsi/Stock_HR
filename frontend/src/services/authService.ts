import { api } from './api';
import { UserRole } from '../types/user';

export interface LoginCredentials {
  username: string;
  password: string;
  role: UserRole;
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

class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<UserProfile> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async resetPassword(email: string): Promise<void> {
    await api.post('/auth/reset-password', { email });
  }
}

export const authService = AuthService.getInstance(); 
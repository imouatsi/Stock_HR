import { api } from './api';
import { AxiosResponse } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    isActive: boolean;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: UserProfile;
  };
}

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/auth';

  private constructor() {
    // Initialize axios interceptors
    api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private setUser(user: UserProfile): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(`${this.baseUrl}/login`, {
        email,
        password,
      });
      
      if (response.data.token && response.data.data.user) {
        this.setToken(response.data.token);
        this.setUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(`${this.baseUrl}/register`, data);
      
      if (response.data.token && response.data.data.user) {
        this.setToken(response.data.token);
        this.setUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  public async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<{ data: { user: UserProfile } }>(`${this.baseUrl}/me`);
    return response.data.data.user;
  }

  public async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<{ data: { user: UserProfile } }>(`${this.baseUrl}/profile`, data);
    return response.data.data.user;
  }

  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.patch(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  public async forgotPassword(email: string): Promise<{ status: string; message: string }> {
    const response = await api.post<{ status: string; message: string }>(`${this.baseUrl}/forgot-password`, { email });
    return response.data;
  }

  public async resetPassword(token: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.baseUrl}/reset-password/${token}`, {
      password,
    });
    return response.data;
  }

  public logout(): void {
    this.clearAuth();
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getStoredUser(): UserProfile | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export default AuthService.getInstance(); 
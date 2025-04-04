import api from './api';

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
  createdAt: string;
  updatedAt: string;
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
    user: User;
  };
}

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/auth';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.baseUrl}/login`, {
      email,
      password,
    });
    return response.data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.baseUrl}/register`, data);
    return response.data;
  }

  public async getCurrentUser(): Promise<UserProfile> {
    const response = await api.get<UserProfile>(`${this.baseUrl}/me`);
    return response.data;
  }

  public async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch<UserProfile>(`${this.baseUrl}/profile`, data);
    return response.data;
  }

  public async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.patch(`${this.baseUrl}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  public async forgotPassword(email: string): Promise<{ status: string; message: string }> {
    const response = await api.post(`${this.baseUrl}/forgot-password`, { email });
    return response.data;
  }

  public async resetPassword(token: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.baseUrl}/reset-password`, {
      token,
      password,
    });
    return response.data;
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}

export default AuthService.getInstance(); 
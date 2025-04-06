import api from './api';
import { User } from '../types/user';

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface ResetPasswordRequest {
  targetUsername: string;
  newPassword: string;
}

class AuthService {
  private baseUrl = '/api/v1/auth';

  public async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${this.baseUrl}/login`, {
      username,
      password
    });
    return response.data;
  }

  public async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await api.post(`${this.baseUrl}/reset-password`, request);
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post(`${this.baseUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  public async updateProfile(profileData: Partial<User>): Promise<User> {
    const response = await api.patch<User>(`${this.baseUrl}/profile`, profileData);
    return response.data;
  }

  public async logout(): Promise<void> {
    await api.post(`${this.baseUrl}/logout`);
  }
}

export default new AuthService(); 
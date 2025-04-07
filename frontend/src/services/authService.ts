import { UserProfile } from '../types/user';
import api, { getApiResponse, handleApiError } from '../utils/api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ResetPasswordData {
  targetUsername: string;
  newPassword: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    try {
      const response = await api.post('/auth/login', credentials);
      return getApiResponse<UserProfile>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('/auth/profile');
      return getApiResponse<UserProfile>(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<void> {
    try {
      await api.post('/auth/reset-password', data);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export const authService = new AuthService(); 
import { api } from '@/lib/api';
import { UserProfile, LoginCredentials } from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: UserProfile; token: string }> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      this.setToken(token);
      this.setUser(user);
      return { user, token };
    } catch (error) {
      console.error('Error logging in:', error);
      throw new Error('Invalid credentials');
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      this.clearAuth();
    }
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      const response = await api.get<UserProfile>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setUser(user: UserProfile): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): UserProfile | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
}; 
import { api } from '@/lib/api';

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'manager';
  firstName?: string;
  lastName?: string;
};

export const authService = {
  async login(username: string, password: string): Promise<User> {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/login', {
        username,
        password,
      });

      const { user, token } = response.data;
      this.setToken(token);
      this.setUser(user);

      return user;
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

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<User>('/auth/me');
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

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
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

  hasRole(role: User['role']): boolean {
    const user = this.getUser();
    return user?.role === role || user?.role === 'admin';
  },
}; 
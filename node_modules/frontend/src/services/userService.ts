import axios from 'axios';
import { API_URL } from '../config';
import { User } from '../types/user';

class UserService {
  private static instance: UserService;
  private token: string | null = null;

  private constructor() {
    this.token = localStorage.getItem('token');
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw new Error('Network error occurred');
  }

  public async getUsers(): Promise<User[]> {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: this.getHeaders(),
      });
      return response.data.data.users;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getUser(id: string): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: this.getHeaders(),
      });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: this.getHeaders(),
      });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/${id}`, userData, {
        headers: this.getHeaders(),
      });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: this.getHeaders(),
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async getProfile(): Promise<User> {
    try {
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: this.getHeaders(),
      });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  public async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, userData, {
        headers: this.getHeaders(),
      });
      return response.data.data.user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export default UserService; 
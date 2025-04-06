import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  departmentId: string;
  positionId: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

interface UserPreferences {
  id: string;
  userId: string;
  theme: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: string;
    widgets: string[];
  };
}

interface UserActivity {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, any>;
  timestamp: string;
}

class UserService {
  private static instance: UserService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.USER_CREATED, this.handleUserCreated.bind(this));
    eventService.on(EventType.USER_UPDATED, this.handleUserUpdated.bind(this));
    eventService.on(EventType.USER_DELETED, this.handleUserDeleted.bind(this));
  }

  private async handleUserCreated(data: { userId: string; username: string }): Promise<void> {
    try {
      console.log(`User created: ${data.username}`);
    } catch (error) {
      console.error('Error handling user creation:', error);
    }
  }

  private async handleUserUpdated(data: { userId: string; changes: Partial<{ username: string; role: string }> }): Promise<void> {
    try {
      console.log(`User updated: ${data.userId}`, data.changes);
    } catch (error) {
      console.error('Error handling user update:', error);
    }
  }

  private async handleUserDeleted(data: { userId: string }): Promise<void> {
    try {
      console.log(`User deleted: ${data.userId}`);
    } catch (error) {
      console.error('Error handling user deletion:', error);
    }
  }

  public async getUsers(): Promise<User[]> {
    const response = await api.get('/users');
    return response.data;
  }

  public async getUser(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  public async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const response = await api.post('/users', user);
    return response.data;
  }

  public async updateUser(id: string, changes: Partial<User>): Promise<User> {
    const response = await api.patch(`/users/${id}`, changes);
    return response.data;
  }

  public async deleteUser(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  public async getUserPreferences(id: string): Promise<UserPreferences> {
    const response = await api.get(`/users/${id}/preferences`);
    return response.data;
  }

  public async updateUserPreferences(id: string, changes: Partial<UserPreferences>): Promise<UserPreferences> {
    const response = await api.patch(`/users/${id}/preferences`, changes);
    return response.data;
  }

  public async getUserActivities(id: string): Promise<UserActivity[]> {
    const response = await api.get(`/users/${id}/activities`);
    return response.data;
  }

  public async changeUserRole(id: string, role: string): Promise<void> {
    await api.post(`/users/${id}/role`, { role });
  }

  public async toggleUserStatus(id: string): Promise<void> {
    await api.post(`/users/${id}/toggle-status`);
  }

  public async resetUserPassword(id: string): Promise<void> {
    await api.post(`/users/${id}/reset-password`);
  }

  public async updateUserPassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    await api.post(`/users/${id}/password`, { currentPassword, newPassword });
  }

  public async getUserPermissions(id: string): Promise<string[]> {
    const response = await api.get(`/users/${id}/permissions`);
    return response.data;
  }

  public async updateUserPermissions(id: string, permissions: string[]): Promise<void> {
    await api.post(`/users/${id}/permissions`, { permissions });
  }
}

export const userService = UserService.getInstance(); 
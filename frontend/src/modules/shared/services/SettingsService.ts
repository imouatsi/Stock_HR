import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

export enum SettingType {
  SYSTEM = 'system',
  USER = 'user',
  DEPARTMENT = 'department',
  COMPANY = 'company'
}

export interface Setting {
  id: string;
  type: SettingType;
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface UserSetting {
  id: string;
  userId: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentSetting {
  id: string;
  departmentId: string;
  key: string;
  value: any;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CompanySetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

class SettingsService {
  private static instance: SettingsService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.SETTING_UPDATED, this.handleSettingUpdated);
  }

  public static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async getSettings(type?: SettingType): Promise<Setting[]> {
    const response = await api.get('/settings', { params: { type } });
    return response.data;
  }

  async getSetting(id: string): Promise<Setting> {
    const response = await api.get(`/settings/${id}`);
    return response.data;
  }

  async createSetting(data: Omit<Setting, 'id' | 'createdBy' | 'createdAt' | 'updatedBy' | 'updatedAt'>): Promise<Setting> {
    const response = await api.post('/settings', data);
    return response.data;
  }

  async updateSetting(id: string, data: Partial<Setting>): Promise<Setting> {
    const response = await api.put(`/settings/${id}`, data);
    return response.data;
  }

  async deleteSetting(id: string): Promise<void> {
    await api.delete(`/settings/${id}`);
  }

  async getUserSettings(userId: string): Promise<UserSetting[]> {
    const response = await api.get(`/settings/user/${userId}`);
    return response.data;
  }

  async getUserSetting(userId: string, key: string): Promise<UserSetting> {
    const response = await api.get(`/settings/user/${userId}/${key}`);
    return response.data;
  }

  async updateUserSetting(userId: string, key: string, value: any): Promise<UserSetting> {
    const response = await api.put(`/settings/user/${userId}/${key}`, { value });
    return response.data;
  }

  async getDepartmentSettings(departmentId: string): Promise<DepartmentSetting[]> {
    const response = await api.get(`/settings/department/${departmentId}`);
    return response.data;
  }

  async getDepartmentSetting(departmentId: string, key: string): Promise<DepartmentSetting> {
    const response = await api.get(`/settings/department/${departmentId}/${key}`);
    return response.data;
  }

  async updateDepartmentSetting(departmentId: string, key: string, value: any): Promise<DepartmentSetting> {
    const response = await api.put(`/settings/department/${departmentId}/${key}`, { value });
    return response.data;
  }

  async getCompanySettings(): Promise<CompanySetting[]> {
    const response = await api.get('/settings/company');
    return response.data;
  }

  async getCompanySetting(key: string): Promise<CompanySetting> {
    const response = await api.get(`/settings/company/${key}`);
    return response.data;
  }

  async updateCompanySetting(key: string, value: any): Promise<CompanySetting> {
    const response = await api.put(`/settings/company/${key}`, { value });
    return response.data;
  }

  private async handleSettingUpdated(data: { setting: Setting }): Promise<void> {
    try {
      // Handle setting updated event
      console.log('Setting updated:', data.setting);
    } catch (error) {
      console.error('Failed to handle setting updated:', error);
    }
  }
}

export const settingsService = SettingsService.getInstance(); 
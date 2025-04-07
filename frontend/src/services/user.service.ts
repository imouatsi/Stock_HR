import { UserRole, UserAccount, Role } from '@/types/core.types';
import { apiService } from './api.service';
import { auditService } from './audit.service';

class UserService {
  private readonly rolePrefixes: Record<UserRole, string> = {
    'SU': 'SU', // Super User (Developer)
    'UA': 'UA', // User Admin (Client)
    'HR': 'HR', // HR Personnel
    'ACC': 'ACC', // Accountant
    'MGR': 'MGR', // Manager
    'STK': 'STK', // Stock Clerk
    'SLR': 'SLR', // Seller
  };

  async generateUsername(role: UserRole, employeeId: string): Promise<string> {
    try {
      const prefix = this.rolePrefixes[role];
      const response = await apiService.get<{ nextNumber: number }>(
        `/users/next-number/${prefix}`
      );
      const nextNumber = response.data?.nextNumber || 1;
      return `${prefix}${String(nextNumber).padStart(5, '0')}`;
    } catch (error) {
      console.error('Failed to generate username:', error);
      throw new Error('Failed to generate username');
    }
  }

  async createUserAccount(employeeId: string, role: UserRole): Promise<UserAccount> {
    try {
      const username = await this.generateUsername(role, employeeId);
      const response = await apiService.post<UserAccount>('/users', {
        username,
        role,
        employeeId,
        isActive: true,
        isAuthorized: false,
      });

      await auditService.logAction(
        'CREATE_USER_ACCOUNT',
        'UserAccount',
        response.data?.id || '',
        { username, role, employeeId }
      );

      return response.data!;
    } catch (error) {
      console.error('Failed to create user account:', error);
      throw new Error('Failed to create user account');
    }
  }

  async authorizeUserAccount(userId: string, authorizedBy: string): Promise<UserAccount> {
    try {
      const response = await apiService.put<UserAccount>(`/users/${userId}/authorize`, {
        authorizedBy,
      });

      await auditService.logAction(
        'AUTHORIZE_USER_ACCOUNT',
        'UserAccount',
        userId,
        { authorizedBy }
      );

      return response.data!;
    } catch (error) {
      console.error('Failed to authorize user account:', error);
      throw new Error('Failed to authorize user account');
    }
  }

  async getRoles(): Promise<Role[]> {
    try {
      const response = await apiService.get<Role[]>('/roles');
      return response.data || [];
    } catch (error) {
      console.error('Failed to get roles:', error);
      throw new Error('Failed to get roles');
    }
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    try {
      const response = await apiService.post<Role>('/roles', role);

      await auditService.logAction(
        'CREATE_ROLE',
        'Role',
        response.data?.id || '',
        { role: response.data }
      );

      return response.data!;
    } catch (error) {
      console.error('Failed to create role:', error);
      throw new Error('Failed to create role');
    }
  }

  async updateRole(roleId: string, role: Partial<Role>): Promise<Role> {
    try {
      const response = await apiService.put<Role>(`/roles/${roleId}`, role);

      await auditService.logAction(
        'UPDATE_ROLE',
        'Role',
        roleId,
        { role: response.data }
      );

      return response.data!;
    } catch (error) {
      console.error('Failed to update role:', error);
      throw new Error('Failed to update role');
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      await apiService.delete(`/roles/${roleId}`);

      await auditService.logAction(
        'DELETE_ROLE',
        'Role',
        roleId,
        {}
      );
    } catch (error) {
      console.error('Failed to delete role:', error);
      throw new Error('Failed to delete role');
    }
  }
}

export const userService = new UserService(); 
import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  parentId?: string;
  managerId?: string;
  budget: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface DepartmentStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPositions: number;
  filledPositions: number;
  budget: {
    allocated: number;
    spent: number;
    remaining: number;
  };
  assets: {
    total: number;
    assigned: number;
    available: number;
  };
}

interface DepartmentHierarchy {
  id: string;
  name: string;
  children: DepartmentHierarchy[];
}

class DepartmentService {
  private static instance: DepartmentService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): DepartmentService {
    if (!DepartmentService.instance) {
      DepartmentService.instance = new DepartmentService();
    }
    return DepartmentService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.DEPARTMENT_CREATED, this.handleDepartmentCreated.bind(this));
    eventService.on(EventType.DEPARTMENT_UPDATED, this.handleDepartmentUpdated.bind(this));
    eventService.on(EventType.DEPARTMENT_DELETED, this.handleDepartmentDeleted.bind(this));
  }

  private async handleDepartmentCreated(data: { departmentId: string; name: string }): Promise<void> {
    try {
      console.log(`Department created: ${data.name}`);
    } catch (error) {
      console.error('Error handling department creation:', error);
    }
  }

  private async handleDepartmentUpdated(data: { departmentId: string; changes: Partial<{ name: string; code: string }> }): Promise<void> {
    try {
      console.log(`Department updated: ${data.departmentId}`, data.changes);
    } catch (error) {
      console.error('Error handling department update:', error);
    }
  }

  private async handleDepartmentDeleted(data: { departmentId: string }): Promise<void> {
    try {
      console.log(`Department deleted: ${data.departmentId}`);
    } catch (error) {
      console.error('Error handling department deletion:', error);
    }
  }

  public async getDepartments(): Promise<Department[]> {
    const response = await api.get('/departments');
    return response.data;
  }

  public async getDepartment(id: string): Promise<Department> {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  }

  public async createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const response = await api.post('/departments', department);
    return response.data;
  }

  public async updateDepartment(id: string, changes: Partial<Department>): Promise<Department> {
    const response = await api.patch(`/departments/${id}`, changes);
    return response.data;
  }

  public async deleteDepartment(id: string): Promise<void> {
    await api.delete(`/departments/${id}`);
  }

  public async getDepartmentStats(id: string): Promise<DepartmentStats> {
    const response = await api.get(`/departments/${id}/stats`);
    return response.data;
  }

  public async getDepartmentHierarchy(): Promise<DepartmentHierarchy> {
    const response = await api.get('/departments/hierarchy');
    return response.data;
  }

  public async getSubDepartments(id: string): Promise<Department[]> {
    const response = await api.get(`/departments/${id}/sub-departments`);
    return response.data;
  }

  public async getDepartmentEmployees(id: string): Promise<any[]> {
    const response = await api.get(`/departments/${id}/employees`);
    return response.data;
  }

  public async getDepartmentPositions(id: string): Promise<any[]> {
    const response = await api.get(`/departments/${id}/positions`);
    return response.data;
  }

  public async getDepartmentAssets(id: string): Promise<any[]> {
    const response = await api.get(`/departments/${id}/assets`);
    return response.data;
  }
}

export const departmentService = DepartmentService.getInstance(); 
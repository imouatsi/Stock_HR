import { Department, DepartmentFormData, DepartmentFilters } from '../types/department.types';

class DepartmentService {
  private static instance: DepartmentService;
  private baseUrl = '/api/departments';

  private constructor() {}

  public static getInstance(): DepartmentService {
    if (!DepartmentService.instance) {
      DepartmentService.instance = new DepartmentService();
    }
    return DepartmentService.instance;
  }

  async getDepartments(filters?: DepartmentFilters): Promise<Department[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch departments');
    return response.json();
  }

  async getDepartment(id: string): Promise<Department> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch department');
    return response.json();
  }

  async createDepartment(data: DepartmentFormData): Promise<Department> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create department');
    return response.json();
  }

  async updateDepartment(id: string, data: Partial<DepartmentFormData>): Promise<Department> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update department');
    return response.json();
  }

  async deleteDepartment(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete department');
  }
}

export const departmentService = DepartmentService.getInstance(); 
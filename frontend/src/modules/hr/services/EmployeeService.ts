import { Employee, EmployeeFormData, EmployeeFilters } from '../types/employee.types';

class EmployeeService {
  private static instance: EmployeeService;
  private baseUrl = '/api/employees';

  private constructor() {}

  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  async getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value.toString());
      });
    }

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  }

  async getEmployee(id: string): Promise<Employee> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch employee');
    return response.json();
  }

  async createEmployee(data: EmployeeFormData): Promise<Employee> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  }

  async updateEmployee(id: string, data: Partial<EmployeeFormData>): Promise<Employee> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'documents' && Array.isArray(value)) {
        value.forEach((file, index) => {
          formData.append(`documents[${index}]`, file);
        });
      } else if (value !== undefined) {
        formData.append(key, value as string);
      }
    });

    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  }

  async deleteEmployee(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
  }
}

export const employeeService = EmployeeService.getInstance(); 
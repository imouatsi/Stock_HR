import { api } from '../../services/api';
import { eventService, EventType } from './EventService';
import { EmployeeStatus } from '../types/EmployeeStatus';

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  positionId: string;
  managerId?: string;
  hireDate: string;
  terminationDate?: string;
  status: EmployeeStatus;
  salary: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents: {
    id: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
}

interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  terminatedEmployees: number;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
}

interface EmployeeSearchFilter {
  departmentId?: string;
  positionId?: string;
  status?: EmployeeStatus;
  minSalary?: number;
  maxSalary?: number;
  hireDateFrom?: string;
  hireDateTo?: string;
}

class EmployeeService {
  private static instance: EmployeeService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.EMPLOYEE_CREATED, this.handleEmployeeCreated.bind(this));
    eventService.on(EventType.EMPLOYEE_UPDATED, this.handleEmployeeUpdated.bind(this));
    eventService.on(EventType.EMPLOYEE_DELETED, this.handleEmployeeDeleted.bind(this));
    eventService.on(EventType.EMPLOYEE_STATUS_CHANGED, this.handleEmployeeStatusChanged.bind(this));
  }

  private async handleEmployeeCreated(data: { employeeId: string; name: string; role: string }): Promise<void> {
    try {
      console.log(`Employee created: ${data.name} (${data.role})`);
    } catch (error) {
      console.error('Error handling employee creation:', error);
    }
  }

  private async handleEmployeeUpdated(data: { employeeId: string; changes: Partial<{ name: string; role: string }> }): Promise<void> {
    try {
      console.log(`Employee updated: ${data.employeeId}`, data.changes);
    } catch (error) {
      console.error('Error handling employee update:', error);
    }
  }

  private async handleEmployeeDeleted(data: { employeeId: string }): Promise<void> {
    try {
      console.log(`Employee deleted: ${data.employeeId}`);
    } catch (error) {
      console.error('Error handling employee deletion:', error);
    }
  }

  private async handleEmployeeStatusChanged(data: { employeeId: string; oldStatus: EmployeeStatus; newStatus: EmployeeStatus }): Promise<void> {
    try {
      console.log(`Employee status changed: ${data.employeeId} from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling employee status change:', error);
    }
  }

  public async getEmployees(filter?: EmployeeSearchFilter): Promise<Employee[]> {
    const response = await api.get('/employees', { params: filter });
    return response.data;
  }

  public async getEmployee(id: string): Promise<Employee> {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  }

  public async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const response = await api.post('/employees', employee);
    return response.data;
  }

  public async updateEmployee(id: string, changes: Partial<Employee>): Promise<Employee> {
    const response = await api.patch(`/employees/${id}`, changes);
    return response.data;
  }

  public async deleteEmployee(id: string): Promise<void> {
    await api.delete(`/employees/${id}`);
  }

  public async getEmployeeStats(): Promise<EmployeeStats> {
    const response = await api.get('/employees/stats');
    return response.data;
  }

  public async getEmployeeDocuments(id: string): Promise<Employee['documents']> {
    const response = await api.get(`/employees/${id}/documents`);
    return response.data;
  }

  public async uploadEmployeeDocument(id: string, file: File): Promise<Employee['documents'][0]> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/employees/${id}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public async deleteEmployeeDocument(id: string, documentId: string): Promise<void> {
    await api.delete(`/employees/${id}/documents/${documentId}`);
  }
}

export const employeeService = EmployeeService.getInstance(); 
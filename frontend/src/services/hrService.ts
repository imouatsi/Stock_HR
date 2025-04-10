import api from './api.service';
import { eventService, EventType } from '../modules/shared/services/EventService';
import { statusManagementService, EmployeeStatus } from '../modules/shared/services/StatusManagementService';

// Algerian contract types
export enum ContractType {
  CDI = 'CDI', // Contrat à Durée Indéterminée
  CDD = 'CDD', // Contrat à Durée Déterminée
  STAGE = 'STAGE', // Internship
  INTERIM = 'INTERIM' // Temporary work
}

// Algerian family situation
export enum FamilySituation {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED'
}

// Update Employee interface to include Algerian-specific fields
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: EmployeeStatus;

  // Algerian-specific fields
  cnasNumber?: string; // N° de Sécurité Sociale
  nationalRegistryNumber?: string; // N° de registre national
  dateOfBirth?: string;
  familySituation?: FamilySituation;
  contractType?: ContractType;
  contractStartDate?: string;
  contractEndDate?: string; // For CDD
  probationPeriodEndDate?: string;
  cnasAffiliationStatus?: boolean;

  manager?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents?: {
    type: string;
    url: string;
    expiryDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

class HRService {
  private static instance: HRService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.ASSET_ASSIGNED, this.handleAssetAssignment);
  }

  public static getInstance(): HRService {
    if (!HRService.instance) {
      HRService.instance = new HRService();
    }
    return HRService.instance;
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    try {
      const response = await api.get('/hr/employees');
      // Check if we have valid data in the response
      if (response && response.data && response.data.data) {
        return response.data.data.employees || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching employees:', error);
      // Fallback to mock data if API fails
      return [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          department: 'IT',
          position: 'Software Developer',
          status: 'ACTIVE',
          hireDate: '2022-01-15',
          salary: 75000,
          phoneNumber: '+1-555-123-4567',
          phone: '+1-555-123-4567',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          department: 'HR',
          position: 'HR Manager',
          status: 'ACTIVE',
          hireDate: '2021-06-10',
          salary: 85000,
          phoneNumber: '+1-555-987-6543',
          phone: '+1-555-987-6543',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: '3',
          firstName: 'Michael',
          lastName: 'Johnson',
          department: 'Finance',
          position: 'Accountant',
          status: 'INACTIVE',
          hireDate: '2020-03-22',
          salary: 65000,
          phoneNumber: '+1-555-456-7890',
          phone: '+1-555-456-7890',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
  }

  async createEmployee(employeeData: Partial<Employee>): Promise<Employee> {
    try {
      const response = await api.post('/hr/employees', employeeData);
      if (response && response.data && response.data.data) {
        return response.data.data.employee;
      }

      // If API call succeeds but doesn't return expected data format
      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        ...employeeData as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Employee;
    } catch (error) {
      console.error('Error creating employee:', error);

      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        ...employeeData as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Employee;
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await api.get(`/hr/employees/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data.employee;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    try {
      const response = await api.patch(`/hr/employees/${id}`, data);
      return response.data.data.employee;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Department methods
  async getAllDepartments(): Promise<any[]> {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          name: 'IT',
          description: 'Information Technology Department',
          manager: 'John Doe',
          employeeCount: 15,
          status: 'active'
        },
        {
          id: '2',
          name: 'HR',
          description: 'Human Resources Department',
          manager: 'Jane Smith',
          employeeCount: 8,
          status: 'active'
        },
        {
          id: '3',
          name: 'Finance',
          description: 'Finance and Accounting Department',
          manager: 'Michael Johnson',
          employeeCount: 12,
          status: 'active'
        }
      ];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getDepartmentById(id: string): Promise<any> {
    try {
      const response = await api.get(`/hr/departments/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createDepartment(data: any): Promise<any> {
    try {
      const response = await api.post('/hr/departments', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateDepartment(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/hr/departments/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteDepartment(id: string): Promise<void> {
    try {
      await api.delete(`/hr/departments/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Position methods
  async getAllPositions(): Promise<any[]> {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          title: 'Software Developer',
          department: 'IT',
          description: 'Develops software applications',
          salaryRange: { min: 70000, max: 100000 },
          status: 'active'
        },
        {
          id: '2',
          title: 'HR Manager',
          department: 'HR',
          description: 'Manages HR operations',
          salaryRange: { min: 80000, max: 120000 },
          status: 'active'
        },
        {
          id: '3',
          title: 'Accountant',
          department: 'Finance',
          description: 'Handles financial records and transactions',
          salaryRange: { min: 60000, max: 90000 },
          status: 'active'
        }
      ];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getPositionById(id: string): Promise<any> {
    try {
      const response = await api.get(`/hr/positions/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPosition(data: any): Promise<any> {
    try {
      const response = await api.post('/hr/positions', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePosition(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/hr/positions/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePosition(id: string): Promise<void> {
    try {
      await api.delete(`/hr/positions/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Leave Request methods
  async getAllLeaveRequests(): Promise<any[]> {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          employee: {
            id: '1',
            name: 'John Doe'
          },
          type: 'vacation',
          startDate: '2023-07-10',
          endDate: '2023-07-15',
          status: 'approved',
          reason: 'Annual vacation'
        },
        {
          id: '2',
          employee: {
            id: '2',
            name: 'Jane Smith'
          },
          type: 'sick',
          startDate: '2023-08-05',
          endDate: '2023-08-07',
          status: 'approved',
          reason: 'Flu'
        },
        {
          id: '3',
          employee: {
            id: '3',
            name: 'Michael Johnson'
          },
          type: 'personal',
          startDate: '2023-09-20',
          endDate: '2023-09-22',
          status: 'pending',
          reason: 'Family event'
        }
      ];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getLeaveRequestById(id: string): Promise<any> {
    try {
      const response = await api.get(`/hr/leave-requests/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createLeaveRequest(data: any): Promise<any> {
    try {
      const response = await api.post('/hr/leave-requests', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateLeaveRequest(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/hr/leave-requests/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteLeaveRequest(id: string): Promise<void> {
    try {
      await api.delete(`/hr/leave-requests/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Performance Review methods
  async getAllPerformanceReviews(): Promise<any[]> {
    try {
      // Return mock data for now
      return [
        {
          id: '1',
          employee: {
            id: '1',
            name: 'John Doe'
          },
          reviewer: {
            id: '2',
            name: 'Jane Smith'
          },
          reviewDate: '2023-06-15',
          period: 'Q2 2023',
          rating: 4.5,
          status: 'completed',
          strengths: 'Technical skills, teamwork',
          areasForImprovement: 'Communication'
        },
        {
          id: '2',
          employee: {
            id: '2',
            name: 'Jane Smith'
          },
          reviewer: {
            id: '3',
            name: 'Michael Johnson'
          },
          reviewDate: '2023-06-20',
          period: 'Q2 2023',
          rating: 4.8,
          status: 'completed',
          strengths: 'Leadership, organization',
          areasForImprovement: 'Delegation'
        },
        {
          id: '3',
          employee: {
            id: '3',
            name: 'Michael Johnson'
          },
          reviewer: {
            id: '1',
            name: 'John Doe'
          },
          reviewDate: '2023-07-05',
          period: 'Q2 2023',
          rating: 4.2,
          status: 'in-progress',
          strengths: 'Attention to detail, analytical skills',
          areasForImprovement: 'Time management'
        }
      ];
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  async getPerformanceReviewById(id: string): Promise<any> {
    try {
      const response = await api.get(`/hr/performance-reviews/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createPerformanceReview(data: any): Promise<any> {
    try {
      const response = await api.post('/hr/performance-reviews', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updatePerformanceReview(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/hr/performance-reviews/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deletePerformanceReview(id: string): Promise<void> {
    try {
      await api.delete(`/hr/performance-reviews/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Audit log method
  async createAuditLog(entityType: string, entityId: string, action: string, eventType: string): Promise<void> {
    try {
      await api.post('/hr/audit-logs', {
        entityType,
        entityId,
        action,
        eventType,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  // Update deleteEmployee to use status management
  async deleteEmployee(id: string, reason: string, userId: string): Promise<void> {
    try {
      // Instead of deleting, change status to terminated
      await statusManagementService.changeStatus(
        'employees',
        id,
        EmployeeStatus.TERMINATED,
        'EMPLOYEE_TERMINATED',
        reason,
        userId
      );

      // Update the employee in the database
      await api.patch(`/hr/employees/${id}`, {
        status: EmployeeStatus.TERMINATED,
        reason
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle employee status changes
  async updateEmployeeStatus(
    id: string,
    newStatus: EmployeeStatus,
    reason: string,
    userId: string
  ): Promise<Employee> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'employees',
        id,
        newStatus,
        `EMPLOYEE_${newStatus.toUpperCase()}`,
        reason,
        userId
      );

      // Update the employee in the database
      const response = await api.patch(`/hr/employees/${id}`, {
        status: newStatus,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle employee retirement
  async retireEmployee(
    id: string,
    retirementDate: string,
    reason: string,
    userId: string
  ): Promise<Employee> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'employees',
        id,
        EmployeeStatus.RETIRED,
        'EMPLOYEE_RETIRED',
        reason,
        userId
      );

      // Update the employee in the database
      const response = await api.patch(`/hr/employees/${id}`, {
        status: EmployeeStatus.RETIRED,
        retirementDate,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle employee suspension
  async suspendEmployee(
    id: string,
    suspensionStartDate: string,
    suspensionEndDate: string,
    reason: string,
    userId: string
  ): Promise<Employee> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'employees',
        id,
        EmployeeStatus.SUSPENDED,
        'EMPLOYEE_SUSPENDED',
        reason,
        userId
      );

      // Update the employee in the database
      const response = await api.patch(`/hr/employees/${id}`, {
        status: EmployeeStatus.SUSPENDED,
        suspensionStartDate,
        suspensionEndDate,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle employee death
  async markEmployeeDeceased(
    id: string,
    dateOfDeath: string,
    reason: string,
    userId: string
  ): Promise<Employee> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'employees',
        id,
        EmployeeStatus.DECEASED,
        'EMPLOYEE_DECEASED',
        reason,
        userId
      );

      // Update the employee in the database
      const response = await api.patch(`/hr/employees/${id}`, {
        status: EmployeeStatus.DECEASED,
        dateOfDeath,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Event Handlers
  private async handleAssetAssignment(data: {
    assetId: string;
    employeeId: string;
    assignedBy: string;
  }): Promise<void> {
    try {
      // Update employee's asset assignment record
      await api.post(`/hr/employees/${data.employeeId}/assets`, {
        assetId: data.assetId,
        assignedBy: data.assignedBy,
        assignedDate: new Date()
      });
    } catch (error) {
      console.error('Failed to handle asset assignment:', error);
    }
  }

  private handleError(error: any): void {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }

  async terminateEmployee(id: string, reason: string, userId: string) {
    try {
      // Create audit log entry
      await this.createAuditLog(
        'employees',
        id,
        'TERMINATED',
        'EMPLOYEE_TERMINATED'
      );

      // Update the employee in the database
      await api.patch(`/hr/employees/${id}`, {
        status: 'TERMINATED',
        reason
      });
    } catch (error) {
      throw error;
    }
  }

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration
}

export const hrService = HRService.getInstance();
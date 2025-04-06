import { api } from './api';
import { eventService, EventType } from '../modules/shared/services/EventService';
import { statusManagementService, EmployeeStatus } from '../modules/shared/services/StatusManagementService';

// Update Employee interface to include status
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: EmployeeStatus;
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

  // ... existing methods ...

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

  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }
}

export const hrService = HRService.getInstance(); 
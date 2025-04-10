import api from './api.service';

// Algerian leave types
export enum LeaveType {
  ANNUAL = 'ANNUAL', // Congé annuel (30 days minimum)
  SICK = 'SICK', // Congé maladie (requires CNAS justification)
  MATERNITY = 'MATERNITY', // Congé maternité (14 weeks)
  UNPAID = 'UNPAID', // Congé sans solde
  PUBLIC_HOLIDAY = 'PUBLIC_HOLIDAY' // Jour férié
}

// Leave request status
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

// Leave request interface
export interface LeaveRequest {
  _id: string;
  employeeId: string;
  employeeName?: string; // For display purposes
  type: LeaveType;
  startDate: string;
  endDate: string;
  duration: number; // In days
  reason?: string;
  status: LeaveStatus;
  cnasJustification?: string; // For sick leave
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Algerian public holidays for the current year
export const ALGERIAN_PUBLIC_HOLIDAYS = [
  { date: '2023-01-01', name: 'New Year\'s Day' },
  { date: '2023-01-12', name: 'Yennayer (Amazigh New Year)' },
  { date: '2023-05-01', name: 'Labour Day' },
  { date: '2023-07-05', name: 'Independence Day' },
  { date: '2023-11-01', name: 'Revolution Day' },
  // Islamic holidays (approximate dates for 2023, should be updated yearly)
  { date: '2023-04-21', name: 'Eid al-Fitr' },
  { date: '2023-04-22', name: 'Eid al-Fitr (2nd day)' },
  { date: '2023-06-28', name: 'Eid al-Adha' },
  { date: '2023-06-29', name: 'Eid al-Adha (2nd day)' },
  { date: '2023-07-19', name: 'Islamic New Year' },
  { date: '2023-09-27', name: 'Mawlid' }
];

class LeaveService {
  private static instance: LeaveService;

  private constructor() {}

  public static getInstance(): LeaveService {
    if (!LeaveService.instance) {
      LeaveService.instance = new LeaveService();
    }
    return LeaveService.instance;
  }

  // Get all leave requests
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await api.get('/hr/leaves');
      if (response && response.data && response.data.data) {
        return response.data.data.leaves || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      // Return mock data if API fails
      return this.getMockLeaveRequests();
    }
  }

  // Get leave requests for a specific employee
  async getEmployeeLeaveRequests(employeeId: string): Promise<LeaveRequest[]> {
    try {
      const response = await api.get(`/hr/employees/${employeeId}/leaves`);
      if (response && response.data && response.data.data) {
        return response.data.data.leaves || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching leave requests for employee ${employeeId}:`, error);
      // Return mock data if API fails
      return this.getMockLeaveRequests().filter(leave => leave.employeeId === employeeId);
    }
  }

  // Create a new leave request
  async createLeaveRequest(leaveData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    try {
      const response = await api.post('/hr/leaves', leaveData);
      if (response && response.data && response.data.data) {
        return response.data.data.leave;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error creating leave request:', error);
      
      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        employeeId: leaveData.employeeId || '',
        employeeName: leaveData.employeeName || 'Employee Name',
        type: leaveData.type || LeaveType.ANNUAL,
        startDate: leaveData.startDate || new Date().toISOString(),
        endDate: leaveData.endDate || new Date().toISOString(),
        duration: leaveData.duration || 1,
        reason: leaveData.reason || '',
        status: LeaveStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Update a leave request
  async updateLeaveRequest(id: string, leaveData: Partial<LeaveRequest>): Promise<LeaveRequest> {
    try {
      const response = await api.patch(`/hr/leaves/${id}`, leaveData);
      if (response && response.data && response.data.data) {
        return response.data.data.leave;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error updating leave request ${id}:`, error);
      throw error;
    }
  }

  // Approve a leave request
  async approveLeaveRequest(id: string, approverId: string): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: LeaveStatus.APPROVED,
      approvedBy: approverId,
      approvedAt: new Date().toISOString()
    });
  }

  // Reject a leave request
  async rejectLeaveRequest(id: string, approverId: string): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: LeaveStatus.REJECTED,
      approvedBy: approverId,
      approvedAt: new Date().toISOString()
    });
  }

  // Cancel a leave request
  async cancelLeaveRequest(id: string): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, {
      status: LeaveStatus.CANCELLED
    });
  }

  // Calculate remaining annual leave days for an employee
  async getRemainingAnnualLeave(employeeId: string): Promise<number> {
    try {
      const response = await api.get(`/hr/employees/${employeeId}/leave-balance`);
      if (response && response.data && response.data.data) {
        return response.data.data.remainingDays || 0;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching remaining leave for employee ${employeeId}:`, error);
      // Return default value if API fails (30 days is the minimum in Algeria)
      return 30;
    }
  }

  // Check if a date is a public holiday
  isPublicHoliday(date: Date): boolean {
    const dateString = date.toISOString().split('T')[0];
    return ALGERIAN_PUBLIC_HOLIDAYS.some(holiday => holiday.date === dateString);
  }

  // Get all public holidays
  getPublicHolidays(): { date: string; name: string }[] {
    return ALGERIAN_PUBLIC_HOLIDAYS;
  }

  // Calculate business days between two dates (excluding weekends and public holidays)
  calculateBusinessDays(startDate: Date, endDate: Date): number {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
      const dayOfWeek = curDate.getDay();
      // Skip weekends (Friday and Saturday in Algeria)
      if (dayOfWeek !== 5 && dayOfWeek !== 6 && !this.isPublicHoliday(curDate)) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  }

  // Mock data for testing
  private getMockLeaveRequests(): LeaveRequest[] {
    return [
      {
        _id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        type: LeaveType.ANNUAL,
        startDate: '2023-08-01T00:00:00Z',
        endDate: '2023-08-15T00:00:00Z',
        duration: 10, // Business days
        reason: 'Summer vacation',
        status: LeaveStatus.APPROVED,
        approvedBy: 'admin',
        approvedAt: '2023-07-15T10:30:00Z',
        createdAt: '2023-07-10T09:15:00Z',
        updatedAt: '2023-07-15T10:30:00Z'
      },
      {
        _id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        type: LeaveType.SICK,
        startDate: '2023-07-20T00:00:00Z',
        endDate: '2023-07-25T00:00:00Z',
        duration: 4, // Business days
        reason: 'Flu',
        status: LeaveStatus.APPROVED,
        cnasJustification: 'CNAS-2023-07-20-123',
        approvedBy: 'admin',
        approvedAt: '2023-07-20T11:45:00Z',
        createdAt: '2023-07-20T08:30:00Z',
        updatedAt: '2023-07-20T11:45:00Z'
      },
      {
        _id: '3',
        employeeId: '3',
        employeeName: 'Michael Johnson',
        type: LeaveType.MATERNITY,
        startDate: '2023-09-01T00:00:00Z',
        endDate: '2023-12-08T00:00:00Z', // 14 weeks
        duration: 70, // Business days (14 weeks)
        status: LeaveStatus.PENDING,
        createdAt: '2023-07-25T14:20:00Z',
        updatedAt: '2023-07-25T14:20:00Z'
      }
    ];
  }
}

export const leaveService = LeaveService.getInstance();
export default leaveService;

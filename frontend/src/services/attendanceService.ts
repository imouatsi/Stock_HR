import api from './api.service';

// Attendance status
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  LEAVE = 'LEAVE',
  HOLIDAY = 'HOLIDAY'
}

// Overtime rate types (as per Algerian labor law)
export enum OvertimeRateType {
  REGULAR = 'REGULAR', // +50% (weekdays)
  WEEKEND = 'WEEKEND', // +100% (weekends)
  HOLIDAY = 'HOLIDAY' // +100% (public holidays)
}

// Attendance record interface
export interface AttendanceRecord {
  _id: string;
  employeeId: string;
  employeeName?: string; // For display purposes
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workingHours?: number;
  overtime?: number;
  overtimeRateType?: OvertimeRateType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Standard working hours in Algeria
export const STANDARD_WORKING_HOURS = 8; // 8 hours per day
export const STANDARD_WORKING_DAYS = 5; // 5 days per week
export const STANDARD_WORKING_HOURS_WEEK = 40; // 40 hours per week

class AttendanceService {
  private static instance: AttendanceService;

  private constructor() {}

  public static getInstance(): AttendanceService {
    if (!AttendanceService.instance) {
      AttendanceService.instance = new AttendanceService();
    }
    return AttendanceService.instance;
  }

  // Get all attendance records
  async getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
    try {
      const response = await api.get('/hr/attendance');
      if (response && response.data && response.data.data) {
        return response.data.data.records || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      // Return mock data if API fails
      return this.getMockAttendanceRecords();
    }
  }

  // Get attendance records for a specific employee
  async getEmployeeAttendanceRecords(employeeId: string): Promise<AttendanceRecord[]> {
    try {
      const response = await api.get(`/hr/employees/${employeeId}/attendance`);
      if (response && response.data && response.data.data) {
        return response.data.data.records || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching attendance records for employee ${employeeId}:`, error);
      // Return mock data if API fails
      return this.getMockAttendanceRecords().filter(record => record.employeeId === employeeId);
    }
  }

  // Create a new attendance record
  async createAttendanceRecord(attendanceData: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    try {
      const response = await api.post('/hr/attendance', attendanceData);
      if (response && response.data && response.data.data) {
        return response.data.data.record;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error creating attendance record:', error);
      
      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        employeeId: attendanceData.employeeId || '',
        employeeName: attendanceData.employeeName || 'Employee Name',
        date: attendanceData.date || new Date().toISOString().split('T')[0],
        checkIn: attendanceData.checkIn || new Date().toISOString(),
        status: attendanceData.status || AttendanceStatus.PRESENT,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as AttendanceRecord;
    }
  }

  // Update an attendance record
  async updateAttendanceRecord(id: string, attendanceData: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    try {
      const response = await api.patch(`/hr/attendance/${id}`, attendanceData);
      if (response && response.data && response.data.data) {
        return response.data.data.record;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error updating attendance record ${id}:`, error);
      throw error;
    }
  }

  // Record check-in
  async recordCheckIn(employeeId: string, employeeName?: string): Promise<AttendanceRecord> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Check if there's already a record for today
    try {
      const records = await this.getEmployeeAttendanceRecords(employeeId);
      const todayRecord = records.find(record => record.date.startsWith(today));
      
      if (todayRecord) {
        // Update existing record
        return this.updateAttendanceRecord(todayRecord._id, {
          checkIn: now.toISOString(),
          status: this.isLate(now) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT
        });
      } else {
        // Create new record
        return this.createAttendanceRecord({
          employeeId,
          employeeName,
          date: today,
          checkIn: now.toISOString(),
          status: this.isLate(now) ? AttendanceStatus.LATE : AttendanceStatus.PRESENT
        });
      }
    } catch (error) {
      console.error('Error recording check-in:', error);
      throw error;
    }
  }

  // Record check-out
  async recordCheckOut(employeeId: string): Promise<AttendanceRecord> {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Find today's record
    try {
      const records = await this.getEmployeeAttendanceRecords(employeeId);
      const todayRecord = records.find(record => record.date.startsWith(today));
      
      if (todayRecord) {
        // Calculate working hours and overtime
        const checkIn = todayRecord.checkIn ? new Date(todayRecord.checkIn) : new Date(today + 'T09:00:00');
        const workingHours = this.calculateWorkingHours(checkIn, now);
        const overtime = Math.max(0, workingHours - STANDARD_WORKING_HOURS);
        const overtimeRateType = this.getOvertimeRateType(now);
        
        // Update record
        return this.updateAttendanceRecord(todayRecord._id, {
          checkOut: now.toISOString(),
          workingHours,
          overtime: overtime > 0 ? overtime : undefined,
          overtimeRateType: overtime > 0 ? overtimeRateType : undefined
        });
      } else {
        throw new Error('No check-in record found for today');
      }
    } catch (error) {
      console.error('Error recording check-out:', error);
      throw error;
    }
  }

  // Calculate working hours between check-in and check-out
  calculateWorkingHours(checkIn: Date, checkOut: Date): number {
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return Math.round(diffHours * 100) / 100; // Round to 2 decimal places
  }

  // Check if check-in time is late (after 9:00 AM in Algeria)
  isLate(checkInTime: Date): boolean {
    const hour = checkInTime.getHours();
    const minute = checkInTime.getMinutes();
    return hour > 9 || (hour === 9 && minute > 0);
  }

  // Get overtime rate type based on day
  getOvertimeRateType(date: Date): OvertimeRateType {
    const day = date.getDay();
    
    // In Algeria, the weekend is Friday and Saturday
    if (day === 5 || day === 6) {
      return OvertimeRateType.WEEKEND;
    }
    
    // Check if it's a public holiday
    const dateString = date.toISOString().split('T')[0];
    const isHoliday = this.isPublicHoliday(dateString);
    
    return isHoliday ? OvertimeRateType.HOLIDAY : OvertimeRateType.REGULAR;
  }

  // Check if a date is a public holiday
  isPublicHoliday(dateString: string): boolean {
    // Algerian public holidays for 2023
    const publicHolidays = [
      '2023-01-01', // New Year's Day
      '2023-01-12', // Yennayer (Amazigh New Year)
      '2023-05-01', // Labour Day
      '2023-07-05', // Independence Day
      '2023-11-01', // Revolution Day
      // Islamic holidays (approximate dates for 2023)
      '2023-04-21', // Eid al-Fitr
      '2023-04-22', // Eid al-Fitr (2nd day)
      '2023-06-28', // Eid al-Adha
      '2023-06-29', // Eid al-Adha (2nd day)
      '2023-07-19', // Islamic New Year
      '2023-09-27', // Mawlid
    ];
    
    return publicHolidays.includes(dateString);
  }

  // Calculate overtime pay
  calculateOvertimePay(hours: number, rateType: OvertimeRateType, hourlyRate: number): number {
    switch (rateType) {
      case OvertimeRateType.REGULAR:
        return hours * hourlyRate * 1.5; // +50%
      case OvertimeRateType.WEEKEND:
      case OvertimeRateType.HOLIDAY:
        return hours * hourlyRate * 2; // +100%
      default:
        return 0;
    }
  }

  // Get monthly attendance summary for an employee
  async getMonthlyAttendanceSummary(employeeId: string, year: number, month: number): Promise<{
    present: number;
    absent: number;
    late: number;
    leave: number;
    totalWorkingHours: number;
    totalOvertimeHours: number;
  }> {
    try {
      const response = await api.get(`/hr/employees/${employeeId}/attendance/summary?year=${year}&month=${month}`);
      if (response && response.data && response.data.data) {
        return response.data.data.summary;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching attendance summary for employee ${employeeId}:`, error);
      
      // Calculate from mock data if API fails
      const records = this.getMockAttendanceRecords().filter(record => {
        const recordDate = new Date(record.date);
        return record.employeeId === employeeId && 
               recordDate.getFullYear() === year && 
               recordDate.getMonth() === month - 1;
      });
      
      return {
        present: records.filter(r => r.status === AttendanceStatus.PRESENT).length,
        absent: records.filter(r => r.status === AttendanceStatus.ABSENT).length,
        late: records.filter(r => r.status === AttendanceStatus.LATE).length,
        leave: records.filter(r => r.status === AttendanceStatus.LEAVE).length,
        totalWorkingHours: records.reduce((sum, r) => sum + (r.workingHours || 0), 0),
        totalOvertimeHours: records.reduce((sum, r) => sum + (r.overtime || 0), 0)
      };
    }
  }

  // Mock data for testing
  private getMockAttendanceRecords(): AttendanceRecord[] {
    return [
      {
        _id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        date: '2023-08-01',
        checkIn: '2023-08-01T08:55:00Z',
        checkOut: '2023-08-01T17:05:00Z',
        status: AttendanceStatus.PRESENT,
        workingHours: 8.17,
        overtime: 0.17,
        overtimeRateType: OvertimeRateType.REGULAR,
        createdAt: '2023-08-01T08:55:00Z',
        updatedAt: '2023-08-01T17:05:00Z'
      },
      {
        _id: '2',
        employeeId: '1',
        employeeName: 'John Doe',
        date: '2023-08-02',
        checkIn: '2023-08-02T09:10:00Z',
        checkOut: '2023-08-02T17:00:00Z',
        status: AttendanceStatus.LATE,
        workingHours: 7.83,
        createdAt: '2023-08-02T09:10:00Z',
        updatedAt: '2023-08-02T17:00:00Z'
      },
      {
        _id: '3',
        employeeId: '2',
        employeeName: 'Jane Smith',
        date: '2023-08-01',
        checkIn: '2023-08-01T08:45:00Z',
        checkOut: '2023-08-01T18:30:00Z',
        status: AttendanceStatus.PRESENT,
        workingHours: 9.75,
        overtime: 1.75,
        overtimeRateType: OvertimeRateType.REGULAR,
        createdAt: '2023-08-01T08:45:00Z',
        updatedAt: '2023-08-01T18:30:00Z'
      }
    ];
  }
}

export const attendanceService = AttendanceService.getInstance();
export default attendanceService;

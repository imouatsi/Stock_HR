import api from './api.service';
import { Employee } from './hrService';
import { AttendanceRecord } from './attendanceService';

// Algerian payroll constants
export const SMIG = 20000; // Algerian minimum wage (SMIG) in DZD
export const CNAS_EMPLOYEE_RATE = 0.09; // 9% employee contribution
export const CNAS_EMPLOYER_RATE = 0.26; // 26% employer contribution

// Seniority bonus rates (based on years of service)
export const SENIORITY_RATES = [
  { years: 2, rate: 0.01 }, // 1% after 2 years
  { years: 3, rate: 0.02 }, // 2% after 3 years
  { years: 5, rate: 0.03 }, // 3% after 5 years
  { years: 10, rate: 0.05 }, // 5% after 10 years
  { years: 15, rate: 0.07 }, // 7% after 15 years
  { years: 20, rate: 0.10 }, // 10% after 20 years
];

// IRG (Income Tax) brackets for Algeria
export const IRG_BRACKETS = [
  { min: 0, max: 30000, rate: 0 }, // 0% for income up to 30,000 DZD
  { min: 30001, max: 120000, rate: 0.20 }, // 20% for income between 30,001 and 120,000 DZD
  { min: 120001, max: Infinity, rate: 0.30 }, // 30% for income above 120,000 DZD
];

// Payroll item types
export enum PayrollItemType {
  // Earnings
  BASE_SALARY = 'BASE_SALARY',
  SENIORITY_BONUS = 'SENIORITY_BONUS',
  PERFORMANCE_BONUS = 'PERFORMANCE_BONUS',
  TRANSPORT_ALLOWANCE = 'TRANSPORT_ALLOWANCE',
  MEAL_ALLOWANCE = 'MEAL_ALLOWANCE',
  HOUSING_ALLOWANCE = 'HOUSING_ALLOWANCE',
  OVERTIME = 'OVERTIME',
  OTHER_BONUS = 'OTHER_BONUS',

  // Deductions
  CNAS_CONTRIBUTION = 'CNAS_CONTRIBUTION',
  RETIREMENT_FUND = 'RETIREMENT_FUND',
  PROFESSIONAL_TAX = 'PROFESSIONAL_TAX',
  UNION_CONTRIBUTION = 'UNION_CONTRIBUTION',
  IRG_TAX = 'IRG_TAX',
  OTHER_DEDUCTION = 'OTHER_DEDUCTION'
}

// Payroll item interface
export interface PayrollItem {
  type: PayrollItemType;
  amount: number;
  description?: string;
}

// Payslip interface
export interface Payslip {
  _id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  baseSalary: number;
  grossSalary: number;
  netSalary: number;
  items: PayrollItem[];
  cnasEmployeeContribution: number;
  cnasEmployerContribution: number;
  irgTax: number;
  paymentDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class PayrollService {
  private static instance: PayrollService;

  private constructor() {}

  public static getInstance(): PayrollService {
    if (!PayrollService.instance) {
      PayrollService.instance = new PayrollService();
    }
    return PayrollService.instance;
  }

  // Get all payslips
  async getAllPayslips(): Promise<Payslip[]> {
    try {
      const response = await api.get('/hr/payroll');
      if (response && response.data && response.data.data) {
        return response.data.data.payslips || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching payslips:', error);
      // Return mock data if API fails
      return this.getMockPayslips();
    }
  }

  // Get payslips for a specific employee
  async getEmployeePayslips(employeeId: string): Promise<Payslip[]> {
    try {
      const response = await api.get(`/hr/employees/${employeeId}/payslips`);
      if (response && response.data && response.data.data) {
        return response.data.data.payslips || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching payslips for employee ${employeeId}:`, error);
      // Return mock data if API fails
      return this.getMockPayslips().filter(payslip => payslip.employeeId === employeeId);
    }
  }

  // Get a specific payslip
  async getPayslip(id: string): Promise<Payslip> {
    try {
      const response = await api.get(`/hr/payroll/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data.payslip;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Error fetching payslip ${id}:`, error);
      // Return mock data if API fails
      const mockPayslip = this.getMockPayslips().find(payslip => payslip._id === id);
      if (mockPayslip) {
        return mockPayslip;
      }
      throw error;
    }
  }

  // Generate payslip for an employee
  async generatePayslip(
    employee: Employee,
    month: number,
    year: number,
    attendanceRecords: AttendanceRecord[]
  ): Promise<Payslip> {
    try {
      // Calculate payroll items
      const items: PayrollItem[] = [];

      // Base salary
      const baseSalary = employee.salary || SMIG;
      items.push({
        type: PayrollItemType.BASE_SALARY,
        amount: baseSalary,
        description: 'Base Salary'
      });

      // Seniority bonus (if applicable)
      const seniorityBonus = this.calculateSeniorityBonus(employee, baseSalary);
      if (seniorityBonus > 0) {
        items.push({
          type: PayrollItemType.SENIORITY_BONUS,
          amount: seniorityBonus,
          description: 'Prime d\'ancienneté'
        });
      }

      // Transport allowance (fixed amount)
      const transportAllowance = 2500; // Example: 2,500 DZD
      items.push({
        type: PayrollItemType.TRANSPORT_ALLOWANCE,
        amount: transportAllowance,
        description: 'Indemnité de transport'
      });

      // Meal allowance (based on working days)
      const workingDays = attendanceRecords.filter(r =>
        r.status !== 'ABSENT' && r.status !== 'LEAVE'
      ).length;
      const mealAllowance = workingDays * 300; // Example: 300 DZD per working day
      items.push({
        type: PayrollItemType.MEAL_ALLOWANCE,
        amount: mealAllowance,
        description: 'Indemnité de repas'
      });

      // Overtime pay
      const overtimePay = this.calculateOvertimePay(attendanceRecords, baseSalary);
      if (overtimePay > 0) {
        items.push({
          type: PayrollItemType.OVERTIME,
          amount: overtimePay,
          description: 'Heures supplémentaires'
        });
      }

      // Calculate gross salary
      const grossSalary = items.reduce((sum, item) => sum + item.amount, 0);

      // CNAS employee contribution (9%)
      const cnasEmployeeContribution = Math.round(grossSalary * CNAS_EMPLOYEE_RATE);
      items.push({
        type: PayrollItemType.CNAS_CONTRIBUTION,
        amount: -cnasEmployeeContribution,
        description: 'Cotisation CNAS (9%)'
      });

      // CNAS employer contribution (26%) - not deducted from employee salary
      const cnasEmployerContribution = Math.round(grossSalary * CNAS_EMPLOYER_RATE);

      // IRG (income tax)
      const irgTax = this.calculateIRG(grossSalary - cnasEmployeeContribution);
      items.push({
        type: PayrollItemType.IRG_TAX,
        amount: -irgTax,
        description: 'Impôt sur le Revenu Global (IRG)'
      });

      // Calculate net salary
      const netSalary = grossSalary - cnasEmployeeContribution - irgTax;

      // Create payslip object
      const payslipData: Partial<Payslip> = {
        employeeId: employee._id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        month,
        year,
        baseSalary,
        grossSalary,
        netSalary,
        items,
        cnasEmployeeContribution,
        cnasEmployerContribution,
        irgTax,
        paymentDate: new Date().toISOString(),
        paymentMethod: 'Bank Transfer',
        notes: 'Generated automatically'
      };

      // Save to API
      try {
        const response = await api.post('/hr/payroll', payslipData);
        if (response && response.data && response.data.data) {
          return response.data.data.payslip;
        }
        throw new Error('Invalid response format');
      } catch (apiError) {
        console.error('Error saving payslip to API:', apiError);

        // Return local payslip if API fails
        const mockId = Math.random().toString(36).substring(2, 15);
        return {
          _id: mockId,
          ...payslipData as any,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Payslip;
      }
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  }

  // Calculate seniority bonus based on years of service
  calculateSeniorityBonus(employee: Employee, baseSalary: number): number {
    if (!employee.hireDate) {
      return 0;
    }

    const hireDate = new Date(employee.hireDate);
    const now = new Date();
    const yearsOfService = now.getFullYear() - hireDate.getFullYear();

    // Seniority bonus only applies after 2 years of service
    if (yearsOfService < 2) {
      return 0;
    }

    // Find the applicable rate
    let rate = 0;
    for (let i = SENIORITY_RATES.length - 1; i >= 0; i--) {
      if (yearsOfService >= SENIORITY_RATES[i].years) {
        rate = SENIORITY_RATES[i].rate;
        break;
      }
    }

    return Math.round(baseSalary * rate);
  }

  // Calculate overtime pay
  calculateOvertimePay(attendanceRecords: AttendanceRecord[], baseSalary: number): number {
    // Calculate hourly rate (based on 173.33 hours per month)
    const hourlyRate = baseSalary / 173.33;

    // Sum up overtime pay
    let overtimePay = 0;

    attendanceRecords.forEach(record => {
      if (record.overtime && record.overtime > 0 && record.overtimeRateType) {
        let rate = 1.5; // Default +50%

        if (record.overtimeRateType === 'WEEKEND' || record.overtimeRateType === 'HOLIDAY') {
          rate = 2.0; // +100% for weekends and holidays
        }

        overtimePay += record.overtime * hourlyRate * rate;
      }
    });

    return Math.round(overtimePay);
  }

  // Calculate IRG (income tax) using Algerian progressive tax algorithm
  calculateIRG(taxableIncome: number): number {
    // Progressive tax calculation for Algerian IRG
    let tax = 0;

    // 0% on first 30,000 DZD
    // No tax on this bracket

    // 20% on amount between 30,001 and 120,000 DZD
    if (taxableIncome > 30000) {
      const amountIn20Bracket = Math.min(taxableIncome, 120000) - 30000;
      tax += amountIn20Bracket * 0.2;
    }

    // 30% on amount above 120,000 DZD
    if (taxableIncome > 120000) {
      const amountIn30Bracket = taxableIncome - 120000;
      tax += amountIn30Bracket * 0.3;
    }

    return Math.round(tax);
  }

  // Generate CNAS declaration
  async generateCNASDeclaration(month: number, year: number): Promise<string> {
    try {
      const response = await api.get(`/hr/payroll/cnas-declaration?month=${month}&year=${year}`);
      if (response && response.data && response.data.data) {
        return response.data.data.declarationUrl;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating CNAS declaration:', error);
      // Return mock URL if API fails
      return `/mock-cnas-declaration-${month}-${year}.pdf`;
    }
  }

  // Generate DAS (Déclaration Annuelle des Salaires)
  async generateDAS(year: number): Promise<string> {
    try {
      const response = await api.get(`/hr/payroll/das?year=${year}`);
      if (response && response.data && response.data.data) {
        return response.data.data.dasUrl;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating DAS:', error);
      // Return mock URL if API fails
      return `/mock-das-${year}.pdf`;
    }
  }

  // Mock data for testing
  private getMockPayslips(): Payslip[] {
    return [
      {
        _id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        month: 7,
        year: 2023,
        baseSalary: 45000,
        grossSalary: 52500,
        netSalary: 41895,
        items: [
          {
            type: PayrollItemType.BASE_SALARY,
            amount: 45000,
            description: 'Base Salary'
          },
          {
            type: PayrollItemType.SENIORITY_BONUS,
            amount: 1350,
            description: 'Prime d\'ancienneté (3%)'
          },
          {
            type: PayrollItemType.TRANSPORT_ALLOWANCE,
            amount: 2500,
            description: 'Indemnité de transport'
          },
          {
            type: PayrollItemType.MEAL_ALLOWANCE,
            amount: 6000,
            description: 'Indemnité de repas'
          },
          {
            type: PayrollItemType.OVERTIME,
            amount: 2650,
            description: 'Heures supplémentaires'
          },
          {
            type: PayrollItemType.CNAS_CONTRIBUTION,
            amount: -4725,
            description: 'Cotisation CNAS (9%)'
          },
          {
            type: PayrollItemType.IRG_TAX,
            amount: -5880,
            description: 'Impôt sur le Revenu Global (IRG)'
          }
        ],
        cnasEmployeeContribution: 4725,
        cnasEmployerContribution: 13650,
        irgTax: 5880,
        paymentDate: '2023-07-30T00:00:00Z',
        paymentMethod: 'Bank Transfer',
        paymentReference: 'PAY-2023-07-001',
        createdAt: '2023-07-28T10:15:00Z',
        updatedAt: '2023-07-28T10:15:00Z'
      },
      {
        _id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        month: 7,
        year: 2023,
        baseSalary: 60000,
        grossSalary: 69500,
        netSalary: 54405,
        items: [
          {
            type: PayrollItemType.BASE_SALARY,
            amount: 60000,
            description: 'Base Salary'
          },
          {
            type: PayrollItemType.SENIORITY_BONUS,
            amount: 3000,
            description: 'Prime d\'ancienneté (5%)'
          },
          {
            type: PayrollItemType.TRANSPORT_ALLOWANCE,
            amount: 2500,
            description: 'Indemnité de transport'
          },
          {
            type: PayrollItemType.MEAL_ALLOWANCE,
            amount: 6000,
            description: 'Indemnité de repas'
          },
          {
            type: PayrollItemType.PERFORMANCE_BONUS,
            amount: 3000,
            description: 'Prime de rendement'
          },
          {
            type: PayrollItemType.CNAS_CONTRIBUTION,
            amount: -6255,
            description: 'Cotisation CNAS (9%)'
          },
          {
            type: PayrollItemType.IRG_TAX,
            amount: -8840,
            description: 'Impôt sur le Revenu Global (IRG)'
          }
        ],
        cnasEmployeeContribution: 6255,
        cnasEmployerContribution: 18070,
        irgTax: 8840,
        paymentDate: '2023-07-30T00:00:00Z',
        paymentMethod: 'Bank Transfer',
        paymentReference: 'PAY-2023-07-002',
        createdAt: '2023-07-28T10:20:00Z',
        updatedAt: '2023-07-28T10:20:00Z'
      }
    ];
  }
}

export const payrollService = PayrollService.getInstance();
export default payrollService;

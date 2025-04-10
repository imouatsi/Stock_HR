export interface PayrollCalculation {
  // Earnings
  baseSalary: number;
  bonuses: number;
  transportAllowance: number;
  housingAllowance: number;
  totalAllowances: number;
  grossSalary: number;
  
  // Deductions
  cnasEmployeeContribution: number;
  retirementFund: number;
  professionalTax: number;
  unionContribution: number;
  totalDeductionsBeforeTax: number;
  taxableIncome: number;
  irgTax: number;
  totalDeductions: number;
  netSalary: number;
  
  // Employer costs
  cnasEmployerContribution: number;
  totalEmployerCost: number;
}

export interface PayslipData {
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  paymentDate: string;
  paymentMethod: string;
  reference: string;
  calculations: PayrollCalculation;
}

export interface PayrollHistoryItem {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  baseSalary: number;
  grossSalary: number;
  netSalary: number;
}

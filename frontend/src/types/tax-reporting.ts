// Tax Reporting Types for Algerian Tax System

// Common interfaces
export interface TaxPeriod {
  _id?: string;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  type: 'monthly' | 'quarterly' | 'annual';
  year: number;
  month?: number;
  quarter?: number;
  isClosed: boolean;
  closedAt?: string;
  closedBy?: string;
}

export interface TaxRate {
  _id?: string;
  code: string;
  name: string;
  rate: number;
  description?: string;
  isActive: boolean;
  effectiveDate: string;
  endDate?: string;
}

// G50 Form interfaces
export interface G50Declaration {
  _id?: string;
  declarationNumber: string;
  periodId: string;
  periodName?: string;
  periodType: 'monthly' | 'quarterly';
  year: number;
  month?: number;
  quarter?: number;
  submissionDate: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  companyInfo: CompanyInfo;
  taxSections: G50TaxSection[];
  totalAmount: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  submittedBy?: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  taxId: string; // NIF (Numéro d'Identification Fiscale)
  taxRegistrationNumber: string; // NIS (Numéro d'Identification Statistique)
  articleOfImposition: string; // Article d'imposition
  activityCode: string; // Code d'activité
  municipality: string; // Commune
  wilaya: string; // Wilaya
}

export interface G50TaxSection {
  code: string;
  name: string;
  taxType: 'TVA' | 'TAP' | 'IRG' | 'IBS' | 'TF' | 'TA' | 'OTHER';
  description?: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  isExempt: boolean;
  exemptionReason?: string;
}

// TVA (VAT) interfaces
export interface TVADeclaration {
  _id?: string;
  declarationNumber: string;
  periodId: string;
  periodName?: string;
  year: number;
  month: number;
  submissionDate: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  companyInfo: CompanyInfo;
  salesSection: TVASalesSection;
  purchasesSection: TVAPurchasesSection;
  previousBalance: number;
  totalTVACollected: number;
  totalTVADeductible: number;
  netTVA: number;
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  notes?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  submittedBy?: string;
}

export interface TVASalesSection {
  domesticSales: TVAEntry[];
  exportSales: TVAEntry[];
  totalDomesticSales: number;
  totalExportSales: number;
  totalTVACollected: number;
}

export interface TVAPurchasesSection {
  domesticPurchases: TVAEntry[];
  importPurchases: TVAEntry[];
  totalDomesticPurchases: number;
  totalImportPurchases: number;
  totalTVADeductible: number;
}

export interface TVAEntry {
  description: string;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
}

// IBS (Corporate Tax) interfaces
export interface IBSDeclaration {
  _id?: string;
  declarationNumber: string;
  periodId: string;
  periodName?: string;
  fiscalYear: number;
  submissionDate: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  companyInfo: CompanyInfo;
  financialData: IBSFinancialData;
  taxCalculation: IBSTaxCalculation;
  paymentSchedule: IBSPaymentSchedule[];
  notes?: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
  submittedAt?: string;
  submittedBy?: string;
}

export interface IBSFinancialData {
  totalRevenue: number;
  totalExpenses: number;
  accountingProfit: number;
  taxAdjustments: IBSTaxAdjustment[];
  taxableProfit: number;
}

export interface IBSTaxAdjustment {
  description: string;
  amount: number;
  isAddition: boolean; // true for additions, false for deductions
}

export interface IBSTaxCalculation {
  taxableProfit: number;
  taxRate: number;
  grossTaxAmount: number;
  taxCredits: IBSTaxCredit[];
  netTaxAmount: number;
  advancePayments: IBSAdvancePayment[];
  remainingTaxDue: number;
}

export interface IBSTaxCredit {
  description: string;
  amount: number;
}

export interface IBSAdvancePayment {
  description: string;
  date: string;
  amount: number;
  reference: string;
}

export interface IBSPaymentSchedule {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
  paymentDate?: string;
  paymentReference?: string;
}

// Tax Report interface
export interface TaxReport {
  _id?: string;
  type: 'g50' | 'tva' | 'ibs' | 'annual';
  periodId: string;
  date: string;
  status: 'draft' | 'final' | 'submitted';
  data: G50Declaration | TVADeclaration | IBSDeclaration;
  notes?: Record<string, string>;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// SCF (Système Comptable Financier) Account Types
export enum AccountType {
  ASSET = 'asset',
  LIABILITY = 'liability',
  EQUITY = 'equity',
  INCOME = 'income',
  EXPENSE = 'expense'
}

// SCF Account Classes
export enum SCFClass {
  CLASS_1 = '1', // Capital accounts
  CLASS_2 = '2', // Fixed assets
  CLASS_3 = '3', // Inventory accounts
  CLASS_4 = '4', // Third-party accounts
  CLASS_5 = '5', // Financial accounts
  CLASS_6 = '6', // Expense accounts
  CLASS_7 = '7', // Revenue accounts
}

// SCF Account interface
export interface SCFAccount {
  _id?: string;
  code: string;
  label: string;
  type: AccountType;
  scfClass: SCFClass;
  parentId?: string;
  isParent: boolean;
  balance: number;
  description?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Journal Entry interface
export interface JournalEntryLine {
  _id?: string;
  accountId: string;
  accountCode: string;
  accountLabel: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  _id?: string;
  reference: string;
  date: string;
  description: string;
  periodId: string;
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}

// Accounting Period interface
export interface AccountingPeriod {
  _id?: string;
  name: string;
  startDate: string;
  endDate: string;
  isClosed: boolean;
  closedBy?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// General Ledger Entry interface
export interface GeneralLedgerEntry {
  _id?: string;
  accountId: string;
  accountCode: string;
  accountLabel: string;
  date: string;
  journalEntryId: string;
  journalReference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

// General Ledger Account interface
export interface GeneralLedgerAccount {
  accountId: string;
  accountCode: string;
  accountLabel: string;
  accountType: AccountType | string;
  openingBalance: number;
  entries: GeneralLedgerEntry[];
  totalDebit: number;
  totalCredit: number;
  closingBalance: number;
}

// Financial Statement interface
export interface FinancialStatement {
  _id?: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow';
  period: string;
  date: string;
  status: 'draft' | 'final';
  createdAt?: string;
  updatedAt?: string;
}

// Expense interface
export interface Expense {
  _id?: string;
  number: string;
  date: string;
  employeeId: string;
  employeeName: string;
  description: string;
  amount: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  paidBy?: string;
  paidAt?: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Invoice interface
export interface Invoice {
  _id?: string;
  number: string;
  date: string;
  dueDate: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Invoice Item interface
export interface InvoiceItem {
  _id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// Proforma Invoice interface
export interface ProformaInvoice {
  _id?: string;
  number: string;
  date: string;
  validUntil: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

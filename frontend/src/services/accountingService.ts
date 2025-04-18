import api from './api.service';
import { eventService, EventType } from '../modules/shared/services/EventService';
import { statusManagementService, InvoiceStatus, ExpenseStatus } from '../modules/shared/services/StatusManagementService';
import { SCFAccount, AccountType, SCFClass, JournalEntry, AccountingPeriod, GeneralLedgerAccount } from '@/types/accounting';
import { FinancialStatementReport, BalanceSheet, IncomeStatement, CashFlowStatement } from '@/types/financial-statements';

// Update Invoice interface to include status
export interface Invoice {
  _id: string;
  invoiceNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    address: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

// Update Expense interface to include new status and soft deletion fields
export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdBy: string;
  departmentId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'void';
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  cancelledBy?: string;
  cancelledAt?: string;
  voidedBy?: string;
  voidedAt?: string;
  reason?: string;
  attachments?: {
    type: string;
    url: string;
  }[];
  isDeleted: boolean;
  deletedBy?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

class AccountingService {
  private static instance: AccountingService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.STOCK_MOVEMENT_CREATED, this.handleStockMovement);
  }

  public static getInstance(): AccountingService {
    if (!AccountingService.instance) {
      AccountingService.instance = new AccountingService();
    }
    return AccountingService.instance;
  }

  // Invoice methods
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      const response = await api.get('/accounting/invoices');
      // Check if we have valid data in the response
      if (response && response.data && response.data.data) {
        return response.data.data.invoices || [];
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async createInvoice(invoiceData: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await api.post('/accounting/invoices', invoiceData);
      if (response && response.data && response.data.data) {
        return response.data.data.invoice;
      }

      // If API call succeeds but doesn't return expected data format
      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        id: mockId,
        ...invoiceData as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);

      // Create a mock response with the data we sent
      const mockId = Math.random().toString(36).substring(2, 15);
      return {
        _id: mockId,
        id: mockId,
        ...invoiceData as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Invoice;
    }
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    try {
      const response = await api.get(`/accounting/invoices/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data.invoice;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    try {
      const response = await api.patch(`/accounting/invoices/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Expense methods
  async createExpense(data: Omit<Expense, '_id' | 'isDeleted' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    try {
      const response = await api.post('/accounting/expenses', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getExpenseById(id: string): Promise<Expense> {
    try {
      const response = await api.get(`/accounting/expenses/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Journal Entry methods - SCF compliant
  async getAllJournalEntries(): Promise<JournalEntry[]> {
    try {
      const response = await api.get('/accounting/journal-entries');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      throw error;
    }
  }

  // Get default journal entries with SCF accounts
  private getDefaultJournalEntries(): JournalEntry[] {
    const today = new Date().toISOString().split('T')[0];
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    return [
      {
        _id: '1',
        reference: 'JE-2023-001',
        date: '2023-08-01',
        description: 'Paiement du loyer mensuel',
        periodId: 'P-2023-08',
        lines: [
          {
            _id: '1-1',
            accountId: '16',
            accountCode: '613',
            accountLabel: 'Locations',
            description: 'Loyer du bureau',
            debit: 1500000,
            credit: 0
          },
          {
            _id: '1-2',
            accountId: '13',
            accountCode: '512',
            accountLabel: 'Banques comptes courants',
            description: 'Paiement du loyer',
            debit: 0,
            credit: 1500000
          }
        ],
        totalDebit: 1500000,
        totalCredit: 1500000,
        isBalanced: true,
        createdBy: 'system',
        createdAt: '2023-08-01T10:00:00Z',
        updatedAt: '2023-08-01T10:00:00Z'
      },
      {
        _id: '2',
        reference: 'JE-2023-002',
        date: '2023-08-05',
        description: 'Paiement de facture reçu',
        periodId: 'P-2023-08',
        lines: [
          {
            _id: '2-1',
            accountId: '13',
            accountCode: '512',
            accountLabel: 'Banques comptes courants',
            description: 'Paiement reçu',
            debit: 6820000,
            credit: 0
          },
          {
            _id: '2-2',
            accountId: '10',
            accountCode: '411',
            accountLabel: 'Clients - ventes de biens ou de prestations de services',
            description: 'Règlement de facture',
            debit: 0,
            credit: 6820000
          }
        ],
        totalDebit: 6820000,
        totalCredit: 6820000,
        isBalanced: true,
        createdBy: 'system',
        createdAt: '2023-08-05T14:30:00Z',
        updatedAt: '2023-08-05T14:30:00Z'
      },
      {
        _id: '3',
        reference: 'JE-2023-003',
        date: '2023-08-10',
        description: 'Achat de fournitures de bureau',
        periodId: 'P-2023-08',
        lines: [
          {
            _id: '3-1',
            accountId: '15',
            accountCode: '61',
            accountLabel: 'Services extérieurs',
            description: 'Fournitures de bureau',
            debit: 350000,
            credit: 0
          },
          {
            _id: '3-2',
            accountId: '13',
            accountCode: '512',
            accountLabel: 'Banques comptes courants',
            description: 'Paiement des fournitures',
            debit: 0,
            credit: 350000
          }
        ],
        totalDebit: 350000,
        totalCredit: 350000,
        isBalanced: true,
        createdBy: 'system',
        createdAt: '2023-08-10T09:15:00Z',
        updatedAt: '2023-08-10T09:15:00Z'
      }
    ];
  }

  async getJournalEntryById(id: string): Promise<JournalEntry | null> {
    try {
      const response = await api.get(`/accounting/journal-entries/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching journal entry:', error);
      throw error;
    }
  }

  async createJournalEntry(data: Partial<JournalEntry>): Promise<JournalEntry> {
    try {
      // Validate journal entry
      this.validateJournalEntry(data);

      const response = await api.post('/accounting/journal-entries', data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      return {
        _id: Math.random().toString(36).substring(2, 15),
        reference: data.reference || `JE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        date: data.date || new Date().toISOString().split('T')[0],
        description: data.description || '',
        periodId: data.periodId || `P-${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`,
        lines: data.lines || [],
        totalDebit: data.totalDebit || 0,
        totalCredit: data.totalCredit || 0,
        isBalanced: data.isBalanced || false,
        createdBy: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw error;
    }
  }

  async updateJournalEntry(id: string, data: Partial<JournalEntry>): Promise<JournalEntry> {
    try {
      // Validate journal entry
      this.validateJournalEntry(data);

      const response = await api.patch(`/accounting/journal-entries/${id}`, data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      const existingEntry = await this.getJournalEntryById(id);
      if (!existingEntry) {
        throw new Error('Journal entry not found');
      }

      return {
        ...existingEntry,
        ...data,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw error;
    }
  }

  async deleteJournalEntry(id: string): Promise<void> {
    try {
      await api.delete(`/accounting/journal-entries/${id}`);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw error;
    }
  }

  // Validate journal entry
  private validateJournalEntry(data: Partial<JournalEntry>): boolean {
    // Check if entry has lines
    if (!data.lines || data.lines.length === 0) {
      throw new Error('Journal entry must have at least one line');
    }

    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;

    data.lines.forEach(line => {
      totalDebit += line.debit || 0;
      totalCredit += line.credit || 0;
    });

    // Check if entry is balanced
    if (totalDebit !== totalCredit) {
      throw new Error('Journal entry must be balanced (total debit = total credit)');
    }

    // Check if entry has a date
    if (!data.date) {
      throw new Error('Journal entry must have a date');
    }

    // Check if entry has a period
    if (!data.periodId) {
      throw new Error('Journal entry must be associated with an accounting period');
    }

    return true;
  }

  // Chart of Accounts methods - SCF compliant
  async getAllChartOfAccounts(): Promise<SCFAccount[]> {
    try {
      const response = await api.get('/accounting/chart-of-accounts');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching chart of accounts:', error);
      throw error;
    }
  }

  // Get default SCF accounts (Plan Comptable National - PCN)
  private getDefaultSCFAccounts(): SCFAccount[] {
    return [
      // Class 1: Capital Accounts
      {
        _id: '1',
        code: '10',
        label: 'Capital et réserves',
        type: AccountType.EQUITY,
        scfClass: SCFClass.CLASS_1,
        isParent: true,
        balance: 0,
        description: 'Capital and reserves',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '2',
        code: '101',
        label: 'Capital émis',
        type: AccountType.EQUITY,
        scfClass: SCFClass.CLASS_1,
        parentId: '1',
        isParent: false,
        balance: 50000000,
        description: 'Issued capital',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 2: Fixed Assets
      {
        _id: '3',
        code: '20',
        label: 'Immobilisations incorporelles',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_2,
        isParent: true,
        balance: 0,
        description: 'Intangible assets',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '4',
        code: '21',
        label: 'Immobilisations corporelles',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_2,
        isParent: true,
        balance: 0,
        description: 'Tangible assets',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 3: Inventory
      {
        _id: '5',
        code: '30',
        label: 'Stocks de matières premières',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_3,
        isParent: true,
        balance: 0,
        description: 'Raw materials inventory',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '6',
        code: '31',
        label: 'Stocks de produits finis',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_3,
        isParent: true,
        balance: 35000000,
        description: 'Finished goods inventory',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 4: Third-party accounts
      {
        _id: '7',
        code: '40',
        label: 'Fournisseurs',
        type: AccountType.LIABILITY,
        scfClass: SCFClass.CLASS_4,
        isParent: true,
        balance: 0,
        description: 'Suppliers',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '8',
        code: '401',
        label: 'Fournisseurs de biens et services',
        type: AccountType.LIABILITY,
        scfClass: SCFClass.CLASS_4,
        parentId: '7',
        isParent: false,
        balance: 12000000,
        description: 'Suppliers of goods and services',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '9',
        code: '41',
        label: 'Clients',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_4,
        isParent: true,
        balance: 0,
        description: 'Customers',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '10',
        code: '411',
        label: 'Clients - ventes de biens ou de prestations de services',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_4,
        parentId: '9',
        isParent: false,
        balance: 15000000,
        description: 'Customers - sales of goods or services',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 5: Financial accounts
      {
        _id: '11',
        code: '50',
        label: 'Valeurs mobilières de placement',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_5,
        isParent: true,
        balance: 0,
        description: 'Marketable securities',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '12',
        code: '51',
        label: 'Banques',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_5,
        isParent: true,
        balance: 0,
        description: 'Banks',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '13',
        code: '512',
        label: 'Banques comptes courants',
        type: AccountType.ASSET,
        scfClass: SCFClass.CLASS_5,
        parentId: '12',
        isParent: false,
        balance: 25000000,
        description: 'Bank current accounts',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 6: Expense accounts
      {
        _id: '14',
        code: '60',
        label: 'Achats consommés',
        type: AccountType.EXPENSE,
        scfClass: SCFClass.CLASS_6,
        isParent: true,
        balance: 0,
        description: 'Purchases consumed',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '15',
        code: '61',
        label: 'Services extérieurs',
        type: AccountType.EXPENSE,
        scfClass: SCFClass.CLASS_6,
        isParent: true,
        balance: 0,
        description: 'External services',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '16',
        code: '613',
        label: 'Locations',
        type: AccountType.EXPENSE,
        scfClass: SCFClass.CLASS_6,
        parentId: '15',
        isParent: false,
        balance: 12000000,
        description: 'Rent expenses',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '17',
        code: '60',
        label: 'Achats de marchandises vendues',
        type: AccountType.EXPENSE,
        scfClass: SCFClass.CLASS_6,
        parentId: '14',
        isParent: false,
        balance: 45000000,
        description: 'Cost of goods sold',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },

      // Class 7: Revenue accounts
      {
        _id: '18',
        code: '70',
        label: 'Ventes de marchandises et de produits fabriqués',
        type: AccountType.INCOME,
        scfClass: SCFClass.CLASS_7,
        isParent: true,
        balance: 0,
        description: 'Sales of goods and manufactured products',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '19',
        code: '701',
        label: 'Ventes de produits finis',
        type: AccountType.INCOME,
        scfClass: SCFClass.CLASS_7,
        parentId: '18',
        isParent: false,
        balance: 75000000,
        description: 'Sales of finished goods',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  async getChartOfAccountById(id: string): Promise<SCFAccount | null> {
    try {
      const response = await api.get(`/accounting/chart-of-accounts/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  // Financial Statements methods
  async getAllFinancialStatements(): Promise<FinancialStatementReport[]> {
    try {
      const response = await api.get('/accounting/financial-statements');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      throw error;
    }
  }

  // Get default financial statements
  private getDefaultFinancialStatements(): FinancialStatementReport[] {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const previousMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const currentPeriodId = `P-${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    const previousPeriodId = `P-${previousMonthYear}-${previousMonth.toString().padStart(2, '0')}`;

    const currentDate = new Date(currentYear, currentMonth - 1, 0).toISOString().split('T')[0]; // Last day of current month
    const previousDate = new Date(previousMonthYear, previousMonth - 1, 0).toISOString().split('T')[0]; // Last day of previous month

    return [
      {
        _id: '1',
        type: 'balance_sheet',
        periodId: previousPeriodId,
        date: previousDate,
        status: 'final',
        data: this.generateMockBalanceSheet(previousPeriodId, previousDate),
        createdBy: 'system',
        createdAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString(),
        updatedAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString()
      },
      {
        _id: '2',
        type: 'income_statement',
        periodId: previousPeriodId,
        date: previousDate,
        status: 'final',
        data: this.generateMockIncomeStatement(previousPeriodId, previousDate),
        createdBy: 'system',
        createdAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString(),
        updatedAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString()
      },
      {
        _id: '3',
        type: 'cash_flow',
        periodId: previousPeriodId,
        date: previousDate,
        status: 'final',
        data: this.generateMockCashFlowStatement(previousPeriodId, previousDate),
        createdBy: 'system',
        createdAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString(),
        updatedAt: new Date(previousMonthYear, previousMonth - 1, 5).toISOString()
      },
      {
        _id: '4',
        type: 'balance_sheet',
        periodId: currentPeriodId,
        date: currentDate,
        status: 'draft',
        data: this.generateMockBalanceSheet(currentPeriodId, currentDate),
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        _id: '5',
        type: 'income_statement',
        periodId: currentPeriodId,
        date: currentDate,
        status: 'draft',
        data: this.generateMockIncomeStatement(currentPeriodId, currentDate),
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  async getFinancialStatementById(id: string): Promise<FinancialStatementReport | null> {
    try {
      const response = await api.get(`/accounting/financial-statements/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching financial statement:', error);
      throw error;
    }
  }

  // Generate financial statements
  async generateFinancialStatement(
    type: 'balance_sheet' | 'income_statement' | 'cash_flow',
    periodId: string,
    comparisonPeriodId?: string
  ): Promise<FinancialStatementReport> {
    try {
      const response = await api.post('/accounting/financial-statements/generate', {
        type,
        periodId,
        comparisonPeriodId
      });

      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating financial statement:', error);
      throw error;
    }
  }

  // Finalize financial statement
  async finalizeFinancialStatement(id: string): Promise<FinancialStatementReport> {
    try {
      const response = await api.post(`/accounting/financial-statements/${id}/finalize`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      const statement = await this.getFinancialStatementById(id);
      if (!statement) {
        throw new Error('Statement not found');
      }

      return {
        ...statement,
        status: 'final',
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error finalizing financial statement:', error);
      throw error;
    }
  }

  // Export financial statement to PDF
  async exportFinancialStatementToPDF(id: string): Promise<string> {
    try {
      const response = await api.get(`/accounting/financial-statements/${id}/export/pdf`, {
        responseType: 'blob'
      });

      // Create a blob URL for the PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error exporting financial statement to PDF:', error);
      throw error;
    }
  }

  // Export financial statement to Excel
  async exportFinancialStatementToExcel(id: string): Promise<string> {
    try {
      const response = await api.get(`/accounting/financial-statements/${id}/export/excel`, {
        responseType: 'blob'
      });

      // Create a blob URL for the Excel file
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error exporting financial statement to Excel:', error);
      throw error;
    }
  }

  // Generate mock Balance Sheet
  private generateMockBalanceSheet(periodId: string, date: string): BalanceSheet {
    return {
      date,
      periodId,
      assets: {
        nonCurrentAssets: {
          code: 'A',
          label: 'ACTIFS NON COURANTS',
          items: [
            {
              code: 'A.1',
              label: 'Immobilisations incorporelles',
              accounts: ['20'],
              value: 5000000,
              previousValue: 4500000
            },
            {
              code: 'A.2',
              label: 'Immobilisations corporelles',
              accounts: ['21'],
              value: 75000000,
              previousValue: 80000000
            },
            {
              code: 'A.3',
              label: 'Immobilisations en cours',
              accounts: ['23'],
              value: 15000000,
              previousValue: 10000000
            },
            {
              code: 'A.4',
              label: 'Immobilisations financières',
              accounts: ['26', '27'],
              value: 2000000,
              previousValue: 2000000
            }
          ],
          total: 97000000,
          previousTotal: 96500000
        },
        currentAssets: {
          code: 'B',
          label: 'ACTIFS COURANTS',
          items: [
            {
              code: 'B.1',
              label: 'Stocks et encours',
              accounts: ['30', '31', '32', '33', '34', '35', '36', '37', '38'],
              value: 35000000,
              previousValue: 30000000
            },
            {
              code: 'B.2',
              label: 'Créances et emplois assimilés',
              accounts: ['40', '41', '42', '43', '44', '45', '46', '47', '48'],
              value: 15000000,
              previousValue: 18000000
            },
            {
              code: 'B.3',
              label: 'Disponibilités et assimilés',
              accounts: ['50', '51', '52', '53', '54', '55', '56', '57', '58'],
              value: 25000000,
              previousValue: 20000000
            }
          ],
          total: 75000000,
          previousTotal: 68000000
        }
      },
      liabilities: {
        equity: {
          code: 'C',
          label: 'CAPITAUX PROPRES',
          items: [
            {
              code: 'C.1',
              label: 'Capital émis',
              accounts: ['101'],
              value: 50000000,
              previousValue: 50000000
            },
            {
              code: 'C.2',
              label: 'Réserves',
              accounts: ['106'],
              value: 10000000,
              previousValue: 8000000
            },
            {
              code: 'C.3',
              label: 'Résultat net',
              accounts: ['12'],
              value: 15000000,
              previousValue: 12000000
            }
          ],
          total: 75000000,
          previousTotal: 70000000
        },
        nonCurrentLiabilities: {
          code: 'D',
          label: 'PASSIFS NON COURANTS',
          items: [
            {
              code: 'D.1',
              label: 'Emprunts et dettes financières',
              accounts: ['16'],
              value: 40000000,
              previousValue: 45000000
            },
            {
              code: 'D.2',
              label: 'Provisions et produits constatés d\'avance',
              accounts: ['15'],
              value: 5000000,
              previousValue: 4500000
            }
          ],
          total: 45000000,
          previousTotal: 49500000
        },
        currentLiabilities: {
          code: 'E',
          label: 'PASSIFS COURANTS',
          items: [
            {
              code: 'E.1',
              label: 'Fournisseurs et comptes rattachés',
              accounts: ['40'],
              value: 12000000,
              previousValue: 10000000
            },
            {
              code: 'E.2',
              label: 'Impôts',
              accounts: ['44'],
              value: 8000000,
              previousValue: 7000000
            },
            {
              code: 'E.3',
              label: 'Autres dettes',
              accounts: ['41', '42', '43', '45', '46', '47', '48'],
              value: 32000000,
              previousValue: 28000000
            }
          ],
          total: 52000000,
          previousTotal: 45000000
        }
      },
      totalAssets: 172000000,
      totalLiabilities: 172000000,
      previousTotalAssets: 164500000,
      previousTotalLiabilities: 164500000
    };
  }

  // Generate mock Income Statement
  private generateMockIncomeStatement(periodId: string, endDate: string): IncomeStatement {
    const period = this.getDefaultAccountingPeriods().find(p => p._id === periodId);
    const startDate = period?.startDate || new Date().toISOString().split('T')[0];

    return {
      startDate,
      endDate,
      periodId,
      operatingRevenue: {
        code: 'I',
        label: 'PRODUITS D\'EXPLOITATION',
        items: [
          {
            code: 'I.1',
            label: 'Ventes et produits annexes',
            accounts: ['70'],
            value: 75000000,
            previousValue: 65000000
          },
          {
            code: 'I.2',
            label: 'Production stockée ou déstockée',
            accounts: ['71'],
            value: 5000000,
            previousValue: 3000000
          },
          {
            code: 'I.3',
            label: 'Production immobilisée',
            accounts: ['72'],
            value: 2000000,
            previousValue: 1500000
          },
          {
            code: 'I.4',
            label: 'Subventions d\'exploitation',
            accounts: ['74'],
            value: 1000000,
            previousValue: 1000000
          }
        ],
        total: 83000000,
        previousTotal: 70500000
      },
      operatingExpenses: {
        code: 'II',
        label: 'CHARGES D\'EXPLOITATION',
        items: [
          {
            code: 'II.1',
            label: 'Achats consommés',
            accounts: ['60'],
            value: 45000000,
            previousValue: 38000000
          },
          {
            code: 'II.2',
            label: 'Services extérieurs et autres consommations',
            accounts: ['61', '62'],
            value: 12000000,
            previousValue: 10000000
          },
          {
            code: 'II.3',
            label: 'Charges de personnel',
            accounts: ['63'],
            value: 15000000,
            previousValue: 13000000
          },
          {
            code: 'II.4',
            label: 'Impôts, taxes et versements assimilés',
            accounts: ['64'],
            value: 3000000,
            previousValue: 2500000
          },
          {
            code: 'II.5',
            label: 'Dotations aux amortissements et provisions',
            accounts: ['68'],
            value: 5000000,
            previousValue: 4500000
          }
        ],
        total: 80000000,
        previousTotal: 68000000
      },
      financialRevenue: {
        code: 'III',
        label: 'PRODUITS FINANCIERS',
        items: [
          {
            code: 'III.1',
            label: 'Produits financiers',
            accounts: ['76'],
            value: 1000000,
            previousValue: 800000
          }
        ],
        total: 1000000,
        previousTotal: 800000
      },
      financialExpenses: {
        code: 'IV',
        label: 'CHARGES FINANCIÈRES',
        items: [
          {
            code: 'IV.1',
            label: 'Charges financières',
            accounts: ['66'],
            value: 2000000,
            previousValue: 2200000
          }
        ],
        total: 2000000,
        previousTotal: 2200000
      },
      extraordinaryItems: {
        code: 'V',
        label: 'ÉLÉMENTS EXTRAORDINAIRES',
        items: [
          {
            code: 'V.1',
            label: 'Produits extraordinaires',
            accounts: ['77'],
            value: 500000,
            previousValue: 0
          },
          {
            code: 'V.2',
            label: 'Charges extraordinaires',
            accounts: ['67'],
            value: 0,
            previousValue: 300000
          }
        ],
        total: 500000,
        previousTotal: -300000
      },
      taxes: {
        code: 'VI',
        label: 'IMPÔTS SUR LES RÉSULTATS',
        items: [
          {
            code: 'VI.1',
            label: 'Impôts exigibles sur résultats',
            accounts: ['695'],
            value: 2500000,
            previousValue: 1800000
          },
          {
            code: 'VI.2',
            label: 'Impôts différés (variations)',
            accounts: ['692', '693'],
            value: 0,
            previousValue: 0
          }
        ],
        total: 2500000,
        previousTotal: 1800000
      },
      operatingResult: 3000000,
      financialResult: -1000000,
      ordinaryResult: 2000000,
      extraordinaryResult: 500000,
      netResult: 0,
      previousOperatingResult: 2500000,
      previousFinancialResult: -1400000,
      previousOrdinaryResult: 1100000,
      previousExtraordinaryResult: -300000,
      previousNetResult: -1000000
    };
  }

  // Generate mock Cash Flow Statement
  private generateMockCashFlowStatement(periodId: string, endDate: string): CashFlowStatement {
    const period = this.getDefaultAccountingPeriods().find(p => p._id === periodId);
    const startDate = period?.startDate || new Date().toISOString().split('T')[0];

    return {
      startDate,
      endDate,
      periodId,
      operatingActivities: {
        code: 'A',
        label: 'FLUX DE TRÉSORERIE LIÉS À L\'ACTIVITÉ',
        items: [
          {
            code: 'A.1',
            label: 'Résultat net',
            accounts: ['12'],
            value: 15000000,
            previousValue: 12000000
          },
          {
            code: 'A.2',
            label: 'Amortissements et provisions',
            accounts: ['68', '78'],
            value: 5000000,
            previousValue: 4500000
          },
          {
            code: 'A.3',
            label: 'Variation du BFR',
            accounts: [],
            value: -3000000,
            previousValue: -2000000
          }
        ],
        total: 17000000,
        previousTotal: 14500000
      },
      investingActivities: {
        code: 'B',
        label: 'FLUX DE TRÉSORERIE LIÉS AUX OPÉRATIONS D\'INVESTISSEMENT',
        items: [
          {
            code: 'B.1',
            label: 'Acquisitions d\'immobilisations',
            accounts: ['20', '21', '22', '23', '24', '25', '26', '27', '28'],
            value: -10000000,
            previousValue: -15000000
          },
          {
            code: 'B.2',
            label: 'Cessions d\'immobilisations',
            accounts: ['775'],
            value: 2000000,
            previousValue: 1000000
          }
        ],
        total: -8000000,
        previousTotal: -14000000
      },
      financingActivities: {
        code: 'C',
        label: 'FLUX DE TRÉSORERIE LIÉS AUX OPÉRATIONS DE FINANCEMENT',
        items: [
          {
            code: 'C.1',
            label: 'Augmentation de capital',
            accounts: ['101'],
            value: 0,
            previousValue: 5000000
          },
          {
            code: 'C.2',
            label: 'Dividendes versés',
            accounts: ['457'],
            value: -5000000,
            previousValue: -4000000
          },
          {
            code: 'C.3',
            label: 'Emprunts',
            accounts: ['16'],
            value: 0,
            previousValue: 10000000
          },
          {
            code: 'C.4',
            label: 'Remboursements d\'emprunts',
            accounts: ['16'],
            value: -5000000,
            previousValue: -3000000
          }
        ],
        total: -10000000,
        previousTotal: 8000000
      },
      netCashFromOperatingActivities: 17000000,
      netCashFromInvestingActivities: -8000000,
      netCashFromFinancingActivities: -10000000,
      netChangeInCash: -1000000,
      openingCashBalance: 20000000,
      closingCashBalance: 19000000,
      previousNetCashFromOperatingActivities: 14500000,
      previousNetCashFromInvestingActivities: -14000000,
      previousNetCashFromFinancingActivities: 8000000,
      previousNetChangeInCash: 8500000,
      previousOpeningCashBalance: 11500000,
      previousClosingCashBalance: 20000000
    };
  }

  // Accounting Periods methods
  async getAllAccountingPeriods(): Promise<AccountingPeriod[]> {
    try {
      const response = await api.get('/accounting/periods');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching accounting periods:', error);
      throw error;
    }
  }

  // Get default accounting periods
  private getDefaultAccountingPeriods(): AccountingPeriod[] {
    const currentYear = new Date().getFullYear();
    const periods: AccountingPeriod[] = [];

    // Generate monthly periods for the current year
    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(currentYear, month - 1, 1);
      const endDate = new Date(currentYear, month, 0);

      periods.push({
        _id: `P-${currentYear}-${month.toString().padStart(2, '0')}`,
        name: `${this.getMonthName(month)} ${currentYear}`,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        isClosed: month < new Date().getMonth() + 1, // Close past months
        closedBy: month < new Date().getMonth() + 1 ? 'system' : undefined,
        closedAt: month < new Date().getMonth() + 1 ? new Date(currentYear, month, 1).toISOString() : undefined,
        createdAt: new Date(currentYear, 0, 1).toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    return periods;
  }

  // Get month name
  private getMonthName(month: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[month - 1];
  }

  async getAccountingPeriodById(id: string): Promise<AccountingPeriod | null> {
    try {
      const response = await api.get(`/accounting/periods/${id}`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching accounting period:', error);
      throw error;
    }
  }

  async createAccountingPeriod(data: Partial<AccountingPeriod>): Promise<AccountingPeriod> {
    try {
      // Validate accounting period
      this.validateAccountingPeriod(data);

      const response = await api.post('/accounting/periods', data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error creating accounting period:', error);
      throw error;
    }
  }

  async updateAccountingPeriod(id: string, data: Partial<AccountingPeriod>): Promise<AccountingPeriod> {
    try {
      // Validate accounting period
      this.validateAccountingPeriod(data);

      const response = await api.patch(`/accounting/periods/${id}`, data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error updating accounting period:', error);
      throw error;
    }
  }

  async closeAccountingPeriod(id: string): Promise<AccountingPeriod> {
    try {
      const response = await api.post(`/accounting/periods/${id}/close`);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      const existingPeriod = await this.getAccountingPeriodById(id);
      if (!existingPeriod) {
        throw new Error('Accounting period not found');
      }

      return {
        ...existingPeriod,
        isClosed: true,
        closedBy: 'user',
        closedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error closing accounting period:', error);
      throw error;
    }
  }

  // Validate accounting period
  private validateAccountingPeriod(data: Partial<AccountingPeriod>): boolean {
    // Check if period has a name
    if (!data.name) {
      throw new Error('Accounting period must have a name');
    }

    // Check if period has start and end dates
    if (!data.startDate || !data.endDate) {
      throw new Error('Accounting period must have start and end dates');
    }

    // Check if start date is before end date
    if (new Date(data.startDate) > new Date(data.endDate)) {
      throw new Error('Start date must be before end date');
    }

    return true;
  }

  // General Ledger methods
  async getGeneralLedger(params: { accountId?: string, periodId?: string, startDate?: string, endDate?: string } = {}): Promise<GeneralLedgerAccount[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params.accountId) queryParams.append('accountId', params.accountId);
      if (params.periodId) queryParams.append('periodId', params.periodId);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);

      const url = `/accounting/general-ledger?${queryParams.toString()}`;
      const response = await api.get(url);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching general ledger:', error);
      throw error;
    }
  }

  // Get default general ledger
  private getDefaultGeneralLedger(params: { accountId?: string, periodId?: string, startDate?: string, endDate?: string } = {}): GeneralLedgerAccount[] {
    // Get accounts
    const accounts = this.getDefaultSCFAccounts();

    // Get journal entries
    const journalEntries = this.getDefaultJournalEntries();

    // Filter journal entries by date range if provided
    let filteredEntries = journalEntries;
    if (params.startDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date >= params.startDate!);
    }
    if (params.endDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date <= params.endDate!);
    }
    if (params.periodId) {
      filteredEntries = filteredEntries.filter(entry => entry.periodId === params.periodId);
    }

    // Create general ledger accounts
    const ledgerAccounts: GeneralLedgerAccount[] = [];

    // If accountId is provided, only include that account
    const accountsToInclude = params.accountId
      ? accounts.filter(account => account._id === params.accountId)
      : accounts;

    // Create a ledger account for each account
    accountsToInclude.forEach(account => {
      // Get all journal entry lines for this account
      const accountEntries: GeneralLedgerEntry[] = [];
      let totalDebit = 0;
      let totalCredit = 0;
      let balance = account.balance; // Starting balance

      // Add journal entry lines
      filteredEntries.forEach(entry => {
        entry.lines.forEach(line => {
          if (line.accountId === account._id) {
            // Add to running balance
            balance = balance + line.debit - line.credit;

            // Add to totals
            totalDebit += line.debit;
            totalCredit += line.credit;

            // Add to entries
            accountEntries.push({
              _id: `${entry._id}-${line._id}`,
              accountId: account._id!,
              accountCode: account.code,
              accountLabel: account.label,
              date: entry.date,
              journalEntryId: entry._id!,
              journalReference: entry.reference,
              description: line.description,
              debit: line.debit,
              credit: line.credit,
              balance: balance
            });
          }
        });
      });

      // Only add accounts with entries or a non-zero balance
      if (accountEntries.length > 0 || account.balance !== 0) {
        ledgerAccounts.push({
          accountId: account._id!,
          accountCode: account.code,
          accountLabel: account.label,
          accountType: account.type,
          openingBalance: account.balance,
          entries: accountEntries,
          totalDebit: totalDebit,
          totalCredit: totalCredit,
          closingBalance: balance
        });
      }
    });

    return ledgerAccounts;
  }

  async createChartOfAccount(data: Partial<SCFAccount>): Promise<SCFAccount> {
    try {
      // Validate account code format according to SCF
      this.validateSCFAccountCode(data.code || '', data.scfClass || '');

      const response = await api.post('/accounting/chart-of-accounts', data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      return {
        _id: Math.random().toString(36).substring(2, 15),
        code: data.code || '',
        label: data.label || '',
        type: data.type || AccountType.ASSET,
        scfClass: data.scfClass || SCFClass.CLASS_1,
        parentId: data.parentId,
        isParent: data.isParent || false,
        balance: data.balance || 0,
        description: data.description || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async updateChartOfAccount(id: string, data: Partial<SCFAccount>): Promise<SCFAccount> {
    try {
      // Validate account code format according to SCF if code is being updated
      if (data.code) {
        this.validateSCFAccountCode(data.code, data.scfClass || '');
      }

      const response = await api.patch(`/accounting/chart-of-accounts/${id}`, data);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }

      // Mock response if API fails
      const existingAccount = await this.getChartOfAccountById(id);
      if (!existingAccount) {
        throw new Error('Account not found');
      }

      return {
        ...existingAccount,
        ...data,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  async deleteChartOfAccount(id: string): Promise<void> {
    try {
      await api.delete(`/accounting/chart-of-accounts/${id}`);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Validate SCF account code format
  private validateSCFAccountCode(code: string, scfClass: string): boolean {
    // SCF account codes must start with the class number
    if (!code.startsWith(scfClass)) {
      throw new Error(`Account code must start with class number ${scfClass}`);
    }

    // SCF account codes must be numeric
    if (!/^\d+$/.test(code)) {
      throw new Error('Account code must contain only digits');
    }

    // SCF account codes must be between 1 and 8 digits
    if (code.length < 1 || code.length > 8) {
      throw new Error('Account code must be between 1 and 8 digits');
    }

    return true;
  }

  // Proforma Invoice methods
  async getAllProformaInvoices(): Promise<any[]> {
    try {
      const response = await api.get('/accounting/proforma-invoices');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching proforma invoices:', error);
      throw error;
    }
  }

  async getProformaInvoiceById(id: string): Promise<any> {
    try {
      const response = await api.get(`/accounting/proforma-invoices/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createProformaInvoice(data: any): Promise<any> {
    try {
      const response = await api.post('/accounting/proforma-invoices', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateProformaInvoice(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/accounting/proforma-invoices/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteProformaInvoice(id: string): Promise<void> {
    try {
      await api.delete(`/accounting/proforma-invoices/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Contract methods
  async getAllContracts(): Promise<any[]> {
    try {
      const response = await api.get('/accounting/contracts');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  async getContractById(id: string): Promise<any> {
    try {
      const response = await api.get(`/accounting/contracts/${id}`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createContract(data: any): Promise<any> {
    try {
      const response = await api.post('/accounting/contracts', data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateContract(id: string, data: any): Promise<any> {
    try {
      const response = await api.patch(`/accounting/contracts/${id}`, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteContract(id: string): Promise<void> {
    try {
      await api.delete(`/accounting/contracts/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Audit log method
  async createAuditLog(entityType: string, entityId: string, action: string, eventType: string): Promise<void> {
    try {
      await api.post('/accounting/audit-logs', {
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

  // Update deleteInvoice to use status management
  async deleteInvoice(id: string, reason: string, userId: string): Promise<void> {
    try {
      // Instead of deleting, change status to cancelled
      await statusManagementService.changeStatus(
        'invoices',
        id,
        InvoiceStatus.CANCELLED,
        'INVOICE_CANCELLED',
        reason,
        userId
      );

      // Update the invoice in the database
      await api.patch(`/accounting/invoices/${id}`, {
        status: InvoiceStatus.CANCELLED,
        reason
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle invoice status changes
  async updateInvoiceStatus(
    id: string,
    newStatus: InvoiceStatus,
    reason: string,
    userId: string
  ): Promise<Invoice> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'invoices',
        id,
        newStatus,
        `INVOICE_${newStatus.toUpperCase()}`,
        reason,
        userId
      );

      // Update the invoice in the database
      const response = await api.patch(`/accounting/invoices/${id}`, {
        status: newStatus,
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle invoice void
  async voidInvoice(
    id: string,
    reason: string,
    userId: string
  ): Promise<Invoice> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'invoices',
        id,
        InvoiceStatus.VOID,
        'INVOICE_VOID',
        reason,
        userId
      );

      // Update the invoice in the database
      const response = await api.patch(`/accounting/invoices/${id}/void`, {
        reason
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update deleteExpense to use status management
  async deleteExpense(id: string, reason: string, userId: string): Promise<void> {
    try {
      // Instead of deleting, change status to rejected
      await statusManagementService.changeStatus(
        'expenses',
        id,
        ExpenseStatus.REJECTED,
        'EXPENSE_REJECTED',
        reason,
        userId
      );

      // Update the expense in the database
      await api.patch(`/accounting/expenses/${id}`, {
        status: ExpenseStatus.REJECTED,
        reason
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to handle expense status changes
  async updateExpenseStatus(
    id: string,
    newStatus: Expense['status'],
    reason: string,
    userId: string
  ): Promise<Expense> {
    try {
      // Use status management service
      await statusManagementService.changeStatus(
        'expenses',
        id,
        newStatus,
        `EXPENSE_${newStatus.toUpperCase()}`,
        reason,
        userId
      );

      // Update the expense in the database
      const response = await api.patch(`/accounting/expenses/${id}`, {
        status: newStatus,
        reason,
        [`${newStatus}By`]: userId,
        [`${newStatus}At`]: new Date().toISOString()
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to soft delete an expense
  async softDeleteExpense(id: string, userId: string): Promise<Expense> {
    try {
      const response = await api.patch(`/accounting/expenses/${id}/soft-delete`, {
        deletedBy: userId
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add method to restore a soft deleted expense
  async restoreExpense(id: string): Promise<Expense> {
    try {
      const response = await api.patch(`/accounting/expenses/${id}/restore`);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update getExpenses method to include soft deleted items when requested
  async getExpenses(filters?: {
    departmentId?: string;
    category?: string;
    status?: Expense['status'];
    startDate?: Date;
    endDate?: Date;
    includeDeleted?: boolean;
  }): Promise<Expense[]> {
    try {
      const response = await api.get('/accounting/expenses', { params: filters });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Event Handlers
  private async handleStockMovement(data: {
    movementId: string;
    type: 'in' | 'out' | 'transfer';
    quantity: number;
    unitPrice: number;
  }): Promise<void> {
    try {
      if (data.type === 'out') {
        // Create an expense for outgoing stock
        await this.createExpense({
          amount: data.quantity * data.unitPrice,
          category: 'stock',
          description: `Stock movement: ${data.movementId}`,
          date: new Date().toISOString(),
          createdBy: 'system',
          departmentId: 'stock',
          status: ExpenseStatus.PENDING
        });
      }
    } catch (error) {
      console.error('Failed to handle stock movement:', error);
    }
  }

  private handleError(error: any): never {
    if (error.response) {
      throw new Error(error.response.data.message || 'An error occurred');
    }
    throw error;
  }

  async cancelInvoice(id: string, reason: string, userId: string) {
    try {
      // Create audit log entry
      await this.createAuditLog(
        'invoices',
        id,
        'CANCELLED',
        'INVOICE_CANCELLED'
      );

      // Update the invoice in the database
      await api.patch(`/accounting/invoices/${id}`, {
        status: 'CANCELLED',
        reason
      });
    } catch (error) {
      throw error;
    }
  }

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Financial Statements methods
  async getFinancialStatements(): Promise<FinancialStatementReport[]> {
    try {
      const response = await api.get('/accounting/financial-statements');
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error fetching financial statements:', error);
      throw error;
    }
  }

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration

  // Method removed to fix duplicate declaration
}

export const accountingService = AccountingService.getInstance();
import { api } from './api';
import { eventService, EventType } from '../modules/shared/services/EventService';
import { statusManagementService, InvoiceStatus, ExpenseStatus } from '../modules/shared/services/StatusManagementService';

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

  // ... existing methods ...

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

  async updateInvoiceStatus(id: string, newStatus: string, reason: string, userId: string) {
    try {
      // Create audit log entry
      await this.createAuditLog(
        'invoices',
        id,
        newStatus,
        `INVOICE_${newStatus.toUpperCase()}`
      );

      // Update the invoice in the database
      await api.patch(`/accounting/invoices/${id}`, {
        status: newStatus,
        reason
      });
    } catch (error) {
      throw error;
    }
  }

  async voidInvoice(id: string, reason: string, userId: string) {
    try {
      // Create audit log entry
      await this.createAuditLog(
        'invoices',
        id,
        'VOID',
        'INVOICE_VOID'
      );

      // Update the invoice in the database
      await api.patch(`/accounting/invoices/${id}`, {
        status: 'VOID',
        reason
      });
    } catch (error) {
      throw error;
    }
  }
}

export const accountingService = AccountingService.getInstance(); 
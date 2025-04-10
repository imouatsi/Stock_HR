import api from '../../../services/api.service';
import { eventService, EventType } from './EventService';

// Common status types across modules
export enum CommonStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

// Employee-specific statuses
export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  RETIRED = 'retired',
  SUSPENDED = 'suspended',
  DECEASED = 'deceased'
}

// Stock-specific statuses
export enum StockItemStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock'
}

// Invoice-specific statuses
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  VOID = 'void'
}

// Expense-specific statuses
export enum ExpenseStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid'
}

// Asset-specific statuses
export enum AssetStatus {
  AVAILABLE = 'available',
  ASSIGNED = 'assigned',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  LOST = 'lost',
  STOLEN = 'stolen',
  DAMAGED = 'damaged'
}

// Status change reason categories
export enum StatusChangeReasonCategory {
  EMPLOYEE = 'employee',
  STOCK = 'stock',
  INVOICE = 'invoice',
  ASSET = 'asset',
  GENERAL = 'general'
}

// Status change reason interface
export interface StatusChangeReason {
  id: string;
  code: string;
  description: string;
  type: 'employee' | 'stock' | 'invoice' | 'expense';
}

// Status change record interface
export interface StatusChangeRecord {
  id: string;
  entityId: string;
  entityType: 'employee' | 'stock' | 'invoice' | 'expense';
  oldStatus: EmployeeStatus | StockItemStatus | InvoiceStatus | ExpenseStatus;
  newStatus: EmployeeStatus | StockItemStatus | InvoiceStatus | ExpenseStatus;
  reason: string;
  changedBy: string;
  changedAt: string;
}

class StatusManagementService {
  private static instance: StatusManagementService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.EMPLOYEE_STATUS_CHANGED, this.handleEmployeeStatusChange);
    eventService.on(EventType.STOCK_ITEM_STATUS_CHANGED, this.handleStockItemStatusChange);
    eventService.on(EventType.INVOICE_STATUS_CHANGED, this.handleInvoiceStatusChange);
    eventService.on(EventType.EXPENSE_STATUS_CHANGED, this.handleExpenseStatusChange);
  }

  public static getInstance(): StatusManagementService {
    if (!StatusManagementService.instance) {
      StatusManagementService.instance = new StatusManagementService();
    }
    return StatusManagementService.instance;
  }

  async changeStatus(
    entityId: string,
    entityType: 'employee' | 'stock' | 'invoice' | 'expense',
    newStatus: EmployeeStatus | StockItemStatus | InvoiceStatus | ExpenseStatus,
    reasonCode: string
  ): Promise<StatusChangeRecord> {
    const response = await api.post('/status/change', {
      entityId,
      entityType,
      newStatus,
      reasonCode
    });
    return response.data;
  }

  async getStatusHistory(
    entityId: string,
    entityType: 'employee' | 'stock' | 'invoice' | 'expense'
  ): Promise<StatusChangeRecord[]> {
    const response = await api.get(`/status/history/${entityType}/${entityId}`);
    return response.data;
  }

  async getStatusReasons(
    type: 'employee' | 'stock' | 'invoice' | 'expense'
  ): Promise<StatusChangeReason[]> {
    const response = await api.get(`/status/reasons/${type}`);
    return response.data;
  }

  private async handleEmployeeStatusChange(data: { employeeId: string; newStatus: EmployeeStatus }): Promise<void> {
    try {
      await this.changeStatus(
        data.employeeId,
        'employee',
        data.newStatus,
        'system'
      );
    } catch (error) {
      console.error('Failed to handle employee status change:', error);
    }
  }

  private async handleStockItemStatusChange(data: { itemId: string; newStatus: StockItemStatus }): Promise<void> {
    try {
      await this.changeStatus(
        data.itemId,
        'stock',
        data.newStatus,
        'system'
      );
    } catch (error) {
      console.error('Failed to handle stock item status change:', error);
    }
  }

  private async handleInvoiceStatusChange(data: { invoiceId: string; newStatus: InvoiceStatus }): Promise<void> {
    try {
      await this.changeStatus(
        data.invoiceId,
        'invoice',
        data.newStatus,
        'system'
      );
    } catch (error) {
      console.error('Failed to handle invoice status change:', error);
    }
  }

  private async handleExpenseStatusChange(data: { expenseId: string; newStatus: ExpenseStatus }): Promise<void> {
    try {
      await this.changeStatus(
        data.expenseId,
        'expense',
        data.newStatus,
        'system'
      );
    } catch (error) {
      console.error('Failed to handle expense status change:', error);
    }
  }
}

export const statusManagementService = StatusManagementService.getInstance();
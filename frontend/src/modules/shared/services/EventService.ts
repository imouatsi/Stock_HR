import { AssetStatus } from './AssetTrackingService';
import { EmployeeStatus, InvoiceStatus, ExpenseStatus } from './StatusManagementService';

// Define event types for cross-module communication
export enum EventType {
  // Employee Events
  EMPLOYEE_CREATED = 'EMPLOYEE_CREATED',
  EMPLOYEE_UPDATED = 'EMPLOYEE_UPDATED',
  EMPLOYEE_DELETED = 'EMPLOYEE_DELETED',
  EMPLOYEE_STATUS_CHANGED = 'EMPLOYEE_STATUS_CHANGED',
  EMPLOYEE_TERMINATED = 'EMPLOYEE_TERMINATED',
  EMPLOYEE_RETIRED = 'EMPLOYEE_RETIRED',
  EMPLOYEE_SUSPENDED = 'EMPLOYEE_SUSPENDED',
  EMPLOYEE_DECEASED = 'EMPLOYEE_DECEASED',

  // Department Events
  DEPARTMENT_CREATED = 'DEPARTMENT_CREATED',
  DEPARTMENT_UPDATED = 'DEPARTMENT_UPDATED',
  DEPARTMENT_DELETED = 'DEPARTMENT_DELETED',

  // Position Events
  POSITION_CREATED = 'POSITION_CREATED',
  POSITION_UPDATED = 'POSITION_UPDATED',
  POSITION_DELETED = 'POSITION_DELETED',

  // Stock Events
  STOCK_MOVEMENT_CREATED = 'STOCK_MOVEMENT_CREATED',
  STOCK_MOVEMENT_UPDATED = 'STOCK_MOVEMENT_UPDATED',
  STOCK_MOVEMENT_CANCELLED = 'STOCK_MOVEMENT_CANCELLED',
  STOCK_ITEM_STATUS_CHANGED = 'STOCK_ITEM_STATUS_CHANGED',
  STOCK_ITEM_UPDATED = 'STOCK_ITEM_UPDATED',
  STOCK_ITEM_DELETED = 'STOCK_ITEM_DELETED',
  STOCK_ITEM_OUT = 'STOCK_ITEM_OUT',
  STOCK_ITEM_IN = 'STOCK_ITEM_IN',
  STOCK_ITEM_TRANSFER = 'STOCK_ITEM_TRANSFER',

  // Asset Events
  ASSET_CREATED = 'ASSET_CREATED',
  ASSET_UPDATED = 'ASSET_UPDATED',
  ASSET_DELETED = 'ASSET_DELETED',
  ASSET_ASSIGNED = 'ASSET_ASSIGNED',
  ASSET_RETURNED = 'ASSET_RETURNED',
  ASSET_STATUS_CHANGED = 'ASSET_STATUS_CHANGED',

  // Invoice Events
  INVOICE_CREATED = 'INVOICE_CREATED',
  INVOICE_UPDATED = 'INVOICE_UPDATED',
  INVOICE_DELETED = 'INVOICE_DELETED',
  INVOICE_PAID = 'INVOICE_PAID',
  INVOICE_VOID = 'INVOICE_VOID',
  INVOICE_STATUS_CHANGED = 'INVOICE_STATUS_CHANGED',

  // Expense Events
  EXPENSE_CREATED = 'EXPENSE_CREATED',
  EXPENSE_UPDATED = 'EXPENSE_UPDATED',
  EXPENSE_DELETED = 'EXPENSE_DELETED',
  EXPENSE_STATUS_CHANGED = 'EXPENSE_STATUS_CHANGED',
  EXPENSE_APPROVED = 'EXPENSE_APPROVED',
  EXPENSE_REJECTED = 'EXPENSE_REJECTED',
  EXPENSE_PAID = 'EXPENSE_PAID',

  // User Events
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',

  // System Events
  SYSTEM_STATUS_CHANGED = 'SYSTEM_STATUS_CHANGED',
  SYSTEM_ALERT_CREATED = 'SYSTEM_ALERT_CREATED',

  // Import/Export Events
  IMPORT_EXPORT_STARTED = 'IMPORT_EXPORT_STARTED',
  IMPORT_EXPORT_COMPLETED = 'IMPORT_EXPORT_COMPLETED',
  IMPORT_EXPORT_FAILED = 'IMPORT_EXPORT_FAILED',

  // Report Events
  REPORT_GENERATED = 'REPORT_GENERATED',
  REPORT_FAILED = 'REPORT_FAILED',

  // Audit Events
  AUDIT_LOG_CREATED = 'AUDIT_LOG_CREATED',

  // Settings Events
  SETTING_UPDATED = 'SETTING_UPDATED',

  // Dashboard Events
  DASHBOARD_UPDATED = 'DASHBOARD_UPDATED',

  // Log Events
  LOG_CREATED = 'LOG_CREATED',

  // Security Events
  SECURITY_EVENT_CREATED = 'SECURITY_EVENT_CREATED',
  SECURITY_ALERT_CREATED = 'SECURITY_ALERT_CREATED'
}

// Define event data interfaces
export interface EventData {
  [EventType.EMPLOYEE_CREATED]: { employeeId: string; name: string; role: string };
  [EventType.EMPLOYEE_UPDATED]: { employeeId: string; changes: Partial<{ name: string; role: string }> };
  [EventType.EMPLOYEE_DELETED]: { employeeId: string };
  [EventType.EMPLOYEE_TERMINATED]: { employeeId: string; reason: string; terminatedBy: string };
  [EventType.EMPLOYEE_RETIRED]: { employeeId: string; date: string; reason: string };
  [EventType.EMPLOYEE_SUSPENDED]: { employeeId: string; reason: string; duration: string };
  [EventType.EMPLOYEE_DECEASED]: { employeeId: string; date: string };
  [EventType.EMPLOYEE_STATUS_CHANGED]: { employeeId: string; oldStatus: EmployeeStatus; newStatus: EmployeeStatus };

  [EventType.ASSET_CREATED]: { assetId: string; name: string; type: string };
  [EventType.ASSET_UPDATED]: { assetId: string; changes: Partial<{ name: string; type: string }> };
  [EventType.ASSET_DELETED]: { assetId: string };
  [EventType.ASSET_ASSIGNED]: { assetId: string; employeeId: string; assignedBy: string; assignedDate: string };
  [EventType.ASSET_RETURNED]: { assetId: string; employeeId: string; returnedBy: string; returnedDate: string };
  [EventType.ASSET_STATUS_CHANGED]: { assetId: string; oldStatus: AssetStatus; newStatus: AssetStatus };

  [EventType.STOCK_ITEM_CREATED]: { itemId: string; name: string; category: string };
  [EventType.STOCK_ITEM_UPDATED]: { itemId: string; changes: Partial<{ name: string; category: string }> };
  [EventType.STOCK_ITEM_DELETED]: { itemId: string };
  [EventType.STOCK_MOVEMENT_CREATED]: { movementId: string; itemId: string; quantity: number; type: 'in' | 'out' | 'transfer'; userId: string };
  [EventType.STOCK_MOVEMENT_UPDATED]: { movementId: string; changes: Partial<{ quantity: number; type: 'in' | 'out' | 'transfer' }> };
  [EventType.STOCK_MOVEMENT_CANCELLED]: { movementId: string; reason: string };
  [EventType.STOCK_ITEM_STATUS_CHANGED]: { itemId: string; oldStatus: string; newStatus: string };
  [EventType.STOCK_ITEM_OUT]: { itemId: string; quantity: number; destination: string };
  [EventType.STOCK_ITEM_IN]: { itemId: string; quantity: number; source: string };
  [EventType.STOCK_ITEM_TRANSFER]: { itemId: string; quantity: number; source: string; destination: string };

  [EventType.INVOICE_CREATED]: { invoiceId: string; amount: number; client: string };
  [EventType.INVOICE_UPDATED]: { invoiceId: string; changes: Partial<{ amount: number; client: string }> };
  [EventType.INVOICE_DELETED]: { invoiceId: string };
  [EventType.INVOICE_PAID]: { invoiceId: string; paidAmount: number; paidDate: string };
  [EventType.INVOICE_VOID]: { invoiceId: string; reason: string };
  [EventType.INVOICE_STATUS_CHANGED]: { invoiceId: string; oldStatus: InvoiceStatus; newStatus: InvoiceStatus };

  [EventType.EXPENSE_CREATED]: { expenseId: string; amount: number; category: string; createdBy: string; departmentId: string };
  [EventType.EXPENSE_APPROVED]: { expenseId: string; amount: number; category: string; approvedBy: string };
  [EventType.EXPENSE_REJECTED]: { expenseId: string; reason: string; rejectedBy: string };
  [EventType.EXPENSE_PAID]: { expenseId: string; paidAmount: number; paidDate: string };
  [EventType.EXPENSE_STATUS_CHANGED]: { expenseId: string; oldStatus: ExpenseStatus; newStatus: ExpenseStatus };
}

type EventHandler<T extends EventType> = (data: any) => Promise<void>;

class EventService {
  private static instance: EventService;
  private handlers: Map<EventType, Set<EventHandler<EventType>>>;

  private constructor() {
    this.handlers = new Map();
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  public on<T extends EventType>(event: T, handler: EventHandler<T>): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)?.add(handler as EventHandler<EventType>);
  }

  public off<T extends EventType>(event: T, handler: EventHandler<T>): void {
    this.handlers.get(event)?.delete(handler as EventHandler<EventType>);
  }

  public async emit<T extends EventType>(event: T, data: any): Promise<void> {
    const handlers = this.handlers.get(event);
    if (handlers) {
      await Promise.all(Array.from(handlers).map(handler => handler(data)));
    }
  }

  public clear(): void {
    this.handlers.clear();
  }
}

export const eventService = EventService.getInstance(); 
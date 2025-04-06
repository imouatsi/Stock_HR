import { api } from '../../../services/api';
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
  ON_LEAVE = 'on_leave',
  SUSPENDED = 'suspended',
  RETIRED = 'retired',
  FIRED = 'fired',
  DECEASED = 'deceased',
  RESIGNED = 'resigned'
}

// Stock-specific statuses
export enum StockItemStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  DAMAGED = 'damaged',
  LOST = 'lost',
  STOLEN = 'stolen',
  EXPIRED = 'expired',
  RECALLED = 'recalled'
}

// Invoice-specific statuses
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  VOID = 'void',
  REFUNDED = 'refunded'
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
  _id: string;
  category: StatusChangeReasonCategory;
  code: string;
  description: string;
  requiresComment: boolean;
  requiresApproval: boolean;
  active: boolean;
}

// Status change record interface
export interface StatusChangeRecord {
  _id: string;
  entityType: string;
  entityId: string;
  previousStatus: string;
  newStatus: string;
  reasonId: string;
  comment?: string;
  changedBy: string;
  changedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

class StatusManagementService {
  private static instance: StatusManagementService;

  private constructor() {
    // Initialize event listeners
    this.initializeEventListeners();
  }

  public static getInstance(): StatusManagementService {
    if (!StatusManagementService.instance) {
      StatusManagementService.instance = new StatusManagementService();
    }
    return StatusManagementService.instance;
  }

  private initializeEventListeners(): void {
    // Listen for events that might require status changes
    eventService.on(EventType.EMPLOYEE_DELETED, this.handleEmployeeStatusChange);
    eventService.on(EventType.STOCK_ITEM_OUT, this.handleStockItemStatusChange);
    eventService.on(EventType.INVOICE_CREATED, this.handleInvoiceStatusChange);
  }

  // Status Change Reasons Management
  async getStatusChangeReasons(category?: StatusChangeReasonCategory): Promise<StatusChangeReason[]> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/status-change-reasons', { params });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch status change reasons:', error);
      throw error;
    }
  }

  async createStatusChangeReason(data: Partial<StatusChangeReason>): Promise<StatusChangeReason> {
    try {
      const response = await api.post('/status-change-reasons', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create status change reason:', error);
      throw error;
    }
  }

  // Status Change Records Management
  async getStatusChangeRecords(filters?: {
    entityType?: string;
    entityId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<StatusChangeRecord[]> {
    try {
      const response = await api.get('/status-change-records', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch status change records:', error);
      throw error;
    }
  }

  async createStatusChangeRecord(data: Partial<StatusChangeRecord>): Promise<StatusChangeRecord> {
    try {
      const response = await api.post('/status-change-records', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create status change record:', error);
      throw error;
    }
  }

  // Generic status change method
  async changeStatus(
    entityType: string,
    entityId: string,
    newStatus: string,
    reasonId: string,
    comment?: string,
    userId: string
  ): Promise<StatusChangeRecord> {
    try {
      // Get current status
      const currentStatus = await this.getCurrentStatus(entityType, entityId);
      
      // Create status change record
      const record = await this.createStatusChangeRecord({
        entityType,
        entityId,
        previousStatus: currentStatus,
        newStatus,
        reasonId,
        comment,
        changedBy: userId,
        changedAt: new Date()
      });
      
      // Emit appropriate event based on entity type
      this.emitStatusChangeEvent(entityType, entityId, currentStatus, newStatus, record);
      
      return record;
    } catch (error) {
      console.error('Failed to change status:', error);
      throw error;
    }
  }

  // Helper method to get current status
  private async getCurrentStatus(entityType: string, entityId: string): Promise<string> {
    try {
      const response = await api.get(`/${entityType}/${entityId}`);
      return response.data.data.status;
    } catch (error) {
      console.error('Failed to get current status:', error);
      throw error;
    }
  }

  // Helper method to emit appropriate event
  private emitStatusChangeEvent(
    entityType: string,
    entityId: string,
    previousStatus: string,
    newStatus: string,
    record: StatusChangeRecord
  ): void {
    switch (entityType) {
      case 'employees':
        eventService.emit(EventType.EMPLOYEE_UPDATED, {
          employeeId: entityId,
          previousStatus,
          newStatus
        });
        break;
      case 'stock':
        eventService.emit(EventType.STOCK_MOVEMENT_UPDATED, {
          movementId: entityId,
          previousStatus,
          newStatus
        });
        break;
      case 'invoices':
        eventService.emit(EventType.INVOICE_PAID, {
          invoiceId: entityId,
          previousStatus,
          newStatus
        });
        break;
      case 'assets':
        eventService.emit(EventType.ASSET_RETURNED, {
          assetId: entityId,
          previousStatus,
          newStatus
        });
        break;
      default:
        // Generic event for other entity types
        console.log(`Status changed for ${entityType} ${entityId}: ${previousStatus} -> ${newStatus}`);
    }
  }

  // Event Handlers
  private handleEmployeeStatusChange = async (data: { employeeId: string }): Promise<void> => {
    try {
      // Instead of deleting, change status to SUSPENDED
      await this.changeStatus(
        'employees',
        data.employeeId,
        EmployeeStatus.SUSPENDED,
        'EMPLOYEE_SUSPENSION', // This should be a valid reason code
        'Employee account suspended',
        'system'
      );
    } catch (error) {
      console.error('Failed to handle employee status change:', error);
    }
  };

  private handleStockItemStatusChange = async (data: { itemId: string; quantity: number }): Promise<void> => {
    try {
      // Check if item is out of stock
      if (data.quantity <= 0) {
        await this.changeStatus(
          'stock',
          data.itemId,
          StockItemStatus.DISCONTINUED,
          'STOCK_DEPLETED', // This should be a valid reason code
          'Item out of stock',
          'system'
        );
      }
    } catch (error) {
      console.error('Failed to handle stock item status change:', error);
    }
  };

  private handleInvoiceStatusChange = async (data: { invoiceId: string }): Promise<void> => {
    try {
      // Set initial status to PENDING
      await this.changeStatus(
        'invoices',
        data.invoiceId,
        InvoiceStatus.PENDING,
        'INVOICE_CREATED', // This should be a valid reason code
        'Invoice created',
        'system'
      );
    } catch (error) {
      console.error('Failed to handle invoice status change:', error);
    }
  };
}

export const statusManagementService = StatusManagementService.getInstance(); 
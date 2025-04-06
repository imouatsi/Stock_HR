import { EventEmitter } from 'events';

// Define event types for cross-module communication
export enum EventType {
  // Stock events
  STOCK_MOVEMENT_CREATED = 'stock:movement:created',
  STOCK_MOVEMENT_UPDATED = 'stock:movement:updated',
  STOCK_ITEM_LOW = 'stock:item:low',
  STOCK_ITEM_OUT = 'stock:item:out',
  
  // HR events
  EMPLOYEE_CREATED = 'hr:employee:created',
  EMPLOYEE_UPDATED = 'hr:employee:updated',
  EMPLOYEE_DELETED = 'hr:employee:deleted',
  LEAVE_REQUEST_CREATED = 'hr:leave:created',
  LEAVE_REQUEST_APPROVED = 'hr:leave:approved',
  
  // Accounting events
  INVOICE_CREATED = 'accounting:invoice:created',
  INVOICE_PAID = 'accounting:invoice:paid',
  PURCHASE_ORDER_CREATED = 'accounting:purchase:created',
  PURCHASE_ORDER_APPROVED = 'accounting:purchase:approved',
  
  // Cross-module events
  ASSET_ASSIGNED = 'asset:assigned',
  ASSET_RETURNED = 'asset:returned',
  EXPENSE_CREATED = 'expense:created',
  EXPENSE_APPROVED = 'expense:approved'
}

// Define event data interfaces
export interface EventData {
  [EventType.STOCK_MOVEMENT_CREATED]: {
    movementId: string;
    itemId: string;
    quantity: number;
    type: 'in' | 'out' | 'transfer';
    userId: string;
  };
  [EventType.STOCK_ITEM_LOW]: {
    itemId: string;
    currentQuantity: number;
    minQuantity: number;
  };
  [EventType.EMPLOYEE_CREATED]: {
    employeeId: string;
    departmentId: string;
    positionId: string;
  };
  [EventType.ASSET_ASSIGNED]: {
    assetId: string;
    employeeId: string;
    assignedBy: string;
    assignedDate: Date;
  };
  [EventType.EXPENSE_CREATED]: {
    expenseId: string;
    amount: number;
    category: string;
    createdBy: string;
    departmentId: string;
  };
}

class EventService {
  private static instance: EventService;
  private emitter: EventEmitter;

  private constructor() {
    this.emitter = new EventEmitter();
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  public emit<T extends EventType>(event: T, data: EventData[T]): void {
    this.emitter.emit(event, data);
  }

  public on<T extends EventType>(event: T, callback: (data: EventData[T]) => void): void {
    this.emitter.on(event, callback);
  }

  public off<T extends EventType>(event: T, callback: (data: EventData[T]) => void): void {
    this.emitter.off(event, callback);
  }

  public removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }
}

export const eventService = EventService.getInstance(); 
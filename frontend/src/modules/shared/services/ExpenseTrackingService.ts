import { api } from '../../../services/api';
import { eventService, EventType } from './EventService';

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdBy: string;
  departmentId: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: Date;
  receiptUrl?: string;
  relatedItems?: {
    type: 'stock' | 'asset' | 'service';
    id: string;
  }[];
  notes?: string;
}

export interface ExpenseCategory {
  _id: string;
  name: string;
  description?: string;
  budget?: number;
  departmentId?: string;
  type: 'operational' | 'capital' | 'personnel';
}

class ExpenseTrackingService {
  private static instance: ExpenseTrackingService;

  private constructor() {
    // Listen for relevant events
    eventService.on(EventType.STOCK_MOVEMENT_CREATED, this.handleStockMovement);
    eventService.on(EventType.ASSET_ASSIGNED, this.handleAssetAssignment);
  }

  public static getInstance(): ExpenseTrackingService {
    if (!ExpenseTrackingService.instance) {
      ExpenseTrackingService.instance = new ExpenseTrackingService();
    }
    return ExpenseTrackingService.instance;
  }

  // Expense Management
  async createExpense(data: Partial<Expense>): Promise<Expense> {
    try {
      const response = await api.post('/expenses', data);
      const result = response.data.data;
      
      // Emit event for cross-module communication
      eventService.emit(EventType.EXPENSE_CREATED, {
        expenseId: result._id,
        amount: result.amount,
        category: result.category,
        createdBy: result.createdBy,
        departmentId: result.departmentId
      });
      
      return result;
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  }

  async updateExpense(id: string, data: Partial<Expense>): Promise<Expense> {
    try {
      const response = await api.patch(`/expenses/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  }

  async approveExpense(id: string, approvedBy: string): Promise<Expense> {
    try {
      const response = await api.post(`/expenses/${id}/approve`, { approvedBy });
      const result = response.data.data;
      
      // Emit event for cross-module communication
      eventService.emit(EventType.EXPENSE_APPROVED, {
        expenseId: result._id,
        amount: result.amount,
        category: result.category,
        createdBy: result.createdBy,
        departmentId: result.departmentId
      });
      
      return result;
    } catch (error) {
      console.error('Failed to approve expense:', error);
      throw error;
    }
  }

  async getExpenses(filters?: {
    departmentId?: string;
    category?: string;
    status?: 'pending' | 'approved' | 'rejected';
    startDate?: Date;
    endDate?: Date;
  }): Promise<Expense[]> {
    try {
      const response = await api.get('/expenses', { params: filters });
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      throw error;
    }
  }

  // Category Management
  async getCategories(): Promise<ExpenseCategory[]> {
    try {
      const response = await api.get('/expense-categories');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch expense categories:', error);
      throw error;
    }
  }

  async createCategory(data: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    try {
      const response = await api.post('/expense-categories', data);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create expense category:', error);
      throw error;
    }
  }

  // Event Handlers
  private async handleStockMovement(data: {
    movementId: string;
    itemId: string;
    quantity: number;
    type: 'in' | 'out' | 'transfer';
    userId: string;
  }): Promise<void> {
    try {
      if (data.type === 'out') {
        // Create expense for stock out
        await this.createExpense({
          amount: data.quantity, // This should be calculated based on item price
          category: 'stock',
          description: `Stock movement: ${data.type}`,
          date: new Date(),
          createdBy: data.userId,
          relatedItems: [{
            type: 'stock',
            id: data.itemId
          }]
        });
      }
    } catch (error) {
      console.error('Failed to handle stock movement:', error);
    }
  }

  private async handleAssetAssignment(data: {
    assetId: string;
    employeeId: string;
    assignedBy: string;
    assignedDate: Date;
  }): Promise<void> {
    try {
      // Create expense for asset assignment
      await this.createExpense({
        amount: 0, // This should be calculated based on asset value
        category: 'asset',
        description: 'Asset assignment',
        date: data.assignedDate,
        createdBy: data.assignedBy,
        relatedItems: [{
          type: 'asset',
          id: data.assetId
        }]
      });
    } catch (error) {
      console.error('Failed to handle asset assignment:', error);
    }
  }
}

export const expenseTrackingService = ExpenseTrackingService.getInstance(); 
import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface Expense {
  id: string;
  number: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  status: ExpenseStatus;
  employeeId: string;
  departmentId: string;
  projectId?: string;
  attachments: ExpenseAttachment[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

interface ExpenseAttachment {
  id: string;
  expenseId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

interface ExpenseStats {
  totalExpenses: number;
  totalAmount: number;
  byCategory: Record<string, number>;
  byStatus: Record<ExpenseStatus, number>;
  byMonth: Record<string, number>;
  byDepartment: Record<string, number>;
  pendingApproval: number;
  pendingAmount: number;
}

enum ExpenseStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

class ExpenseService {
  private static instance: ExpenseService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }
    return ExpenseService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.EXPENSE_CREATED, this.handleExpenseCreated.bind(this));
    eventService.on(EventType.EXPENSE_UPDATED, this.handleExpenseUpdated.bind(this));
    eventService.on(EventType.EXPENSE_DELETED, this.handleExpenseDeleted.bind(this));
    eventService.on(EventType.EXPENSE_STATUS_CHANGED, this.handleExpenseStatusChanged.bind(this));
    eventService.on(EventType.EXPENSE_APPROVED, this.handleExpenseApproved.bind(this));
  }

  private async handleExpenseCreated(data: { expenseId: string; number: string }): Promise<void> {
    try {
      console.log(`Expense created: ${data.number}`);
    } catch (error) {
      console.error('Error handling expense creation:', error);
    }
  }

  private async handleExpenseUpdated(data: { expenseId: string; changes: Partial<{ number: string; status: ExpenseStatus }> }): Promise<void> {
    try {
      console.log(`Expense updated: ${data.expenseId}`, data.changes);
    } catch (error) {
      console.error('Error handling expense update:', error);
    }
  }

  private async handleExpenseDeleted(data: { expenseId: string }): Promise<void> {
    try {
      console.log(`Expense deleted: ${data.expenseId}`);
    } catch (error) {
      console.error('Error handling expense deletion:', error);
    }
  }

  private async handleExpenseStatusChanged(data: { expenseId: string; oldStatus: ExpenseStatus; newStatus: ExpenseStatus }): Promise<void> {
    try {
      console.log(`Expense ${data.expenseId} status changed from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling expense status change:', error);
    }
  }

  private async handleExpenseApproved(data: { expenseId: string; approvedBy: string }): Promise<void> {
    try {
      console.log(`Expense ${data.expenseId} approved by ${data.approvedBy}`);
    } catch (error) {
      console.error('Error handling expense approval:', error);
    }
  }

  public async getExpenses(): Promise<Expense[]> {
    const response = await api.get('/expenses');
    return response.data;
  }

  public async getExpense(id: string): Promise<Expense> {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  }

  public async createExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    const response = await api.post('/expenses', expense);
    return response.data;
  }

  public async updateExpense(id: string, changes: Partial<Expense>): Promise<Expense> {
    const response = await api.patch(`/expenses/${id}`, changes);
    return response.data;
  }

  public async deleteExpense(id: string): Promise<void> {
    await api.delete(`/expenses/${id}`);
  }

  public async getExpenseStats(): Promise<ExpenseStats> {
    const response = await api.get('/expenses/stats');
    return response.data;
  }

  public async getExpensesByEmployee(employeeId: string): Promise<Expense[]> {
    const response = await api.get(`/expenses/employee/${employeeId}`);
    return response.data;
  }

  public async getExpensesByDepartment(departmentId: string): Promise<Expense[]> {
    const response = await api.get(`/expenses/department/${departmentId}`);
    return response.data;
  }

  public async getExpensesByProject(projectId: string): Promise<Expense[]> {
    const response = await api.get(`/expenses/project/${projectId}`);
    return response.data;
  }

  public async getExpensesByStatus(status: ExpenseStatus): Promise<Expense[]> {
    const response = await api.get(`/expenses/status/${status}`);
    return response.data;
  }

  public async getExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    const response = await api.get('/expenses/date-range', { params: { startDate, endDate } });
    return response.data;
  }

  public async submitExpense(id: string): Promise<void> {
    await api.post(`/expenses/${id}/submit`);
  }

  public async approveExpense(id: string): Promise<void> {
    await api.post(`/expenses/${id}/approve`);
  }

  public async rejectExpense(id: string, reason: string): Promise<void> {
    await api.post(`/expenses/${id}/reject`, { reason });
  }

  public async markExpenseAsPaid(id: string): Promise<void> {
    await api.post(`/expenses/${id}/paid`);
  }

  public async cancelExpense(id: string): Promise<void> {
    await api.post(`/expenses/${id}/cancel`);
  }

  public async uploadExpenseAttachment(id: string, file: File): Promise<ExpenseAttachment> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/expenses/${id}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  public async deleteExpenseAttachment(id: string, attachmentId: string): Promise<void> {
    await api.delete(`/expenses/${id}/attachments/${attachmentId}`);
  }
}

export const expenseService = ExpenseService.getInstance(); 
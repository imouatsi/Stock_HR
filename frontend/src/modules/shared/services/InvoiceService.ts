import { api } from '../../services/api';
import { eventService, EventType } from './EventService';

interface Invoice {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  tax: number;
}

interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  byStatus: Record<InvoiceStatus, number>;
  byMonth: Record<string, number>;
  averageInvoiceAmount: number;
  overdueInvoices: number;
  overdueAmount: number;
}

enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  VOID = 'VOID'
}

class InvoiceService {
  private static instance: InvoiceService;

  private constructor() {
    this.setupEventListeners();
  }

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  private setupEventListeners(): void {
    eventService.on(EventType.INVOICE_CREATED, this.handleInvoiceCreated.bind(this));
    eventService.on(EventType.INVOICE_UPDATED, this.handleInvoiceUpdated.bind(this));
    eventService.on(EventType.INVOICE_DELETED, this.handleInvoiceDeleted.bind(this));
    eventService.on(EventType.INVOICE_STATUS_CHANGED, this.handleInvoiceStatusChanged.bind(this));
  }

  private async handleInvoiceCreated(data: { invoiceId: string; number: string }): Promise<void> {
    try {
      console.log(`Invoice created: ${data.number}`);
    } catch (error) {
      console.error('Error handling invoice creation:', error);
    }
  }

  private async handleInvoiceUpdated(data: { invoiceId: string; changes: Partial<{ number: string; status: InvoiceStatus }> }): Promise<void> {
    try {
      console.log(`Invoice updated: ${data.invoiceId}`, data.changes);
    } catch (error) {
      console.error('Error handling invoice update:', error);
    }
  }

  private async handleInvoiceDeleted(data: { invoiceId: string }): Promise<void> {
    try {
      console.log(`Invoice deleted: ${data.invoiceId}`);
    } catch (error) {
      console.error('Error handling invoice deletion:', error);
    }
  }

  private async handleInvoiceStatusChanged(data: { invoiceId: string; oldStatus: InvoiceStatus; newStatus: InvoiceStatus }): Promise<void> {
    try {
      console.log(`Invoice ${data.invoiceId} status changed from ${data.oldStatus} to ${data.newStatus}`);
    } catch (error) {
      console.error('Error handling invoice status change:', error);
    }
  }

  public async getInvoices(): Promise<Invoice[]> {
    const response = await api.get('/invoices');
    return response.data;
  }

  public async getInvoice(id: string): Promise<Invoice> {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  }

  public async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    const response = await api.post('/invoices', invoice);
    return response.data;
  }

  public async updateInvoice(id: string, changes: Partial<Invoice>): Promise<Invoice> {
    const response = await api.patch(`/invoices/${id}`, changes);
    return response.data;
  }

  public async deleteInvoice(id: string): Promise<void> {
    await api.delete(`/invoices/${id}`);
  }

  public async getInvoiceStats(): Promise<InvoiceStats> {
    const response = await api.get('/invoices/stats');
    return response.data;
  }

  public async getOverdueInvoices(): Promise<Invoice[]> {
    const response = await api.get('/invoices/overdue');
    return response.data;
  }

  public async getInvoicesByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    const response = await api.get(`/invoices/status/${status}`);
    return response.data;
  }

  public async getInvoicesByCustomer(customerId: string): Promise<Invoice[]> {
    const response = await api.get(`/invoices/customer/${customerId}`);
    return response.data;
  }

  public async getInvoicesByDateRange(startDate: string, endDate: string): Promise<Invoice[]> {
    const response = await api.get('/invoices/date-range', { params: { startDate, endDate } });
    return response.data;
  }

  public async sendInvoice(id: string): Promise<void> {
    await api.post(`/invoices/${id}/send`);
  }

  public async markInvoiceAsPaid(id: string): Promise<void> {
    await api.post(`/invoices/${id}/paid`);
  }

  public async voidInvoice(id: string): Promise<void> {
    await api.post(`/invoices/${id}/void`);
  }

  public async cancelInvoice(id: string): Promise<void> {
    await api.post(`/invoices/${id}/cancel`);
  }

  public async addInvoiceItem(invoiceId: string, item: Omit<InvoiceItem, 'id' | 'invoiceId'>): Promise<InvoiceItem> {
    const response = await api.post(`/invoices/${invoiceId}/items`, item);
    return response.data;
  }

  public async updateInvoiceItem(invoiceId: string, itemId: string, changes: Partial<InvoiceItem>): Promise<InvoiceItem> {
    const response = await api.patch(`/invoices/${invoiceId}/items/${itemId}`, changes);
    return response.data;
  }

  public async deleteInvoiceItem(invoiceId: string, itemId: string): Promise<void> {
    await api.delete(`/invoices/${invoiceId}/items/${itemId}`);
  }
}

export const invoiceService = InvoiceService.getInstance(); 
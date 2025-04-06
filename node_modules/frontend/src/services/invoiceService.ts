import { api } from './api';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  createdAt: string;
  dueDate: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxNumber?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'overdue' | 'cancelled';
}

export type InvoiceCreate = Omit<Invoice, '_id' | 'createdAt' | 'subtotal' | 'tax' | 'total'>;
export type InvoiceUpdate = Partial<InvoiceCreate>;

interface ApiResponse<T> {
  status: string;
  data: {
    invoices?: T[];
    invoice?: T;
  };
}

class InvoiceService {
  private static instance: InvoiceService;
  private baseUrl = '/api/invoices';

  private constructor() {}

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  public async getAll(): Promise<Invoice[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch invoices');
    }
    return response.json();
  }

  public async getById(id: string): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch invoice');
    }
    return response.json();
  }

  public async create(invoice: InvoiceCreate): Promise<Invoice> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoice),
    });
    if (!response.ok) {
      throw new Error('Failed to create invoice');
    }
    return response.json();
  }

  public async update(id: string, data: InvoiceUpdate): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update invoice');
    }
    return response.json();
  }

  public async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete invoice');
    }
  }

  public async updateStatus(id: string, status: Invoice['status']): Promise<Invoice> {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update invoice status');
    }
    return response.json();
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data.message || 'An error occurred';
      return new Error(message);
    }
    return new Error('Network error occurred');
  }
}

export default InvoiceService.getInstance(); 
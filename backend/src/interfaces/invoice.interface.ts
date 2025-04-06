import { Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IInvoice extends Document {
  number: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  company: string;
  items: IInvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
} 
import mongoose from 'mongoose';
import { IInvoice, IInvoiceItem } from '../interfaces/invoice.interface';

const invoiceItemSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Item description is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Item quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: [true, 'Unit price is required'],
    min: [0, 'Unit price cannot be negative']
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total cannot be negative']
  }
});

const invoiceSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'Invoice number is required'],
    unique: true,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Invoice date is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  amount: {
    type: Number,
    required: [true, 'Invoice amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  company: {
    type: String,
    required: [true, 'Company name is required']
  },
  items: [invoiceItemSchema]
}, {
  timestamps: true
});

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema); 
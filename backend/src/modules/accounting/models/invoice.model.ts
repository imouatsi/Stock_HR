import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  customer: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    address: string;
  };
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'void' | 'refunded';
  dueDate: Date;
  issuedDate: Date;
  paidDate?: Date;
  paymentMethod?: string;
  notes?: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  items: [{
    description: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be greater than 0']
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative']
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative']
    }
  }],
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  tax: {
    type: Number,
    required: true,
    min: [0, 'Tax cannot be negative']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'paid', 'partially_paid', 'overdue', 'cancelled', 'void', 'refunded'],
    default: 'draft'
  },
  dueDate: {
    type: Date,
    required: true
  },
  issuedDate: {
    type: Date,
    default: Date.now
  },
  paidDate: Date,
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit_card', 'bank_transfer', 'check']
  },
  notes: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    required: function() {
      return ['cancelled', 'void', 'refunded'].includes(this.status);
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ 'customer._id': 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ issuedDate: 1 });

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.total = this.subtotal + this.tax;
  }
  next();
});

// Prevent deletion of paid invoices
invoiceSchema.pre('remove', function(next) {
  if (['paid', 'partially_paid'].includes(this.status)) {
    throw new Error('Cannot delete paid or partially paid invoices');
  }
  next();
});

export const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema); 
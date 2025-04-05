import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  type: 'proforma' | 'final';
  company: {
    name: string;
    address: string;
    nif: string;
  };
  client: {
    name: string;
    address: string;
    nif?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    barcode?: string;
  }>;
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  paymentTerms: string;
  status: 'draft' | 'validated' | 'cancelled';
  dueDate: Date;
  signature?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['proforma', 'final'],
      required: true,
    },
    company: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      nif: {
        type: String,
        required: true,
      },
    },
    client: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      nif: {
        type: String,
      },
    },
    items: [{
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      barcode: {
        type: String,
      },
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    vatRate: {
      type: Number,
      required: true,
      min: 0,
    },
    vatAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentTerms: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'validated', 'cancelled'],
      default: 'draft',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    signature: {
      type: String,
    },
    qrCode: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
invoiceSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Calculate VAT amount
  this.vatAmount = this.subtotal * (this.vatRate / 100);

  // Calculate total with VAT
  this.total = this.subtotal + this.vatAmount;

  next();
});

const Invoice = mongoose.model<IInvoice>('Invoice', invoiceSchema);

export default Invoice; 
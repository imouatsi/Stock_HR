import mongoose, { Document, Schema } from 'mongoose';

export interface IProformaItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  barcode?: string;
}

export interface IProforma extends Document {
  invoiceNumber: string;
  date: Date;
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
  items: IProformaItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  totalAmount: number;
  paymentTerms: string;
  status: 'draft' | 'finalized';
  signature?: string;
  qrCode?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const proformaSchema = new Schema<IProforma>(
  {
    invoiceNumber: {
      type: String,
      required: [true, 'Invoice number is required'],
      unique: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    company: {
      name: {
        type: String,
        required: [true, 'Company name is required'],
      },
      address: {
        type: String,
        required: [true, 'Company address is required'],
      },
      nif: {
        type: String,
        required: [true, 'Company NIF is required'],
      },
    },
    client: {
      name: {
        type: String,
        required: [true, 'Client name is required'],
      },
      address: {
        type: String,
        required: [true, 'Client address is required'],
      },
      nif: {
        type: String,
      },
    },
    items: [{
      description: {
        type: String,
        required: [true, 'Item description is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      unitPrice: {
        type: Number,
        required: [true, 'Unit price is required'],
        min: [0, 'Unit price must be positive'],
      },
      total: {
        type: Number,
        required: [true, 'Total is required'],
      },
      barcode: {
        type: String,
      },
    }],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal must be positive'],
    },
    vatRate: {
      type: Number,
      required: [true, 'VAT rate is required'],
      min: [0, 'VAT rate must be positive'],
    },
    vatAmount: {
      type: Number,
      required: [true, 'VAT amount is required'],
      min: [0, 'VAT amount must be positive'],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    paymentTerms: {
      type: String,
      required: [true, 'Payment terms are required'],
    },
    status: {
      type: String,
      enum: ['draft', 'finalized'],
      default: 'draft',
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
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
proformaSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    item.total = item.quantity * item.unitPrice;
  });

  // Calculate subtotal
  this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);

  // Calculate VAT amount
  this.vatAmount = this.subtotal * (this.vatRate / 100);

  // Calculate total amount with VAT
  this.totalAmount = this.subtotal + this.vatAmount;

  next();
});

export default mongoose.model<IProforma>('Proforma', proformaSchema); 
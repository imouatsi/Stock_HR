import mongoose, { Document, Schema } from 'mongoose';

export interface IProformaItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IProforma extends Document {
  invoiceNumber: string;
  date: Date;
  seller: {
    name: string;
    address: string;
    nif: string;
    rc: string;
    ai: string;
    iban: string;
    bank: string;
  };
  buyer: {
    name: string;
    address: string;
    companyId?: string;
  };
  items: IProformaItem[];
  subtotal: number;
  vat: number;
  totalAmount: number;
  status: 'draft' | 'finalized';
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
    seller: {
      name: {
        type: String,
        required: [true, 'Seller name is required'],
      },
      address: {
        type: String,
        required: [true, 'Seller address is required'],
      },
      nif: {
        type: String,
        required: [true, 'NIF is required'],
      },
      rc: {
        type: String,
        required: [true, 'RC is required'],
      },
      ai: {
        type: String,
        required: [true, 'AI is required'],
      },
      iban: {
        type: String,
        required: [true, 'IBAN is required'],
      },
      bank: {
        type: String,
        required: [true, 'Bank name is required'],
      },
    },
    buyer: {
      name: {
        type: String,
        required: [true, 'Buyer name is required'],
      },
      address: {
        type: String,
        required: [true, 'Buyer address is required'],
      },
      companyId: {
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
    }],
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal must be positive'],
    },
    vat: {
      type: Number,
      required: [true, 'VAT is required'],
      min: [0, 'VAT must be positive'],
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: ['draft', 'finalized'],
      default: 'draft',
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

  // Calculate total amount with VAT
  this.totalAmount = this.subtotal + this.vat;

  next();
});

export default mongoose.model<IProforma>('Proforma', proformaSchema); 
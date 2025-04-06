import mongoose, { Schema, Document } from 'mongoose';
import { ISupplier } from './supplier.model';
import { IInventoryItem } from '../../../models/inventory.model';

export interface IPurchaseOrderItem {
  product: IInventoryItem['_id'];
  quantity: number;
  price: number;
  total: number;
}

export interface IPurchaseOrder extends Document {
  supplier: ISupplier['_id'];
  items: IPurchaseOrderItem[];
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  total: number;
  notes?: string;
  expectedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderItemSchema = new Schema<IPurchaseOrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: [true, 'Product is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be greater than 0'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be greater than or equal to 0'],
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: [0, 'Total must be greater than or equal to 0'],
  },
});

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    items: [purchaseOrderItemSchema],
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'received', 'cancelled'],
      default: 'draft',
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total must be greater than or equal to 0'],
    },
    notes: {
      type: String,
      trim: true,
    },
    expectedDeliveryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
purchaseOrderSchema.index({ supplier: 1, createdAt: -1 });
purchaseOrderSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to calculate totals
purchaseOrderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.total = this.items.reduce((sum, item) => sum + item.total, 0);
  }
  next();
});

export const PurchaseOrder = mongoose.model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema); 
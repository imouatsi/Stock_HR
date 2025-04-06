import mongoose, { Document, Schema } from 'mongoose';

export interface IStock extends Document {
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  category: string;
  supplier?: string;
  reorderPoint?: number;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stockSchema = new Schema<IStock>(
  {
    name: {
      type: String,
      required: [true, 'Stock name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    supplier: {
      type: String,
      trim: true
    },
    reorderPoint: {
      type: Number,
      min: [0, 'Reorder point cannot be negative']
    },
    location: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for better query performance
stockSchema.index({ name: 1, category: 1 });

// Virtual for total value
stockSchema.virtual('totalValue').get(function() {
  return this.quantity * this.unitPrice;
});

export const Stock = mongoose.model<IStock>('Stock', stockSchema); 
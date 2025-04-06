import mongoose, { Schema, Document } from 'mongoose';

export interface IStockCategory extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stockCategorySchema = new Schema<IStockCategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
stockCategorySchema.index({ name: 1 });

export const StockCategory = mongoose.model<IStockCategory>('StockCategory', stockCategorySchema); 
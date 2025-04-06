import mongoose, { Schema, Document, Types } from 'mongoose';
import { IStockCategory } from './stockCategory.model';
import { ISupplier } from './supplier.model';

export interface IInventoryItem extends Document {
  name: string;
  sku: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category: Types.ObjectId | IStockCategory;
  supplier: Types.ObjectId | ISupplier;
  minStockLevel: number;
  valuationMethod: 'FIFO' | 'LIFO' | 'AVERAGE';
  status: 'active' | 'discontinued' | 'damaged' | 'lost' | 'stolen' | 'expired' | 'recalled';
  location?: Types.ObjectId;
  lastRestocked?: Date;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
  stockValue: number;
  stockStatus: 'low' | 'normal' | 'excess';
}

const inventorySchema = new Schema<IInventoryItem>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, 'SKU can only contain uppercase letters, numbers, and hyphens'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole number',
      },
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative'],
      validate: {
        validator: (value: number) => value.toFixed(2) === value.toString(),
        message: 'Unit price must have at most 2 decimal places',
      },
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'StockCategory',
      required: [true, 'Category is required'],
    },
    supplier: {
      type: Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Supplier is required'],
    },
    minStockLevel: {
      type: Number,
      required: [true, 'Minimum stock level is required'],
      min: [0, 'Minimum stock level cannot be negative'],
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: 'Minimum stock level must be a whole number',
      },
    },
    valuationMethod: {
      type: String,
      enum: {
        values: ['FIFO', 'LIFO', 'AVERAGE'],
        message: '{VALUE} is not a valid valuation method',
      },
      default: 'FIFO',
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'discontinued', 'damaged', 'lost', 'stolen', 'expired', 'recalled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'active',
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
    },
    lastRestocked: {
      type: Date,
      validate: {
        validator: (value: Date) => value <= new Date(),
        message: 'Last restocked date cannot be in the future',
      },
    },
    reason: {
      type: String,
      required: function() {
        return ['discontinued', 'damaged', 'lost', 'stolen', 'expired', 'recalled'].includes(this.status);
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
inventorySchema.index({ sku: 1 }, { unique: true });
inventorySchema.index({ name: 1 });
inventorySchema.index({ category: 1 });
inventorySchema.index({ supplier: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ location: 1 });

// Virtual for stock value
inventorySchema.virtual('stockValue').get(function() {
  return this.quantity * this.unitPrice;
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.quantity <= this.minStockLevel) {
    return 'low';
  } else if (this.quantity > this.minStockLevel * 2) {
    return 'excess';
  }
  return 'normal';
});

// Pre-save middleware
inventorySchema.pre('save', function(next) {
  // Ensure SKU is uppercase
  if (this.isModified('sku')) {
    this.sku = this.sku.toUpperCase();
  }
  
  // Update lastRestocked if quantity increases
  if (this.isModified('quantity') && this.quantity > this.get('quantity')) {
    this.lastRestocked = new Date();
  }
  
  if (this.quantity <= this.minStockLevel) {
    // Emit event for low stock notification
    this.constructor.emit('lowStock', {
      itemId: this._id,
      currentQuantity: this.quantity,
      minStockLevel: this.minStockLevel
    });
  }
  
  next();
});

// Pre-remove middleware
inventorySchema.pre('remove', async function(next) {
  // Check if item is being used in any purchase orders
  const PurchaseOrder = mongoose.model('PurchaseOrder');
  const hasPurchaseOrders = await PurchaseOrder.exists({ 'items.product': this._id });
  
  if (hasPurchaseOrders) {
    next(new Error('Cannot delete item that is referenced in purchase orders'));
  }
  
  if (this.quantity > 0) {
    throw new Error('Cannot delete inventory item with remaining quantity');
  }
  
  next();
});

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventorySchema); 
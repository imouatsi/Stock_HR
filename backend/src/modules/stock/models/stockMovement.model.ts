import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../../auth/models/user.model';

export interface IStockMovement extends Document {
  inventoryItem: mongoose.Types.ObjectId;
  quantity: number;
  type: 'in' | 'out' | 'transfer';
  source?: mongoose.Types.ObjectId;
  destination?: mongoose.Types.ObjectId;
  timestamp: Date;
  user: mongoose.Types.ObjectId;
  notes?: string;
  reference: string;
  status: 'pending' | 'completed' | 'cancelled' | 'reversed';
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const stockMovementSchema = new Schema({
  inventoryItem: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be greater than 0'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  type: {
    type: String,
    enum: ['in', 'out', 'transfer'],
    required: true
  },
  source: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: function() {
      return this.type === 'transfer';
    }
  },
  destination: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: function() {
      return this.type === 'transfer';
    }
  },
  timestamp: {
    type: Date,
    default: Date.now,
    validate: {
      validator: function(value: Date) {
        return value <= new Date();
      },
      message: 'Timestamp cannot be in the future'
    }
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  reference: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'reversed'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: function() {
      return ['cancelled', 'reversed'].includes(this.status);
    }
  }
}, {
  timestamps: true
});

// Generate unique reference number
stockMovementSchema.pre('save', async function(next) {
  if (!this.reference) {
    const date = new Date();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    const count = await mongoose.model('StockMovement').countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), 1),
        $lt: new Date(date.getFullYear(), date.getMonth() + 1, 1)
      }
    });
    this.reference = `SM${year}${month}${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Check stock availability for outgoing movements
stockMovementSchema.pre('save', async function(next) {
  if (this.type === 'out' && this.status === 'completed') {
    const inventoryItem = await mongoose.model('InventoryItem').findById(this.inventoryItem);
    if (!inventoryItem || inventoryItem.quantity < this.quantity) {
      throw new Error('Insufficient stock available');
    }
  }
  next();
});

// Update inventory item quantity
stockMovementSchema.post('save', async function() {
  if (this.status === 'completed') {
    const inventoryItem = await mongoose.model('InventoryItem').findById(this.inventoryItem);
    if (inventoryItem) {
      const quantityChange = this.type === 'in' ? this.quantity : -this.quantity;
      inventoryItem.quantity += quantityChange;
      await inventoryItem.save();
    }
  }
});

// Prevent deletion of completed movements
stockMovementSchema.pre('remove', function(next) {
  if (this.status === 'completed') {
    throw new Error('Cannot delete completed stock movements');
  }
  next();
});

// Create indexes for efficient querying
stockMovementSchema.index({ inventoryItem: 1 });
stockMovementSchema.index({ user: 1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ status: 1 });
stockMovementSchema.index({ reference: 1 });
stockMovementSchema.index({ timestamp: 1 });

export const StockMovement = mongoose.model<IStockMovement>('StockMovement', stockMovementSchema); 
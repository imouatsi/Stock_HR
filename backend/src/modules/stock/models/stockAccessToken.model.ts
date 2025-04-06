import mongoose, { Schema, Document } from 'mongoose';

export interface IStockAccessToken extends Document {
  inventoryItem: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  operation: 'sale' | 'transfer' | 'adjustment';
  quantity: number;
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  details?: {
    destination?: mongoose.Types.ObjectId;
    reason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const stockAccessTokenSchema = new Schema({
  inventoryItem: {
    type: Schema.Types.ObjectId,
    ref: 'InventoryItem',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  operation: {
    type: String,
    enum: ['sale', 'transfer', 'adjustment'],
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
  details: {
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Location'
    },
    reason: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
stockAccessTokenSchema.index({ inventoryItem: 1, status: 1 });
stockAccessTokenSchema.index({ user: 1 });
stockAccessTokenSchema.index({ token: 1 }, { unique: true });
stockAccessTokenSchema.index({ expiresAt: 1 });

// Generate unique token
stockAccessTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = `${this.inventoryItem}-${this.user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Check for existing active tokens
stockAccessTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    const existingToken = await this.constructor.findOne({
      inventoryItem: this.inventoryItem,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingToken) {
      throw new Error('Another user is currently accessing this inventory item');
    }
  }
  next();
});

// Auto-expire tokens
stockAccessTokenSchema.methods.checkExpiration = async function() {
  if (this.status === 'active' && this.expiresAt < new Date()) {
    this.status = 'expired';
    await this.save();
  }
};

export const StockAccessToken = mongoose.model<IStockAccessToken>('StockAccessToken', stockAccessTokenSchema); 
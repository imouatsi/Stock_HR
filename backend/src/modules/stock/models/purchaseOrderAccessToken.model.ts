import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseOrderAccessToken extends Document {
  purchaseOrder: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  operation: 'receive' | 'cancel' | 'approve';
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderAccessTokenSchema = new Schema({
  purchaseOrder: {
    type: Schema.Types.ObjectId,
    ref: 'PurchaseOrder',
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
    enum: ['receive', 'cancel', 'approve'],
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'InventoryItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be greater than 0']
    }
  }],
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
purchaseOrderAccessTokenSchema.index({ purchaseOrder: 1, status: 1 });
purchaseOrderAccessTokenSchema.index({ user: 1 });
purchaseOrderAccessTokenSchema.index({ token: 1 }, { unique: true });
purchaseOrderAccessTokenSchema.index({ expiresAt: 1 });

// Generate unique token
purchaseOrderAccessTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = `${this.purchaseOrder}-${this.user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Check for existing active tokens
purchaseOrderAccessTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    const existingToken = await this.constructor.findOne({
      purchaseOrder: this.purchaseOrder,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingToken) {
      throw new Error('Another user is currently accessing this purchase order');
    }
  }
  next();
});

// Auto-expire tokens
purchaseOrderAccessTokenSchema.methods.checkExpiration = async function() {
  if (this.status === 'active' && this.expiresAt < new Date()) {
    this.status = 'expired';
    await this.save();
  }
};

export const PurchaseOrderAccessToken = mongoose.model<IPurchaseOrderAccessToken>('PurchaseOrderAccessToken', purchaseOrderAccessTokenSchema); 
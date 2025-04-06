import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceAccessToken extends Document {
  invoice: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  operation: 'payment' | 'cancellation' | 'approval';
  details: {
    amount?: number;
    paymentMethod?: string;
    reason?: string;
  };
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const invoiceAccessTokenSchema = new Schema({
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
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
    enum: ['payment', 'cancellation', 'approval'],
    required: true
  },
  details: {
    amount: Number,
    paymentMethod: String,
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
invoiceAccessTokenSchema.index({ invoice: 1, status: 1 });
invoiceAccessTokenSchema.index({ user: 1 });
invoiceAccessTokenSchema.index({ token: 1 }, { unique: true });
invoiceAccessTokenSchema.index({ expiresAt: 1 });

// Generate unique token
invoiceAccessTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = `${this.invoice}-${this.user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Check for existing active tokens
invoiceAccessTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    const existingToken = await this.constructor.findOne({
      invoice: this.invoice,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingToken) {
      throw new Error('Another user is currently accessing this invoice');
    }
  }
  next();
});

// Auto-expire tokens
invoiceAccessTokenSchema.methods.checkExpiration = async function() {
  if (this.status === 'active' && this.expiresAt < new Date()) {
    this.status = 'expired';
    await this.save();
  }
};

export const InvoiceAccessToken = mongoose.model<IInvoiceAccessToken>('InvoiceAccessToken', invoiceAccessTokenSchema); 
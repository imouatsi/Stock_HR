import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdBy: mongoose.Types.ObjectId;
  departmentId: mongoose.Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'void';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectedBy?: mongoose.Types.ObjectId;
  rejectedAt?: Date;
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  voidedBy?: mongoose.Types.ObjectId;
  voidedAt?: Date;
  reason?: string;
  attachments?: {
    type: string;
    url: string;
  }[];
  isDeleted: boolean;
  deletedBy?: mongoose.Types.ObjectId;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema({
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled', 'void'],
    default: 'pending'
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  rejectedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectedAt: Date,
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  voidedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  voidedAt: Date,
  reason: {
    type: String,
    required: function() {
      return ['rejected', 'cancelled', 'void'].includes(this.status);
    }
  },
  attachments: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Create indexes for efficient querying
expenseSchema.index({ createdBy: 1 });
expenseSchema.index({ departmentId: 1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ date: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ isDeleted: 1 });

// Prevent deletion of approved expenses
expenseSchema.pre('remove', function(next) {
  if (this.status === 'approved') {
    throw new Error('Cannot delete approved expenses');
  }
  next();
});

// Soft delete middleware
expenseSchema.pre('find', function() {
  this.where({ isDeleted: false });
});

expenseSchema.pre('findOne', function() {
  this.where({ isDeleted: false });
});

// Method to soft delete an expense
expenseSchema.methods.softDelete = async function(userId: mongoose.Types.ObjectId) {
  this.isDeleted = true;
  this.deletedBy = userId;
  this.deletedAt = new Date();
  return this.save();
};

// Method to restore a soft deleted expense
expenseSchema.methods.restore = async function() {
  this.isDeleted = false;
  this.deletedBy = undefined;
  this.deletedAt = undefined;
  return this.save();
};

export const Expense = mongoose.model<IExpense>('Expense', expenseSchema); 
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeAccessToken extends Document {
  employee: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  operation: 'status_change' | 'asset_assignment' | 'leave_approval';
  details: {
    newStatus?: string;
    reason?: string;
    assetId?: mongoose.Types.ObjectId;
    leaveRequestId?: mongoose.Types.ObjectId;
  };
  status: 'active' | 'completed' | 'expired' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const employeeAccessTokenSchema = new Schema({
  employee: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
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
    enum: ['status_change', 'asset_assignment', 'leave_approval'],
    required: true
  },
  details: {
    newStatus: String,
    reason: String,
    assetId: {
      type: Schema.Types.ObjectId,
      ref: 'Asset'
    },
    leaveRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'LeaveRequest'
    }
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
employeeAccessTokenSchema.index({ employee: 1, status: 1 });
employeeAccessTokenSchema.index({ user: 1 });
employeeAccessTokenSchema.index({ token: 1 }, { unique: true });
employeeAccessTokenSchema.index({ expiresAt: 1 });

// Generate unique token
employeeAccessTokenSchema.pre('save', function(next) {
  if (!this.token) {
    this.token = `${this.employee}-${this.user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Check for existing active tokens
employeeAccessTokenSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'active') {
    const existingToken = await this.constructor.findOne({
      employee: this.employee,
      status: 'active',
      _id: { $ne: this._id }
    });

    if (existingToken) {
      throw new Error('Another user is currently accessing this employee');
    }
  }
  next();
});

// Auto-expire tokens
employeeAccessTokenSchema.methods.checkExpiration = async function() {
  if (this.status === 'active' && this.expiresAt < new Date()) {
    this.status = 'expired';
    await this.save();
  }
};

export const EmployeeAccessToken = mongoose.model<IEmployeeAccessToken>('EmployeeAccessToken', employeeAccessTokenSchema); 
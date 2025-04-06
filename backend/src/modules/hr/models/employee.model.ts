import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: mongoose.Types.ObjectId;
  position: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'on_leave' | 'suspended' | 'retired' | 'fired' | 'deceased' | 'resigned';
  manager?: mongoose.Types.ObjectId;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  documents?: {
    type: string;
    url: string;
    expiryDate?: Date;
  }[];
  reason?: string;
  retirementDate?: Date;
  suspensionStartDate?: Date;
  suspensionEndDate?: Date;
  dateOfDeath?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  hireDate: {
    type: Date,
    required: true
  },
  salary: {
    type: Number,
    required: true,
    min: [0, 'Salary cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'suspended', 'retired', 'fired', 'deceased', 'resigned'],
    default: 'active'
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  emergencyContact: {
    name: {
      type: String,
      trim: true
    },
    relationship: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  documents: [{
    type: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    expiryDate: Date
  }],
  reason: {
    type: String,
    required: function() {
      return ['suspended', 'retired', 'fired', 'deceased', 'resigned'].includes(this.status);
    }
  },
  retirementDate: {
    type: Date,
    required: function() {
      return this.status === 'retired';
    }
  },
  suspensionStartDate: {
    type: Date,
    required: function() {
      return this.status === 'suspended';
    }
  },
  suspensionEndDate: {
    type: Date,
    required: function() {
      return this.status === 'suspended';
    }
  },
  dateOfDeath: {
    type: Date,
    required: function() {
      return this.status === 'deceased';
    }
  }
}, {
  timestamps: true
});

// Create indexes for efficient querying
employeeSchema.index({ email: 1 }, { unique: true });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });
employeeSchema.index({ manager: 1 });
employeeSchema.index({ 'documents.expiryDate': 1 });

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Prevent deletion of employees with active status
employeeSchema.pre('remove', function(next) {
  if (this.status === 'active') {
    throw new Error('Cannot delete active employee');
  }
  next();
});

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema); 
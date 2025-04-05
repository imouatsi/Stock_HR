import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  contractNumber: string;
  contractType: string;
  partyA: {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  partyB: {
    name: string;
    address: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  terms: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const contractSchema = new Schema<IContract>(
  {
    contractNumber: {
      type: String,
      required: true,
      unique: true,
    },
    contractType: {
      type: String,
      required: true,
    },
    partyA: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      contactPerson: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    partyB: {
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      contactPerson: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
    },
    terms: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'expired', 'terminated'],
      default: 'draft',
    },
    attachments: [{
      name: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contract = mongoose.model<IContract>('Contract', contractSchema);

export default Contract;

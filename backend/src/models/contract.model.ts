import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    taxNumber?: string;
  };
  terms: string;
  type: string;
  party: {
    name: string;
    type: string;
    contact: string;
    address: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  attachments: string[];
  signature?: {
    date: Date;
    signedBy: string;
    digitalSignature: string;
  };
  createdBy: mongoose.Types.ObjectId;
  updatedBy: mongoose.Types.ObjectId;
}

const contractSchema = new Schema<IContract>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'active', 'expired', 'terminated'],
      default: 'draft'
    },
    client: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      taxNumber: String
    },
    terms: { type: String, required: true },
    type: {
      type: String,
      enum: ['sale', 'purchase', 'service', 'maintenance'],
      required: true
    },
    party: {
      name: { type: String, required: true },
      type: {
        type: String,
        enum: ['individual', 'company'],
        required: true
      },
      contact: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [{
      description: String,
      quantity: Number,
      unitPrice: Number,
      total: Number
    }],
    attachments: [String],
    signature: {
      date: Date,
      signedBy: String,
      digitalSignature: String
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

contractSchema.index({ title: 'text', description: 'text' });
contractSchema.index({ 'client.name': 1, 'party.name': 1 });
contractSchema.index({ startDate: 1, endDate: 1 });
contractSchema.index({ status: 1 });

export default mongoose.model<IContract>('Contract', contractSchema);

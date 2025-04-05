import { Schema, model, Document } from 'mongoose';

export interface ILicense extends Document {
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'expired';
  expiryDate: Date;
  maxUsers: number;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const licenseSchema = new Schema({
  name: { type: String, required: true },
  key: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'expired'],
    default: 'active'
  },
  expiryDate: { type: Date, required: true },
  maxUsers: { type: Number, required: true, default: 1 },
  features: [{ type: String }],
}, {
  timestamps: true
});

export default model<ILicense>('License', licenseSchema); 
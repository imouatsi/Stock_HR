import mongoose, { Schema, Document } from 'mongoose';

interface IAnalytics extends Document {
  metric: string;
  value: number;
  timestamp: Date;
  metadata: Record<string, any>;
  tags: string[];
}

const analyticsSchema = new Schema<IAnalytics>({
  metric: { type: String, required: true, index: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  metadata: { type: Schema.Types.Mixed },
  tags: [{ type: String, index: true }]
});

analyticsSchema.index({ metric: 1, timestamp: -1 });

export const Analytics = mongoose.model<IAnalytics>('Analytics', analyticsSchema);

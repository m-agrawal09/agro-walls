import mongoose, { Schema, Document } from 'mongoose';

export interface ISourceFeed extends Document {
  source: string;
  type: string;
  reportsReceived: number;
  verified: number;
  pending: number;
  lastIngest: string;
  status: 'LIVE FEED' | 'STABLE' | 'MANUAL BATCH';
  sector?: string;
  contact?: string;
}

const SourceFeedSchema: Schema = new Schema(
  {
    source: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    reportsReceived: { type: Number, default: 0 },
    verified: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    lastIngest: { type: String, default: 'Just now' },
    status: {
      type: String,
      enum: ['LIVE FEED', 'STABLE', 'MANUAL BATCH'],
      default: 'LIVE FEED',
    },
    sector: { type: String, default: '' },
    contact: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SourceFeed = mongoose.models.SourceFeed || mongoose.model<ISourceFeed>('SourceFeed', SourceFeedSchema);

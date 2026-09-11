import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  caseId: string;
  name: string;
  ageGender: string;
  location: string;
  source: string;
  matchTarget: string;
  confidence: number;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING FIELD CHECK' | 'PHOTO REVIEW' | 'BIOMETRIC CORRELATED' | 'VERIFIED MATCH';
  reportedAgo: string;
  assignedOfficer?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema: Schema = new Schema(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    ageGender: { type: String, required: true },
    location: { type: String, default: '' },
    source: { type: String, default: '' },
    matchTarget: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM'], default: 'HIGH' },
    status: {
      type: String,
      enum: ['PENDING FIELD CHECK', 'PHOTO REVIEW', 'BIOMETRIC CORRELATED', 'VERIFIED MATCH'],
      default: 'PHOTO REVIEW',
    },
    reportedAgo: { type: String, default: 'Just now' },
    assignedOfficer: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Verification = mongoose.models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema);

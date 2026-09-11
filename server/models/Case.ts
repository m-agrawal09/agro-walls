import mongoose, { Schema, Document } from 'mongoose';

export interface IVerifiedCandidate {
  id: string;
  name: string;
  ref: string;
  confidence: number;
  location: string;
  distance: string;
  evidence: string;
  verifiedBy: string;
  verifiedAt: string;
  notes: string;
}

export interface ICase extends Document {
  caseId: string;
  name: string;
  aliases: string[];
  age: number;
  gender: 'M' | 'F' | 'Other';
  lastSeenLocation: string;
  sector: string;
  reportedAgo: string;
  source: string;
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  status: 'LOOKING FOR A MATCH' | 'AWAITING VERIFICATION' | 'VERIFIED MATCH' | 'FAMILY NOTIFIED' | 'RESOLVED';
  isMinor: boolean;
  hasPhoto: boolean;
  photoUrl?: string;
  imageUrl?: string;
  imagePublicId?: string;
  keyMarks: string;
  height?: string;
  build?: string;
  clothing?: string;
  bodyMarks?: string;
  reporterContact?: string;
  verifiedCandidate?: IVerifiedCandidate | null;
  duplicatesMerged: boolean;
  canonicalId: string;
  verificationNotes: string;
  timeline?: Array<{
    step: number;
    title: string;
    timestamp: string;
    completed: boolean;
    current?: boolean;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema: Schema = new Schema(
  {
    caseId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    aliases: [{ type: String }],
    age: { type: Number, required: true },
    gender: { type: String, enum: ['M', 'F', 'Other'], required: true },
    lastSeenLocation: { type: String, required: true },
    sector: { type: String, default: 'Sector 1' },
    reportedAgo: { type: String, default: 'Just now' },
    source: { type: String, default: 'Citizen Intake' },
    priority: { type: String, enum: ['CRITICAL', 'HIGH', 'ROUTINE'], default: 'HIGH' },
    status: {
      type: String,
      enum: ['LOOKING FOR A MATCH', 'AWAITING VERIFICATION', 'VERIFIED MATCH', 'FAMILY NOTIFIED', 'RESOLVED'],
      default: 'LOOKING FOR A MATCH',
    },
    isMinor: { type: Boolean, default: false },
    hasPhoto: { type: Boolean, default: false },
    photoUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    keyMarks: { type: String, default: '' },
    height: { type: String, default: '' },
    build: { type: String, default: '' },
    clothing: { type: String, default: '' },
    bodyMarks: { type: String, default: '' },
    reporterContact: { type: String, default: '' },
    verifiedCandidate: {
      id: String,
      name: String,
      ref: String,
      confidence: Number,
      location: String,
      distance: String,
      evidence: String,
      verifiedBy: String,
      verifiedAt: String,
      notes: String,
    },
    duplicatesMerged: { type: Boolean, default: false },
    canonicalId: { type: String, default: '' },
    verificationNotes: { type: String, default: '' },
    timeline: [
      {
        step: Number,
        title: String,
        timestamp: String,
        completed: Boolean,
        current: Boolean,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export const Case = mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);

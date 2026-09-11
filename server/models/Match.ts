import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  caseId: string;
  candidateRef: string;
  candidateName: string;
  location: string;
  distance: string;
  confidence: number;
  facialScore: number;
  demographicScore: number;
  clothingScore: number;
  locationScore: number;
  evidence: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DUPLICATE';
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema(
  {
    caseId: { type: String, required: true, index: true },
    candidateRef: { type: String, required: true, index: true },
    candidateName: { type: String, required: true },
    location: { type: String, default: '' },
    distance: { type: String, default: '' },
    confidence: { type: Number, required: true },
    facialScore: { type: Number, default: 0 },
    demographicScore: { type: Number, default: 0 },
    clothingScore: { type: Number, default: 0 },
    locationScore: { type: Number, default: 0 },
    evidence: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'DUPLICATE'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

export const Match = mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reportId: string;
  reportType: 'Missing Person' | 'Found Person' | 'Rescued Person' | 'Hospital Admission' | 'Unidentified Person' | 'Citizen Tip';
  urgencyLevel: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  source: string;
  sourceContact: string;
  intakeStation: string;
  sourceReferenceNumber?: string;
  fullName: string;
  nameAsReported?: string;
  age?: number | string;
  ageIsApproximate?: boolean;
  gender?: string;
  phoneNumber?: string;
  address?: string;
  lastKnownLocation: string;
  photoFileName?: string;
  photoUrl?: string;
  imageUrl?: string;
  imagePublicId?: string;
  height?: string;
  build?: string;
  clothing?: string;
  bodyMarks?: string;
  otherCharacteristics?: string;
  narrativeDescription?: string;
  status: 'NEW' | 'UNDER REVIEW' | 'ACCEPTED' | 'REJECTED' | 'DUPLICATE';
  tabCategory: 'New Submissions' | 'Under Review' | 'Accepted' | 'Rejected' | 'Potential Duplicate';
  isMinor?: boolean;
  submittedBy?: string;
  possibleMatchingCase?: {
    caseId: string;
    person: string;
    confidence: number;
  };
  duplicateWarning?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema(
  {
    reportId: { type: String, required: true, unique: true, index: true },
    reportType: {
      type: String,
      enum: ['Missing Person', 'Found Person', 'Rescued Person', 'Hospital Admission', 'Unidentified Person', 'Citizen Tip'],
      default: 'Missing Person',
    },
    urgencyLevel: { type: String, enum: ['CRITICAL', 'HIGH', 'ROUTINE'], default: 'HIGH' },
    source: { type: String, default: 'Relief Camp' },
    sourceContact: { type: String, default: '' },
    intakeStation: { type: String, default: '' },
    sourceReferenceNumber: { type: String, default: '' },
    fullName: { type: String, required: true },
    nameAsReported: { type: String, default: '' },
    age: { type: Schema.Types.Mixed, default: '' },
    ageIsApproximate: { type: Boolean, default: false },
    gender: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    address: { type: String, default: '' },
    lastKnownLocation: { type: String, default: '' },
    dateTimeLastSeen: { type: String, default: '' },
    photoFileName: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    height: { type: String, default: '' },
    build: { type: String, default: '' },
    clothing: { type: String, default: '' },
    bodyMarks: { type: String, default: '' },
    otherCharacteristics: { type: String, default: '' },
    narrativeDescription: { type: String, default: '' },
    status: {
      type: String,
      enum: ['NEW', 'UNDER REVIEW', 'ACCEPTED', 'REJECTED', 'DUPLICATE'],
      default: 'NEW',
    },
    tabCategory: {
      type: String,
      enum: ['New Submissions', 'Under Review', 'Accepted', 'Rejected', 'Potential Duplicate'],
      default: 'New Submissions',
    },
    isMinor: { type: Boolean, default: false },
    submittedBy: { type: String, default: 'Anonymous Reporter' },
    possibleMatchingCase: {
      caseId: String,
      person: String,
      confidence: Number,
    },
    duplicateWarning: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Report = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);

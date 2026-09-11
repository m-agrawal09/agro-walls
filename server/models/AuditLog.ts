import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  timestamp: string;
  source: string;
  sourceType: 'HELPLINE' | 'HOSPITAL' | 'RELIEF CAMP' | 'NGO' | 'VOLUNTEER' | 'PUBLIC';
  action: string;
  person: string;
  caseId: string;
  operator: string;
  status: 'VERIFIED' | 'MATCH' | 'INTAKE' | 'ALERT';
  details?: string;
  createdAt: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    timestamp: { type: String, default: () => new Date().toISOString() },
    source: { type: String, required: true },
    sourceType: {
      type: String,
      enum: ['HELPLINE', 'HOSPITAL', 'RELIEF CAMP', 'NGO', 'VOLUNTEER', 'PUBLIC'],
      default: 'RELIEF CAMP',
    },
    action: { type: String, required: true },
    person: { type: String, default: '' },
    caseId: { type: String, default: '' },
    operator: { type: String, default: 'DISP-SYSTEM' },
    status: {
      type: String,
      enum: ['VERIFIED', 'MATCH', 'INTAKE', 'ALERT'],
      default: 'INTAKE',
    },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

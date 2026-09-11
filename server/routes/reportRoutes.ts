import { Router, Request, Response } from 'express';
import { Report } from '../models/Report';
import { Case } from '../models/Case';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET all reports
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, status } = req.query;
    const filter: Record<string, any> = {};
    if (type) filter.reportType = type;
    if (status) filter.status = status;

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch reports' });
  }
});

// POST create intake report & automatically register/correlate
router.post('/', async (req: Request, res: Response) => {
  try {
    const reportData = req.body;
    if (!reportData.reportId) {
      const randomId = String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0');
      reportData.reportId = `ST-2026-H4-${randomId.slice(-3)}`;
    }

    const newReport = await Report.create(reportData);

    // Also create or link a Case document so it appears in Live Cases immediately
    const randomCaseNum = String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0');
    const caseId = `MP-2026-${randomCaseNum}`;

    const newCase = await Case.create({
      caseId,
      name: newReport.fullName,
      aliases: newReport.nameAsReported ? [newReport.nameAsReported] : [],
      age: Number(newReport.age) || 25,
      gender: newReport.gender === 'FEMALE' ? 'F' : newReport.gender === 'OTHER' ? 'Other' : 'M',
      lastSeenLocation: newReport.lastKnownLocation || 'Relief Camp Checkpoint',
      sector: newReport.intakeStation || 'Sector B-4',
      reportedAgo: 'Just now',
      source: newReport.source || 'Intake Terminal',
      priority: newReport.urgencyLevel || 'HIGH',
      status: 'LOOKING FOR A MATCH',
      isMinor: Boolean(newReport.isMinor || (Number(newReport.age) > 0 && Number(newReport.age) < 18)),
      hasPhoto: Boolean(newReport.photoFileName || newReport.photoUrl || newReport.imageUrl),
      photoUrl: newReport.imageUrl || newReport.photoUrl || '',
      imageUrl: newReport.imageUrl || '',
      imagePublicId: newReport.imagePublicId || '',
      keyMarks: newReport.bodyMarks || newReport.clothing || '',
      clothing: newReport.clothing || '',
      bodyMarks: newReport.bodyMarks || '',
      reporterContact: newReport.sourceContact || '',
      duplicatesMerged: false,
      canonicalId: caseId,
      verificationNotes: newReport.narrativeDescription || '',
    });

    await AuditLog.create({
      source: newReport.source || 'Intake Terminal',
      sourceType: 'RELIEF CAMP',
      action: 'Intake Registered',
      person: newReport.fullName,
      caseId,
      operator: 'DISP-INTAKE',
      status: 'INTAKE',
      details: `Report ${newReport.reportId} filed and linked to ${caseId}`,
    });

    res.status(201).json({
      report: newReport,
      case: newCase,
      caseId,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to submit report' });
  }
});

export default router;

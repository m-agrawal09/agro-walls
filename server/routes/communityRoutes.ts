import { Router, Request, Response } from 'express';
import { Report } from '../models/Report';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET community reports with optional tabCategory filter
router.get('/', async (req: Request, res: Response) => {
  try {
    const { tab } = req.query;
    const filter: Record<string, any> = {
      reportType: 'Citizen Tip',
    };

    if (tab && typeof tab === 'string' && tab !== 'All') {
      filter.tabCategory = tab;
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch community reports' });
  }
});

// POST new citizen community report
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const count = await Report.countDocuments();
    const reportId = `CR-2026-${String(815 + count).padStart(4, '0')}`;

    const newTip = await Report.create({
      reportId,
      reportType: 'Citizen Tip',
      fullName: data.submittedBy || 'Citizen Informant',
      personName: data.personDescription,
      narrativeDescription: data.narrative,
      lastKnownLocation: data.location,
      phoneNumber: data.reporterPhone,
      address: data.reporterAddress,
      clothing: data.clothing,
      source: 'Citizen Portal (Mobile Upload)',
      tabCategory: 'New Submissions',
      status: 'NEW',
      isMinor: Boolean(data.isMinor),
      possibleMatchingCase: data.possibleMatchingCase,
      duplicateWarning: data.duplicateWarning || '',
      photoFileName: data.photoType || '',
    });

    await AuditLog.create({
      source: 'Citizen Portal',
      sourceType: 'PUBLIC',
      action: 'Citizen Tip Received',
      person: data.personDescription || 'Unknown',
      caseId: data.possibleMatchingCase?.caseId || '',
      operator: 'PUBLIC-INGEST',
      status: 'INTAKE',
      details: `Report ${reportId} submitted by ${data.submittedBy}`,
    });

    res.status(201).json(newTip);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create community report' });
  }
});

// PATCH update status (Accept, Reject, Review, Duplicate)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { status, tabCategory } = req.body;
    const report = await Report.findOneAndUpdate(
      { $or: [{ reportId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }] },
      { $set: { status, tabCategory } },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await AuditLog.create({
      source: 'Citizen Portal Review',
      sourceType: 'PUBLIC',
      action: `Tip Status -> ${status}`,
      person: report.fullName,
      caseId: report.possibleMatchingCase?.caseId || '',
      operator: 'DISP-CONTROL',
      status: status === 'ACCEPTED' ? 'VERIFIED' : status === 'REJECTED' ? 'ALERT' : 'INTAKE',
      details: `Community report ${report.reportId} updated to ${status}`,
    });

    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update community report' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { Case } from '../models/Case';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET all cases with optional search and filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, priority, status, isMinor } = req.query;
    const filter: Record<string, any> = {};

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { name: regex },
        { caseId: regex },
        { lastSeenLocation: regex },
        { aliases: regex },
        { sector: regex },
      ];
    }

    if (priority && typeof priority === 'string' && priority !== 'All') {
      filter.priority = priority.toUpperCase();
    }

    if (status && typeof status === 'string' && status !== 'All') {
      filter.status = status;
    }

    if (isMinor === 'true') {
      filter.isMinor = true;
    }

    const cases = await Case.find(filter).sort({ createdAt: -1 });
    res.json(cases);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch cases' });
  }
});

// GET single case by caseId
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const caseItem = await Case.findOne({
      $or: [{ caseId: req.params.id }, { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null }],
    });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }
    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch case' });
  }
});

// CREATE new case
router.post('/', async (req: Request, res: Response) => {
  try {
    const caseData = req.body;
    if (!caseData.caseId) {
      const randomCaseNum = String(Math.floor(1 + Math.random() * 99999)).padStart(5, '0');
      caseData.caseId = `MP-2026-${randomCaseNum}`;
    }

    const newCase = await Case.create(caseData);

    await AuditLog.create({
      source: newCase.source || 'Direct Intake',
      sourceType: 'RELIEF CAMP',
      action: 'Case Created',
      person: newCase.name,
      caseId: newCase.caseId,
      operator: 'DISP-SYSTEM',
      status: 'INTAKE',
      details: `New case registered in ${newCase.sector}`,
    });

    res.status(201).json(newCase);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create case' });
  }
});

// VERIFY Match for a case
router.patch('/:id/verify', async (req: Request, res: Response) => {
  try {
    const { candidateId, officer, notes } = req.body;
    const caseItem = await Case.findOne({ caseId: req.params.id });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    caseItem.status = 'VERIFIED MATCH';
    caseItem.verificationNotes = notes || 'Sworn physical verification completed.';
    caseItem.verifiedCandidate = {
      id: candidateId || 'FND-2026-01892',
      name: caseItem.name,
      ref: candidateId || 'FND-2026-01892',
      confidence: 94,
      location: 'Disaster Relief Camp Ward 6, Polytechnic Campus',
      distance: '3.2 km',
      evidence: 'Facial recognition match 96%, matching right chin scar & navy blue shirt confirmed by on-site nurse.',
      verifiedBy: officer || 'DISP-884 (Certified Dispatcher)',
      verifiedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      notes: notes || 'Sworn physical verification: Biometrics, healed chin scar, and clothing match intake report.',
    };

    if (caseItem.timeline && caseItem.timeline.length > 2) {
      caseItem.timeline[1].completed = true;
      caseItem.timeline[2].completed = true;
      caseItem.timeline[2].current = true;
    }

    await caseItem.save();

    await AuditLog.create({
      source: 'Verification Control',
      sourceType: 'RELIEF CAMP',
      action: 'Match Verified',
      person: caseItem.name,
      caseId: caseItem.caseId,
      operator: officer || 'DISP-884',
      status: 'VERIFIED',
      details: notes || 'Match verified by officer.',
    });

    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to verify match' });
  }
});

// REJECT Match for a case
router.patch('/:id/reject', async (req: Request, res: Response) => {
  try {
    const { notes } = req.body;
    const caseItem = await Case.findOne({ caseId: req.params.id });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    caseItem.verificationNotes = `Rejected: ${notes}`;
    await caseItem.save();

    await AuditLog.create({
      source: 'Verification Control',
      sourceType: 'RELIEF CAMP',
      action: 'Match Rejected',
      person: caseItem.name,
      caseId: caseItem.caseId,
      operator: 'DISP-SYSTEM',
      status: 'ALERT',
      details: `Candidate rejected: ${notes}`,
    });

    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reject match' });
  }
});

// MERGE duplicates for a case
router.patch('/:id/merge', async (req: Request, res: Response) => {
  try {
    const { canonicalId, notes } = req.body;
    const caseItem = await Case.findOne({ caseId: req.params.id });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    caseItem.duplicatesMerged = true;
    caseItem.canonicalId = canonicalId || caseItem.caseId;
    caseItem.verificationNotes = notes || 'Duplicates resolved and merged.';
    await caseItem.save();

    await AuditLog.create({
      source: 'Duplicate Resolution',
      sourceType: 'RELIEF CAMP',
      action: 'Duplicates Merged',
      person: caseItem.name,
      caseId: caseItem.caseId,
      operator: 'DISP-SYSTEM',
      status: 'VERIFIED',
      details: `Merged under canonical ID ${caseItem.canonicalId}`,
    });

    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to merge duplicates' });
  }
});

// SET priority
router.patch('/:id/priority', async (req: Request, res: Response) => {
  try {
    const { priority } = req.body;
    const caseItem = await Case.findOne({ caseId: req.params.id });

    if (!caseItem) {
      return res.status(404).json({ error: 'Case not found' });
    }

    caseItem.priority = priority;
    await caseItem.save();
    res.json(caseItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update priority' });
  }
});

// RESET Demo data in database
router.post('/reset-demo', async (_req: Request, res: Response) => {
  try {
    const defaultCase = await Case.findOneAndUpdate(
      { caseId: 'MP-2026-00421' },
      {
        $set: {
          status: 'LOOKING FOR A MATCH',
          priority: 'HIGH',
          verifiedCandidate: null,
          duplicatesMerged: false,
          canonicalId: 'MP-2026-00421',
          verificationNotes: '',
        },
      },
      { new: true }
    );
    res.json({ message: 'Demo case reset successfully', case: defaultCase });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to reset demo data' });
  }
});

export default router;

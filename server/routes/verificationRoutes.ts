import { Router, Request, Response } from 'express';
import { Verification } from '../models/Verification';
import { Case } from '../models/Case';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET verification queue
router.get('/', async (_req: Request, res: Response) => {
  try {
    const queue = await Verification.find().sort({ confidence: -1 });
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch verification queue' });
  }
});

// UPDATE or verify verification item
router.patch('/:caseId', async (req: Request, res: Response) => {
  try {
    const { status, assignedOfficer, notes } = req.body;
    const item = await Verification.findOneAndUpdate(
      { caseId: req.params.caseId },
      { $set: { status, assignedOfficer, notes } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Verification item not found' });
    }

    if (status === 'VERIFIED MATCH') {
      await Case.findOneAndUpdate(
        { caseId: req.params.caseId },
        {
          $set: {
            status: 'VERIFIED MATCH',
            verificationNotes: notes || 'Verified by field officer.',
          },
        }
      );
    }

    await AuditLog.create({
      source: 'Verification Queue',
      sourceType: 'RELIEF CAMP',
      action: `Verification -> ${status}`,
      person: item.name,
      caseId: item.caseId,
      operator: assignedOfficer || 'DISP-884',
      status: status === 'VERIFIED MATCH' ? 'VERIFIED' : 'INTAKE',
      details: notes || `Status updated to ${status}`,
    });

    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to update verification item' });
  }
});

export default router;

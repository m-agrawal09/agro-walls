import { Router, Request, Response } from 'express';
import { Match } from '../models/Match';
import { Case } from '../models/Case';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET all matches or by caseId
router.get('/', async (req: Request, res: Response) => {
  try {
    const { caseId } = req.query;
    const filter: Record<string, any> = {};
    if (caseId) filter.caseId = caseId;

    const matches = await Match.find(filter).sort({ confidence: -1 });
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch matches' });
  }
});

// GET matches for specific case
router.get('/:caseId', async (req: Request, res: Response) => {
  try {
    const matches = await Match.find({ caseId: req.params.caseId }).sort({ confidence: -1 });
    res.json(matches);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch matches for case' });
  }
});

// POST trigger verification on a match candidate
router.post('/:id/verify', async (req: Request, res: Response) => {
  try {
    const { officer, notes } = req.body;
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match record not found' });
    }

    match.status = 'VERIFIED';
    await match.save();

    // Also update parent case
    const parentCase = await Case.findOne({ caseId: match.caseId });
    if (parentCase) {
      parentCase.status = 'VERIFIED MATCH';
      parentCase.verifiedCandidate = {
        id: match.candidateRef,
        name: match.candidateName,
        ref: match.candidateRef,
        confidence: match.confidence,
        location: match.location,
        distance: match.distance,
        evidence: match.evidence,
        verifiedBy: officer || 'DISP-884 (Certified Dispatcher)',
        verifiedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        notes: notes || 'Sworn physical verification: Biometrics, healed chin scar, and clothing match intake report.',
      };
      await parentCase.save();
    }

    await AuditLog.create({
      source: 'Match Intelligence',
      sourceType: 'RELIEF CAMP',
      action: 'Biometric Match Confirmed',
      person: match.candidateName,
      caseId: match.caseId,
      operator: officer || 'DISP-884',
      status: 'VERIFIED',
      details: `Candidate ${match.candidateRef} confirmed with ${match.confidence}% confidence.`,
    });

    res.json({ match, case: parentCase });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to verify match' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { Case } from '../models/Case';
import { Report } from '../models/Report';
import { Verification } from '../models/Verification';
import { SourceFeed } from '../models/SourceFeed';

const router = Router();

// GET KPI statistics
router.get('/kpi', async (_req: Request, res: Response) => {
  try {
    const totalCases = await Case.countDocuments();
    const verifiedCases = await Case.countDocuments({ status: 'VERIFIED MATCH' });
    const awaitingVerification = await Case.countDocuments({ status: 'AWAITING VERIFICATION' });
    const lookingForMatch = await Case.countDocuments({ status: 'LOOKING FOR A MATCH' });
    const totalReports = await Report.countDocuments();
    const citizenTips = await Report.countDocuments({ reportType: 'Citizen Tip' });
    const pendingVerificationQueue = await Verification.countDocuments({ status: { $ne: 'VERIFIED MATCH' } });

    res.json({
      totalCases,
      verifiedCases,
      awaitingVerification,
      lookingForMatch,
      totalReports,
      citizenTips,
      pendingVerificationQueue,
      matchRate: totalCases > 0 ? Math.round((verifiedCases / totalCases) * 100) : 74,
      avgCorrelationSeconds: 3.4,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch KPI statistics' });
  }
});

// GET Ingest source feeds
router.get('/sources', async (_req: Request, res: Response) => {
  try {
    const feeds = await SourceFeed.find().sort({ reportsReceived: -1 });
    res.json(feeds);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch source feeds' });
  }
});

export default router;

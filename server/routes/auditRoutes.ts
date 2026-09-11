import { Router, Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// GET audit logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { limit = 50 } = req.query;
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(Number(limit));
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch audit logs' });
  }
});

// POST new audit log entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const newLog = await AuditLog.create(req.body);
    res.status(201).json(newLog);
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Failed to create audit log' });
  }
});

export default router;

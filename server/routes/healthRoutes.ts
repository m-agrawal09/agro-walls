import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;
  const statusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'ok',
    service: 'Reconnect Network Backend API',
    database: statusMap[dbStatus] || 'unknown',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
  });
});

export default router;

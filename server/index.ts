import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import caseRoutes from './routes/caseRoutes';
import reportRoutes from './routes/reportRoutes';
import communityRoutes from './routes/communityRoutes';
import matchRoutes from './routes/matchRoutes';
import verificationRoutes from './routes/verificationRoutes';
import auditRoutes from './routes/auditRoutes';
import statsRoutes from './routes/statsRoutes';
import healthRoutes from './routes/healthRoutes';
import uploadRoutes from './routes/uploadRoutes';
import networkRoutes from './routes/networkRoutes';
import chatbotRoutes from './routes/chatbotRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/community-reports', communityRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/network-graph', networkRoutes);
app.use('/api/chat', chatbotRoutes);

// Root test endpoint
app.get('/api', (_req, res) => {
  res.json({
    message: 'Reconnect Network Backend API is live',
    version: '1.0.0',
    documentation: {
      cases: '/api/cases',
      reports: '/api/reports',
      communityReports: '/api/community-reports',
      matches: '/api/matches',
      verifications: '/api/verifications',
      audit: '/api/audit',
      stats: '/api/stats',
      health: '/api/health',
    },
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Server] Live backend listening on port ${PORT}`);
      console.log(`[Server] Health endpoint: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Server] Failed to start:', error);
  }
};

startServer();

export default app;

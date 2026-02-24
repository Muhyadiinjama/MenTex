import express from 'express';
import { logMood, getMoodHistory } from '../controllers/mood.controller';
import { generateReport, getReports, getLatestReport } from '../controllers/analytics.controller';

const router = express.Router();

// Mood Routes
router.post('/log', logMood);
router.get('/history/:userId', getMoodHistory);

// Analytics Routes
router.post('/generate-report/:userId', generateReport);
router.get('/reports/:userId', getReports);
router.get('/latest-report/:userId', getLatestReport);

export default router;

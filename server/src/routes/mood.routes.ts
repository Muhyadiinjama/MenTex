import express from 'express';
import { logMood, getMoodHistory, deleteMood, updateMoodNote } from '../controllers/mood.controller.js';
import { generateReport, getReports, getLatestReport } from '../controllers/analytics.controller.js';

const router = express.Router();

// Mood Routes
router.post('/log', logMood);
router.get('/history/:userId', getMoodHistory);
router.delete('/:id', deleteMood);
router.put('/:id/note', updateMoodNote);

// Analytics Routes
router.post('/generate-report/:userId', generateReport);
router.get('/reports/:userId', getReports);
router.get('/latest-report/:userId', getLatestReport);

export default router;

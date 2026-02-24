import { Request, Response } from 'express';
import { Mood } from '../models/Mood';
import { maybeGenerateAutoReport } from '../services/reportGeneration.service';

export const logMood = async (req: Request, res: Response) => {
    try {
        const { userId, emoji, moodScore, note } = req.body;

        if (!userId || !emoji || !moodScore) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new mood event every time; users can check in many times a day.
        const mood = await Mood.create({
            userId,
            emoji,
            moodScore,
            note
        });

        // Auto-generate in background; mood logging should not fail if AI/reporting fails.
        void maybeGenerateAutoReport(userId, 3).catch((err) => {
            console.error(`Auto report generation failed for user ${userId}:`, err);
        });

        res.status(200).json(mood);
    } catch (error) {
        console.error("Error logging mood:", error);
        res.status(500).json({ error: 'Failed to log mood' });
    }
};

export const getMoodHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const days = parseInt(req.query.days as string) || 7;

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - days);

        const history = await Mood.find({
            userId,
            timestamp: { $gte: startDate, $lte: endDate }
        }).sort({ timestamp: -1 });

        res.json(history);
    } catch (error) {
        console.error("Error fetching mood history:", error);
        res.status(500).json({ error: 'Failed to fetch mood history' });
    }
};

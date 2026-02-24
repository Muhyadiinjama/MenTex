import { Request, Response } from 'express';
import { WeeklyReport } from '../models/WeeklyReport.js';
import { generateWeeklyReportForUser } from '../services/reportGeneration.service.js';

export const generateReport = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await generateWeeklyReportForUser(userId, { minEntries: 3 });
        if (!result.report) {
            return res.status(400).json({ error: result.reason || 'Not enough data to generate report.' });
        }
        res.status(201).json(result.report);
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: 'Failed to generate report' });
    }
};

export const getReports = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit as string) || 5;

        const reports = await WeeklyReport.find({ userId })
            .sort({ generatedAt: -1 })
            .limit(limit);

        res.json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
};

export const getLatestReport = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const report = await WeeklyReport.findOne({ userId }).sort({ generatedAt: -1 });

        if (!report) {
            return res.status(404).json({ error: 'No reports found' });
        }

        res.json(report);
    } catch (error) {
        console.error("Error fetching latest report:", error);
        res.status(500).json({ error: 'Failed to fetch latest report' });
    }
};

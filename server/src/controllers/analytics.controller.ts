import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { WeeklyReport } from '../models/WeeklyReport.js';
import { generateWeeklyReportForUser } from '../services/reportGeneration.service.js';
import { User } from '../models/User.js';

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

export const sendTherapistReport = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { therapistName, therapistEmail, subject, body } = req.body;

        if (!therapistName || !therapistEmail || !subject || !body) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            return res.status(500).json({ error: 'Email is not configured on server' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"MenTex" <${process.env.EMAIL_USER}>`,
            to: therapistEmail,
            subject,
            text: body,
            replyTo: process.env.EMAIL_USER
        });

        const sentAt = new Date().toISOString();
        await User.findOneAndUpdate(
            { userId },
            { $set: { 'therapistReport.lastSentAt': sentAt } },
            { upsert: true, new: true }
        );

        return res.json({ success: true, sentAt });
    } catch (error) {
        console.error('Error sending therapist report:', error);
        return res.status(500).json({ error: 'Failed to send therapist report' });
    }
};

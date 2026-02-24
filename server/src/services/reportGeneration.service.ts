import { WeeklyReport } from '../models/WeeklyReport.js';
import type { IWeeklyReport } from '../models/WeeklyReport.js';
import { Mood } from '../models/Mood.js';
import { analyzeWeeklyMood } from './geminiAnalytics.service.js';
import { getAggregatedMoodData } from './moodAggregation.service.js';

interface GenerateReportOptions {
  minEntries?: number;
}

interface ReportGenerationResult {
  report: IWeeklyReport | null;
  reason?: string;
}

export const generateWeeklyReportForUser = async (
  userId: string,
  options: GenerateReportOptions = {}
): Promise<ReportGenerationResult> => {
  const minEntries = options.minEntries ?? 3;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const aggregatedData = await getAggregatedMoodData(userId, startDate, endDate);
  if (aggregatedData.moodData.length < minEntries) {
    return { report: null, reason: `Not enough mood entries (minimum ${minEntries}).` };
  }

  const aiAnalysis = await analyzeWeeklyMood(aggregatedData.moodData, aggregatedData.analytics);

  const report = await WeeklyReport.create({
    userId,
    weekStartDate: startDate,
    weekEndDate: endDate,
    moodData: aggregatedData.moodData,
    analytics: aggregatedData.analytics,
    aiInsights: aiAnalysis
  });

  return { report };
};

export const maybeGenerateAutoReport = async (
  userId: string,
  threshold: number = 3
): Promise<ReportGenerationResult> => {
  const latestReport = await WeeklyReport.findOne({ userId }).sort({ generatedAt: -1 });
  const since = latestReport?.generatedAt ?? new Date(0);

  const newEntries = await Mood.countDocuments({
    userId,
    timestamp: { $gt: since }
  });

  if (newEntries < threshold) {
    return { report: null, reason: `Waiting for ${threshold} new entries.` };
  }

  return generateWeeklyReportForUser(userId, { minEntries: 3 });
};

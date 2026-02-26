import { onSchedule } from "firebase-functions/v2/scheduler";
import { Mood } from '../models/Mood.js';
import { WeeklyReport } from '../models/WeeklyReport.js';
import { generateWeeklyReportForUser } from '../services/reportGeneration.service.js';

// Schedule: Every Sunday at 11:59 PM
// Cron expression: 59 23 * * 0
export const weeklyReportJob = onSchedule("59 23 * * 0", async (event) => {
    console.log('Running weekly report generation job...');

    try {
        // 1. Find all users who have logged mood in the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);

        const distinctUsers = await Mood.distinct('userId', {
            timestamp: { $gte: startDate, $lte: endDate }
        });

        console.log(`Found ${distinctUsers.length} users to process.`);

        for (const userId of distinctUsers) {
            try {
                // Check if report already exists for this week (to avoid duplicates if job re-runs)
                const existingReport = await WeeklyReport.findOne({
                    userId,
                    weekStartDate: { $gte: startDate },
                    weekEndDate: { $lte: endDate }
                    // This check is a bit rough, better to check generatedAt or strict date match
                });

                if (existingReport) {
                    console.log(`Report already exists for user ${userId}, skipping.`);
                    continue;
                }

                const result = await generateWeeklyReportForUser(userId, { minEntries: 3 });
                if (!result.report) {
                    console.log(`User ${userId} has insufficient data, skipping.`);
                    continue;
                }
                console.log(`Generated report for user ${userId}`);

            } catch (err) {
                console.error(`Error processing user ${userId}:`, err);
            }
        }
    } catch (error) {
        console.error("Error in weekly report cron job:", error);
    }
});

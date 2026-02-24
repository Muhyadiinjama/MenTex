import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyReport extends Document {
    userId: string;
    weekStartDate: Date;
    weekEndDate: Date;
    moodData: Array<{
        date: Date;
        emoji: string;
        score: number;
        note: string;
    }>;
    analytics: {
        averageMoodScore: number;
        moodTrend: string;
        dominantMood: string;
        totalEntries: number;
        scoreVolatility?: number;
        weekdayPattern?: Array<{
            day: string;
            averageScore: number;
            entries: number;
        }>;
        timeOfDayPattern?: Array<{
            timeBlock: string;
            averageScore: number;
            entries: number;
        }>;
        noteSentiment?: {
            negative: number;
            positive: number;
            neutral: number;
        };
        topKeywords?: string[];
        riskSignals?: {
            lowMoodRatio: number;
            negativeNoteRatio: number;
            volatility: number;
        };
        dailyStats?: Array<{
            date: string;
            dayLabel: string;
            avgScore: number;
            dominantMood: string;
            min: number;
            max: number;
            entries: number;
        }>;
    };
    aiInsights: {
        summary: string;
        analysisSource?: string;
        safetyMeta?: {
            provider: string;
            model: string;
            status: string;
        };
        innovationHighlight?: string;
        dailyStats?: Array<{
            date: string;
            avgScore: number;
            dominantMood: string;
            min: number;
            max: number;
        }>;
        identifiedTriggers: Array<{
            trigger: string;
            category: string;
            frequency: string;
            impact: string;
        }>;
        patterns: string[];
        emotionalThemes: string[];
        recommendations: Array<{
            action: string;
            rationale: string;
            difficulty: string;
        }>;
        riskAssessment: {
            level: string;
            concerns: string[];
            urgentAction: string; // 'true' | 'false' kept as string per prompt or boolean? Prompt says "valid JSON", usually boolean. But maybe string for display. Let's use boolean in TS if possible but prompt example showed string "true" | "false". I'll use string to match prompt exactly.
        };
        positiveHighlights: string[];
    };
    generatedAt: Date;
}

const WeeklyReportSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    moodData: [{
        date: Date,
        emoji: String,
        score: Number,
        note: String
    }],
    analytics: {
        averageMoodScore: Number,
        moodTrend: String,
        dominantMood: String,
        totalEntries: Number,
        scoreVolatility: Number,
        weekdayPattern: [{
            day: String,
            averageScore: Number,
            entries: Number
        }],
        timeOfDayPattern: [{
            timeBlock: String,
            averageScore: Number,
            entries: Number
        }],
        noteSentiment: {
            negative: Number,
            positive: Number,
            neutral: Number
        },
        topKeywords: [String],
        riskSignals: {
            lowMoodRatio: Number,
            negativeNoteRatio: Number,
            volatility: Number
        },
        dailyStats: [{
            date: String,
            dayLabel: String,
            avgScore: Number,
            dominantMood: String,
            min: Number,
            max: Number,
            entries: Number
        }]
    },
    aiInsights: {
        summary: String,
        analysisSource: String,
        safetyMeta: {
            provider: String,
            model: String,
            status: String
        },
        innovationHighlight: String,
        dailyStats: [{
            date: String,
            avgScore: Number,
            dominantMood: String,
            min: Number,
            max: Number
        }],
        identifiedTriggers: [{
            trigger: String,
            category: String,
            frequency: String,
            impact: String
        }],
        patterns: [String],
        emotionalThemes: [String],
        recommendations: [{
            action: String,
            rationale: String,
            difficulty: String
        }],
        riskAssessment: {
            level: String,
            concerns: [String],
            urgentAction: String
        },
        positiveHighlights: [String]
    },
    generatedAt: { type: Date, default: Date.now }
});

export const WeeklyReport = mongoose.model<IWeeklyReport>('WeeklyReport', WeeklyReportSchema);

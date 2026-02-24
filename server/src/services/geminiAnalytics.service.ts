import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateWeeklyAnalysisPrompt } from '../utils/promptTemplates.js';
import { buildFallbackAnalysis } from './fallbackAnalytics.service.js';
import { reviewGeneratedReportSafety } from './safetyMonitor.service.js';

if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
}

const geminiApiKey = process.env.GEMINI_API_KEY || "";
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

const getGeminiModelCandidates = (): string[] => {
    const fromEnvList = (process.env.GEMINI_ANALYTICS_MODELS || '')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
    const primary = process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL] : [];

    const defaults = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
    ];

    return Array.from(new Set([...fromEnvList, ...primary, ...defaults]));
};

const generateWithGemini = async (prompt: string): Promise<string> => {
    if (!genAI) {
        throw new Error('GEMINI_API_KEY missing');
    }

    const candidates = getGeminiModelCandidates();
    let lastError: unknown = null;

    for (const modelName of candidates) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            if (text && text.trim().length > 0) {
                return text;
            }
        } catch (error) {
            lastError = error;
            console.error(`Gemini analytics model failed (${modelName}):`, error);
        }
    }

    throw lastError || new Error('All Gemini models failed for analytics generation.');
};

const safeParseJson = (text: string) => {
    try {
        return JSON.parse(text);
    } catch {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const candidate = text.slice(firstBrace, lastBrace + 1);
            return JSON.parse(candidate);
        }
        throw new Error('Model response was not valid JSON.');
    }
};

type Trigger = {
    trigger: string;
    category: string;
    frequency: string;
    impact: string;
};

const inferCategory = (trigger: string): string => {
    const t = trigger.toLowerCase();
    if (['exercise', 'workout', 'walk', 'sleep', 'friends', 'family time', 'music', 'meditation', 'prayer'].some((w) => t.includes(w))) return 'Positive';
    if (['breakup', 'fight', 'relationship', 'friend', 'family'].some((w) => t.includes(w))) return 'Relationship';
    if (['exam', 'deadline', 'study', 'assignment', 'work', 'project'].some((w) => t.includes(w))) return 'Work';
    if (['sleep', 'health', 'tired', 'panic', 'anxiety'].some((w) => t.includes(w))) return 'Health';
    if (['social', 'event', 'crowd'].some((w) => t.includes(w))) return 'Social';
    return 'Other';
};

const mapTriggerImpact = (
    promptOutput: any,
    analytics?: Record<string, unknown>
): Trigger[] => {
    const triggerImpact = Array.isArray(promptOutput?.TriggerImpact)
        ? promptOutput.TriggerImpact
        : Array.isArray(promptOutput?.Triggers) ? promptOutput.Triggers : [];
    if (triggerImpact.length > 0) {
        return triggerImpact.map((item: any) => ({
            trigger: String(item?.trigger || 'Unknown trigger'),
            category: inferCategory(String(item?.trigger || '')),
            frequency: String(item?.correlationEvidence || item?.explanation || 'Observed in mood logs'),
            impact: String(item?.impact || 'medium').toLowerCase().includes('positive')
                ? 'high positive'
                : String(item?.impact || 'medium').toLowerCase()
        }));
    }

    const keywords = Array.isArray((analytics as any)?.topKeywords) ? (analytics as any).topKeywords : [];
    return keywords.slice(0, 3).map((keyword: string) => ({
        trigger: keyword,
        category: inferCategory(keyword),
        frequency: 'Observed in notes',
        impact: inferCategory(keyword) === 'Positive' ? 'high positive' : 'medium'
    }));
};

const normalizeReport = (
    promptOutput: any,
    moodData: Array<{ score: number; note?: string }>,
    analytics?: Record<string, unknown>
) => {
    const summary = promptOutput?.Summary || promptOutput?.WeeklySummary || promptOutput?.summary || 'Weekly analysis generated.';
    const patterns = Array.isArray(promptOutput?.Patterns)
        ? promptOutput.Patterns.slice(0, 2)
        : Array.isArray(promptOutput?.PatternsObserved)
            ? promptOutput.PatternsObserved.slice(0, 2)
            : Array.isArray(promptOutput?.patterns) ? promptOutput.patterns.slice(0, 2) : [];
    const positiveHighlights = Array.isArray(promptOutput?.PositiveHighlights)
        ? promptOutput.PositiveHighlights.slice(0, 3)
        : Array.isArray(promptOutput?.positiveHighlights) ? promptOutput.positiveHighlights.slice(0, 3) : [];

    const actions = promptOutput?.Actions || promptOutput?.RecommendedActions || {};
    const toActionArray = (value: any) => {
        if (Array.isArray(value)) return value;
        if (value && typeof value === 'object') return [value];
        return [];
    };
    const normalizeDifficultyActions = (key: 'Easy' | 'Medium' | 'Difficult', difficulty: 'easy' | 'medium' | 'difficult') => {
        const items = toActionArray(actions?.[key]).slice(0, 5);
        const normalized = items
            .map((item: any) => ({
                action: String(item?.action || '').trim(),
                rationale: String(item?.rationale || '').trim(),
                difficulty
            }))
            .filter((item: any) => item.action.length > 0);

        if (normalized.length >= 3) {
            return normalized;
        }

        // Ensure at least 3 per category.
        const fallbackBase = key.toLowerCase();
        while (normalized.length < 3) {
            normalized.push({
                action: `${key} support action ${normalized.length + 1}`,
                rationale: `Consistent ${fallbackBase} practice improves emotional balance.`,
                difficulty
            });
        }
        return normalized;
    };

    const recommendations = [
        ...normalizeDifficultyActions('Easy', 'easy'),
        ...normalizeDifficultyActions('Medium', 'medium'),
        ...normalizeDifficultyActions('Difficult', 'difficult')
    ];

    const avg = Number((analytics as any)?.averageMoodScore || 0);
    const lowMoodRatio = Number((analytics as any)?.riskSignals?.lowMoodRatio || 0);
    const negativeRatio = Number((analytics as any)?.riskSignals?.negativeNoteRatio || 0);
    let level = 'LOW';
    if (avg <= 2 || lowMoodRatio >= 0.6 || negativeRatio >= 0.7) level = 'HIGH';
    else if (avg <= 3 || lowMoodRatio >= 0.35 || negativeRatio >= 0.45) level = 'MODERATE';

    const analyticsDailyStats = Array.isArray((analytics as any)?.dailyStats) ? (analytics as any).dailyStats : [];
    const promptDailyStats = Array.isArray(promptOutput?.DailyStats) ? promptOutput.DailyStats : [];
    const normalizedDailyStats = (analyticsDailyStats.length > 0 ? analyticsDailyStats : promptDailyStats)
        .map((d: any) => ({
            date: String(d.date || d.dayLabel || ''),
            avgScore: Number(d.avgScore || 0),
            dominantMood: String(d.dominantMood || 'Okay'),
            min: Number(d.min ?? 1),
            max: Number(d.max ?? 5)
        }));

    return {
        summary,
        innovationHighlight: String(promptOutput?.InnovationHighlight || 'This report tracks micro-mood changes by using daily averages plus min/max ranges from multiple logs.'),
        dailyStats: normalizedDailyStats,
        identifiedTriggers: mapTriggerImpact(promptOutput, analytics),
        patterns,
        emotionalThemes: [],
        recommendations,
        riskAssessment: {
            level,
            concerns: level === 'HIGH'
                ? ['Frequent low mood scores and negative mood context']
                : ['Continue regular monitoring of mood changes'],
            urgentAction: level === 'HIGH' ? 'true' : 'false'
        },
        analysisSource: 'gemini',
        positiveHighlights
    };
};

export const analyzeWeeklyMood = async (moodData: any[], analytics?: Record<string, unknown>) => {
    if (moodData.length === 0) {
        throw new Error("No mood data to analyze.");
    }

    const prompt = generateWeeklyAnalysisPrompt(moodData, analytics);

    try {
        const text = await generateWithGemini(prompt);

        // Clean up markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const promptOutput = safeParseJson(cleanedText);
        const normalized = normalizeReport(promptOutput, moodData, analytics);

        const safety = await reviewGeneratedReportSafety({
            logs: moodData.slice(-5).map((m) => ({ score: Number(m.score || 0), note: m.note || '' })),
            reportText: JSON.stringify(normalized)
        });

        if (safety.status === 'REJECTED') {
            const safeReport = buildFallbackAnalysis(moodData, analytics);
            return {
                ...safeReport,
                safetyMeta: {
                    provider: safety.provider,
                    model: safety.model,
                    status: safety.status
                },
                riskAssessment: {
                    ...safeReport.riskAssessment,
                    level: 'HIGH',
                    concerns: [safety.reason || 'Safety monitor flagged generated content.'],
                    urgentAction: 'true'
                }
            };
        }

        return {
            ...normalized,
            safetyMeta: {
                provider: safety.provider,
                model: safety.model,
                status: safety.status
            }
        };
    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        const safeReport = buildFallbackAnalysis(moodData, analytics);
        const safety = await reviewGeneratedReportSafety({
            logs: moodData.slice(-5).map((m) => ({ score: Number(m.score || 0), note: m.note || '' })),
            reportText: JSON.stringify(safeReport)
        });

        if (safety.status === 'REJECTED') {
            return {
                ...safeReport,
                safetyMeta: {
                    provider: safety.provider,
                    model: safety.model,
                    status: safety.status
                },
                riskAssessment: {
                    ...safeReport.riskAssessment,
                    level: 'HIGH',
                    concerns: [safety.reason || 'Safety monitor flagged generated content.'],
                    urgentAction: 'true'
                }
            };
        }

        return {
            ...safeReport,
            analysisSource: 'fallback-local',
            safetyMeta: {
                provider: safety.provider,
                model: safety.model,
                status: safety.status
            }
        };
    }
};

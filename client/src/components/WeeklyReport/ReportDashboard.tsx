import React, { useEffect, useState } from 'react';
import { getLatestReport, generateReport, getMoodHistory } from '../../services/moodService';
import MoodTrendChart from './MoodTrendChart';
import InsightsCard from './InsightsCard';
import TriggerAnalysis from './TriggerAnalysis';
import { format } from 'date-fns';
import { translations } from '../../i18n/translations';

interface ReportDashboardProps {
    userId: string;
    lang: 'EN' | 'BM';
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ userId, lang }) => {
    const t = translations[lang].analytics;
    const [report, setReport] = useState<any>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [entryCount, setEntryCount] = useState(0);
    const [history30d, setHistory30d] = useState<any[]>([]);
    const [windowMode, setWindowMode] = useState<'Weekly' | 'Monthly'>('Weekly');

    const getMoodStatus = (avg: number, trend: string) => {
        if (avg >= 4.2 && trend === 'improving') return { emoji: '😊', text: t.moodStatus.great };
        if (avg >= 3.2 && trend === 'stable') return { emoji: '🙂', text: t.moodStatus.stable };
        if (avg >= 3.2 && trend === 'declining') return { emoji: '🙂', text: t.moodStatus.declining };
        if (avg >= 2.3 && trend === 'improving') return { emoji: '😌', text: t.moodStatus.mixedImproving };
        if (avg >= 2.3) return { emoji: '😕', text: t.moodStatus.mixedReset };
        return { emoji: '😔', text: t.moodStatus.heavy };
    };

    const fetchReport = async () => {
        try {
            const [reportData, historyData, history30Data] = await Promise.all([
                getLatestReport(userId).catch(() => null),
                getMoodHistory(userId, 7).catch(() => []),
                getMoodHistory(userId, 30).catch(() => [])
            ]);
            setReport(reportData);
            setEntryCount(Array.isArray(historyData) ? historyData.length : 0);
            setHistory30d(Array.isArray(history30Data) ? history30Data : []);
        } catch (err) {
            console.error("No report found or error", err);
        }
    };

    useEffect(() => {
        if (userId) fetchReport();
    }, [userId]);

    const handleGenerate = async () => {
        setGenerating(true);
        setError(null);
        try {
            const newReport = await generateReport(userId);
            setReport(newReport);
            const [historyData, history30Data] = await Promise.all([
                getMoodHistory(userId, 7).catch(() => []),
                getMoodHistory(userId, 30).catch(() => [])
            ]);
            setEntryCount(Array.isArray(historyData) ? historyData.length : 0);
            setHistory30d(Array.isArray(history30Data) ? history30Data : []);
        } catch (err: any) {
            setError(err.response?.data?.error || translations[lang].common.error);
        } finally {
            setGenerating(false);
        }
    };

    const computeDailyStatsFromHistory = (entries: any[], days: number) => {
        const now = new Date();
        const start = new Date();
        start.setDate(now.getDate() - days + 1);

        const filtered = entries
            .filter((entry) => new Date(entry.timestamp) >= start && new Date(entry.timestamp) <= now)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        const buckets: Record<string, { scores: number[] }> = {};
        filtered.forEach((entry) => {
            const key = new Date(entry.timestamp).toISOString().slice(0, 10);
            if (!buckets[key]) buckets[key] = { scores: [] };
            buckets[key].scores.push(Number(entry.moodScore || 0));
        });

        const scoreToLabel = (score: number) => {
            if (score >= 5) return translations[lang].checkin.great;
            if (score >= 4) return translations[lang].checkin.okay;
            if (score >= 3) return translations[lang].checkin.tired;
            if (score >= 2) return translations[lang].checkin.anxious;
            return translations[lang].checkin.sad;
        };

        return Object.entries(buckets).map(([date, bucket]) => {
            const avgScore = bucket.scores.reduce((s, v) => s + v, 0) / bucket.scores.length;
            const min = Math.min(...bucket.scores);
            const max = Math.max(...bucket.scores);
            const modeMap: Record<string, number> = {};
            bucket.scores.forEach((s) => {
                const label = scoreToLabel(s);
                modeMap[label] = (modeMap[label] || 0) + 1;
            });
            const dominantMood = Object.keys(modeMap).reduce((best, cur) => (modeMap[cur] > (modeMap[best] || 0) ? cur : best), 'Okay');
            return { date, avgScore: Number(avgScore.toFixed(2)), dominantMood, min, max };
        }).sort((a, b) => a.date.localeCompare(b.date));
    };

    const selectedDailyStats = windowMode === 'Weekly'
        ? (Array.isArray(report?.aiInsights?.dailyStats) && report.aiInsights.dailyStats.length > 0
            ? report.aiInsights.dailyStats
            : computeDailyStatsFromHistory(history30d, 7))
        : computeDailyStatsFromHistory(history30d, 30);

    const computeTimeOfDayPattern = (entries: any[], days: number) => {
        const now = new Date();
        const start = new Date();
        start.setDate(now.getDate() - days + 1);
        const blocks: Record<'Night' | 'Morning' | 'Afternoon' | 'Evening', { total: number; count: number }> = {
            Night: { total: 0, count: 0 },
            Morning: { total: 0, count: 0 },
            Afternoon: { total: 0, count: 0 },
            Evening: { total: 0, count: 0 }
        };
        entries
            .filter((entry) => new Date(entry.timestamp) >= start && new Date(entry.timestamp) <= now)
            .forEach((entry) => {
                const hour = new Date(entry.timestamp).getHours();
                const block = hour < 6 ? 'Night' : hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
                blocks[block].total += Number(entry.moodScore || 0);
                blocks[block].count += 1;
            });

        return Object.entries(blocks)
            .map(([label, stats]) => ({
                label,
                avg: stats.count > 0 ? stats.total / stats.count : 0,
                count: stats.count
            }))
            .filter((row) => row.count > 0);
    };

    const computeTrendFromStats = (stats: Array<{ avgScore: number }>) => {
        if (!stats || stats.length < 2) return 'stable';
        const half = Math.floor(stats.length / 2);
        const first = stats.slice(0, half);
        const second = stats.slice(half);
        const a = first.reduce((s, d) => s + d.avgScore, 0) / Math.max(first.length, 1);
        const b = second.reduce((s, d) => s + d.avgScore, 0) / Math.max(second.length, 1);
        if (b > a + 0.3) return 'improving';
        if (b < a - 0.3) return 'declining';
        return 'stable';
    };

    // Removed blocking loading state - page will show immediately

    if (!report) {
        return (
            <div className="weekly-empty-card">
                <div className="weekly-empty-icon">
                    📊
                </div>
                <h2 className="weekly-empty-title">{t.emptyTitle}</h2>
                <p className="weekly-empty-text">
                    {t.emptyText}
                </p>

                <div className="weekly-empty-progress">
                    {t.emptyProgress.replace('{count}', entryCount.toString())}
                </div>

                {error && (
                    <div className="weekly-error">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="weekly-primary-btn"
                >
                    {generating ? (
                        <span className="btn-loading-wrap">
                            <span className="btn-spinner"></span>
                            {t.analyzing}
                        </span>
                    ) : t.genFirst}
                </button>
            </div>
        );
    }

    const effectiveTrend = computeTrendFromStats(selectedDailyStats);
    const timePattern = computeTimeOfDayPattern(history30d, windowMode === 'Weekly' ? 7 : 30);
    const bestHour = timePattern.length > 0 ? [...timePattern].sort((a, b) => b.avg - a.avg)[0] : null;
    const toughestHour = timePattern.length > 0 ? [...timePattern].sort((a, b) => a.avg - b.avg)[0] : null;
    const moodStatus = getMoodStatus(
        Number(report.analytics.averageMoodScore || 0),
        effectiveTrend
    );

    return (
        <div className="weekly-report">
            <div className="weekly-panel weekly-hero">
                <div>
                    <h2 className="weekly-hero-title">{t.heroTitle}</h2>
                    <div className="hero-quick-status">
                        <span className="hero-quick-emoji">{moodStatus.emoji}</span>
                        <span>{moodStatus.text}</span>
                    </div>
                    <p className="weekly-hero-subtitle">
                        {format(new Date(report.weekStartDate), 'MMM d')} - {format(new Date(report.weekEndDate), 'MMM d, yyyy')}
                    </p>
                    <p className="weekly-hero-date">
                        {t.lastGenerated}
                        {format(new Date(report.generatedAt), 'MMM d, yyyy h:mm a')}
                    </p>
                    <div className={`analysis-source-badge ${report.aiInsights?.analysisSource === 'gemini' ? 'source-gemini' : 'source-fallback'}`}>
                        {report.aiInsights?.analysisSource === 'gemini' ? t.aiGenerated : t.safeAnalysis}
                    </div>
                    <div className="analysis-source-badge source-safety">
                        {t.safetyCheck} {report.aiInsights?.safetyMeta?.status || t.approved}
                    </div>
                </div>
                <div className="weekly-avg">
                    <p className="weekly-avg-label">{t.avgMood}</p>
                    <p className="weekly-avg-value">{report.analytics.averageMoodScore.toFixed(1)}/5.0</p>
                </div>
            </div>

            <div className="weekly-kpi-grid">
                <div className="weekly-kpi-card">
                    <p className="weekly-kpi-label">{t.entriesAnalyzed}</p>
                    <p className="weekly-kpi-value">{report.analytics.totalEntries}</p>
                </div>
                <div className="weekly-kpi-card">
                    <p className="weekly-kpi-label">{t.trend}</p>
                    <p className="weekly-kpi-value">
                        {effectiveTrend === 'stable' ? t.stable :
                            effectiveTrend === 'improving' ? t.improving :
                                effectiveTrend === 'declining' ? t.declining : effectiveTrend}
                    </p>
                </div>
                <div className="weekly-kpi-card">
                    <p className="weekly-kpi-label">{t.volatility}</p>
                    <p className="weekly-kpi-value">
                        {typeof report.analytics.scoreVolatility === 'number' ? report.analytics.scoreVolatility.toFixed(2) : 'N/A'}
                    </p>
                </div>
            </div>
            <div className="hour-chip-row">
                {bestHour && (
                    <div className="hour-chip best-hour-chip">
                        {t.bestHour}: {bestHour.label} ({bestHour.avg.toFixed(1)}/5)
                    </div>
                )}
                {toughestHour && (
                    <div className="hour-chip tough-hour-chip">
                        {t.toughestHour}: {toughestHour.label} ({toughestHour.avg.toFixed(1)}/5)
                    </div>
                )}
            </div>

            {(report.aiInsights?.riskAssessment?.urgentAction === 'true' || report.aiInsights?.riskAssessment?.urgentAction === true) && (
                <div className="weekly-risk-banner">
                    {t.riskBanner}
                </div>
            )}

            <div className="weekly-panel weekly-section">
                <div className="chart-head-row">
                    <h3 className="weekly-section-title">{t.moodTrend}</h3>
                    <div className="window-toggle">
                        <button
                            type="button"
                            className={`window-btn ${windowMode === 'Weekly' ? 'window-btn-active' : ''}`}
                            onClick={() => setWindowMode('Weekly')}
                        >
                            {t.weekly}
                        </button>
                        <button
                            type="button"
                            className={`window-btn ${windowMode === 'Monthly' ? 'window-btn-active' : ''}`}
                            onClick={() => setWindowMode('Monthly')}
                        >
                            {t.monthly}
                        </button>
                    </div>
                </div>
                <MoodTrendChart data={selectedDailyStats} windowMode={windowMode} />
                {report.aiInsights?.innovationHighlight && (
                    <p className="innovation-note">{report.aiInsights.innovationHighlight}</p>
                )}
            </div>

            <InsightsCard insights={report.aiInsights || { summary: '', patterns: [], positiveHighlights: [], recommendations: [] }} lang={lang} />

            <TriggerAnalysis triggers={report.aiInsights?.identifiedTriggers || []} lang={lang} />

            <div className="weekly-regen-wrap">
                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="weekly-regen"
                >
                    {generating ? (
                        <span className="btn-loading-wrap">
                            <span className="btn-spinner"></span>
                            {t.regenerating}
                        </span>
                    ) : t.regen}
                </button>
            </div>
        </div>
    );
};

export default ReportDashboard;

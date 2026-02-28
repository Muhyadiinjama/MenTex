import React from 'react';
import { format } from 'date-fns';
import { translations } from '../../i18n/translations';

interface InsightsCardProps {
    insights: {
        summary: string;
        patterns: string[];
        positiveHighlights: string[];
        recommendations: Array<{
            action: string;
            rationale: string;
            difficulty: string;
        }>;
    };
    lang: 'EN' | 'BM';
}

const InsightsCard: React.FC<InsightsCardProps> = ({ insights, lang }) => {
    const t = translations[lang].analytics;
    if (!insights) return null;

    const patterns = insights.patterns || [];
    const positiveHighlights = insights.positiveHighlights || [];
    const recommendations = insights.recommendations || [];
    const byDifficulty = {
        easy: recommendations.filter((r) => r.difficulty === 'easy'),
        medium: recommendations.filter((r) => r.difficulty === 'medium'),
        difficult: recommendations.filter((r) => r.difficulty === 'difficult')
    };

    const formatHighlight = (highlight: string) => {
        const [maybeDate, ...rest] = highlight.split(' + ');
        const parsed = new Date(maybeDate);
        if (Number.isNaN(parsed.getTime()) || rest.length === 0) return highlight;
        const text = rest.join(' + ').trim();
        const polished = text.endsWith('.') ? text : `${text}.`;
        return `${format(parsed, 'MMM d, h:mm a')} — ${polished}`;
    };

    return (
        <div className="weekly-panel weekly-section">
            <div className="insights-card insights-summary-card">
                <h3 className="weekly-section-title">{t.summary}</h3>
                <p className="insights-summary-text">{insights.summary}</p>
            </div>

            <div className="insights-grid insights-grid-spacer">
                <div className="insights-card">
                    <h4 className="insights-card-title">{t.patterns}</h4>
                    <ul className="insights-list">
                        {patterns.map((pattern, idx) => (
                            <li key={idx}>{pattern}</li>
                        ))}
                    </ul>
                </div>

                <div className="insights-card">
                    <h4 className="insights-card-title">{t.highlights}</h4>
                    <ul className="insights-list">
                        {positiveHighlights.map((highlight, idx) => (
                            <li key={idx}>{formatHighlight(highlight)}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="recommendations-spacer">
                <h3 className="weekly-section-title">{t.recommendations}</h3>
                <div className="recommend-grid">
                    {(['easy', 'medium', 'difficult'] as const).map((difficulty) => (
                        <div key={difficulty} className={`recommend-card recommend-card-${difficulty}`}>
                            <span
                                className={`difficulty-badge ${difficulty === 'easy'
                                    ? 'difficulty-easy'
                                    : difficulty === 'difficult'
                                        ? 'difficulty-difficult'
                                        : 'difficulty-medium'
                                    }`}
                            >
                                {difficulty === 'easy' ? t.easy :
                                    difficulty === 'medium' ? t.medium :
                                        t.difficult}
                            </span>
                            <div className="rec-list-wrap">
                                {byDifficulty[difficulty].map((rec, idx) => (
                                    <div key={`${difficulty}-${idx}`} className="rec-item">
                                        <h4 className="rec-item-title">{rec.action}</h4>
                                        <p className="rec-item-text">{rec.rationale}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InsightsCard;

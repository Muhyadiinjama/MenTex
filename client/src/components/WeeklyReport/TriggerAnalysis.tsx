import React, { useMemo, useState } from 'react';
import { translations } from '../../i18n/translations';

interface Trigger {
    trigger: string;
    category: string;
    frequency: string;
    impact: string;
}

interface TriggerAnalysisProps {
    triggers: Trigger[];
    lang: 'EN' | 'BM';
}

const TriggerAnalysis: React.FC<TriggerAnalysisProps> = ({ triggers, lang }) => {
    const t = translations[lang].analytics;
    if (!triggers || triggers.length === 0) return null;
    const [showAll, setShowAll] = useState(false);
    const visibleTriggers = useMemo(() => (showAll ? triggers : triggers.slice(0, 2)), [showAll, triggers]);

    const getImpactClass = (impact: string) => {
        const normalized = impact.toLowerCase();
        if (normalized.includes('positive')) return 'impact-high-positive';
        switch (normalized) {
            case 'high': return 'impact-high';
            case 'medium': return 'impact-medium';
            default: return 'impact-low';
        }
    };

    return (
        <div className="weekly-panel weekly-section">
            <h3 className="weekly-section-title">{t.triggers}</h3>
            <div className="trigger-table-wrap">
                <table className="trigger-table">
                    <thead>
                        <tr>
                            <th>{t.reason}</th>
                            <th>{t.observation}</th>
                            <th>{t.impactNotes}</th>
                            <th>{t.impact}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibleTriggers.map((item, idx) => (
                            <tr key={idx}>
                                <td>{item.trigger}</td>
                                <td>{item.category}</td>
                                <td>{item.frequency || 'N/A'}</td>
                                <td>
                                    <span className={`impact-badge ${getImpactClass(item.impact)}`}>
                                        {item.impact.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {triggers.length > 2 && (
                <div className="trigger-toggle-row">
                    <button type="button" className="trigger-toggle-btn" onClick={() => setShowAll((prev) => !prev)}>
                        {showAll ? t.showTop2 : t.showAll.replace('{count}', triggers.length.toString())}
                    </button>
                </div>
            )}
        </div>
    );
};

export default TriggerAnalysis;

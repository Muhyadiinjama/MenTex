import React, { useEffect, useState } from 'react';
import { getMoodHistory } from '../../services/moodService';
import { format } from 'date-fns';
import { translations } from '../../i18n/translations';
import { ms } from 'date-fns/locale';
import { X } from 'lucide-react';
import './MoodHistory.css';

interface MoodHistoryProps {
    userId: string;
    lang: 'EN' | 'BM';
}

interface MoodEntry {
    _id: string;
    emoji: string;
    moodScore: number;
    note: string;
    timestamp: string;
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ userId, lang }) => {
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

    const t = translations[lang].dashboard;
    const common = translations[lang].common;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getMoodHistory(userId);
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchHistory();
    }, [userId]);

    if (loading) return <div className="text-center p-4">{common.loading}</div>;

    if (history.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">{t.noMoods}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="mood-history-title">{t.last7Days}</h3>
            <div className="mood-history-grid">
                {history.map((entry) => (
                    <button
                        key={entry._id}
                        className="mood-history-item"
                        onClick={() => setSelectedEntry(entry)}
                        type="button"
                    >
                        <div className="mood-history-item-head">
                            <span className="mood-history-date">
                                {format(new Date(entry.timestamp), 'EEE, MMM d', { locale: lang === 'BM' ? ms : undefined })}
                            </span>
                            <span className="mood-history-emoji" role="img" aria-label="mood">
                                {entry.emoji}
                            </span>
                        </div>
                        <p className="mood-history-preview">
                            {entry.note?.trim() || (lang === 'EN' ? 'No note added.' : 'Tiada nota ditambah.')}
                        </p>
                    </button>
                ))}
            </div>

            {selectedEntry && (
                <div className="mood-history-overlay" onClick={() => setSelectedEntry(null)}>
                    <div className="mood-history-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mood-history-modal-header">
                            <div className="mood-history-modal-title-wrap">
                                <span className="mood-history-modal-emoji">{selectedEntry.emoji}</span>
                                <div>
                                    <h4 className="mood-history-modal-title">
                                        {selectedEntry.moodScore === 5 ? 'Great' : selectedEntry.moodScore === 4 ? 'Okay' : selectedEntry.moodScore === 3 ? 'Tired' : selectedEntry.moodScore === 2 ? 'Anxious' : 'Sad'}
                                    </h4>
                                    <p className="mood-history-modal-date">
                                        {format(new Date(selectedEntry.timestamp), 'EEEE, MMM d, h:mm a', { locale: lang === 'BM' ? ms : undefined })}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="mood-history-modal-close"
                                type="button"
                                onClick={() => setSelectedEntry(null)}
                                aria-label="Close note details"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="mood-history-modal-body">
                            <p className="mood-history-modal-label">{lang === 'EN' ? 'Saved reason' : 'Sebab disimpan'}</p>
                            <p className="mood-history-modal-text">
                                {selectedEntry.note?.trim() || (lang === 'EN' ? 'No note added for this check-in.' : 'Tiada nota ditambah untuk daftar masuk ini.')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodHistory;

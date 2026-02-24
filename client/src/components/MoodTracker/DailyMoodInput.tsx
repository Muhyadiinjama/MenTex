import React, { useState } from 'react';
import { useMoodTracking } from '../../hooks/useMoodTracking';

import { translations } from '../../i18n/translations';

interface DailyMoodInputProps {
    userId: string;
    onMoodLogged?: () => void;
    lang: 'EN' | 'BM';
}

const EMOJIS = [
    { char: '😭', score: 1 },
    { char: '😢', score: 2 },
    { char: '😐', score: 3 },
    { char: '🙂', score: 4 },
    { char: '😊', score: 5 },
];

const DailyMoodInput: React.FC<DailyMoodInputProps> = ({ userId, onMoodLogged, lang }) => {
    const { recordMood, loading } = useMoodTracking(userId);
    const [selectedEmoji, setSelectedEmoji] = useState<{ char: string; score: number } | null>(null);
    const [note, setNote] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const t = translations[lang].checkin;
    const common = translations[lang].common;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmoji) return;

        try {
            await recordMood(selectedEmoji.char, selectedEmoji.score, note);
            setSuccess(true);
            setNote('');
            setSelectedEmoji(null);
            if (onMoodLogged) onMoodLogged();
        } catch (err) {
            setError(t.saveError);
        }
    };

    if (success) {
        return (
            <div className="p-6 bg-teal-50 rounded-lg text-center shadow-sm">
                <h3 className="text-xl font-bold text-teal-700">{lang === 'EN' ? 'Mood Logged! 🎉' : 'Mood Direkod! 🎉'}</h3>
                <p className="text-teal-600 mt-2">{lang === 'EN' ? 'You can log another mood whenever your feelings change.' : 'Anda boleh merekod mood lain setiap kali perasaan anda berubah.'}</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-teal-800 underline hover:no-underline"
                >
                    {lang === 'EN' ? 'Log Another' : 'Rekod Lagi'}
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">{t.step1Title}</h2>

            <div className="flex justify-between items-center px-4">
                {EMOJIS.map((emoji) => (
                    <button
                        key={emoji.char}
                        type="button"
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-4xl transition-transform hover:scale-125 focus:outline-none ${selectedEmoji?.char === emoji.char ? 'scale-125 drop-shadow-lg' : 'opacity-70 hover:opacity-100'
                            }`}
                        title={`Score: ${emoji.score}`}
                    >
                        {emoji.char}
                    </button>
                ))}
            </div>

            {selectedEmoji && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                            {t.step3Sub} ({note.length}/500)
                        </label>
                        <textarea
                            id="note"
                            rows={4}
                            maxLength={500}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={t.placeholderNote}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? common.loading : lang === 'EN' ? 'Log Mood' : 'Rekod Mood'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default DailyMoodInput;

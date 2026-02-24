import { useState, useEffect, useCallback } from 'react';
import { getMoodHistory, logMood as logMoodApi } from '../services/moodService';

interface MoodEntry {
    _id: string;
    emoji: string;
    moodScore: number;
    note: string;
    timestamp: string;
}

export const useMoodTracking = (userId: string) => {
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getMoodHistory(userId);
            setHistory(data);
        } catch (err) {
            setError('Failed to load mood history');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchHistory();
        }
    }, [fetchHistory, userId]);

    const recordMood = async (emoji: string, score: number, note: string) => {
        setLoading(true);
        try {
            const newMood = await logMoodApi(userId, emoji, score, note);
            setHistory(prev => [newMood, ...prev]);
            return newMood;
        } catch (err) {
            setError('Failed to log mood');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        history,
        loading,
        error,
        refetchHistory: fetchHistory,
        recordMood
    };
};

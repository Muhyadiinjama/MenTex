import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Heart, Briefcase, Users, Home, Sun, Moon, Coffee, AlertCircle } from 'lucide-react';
import { logMood } from '../services/moodService';
import { useAuth } from '../contexts/AuthContext';
import './MoodCheckIn.css';
import { translations } from '../i18n/translations';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

interface MoodCheckInProps {
    lang: 'EN' | 'BM';
}

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [factors, setFactors] = useState<string[]>([]);
    const [note, setNote] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    const t = translations[lang].checkin;
    const common = translations[lang].common;

    const moods = [
        { id: 'great', label: t.great, emoji: '🌟', color: '#a3be8c' },
        { id: 'okay', label: t.okay, emoji: '🙂', color: '#ebcb8b' },
        { id: 'tired', label: t.tired, emoji: '😴', color: '#b48ead' },
        { id: 'anxious', label: t.anxious, emoji: '😰', color: '#d08770' },
        { id: 'sad', label: t.sad, emoji: '😔', color: '#bf616a' },
    ];

    const contextFactors = [
        { id: 'work', label: t.work, icon: Briefcase },
        { id: 'family', label: t.family, icon: Home },
        { id: 'relationship', label: t.relationship, icon: Heart },
        { id: 'social', label: t.social, icon: Users },
        { id: 'health', label: t.health, icon: Sun },
        { id: 'sleep', label: t.sleep, icon: Moon },
        { id: 'stress', label: t.stress, icon: AlertCircle },
        { id: 'other', label: t.other, icon: Coffee },
    ];

    const negativeMoods = ['sad', 'tired', 'anxious'];

    const saveEntry = async (moodId: string, currentFactors: string[], currentNote: string) => {
        if (!currentUser) return;

        try {
            // Map moodId to score (1-5)
            const scoreMap: Record<string, number> = { 'sad': 1, 'anxious': 2, 'tired': 3, 'okay': 4, 'great': 5 };
            const moodScore = scoreMap[moodId] || 3;

            // Map moodId to emoji
            const emojiMap: Record<string, string> = { 'great': '🌟', 'okay': '🙂', 'tired': '😴', 'anxious': '😰', 'sad': '😔' };
            const emoji = emojiMap[moodId] || '😐';

            // Combine note with factors if needed, or just send note
            const finalNote = currentFactors.length > 0
                ? `[Factors: ${currentFactors.join(', ')}] ${currentNote}`
                : currentNote;

            await logMood(currentUser.uid, emoji, moodScore, finalNote);

            // Redirect
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to log mood", error);
            alert(t.saveError);
        }
    };

    const handleMoodSelect = (moodId: string) => {
        setSelectedMood(moodId);
        if (negativeMoods.includes(moodId)) {
            // Negative mood: Ask context and note
            setTimeout(() => setStep(2), 300);
        } else {
            // Positive mood: Save immediately
            saveEntry(moodId, [], '');
        }
    };

    const toggleFactor = (factorId: string) => {
        setFactors(prev =>
            prev.includes(factorId)
                ? prev.filter(f => f !== factorId)
                : [...prev, factorId]
        );
    };

    const handleFinish = () => {
        if (!selectedMood) return;
        saveEntry(selectedMood, factors, note);
    };

    return (
        <div className="dashboard-page-container">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={() => navigate('/chat')}
                currentChatId={null}
                userId={currentUser?.uid || 'guest'}
                lang={lang}
            />

            <main className="main-content">
                <Navbar
                    pageTitle={t.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="checkin-scroll-area">
                    <div className="checkin-container-inner">
                        <div className="card checkin-card">
                            {/* Progress Bar */}
                            <div className="progress-container">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className={`progress-step ${i <= step ? 'active' : ''}`} />
                                ))}
                            </div>

                            {/* STEP 1: MOOD SELECTION */}
                            {step === 1 && (
                                <div className="animate-fade-in">
                                    <h2 className="checkin-h2">
                                        {t.step1Title}
                                    </h2>
                                    <p className="checkin-p-sub">
                                        {t.step1Sub}
                                    </p>
                                    <div className="mood-grid">
                                        {moods.map((m) => (
                                            <button
                                                key={m.id}
                                                onClick={() => handleMoodSelect(m.id)}
                                                className={`mood-btn mood-${m.id} ${selectedMood === m.id ? 'active' : ''}`}
                                            >
                                                <span className="mood-emoji-span">{m.emoji}</span>
                                                <span className="mood-label-span">
                                                    {m.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: CONTEXT FACTORS */}
                            {step === 2 && (
                                <div className="animate-fade-in">
                                    <h2 className="checkin-h2">
                                        {t.step2Title}
                                    </h2>
                                    <p className="checkin-p-sub">
                                        {t.step2Sub}
                                    </p>
                                    <div className="factors-flex">
                                        {contextFactors.map((f) => {
                                            const active = factors.includes(f.id);
                                            return (
                                                <button
                                                    key={f.id}
                                                    onClick={() => toggleFactor(f.id)}
                                                    className={`factor-btn ${active ? 'active' : ''}`}
                                                >
                                                    <f.icon size={16} />
                                                    {f.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="checkin-actions-centered">
                                        <button className="btn-primary" onClick={() => setStep(3)}>
                                            {common.next} <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: NOTE & FINISH */}
                            {step === 3 && (
                                <div className="animate-fade-in">
                                    <h2 className="checkin-h2">
                                        {t.step3Title}
                                    </h2>
                                    <p className="checkin-p-sub">
                                        {t.step3Sub}
                                    </p>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder={t.placeholderNote}
                                        className="note-textarea"
                                    />
                                    <div className="checkin-actions-centered">
                                        <button className="btn-primary" onClick={handleFinish}>
                                            {t.complete} <CheckCircle size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MoodCheckIn;

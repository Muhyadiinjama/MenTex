import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { MessageCircle, BarChart2, Calendar, PlusCircle, CheckCircle, List, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useMoodTracking } from '../hooks/useMoodTracking';
import MoodCalendar from '../components/MoodTracker/MoodCalendar';
import './Dashboard.css';
import { translations } from '../i18n/translations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DashboardProps {
    lang: 'EN' | 'BM';
}

interface MoodEntry {
    _id: string;
    emoji: string;
    moodScore: number;
    note?: string;
    timestamp: string;
}

const Dashboard: React.FC<DashboardProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { history, loading, refetchHistory } = useMoodTracking(currentUser?.uid || '');
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [greeting, setGreeting] = useState('');
    const [historyView, setHistoryView] = useState<'list' | 'calendar'>('list');
    const [selectedHistoryEntry, setSelectedHistoryEntry] = useState<MoodEntry | null>(null);
    const t = translations[lang].dashboard;
    const common = translations[lang].common;

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            let baseGreeting = "";
            if (lang === 'EN') {
                if (hour >= 5 && hour < 12) baseGreeting = "Good Morning";
                else if (hour >= 12 && hour < 17) baseGreeting = "Good Afternoon";
                else if (hour >= 17 && hour < 21) baseGreeting = "Good Evening";
                else baseGreeting = "Good Night";
            } else {
                if (hour >= 5 && hour < 12) baseGreeting = "Selamat Pagi";
                else if (hour >= 12 && hour < 14) baseGreeting = "Selamat Tengahari";
                else if (hour >= 14 && hour < 19) baseGreeting = "Selamat Petang";
                else baseGreeting = "Selamat Malam";
            }
            setGreeting(`${baseGreeting}, ${currentUser?.displayName || common.user}`);
        };
        updateGreeting();
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, [lang, currentUser, common.user]);

    useEffect(() => {
        if (currentUser) {
            refetchHistory();
        }
    }, [currentUser, refetchHistory]);

    // Process History Data
    // Backend returns: { _id, emoji, moodScore, note, timestamp }
    // Sort by timestamp asc for charts
    const sortedHistory = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) as MoodEntry[];
    // Get Today's entries (Dashboard is 1D snapshot)
    const today = new Date().toDateString();
    const todayEntries = sortedHistory.filter((h) => new Date(h.timestamp).toDateString() === today);
    const todayHistoryDesc = [...todayEntries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const todayEntry = todayEntries.length > 0 ? todayEntries[todayEntries.length - 1] : null;

    // Mood score to Label mapping
    const scoreToLabel: { [key: number]: string } = lang === 'EN'
        ? { 5: 'Great', 4: 'Okay', 3: 'Tired', 2: 'Anxious', 1: 'Sad' }
        : { 5: 'Hebat', 4: 'Baik', 3: 'Letih', 2: 'Gelisah', 1: 'Sedih' };



    // --- Chart Config ---
    const chartData = {
        labels: todayEntries.map((h) =>
            new Date(h.timestamp).toLocaleString(lang === 'EN' ? 'en-US' : 'ms-MY', {
                hour: '2-digit',
                minute: '2-digit'
            })
        ),
        datasets: [
            {
                label: 'Mood',
                data: todayEntries.map((h) => h.moodScore),
                borderColor: '#5e81ac',
                backgroundColor: 'rgba(94, 129, 172, 0.2)',
                tension: 0.4,
                pointBackgroundColor: 'white',
                pointBorderColor: '#5e81ac',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
                fill: true,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#2e3440',
                bodyColor: '#4c566a',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: function (context: { raw: unknown }) {
                        const val = context.raw as number;
                        return `Mood: ${scoreToLabel[val] || ''}`;
                    }
                }
            }
        },
        scales: {
            y: {
                min: 0, max: 6,
                ticks: {
                    callback: function (value: string | number) {
                        const scoreToEmoji: { [key: number]: string } = { 1: '😔', 2: '😰', 3: '😴', 4: '🙂', 5: '🌟' };
                        return scoreToEmoji[Number(value)] || '';
                    },
                    font: { size: 22 },
                    color: '#334155'
                },
                grid: { display: false, drawBorder: false }
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: {
                    font: { size: 11 },
                    color: '#475569',
                    maxTicksLimit: 6
                }
            }
        }
    };

    return (
        <div className="dashboard-page-container">
            {/* Sidebar */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={() => navigate('/chat')}
                currentChatId={null}
                userId={currentUser?.uid || 'guest'}
                lang={lang}
            />

            {/* Main Content */}
            <main className="main-content">
                {/* Header Bar */}
                <Navbar
                    pageTitle={t.title || (lang === 'EN' ? "Dashboard" : "Papan Pemuka")}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="dashboard-scroll-area">

                    {/* Welcome Section */}
                    <div className="welcome-section">
                        <h1 className="welcome-h1">
                            {greeting} 👋
                        </h1>
                        <p className="welcome-p">
                            {t.overview}
                        </p>
                    </div>

                    {/* Today's Mood vs Yesterday */}
                    <div className="stats-grid">
                        {/* Card 1: Today's Status */}
                        <div className="card mood-status-card">
                            <div className="card-header-flex">
                                <h3 className="card-title-white">{t.todayMood}</h3>
                                <div className="icon-badge-white">
                                    <CheckCircle size={24} color="white" />
                                </div>
                            </div>

                            {todayEntry ? (
                                <div>
                                    <div className="mood-emoji-large">{todayEntry.emoji}</div>
                                    <div className="mood-label-large">{scoreToLabel[todayEntry.moodScore] || 'Mood'}</div>
                                    <div className="mood-meta-info">
                                        {todayEntries.length > 1 ? (
                                            t.recorded(todayEntries.length)
                                        ) : t.firstCheckin}
                                    </div>
                                    <button
                                        onClick={() => navigate('/check-in')}
                                        className="update-mood-btn"
                                    >
                                        {t.updateMood}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div className="no-mood-emoji">❓</div>
                                    <p className="no-mood-p">
                                        {t.noCheckin}
                                    </p>
                                    <button
                                        onClick={() => navigate('/check-in')}
                                        className="check-in-now-btn"
                                    >
                                        <PlusCircle size={20} />
                                        {t.checkInNow}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent History List */}
                        <div className={`card history-card ${historyView === 'calendar' ? 'hide-scroll' : ''}`}>
                            <div className="card-header-flex">
                                <h3 className="chart-title">{historyView === 'calendar' ? t.calendar : t.history}</h3>
                                <div className="view-toggle-btns">
                                    <button
                                        onClick={() => setHistoryView('list')}
                                        className={`view-btn ${historyView === 'list' ? 'active' : ''}`}
                                        title={t.listView}
                                    >
                                        <List size={18} />
                                    </button>
                                    <button
                                        onClick={() => setHistoryView('calendar')}
                                        className={`view-btn ${historyView === 'calendar' ? 'active' : ''}`}
                                        title={t.calendarView}
                                    >
                                        <Calendar size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="history-scroll">
                                {loading ? (
                                    <div className="history-loading">{t.loading}</div>
                                ) : historyView === 'calendar' ? (
                                    history.length > 0 ? (
                                        <MoodCalendar history={history} />
                                    ) : (
                                        <div className="history-empty">{t.noMoods}</div>
                                    )
                                ) : todayHistoryDesc.length > 0 ? (
                                    <div className="history-list">
                                        {todayHistoryDesc.slice(0, 10).map((entry, index) => (
                                            <button
                                                key={index}
                                                className="history-item"
                                                onClick={() => setSelectedHistoryEntry(entry as MoodEntry)}
                                                type="button"
                                            >
                                                <div className="history-item-emoji">{entry.emoji}</div>
                                                <div className="history-item-content">
                                                    <div className="history-item-label">{scoreToLabel[entry.moodScore]}</div>
                                                    <div className="history-item-date">
                                                        {new Date(entry.timestamp).toLocaleDateString(lang === 'EN' ? 'en-US' : 'ms-MY', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(entry.timestamp).toLocaleTimeString(lang === 'EN' ? 'en-US' : 'ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="history-empty">
                                        {t.noMoodsToday}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Chat CTA / Widget */}
                    <div className="card chat-cta-card">
                        <div className="chat-cta-inner">
                            <div className="chat-cta-header">
                                <div className="chat-cta-icon-wrapper">
                                    <MessageCircle size={32} />
                                </div>
                                <h2 className="chat-cta-title">
                                    {t.chatTitle(todayEntry ? scoreToLabel[todayEntry.moodScore] : undefined)}
                                </h2>
                                <p className="chat-cta-p">
                                    {t.chatSub(todayEntry ? scoreToLabel[todayEntry.moodScore] : undefined)}
                                </p>
                            </div>

                            <div className="chat-cta-input-group">
                                <input
                                    type="text"
                                    placeholder={t.chatPlaceholder}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                            navigate('/chat', { state: { initialMessage: e.currentTarget.value } });
                                        }
                                    }}
                                    className="chat-cta-input"
                                />
                                <button
                                    onClick={(e) => {
                                        const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                                        if (input && input.value.trim()) {
                                            navigate('/chat', { state: { initialMessage: input.value } });
                                        }
                                    }}
                                    className="chat-cta-send-btn"
                                    title={common.sendMessage}
                                    aria-label={common.sendMessage}
                                >
                                    <MessageCircle size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="card chart-card">
                        <div className="chart-header">
                            <div className="flex items-center gap-2">
                                <h3 className="chart-title">{t.timeline}</h3>
                                <button onClick={() => navigate('/weekly-report')} className="report-link-btn">
                                    {t.viewReport}
                                </button>
                            </div>
                            <BarChart2 size={20} color="var(--color-text-sub)" />
                        </div>
                        {todayEntries.length > 0 ? (
                            <div className="chart-container-inner">
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        ) : (
                            <div className="chart-empty">
                                {t.chartEmpty}
                            </div>
                        )}
                    </div>

                    {selectedHistoryEntry && (
                        <div className="history-note-overlay" onClick={() => setSelectedHistoryEntry(null)}>
                            <div className="history-note-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="history-note-header">
                                    <div className="history-note-title-wrap">
                                        <span className="history-note-emoji">{selectedHistoryEntry.emoji}</span>
                                        <div>
                                            <h4 className="history-note-title">
                                                {scoreToLabel[selectedHistoryEntry.moodScore]}
                                            </h4>
                                            <p className="history-note-time">
                                                {new Date(selectedHistoryEntry.timestamp).toLocaleDateString(lang === 'EN' ? 'en-US' : 'ms-MY', { weekday: 'long', month: 'short', day: 'numeric' })} at {new Date(selectedHistoryEntry.timestamp).toLocaleTimeString(lang === 'EN' ? 'en-US' : 'ms-MY', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="history-note-close"
                                        type="button"
                                        onClick={() => setSelectedHistoryEntry(null)}
                                        aria-label="Close note details"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="history-note-body">
                                    <p className="history-note-label">{lang === 'EN' ? 'Saved reason' : 'Sebab disimpan'}</p>
                                    <p className="history-note-text">
                                        {selectedHistoryEntry.note?.trim() || (lang === 'EN' ? 'No note added for this check-in.' : 'Tiada nota ditambah untuk daftar masuk ini.')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Dashboard;

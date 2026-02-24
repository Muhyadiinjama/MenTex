import React from 'react';
import DailyMoodInput from '../components/MoodTracker/DailyMoodInput';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { translations } from '../i18n/translations';

interface MoodTrackerPageProps {
    lang: 'EN' | 'BM';
}

const MoodTrackerPage: React.FC<MoodTrackerPageProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const t = translations[lang].checkin;
    const common = translations[lang].common;

    if (!currentUser) return <div>{common.login}</div>;

    return (
        <div className="dashboard-page-container">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={() => navigate('/chat')}
                currentChatId={null}
                userId={currentUser?.uid || ''}
                lang={lang}
            />

            <main className="main-content">
                <Navbar
                    pageTitle={t.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="dashboard-scroll-area">
                    <div className="max-w-3xl mx-auto py-8">
                        <DailyMoodInput userId={currentUser.uid} lang={lang} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MoodTrackerPage;

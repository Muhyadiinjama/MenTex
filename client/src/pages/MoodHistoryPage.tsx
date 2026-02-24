import React from 'react';
import MoodHistory from '../components/MoodTracker/MoodHistory';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { translations } from '../i18n/translations';

interface MoodHistoryPageProps {
    lang: 'EN' | 'BM';
}

const MoodHistoryPage: React.FC<MoodHistoryPageProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const t = translations[lang].dashboard;
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
                    pageTitle={t.moodHistory}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="dashboard-scroll-area">
                    <div className="max-w-4xl mx-auto py-8">
                        <MoodHistory userId={currentUser.uid} lang={lang} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MoodHistoryPage;

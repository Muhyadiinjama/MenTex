import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportDashboard from '../components/WeeklyReport/ReportDashboard';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../components/WeeklyReport/WeeklyReport.css';
import { translations } from '../i18n/translations';

interface WeeklyReportPageProps {
    lang: 'EN' | 'BM';
}

const WeeklyReportPage: React.FC<WeeklyReportPageProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const t = translations[lang].analytics;
    const common = translations[lang].common;

    if (!currentUser) return <div>{common.login}</div>;

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

                <div className="report-scroll-area">
                    <div className="weekly-report-shell">
                        <ReportDashboard userId={currentUser.uid} lang={lang} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WeeklyReportPage;

import React from 'react';
import { Menu, HelpCircle, MessageSquare, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserNav from './UserNav';
import { useTheme } from '../contexts/ThemeContext';
import './Navbar.css';
import { translations } from '../i18n/translations';

interface NavbarProps {
    pageTitle: string;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    lang: 'EN' | 'BM';
}

const Navbar: React.FC<NavbarProps> = ({ pageTitle, isSidebarOpen, onToggleSidebar, lang }) => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const t = translations[lang].navbar;
    const feedbackFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdw3fG7f299Vcq5RUrdhJjyxfwF_ZW1QwiptQwAoO7EQAKSkQ/viewform?usp=publish-editor';

    return (
        <div className="dashboard-header-bar">
            <div className="dashboard-header-left">
                {!isSidebarOpen && (
                    <button
                        onClick={onToggleSidebar}
                        className="sidebar-toggle-btn"
                        title={t.openSidebar}
                        aria-label={t.openSidebar}
                    >
                        <Menu size={24} />
                    </button>
                )}
                <div className="dashboard-header-brand">
                    <h2 className="dashboard-title-h2">{pageTitle}</h2>
                </div>
            </div>

            <div className="dashboard-header-right">
                <button
                    className="theme-toggle-single-btn"
                    onClick={toggleTheme}
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="nav-actions-group">
                    <a
                        href={feedbackFormUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-feedback-btn"
                        title={t.feedback}
                        aria-label={t.feedback}
                    >
                        <MessageSquare size={16} />
                        <span>{t.feedback}</span>
                    </a>
                    <button className="nav-icon-btn" title={t.help} onClick={() => navigate('/help')}>
                        <HelpCircle size={20} />
                    </button>
                </div>
                <UserNav lang={lang} />
            </div>
        </div>
    );
};

export default Navbar;

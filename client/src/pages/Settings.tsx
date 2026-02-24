import React, { useState } from 'react';
import { Languages } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { updateUserProfile } from '../services/api';
import toast from 'react-hot-toast';
import './Profile.css';
import { translations } from '../i18n/translations';

interface SettingsProps {
    lang: 'EN' | 'BM';
}

const Settings: React.FC<SettingsProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, refreshProfile } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [loading, setLoading] = useState(false);

    const t = translations[lang].settings;

    const handleLanguageChange = async (newLang: 'EN' | 'BM') => {
        if (!currentUser) return;
        setLoading(true);
        try {
            await updateUserProfile(currentUser.uid, { preferredLanguage: newLang });
            await refreshProfile();
            toast.success(t.langUpdated);
        } catch (error) {
            console.error(error);
            toast.error(t.langUpdateError);
        } finally {
            setLoading(false);
        }
    };

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

                <div className="profile-scroll-area">
                    <div className="profile-container">
                        <div className="card">
                            <div className="section-header settings-pref-header">
                                <Languages size={24} color="var(--color-primary)" />
                                <h2 className="profile-name-h2 settings-pref-title">{t.preferences}</h2>
                            </div>
                            <p className="settings-pref-desc">{t.desc}</p>

                            <div className="profile-section settings-section-no-border">
                                <div className="details-list">
                                    <div className="settings-lang-card">
                                        <div className="settings-lang-info">
                                            <div className="settings-lang-label">{t.language}</div>
                                            <div className="settings-lang-current">
                                                {t.currentLang}
                                            </div>
                                        </div>
                                        <button
                                            className="lang-switch-btn profile-lang-btn"
                                            onClick={() => handleLanguageChange(lang === 'EN' ? 'BM' : 'EN')}
                                            disabled={loading}
                                        >
                                            <Languages size={18} />
                                            {t.changeLang}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;

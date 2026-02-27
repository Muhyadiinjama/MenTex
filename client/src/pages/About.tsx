import React, { useState } from 'react';
import { Info, Heart, Shield, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import './About.css';
import { translations } from '../i18n/translations';

interface AboutProps {
    lang: 'EN' | 'BM';
}

const About: React.FC<AboutProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    const t = translations[lang].about;
    // @ts-ignore - translations might not have these nested yet in all types
    const common = translations[lang].common;

    const features = [
        { icon: Sparkles, color: '#0F766E' },
        { icon: Heart, color: '#E11D48' },
        { icon: Shield, color: '#334155' },
        { icon: Info, color: '#0EA5E9' }
    ];

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

                <div className="about-scroll-area">
                    <div className="about-container">

                        {/* Hero Section */}
                        <section className="about-hero-card card highlight-card">
                            <div className="about-logo-meta">
                                <img
                                    src={theme === 'dark' ? "/branding/logo-dark.png" : "/branding/main logo.png"}
                                    alt={t.logoAlt}
                                    className="about-large-logo"
                                />
                            </div>
                            <h1 className="about-title-h1">{t.title}</h1>
                            <p className="about-subtitle">{t.subtitle}</p>
                            <div className="about-divider"></div>
                            <p className="about-description-text">{t.description}</p>
                        </section>

                        <div className="about-grid">
                            {/* Mission Section */}
                            <section className="about-mission-section card">
                                <div className="about-badge-icon">
                                    <Heart size={24} color="var(--color-primary)" />
                                </div>
                                <h2 className="about-section-h2">{t.mission}</h2>
                                <p className="about-mission-p">{t.missionText}</p>
                            </section>

                            {/* Features List */}
                            <section className="about-features-section card">
                                <h2 className="about-section-h2">{translations[lang].sidebar.menu}</h2>
                                <div className="about-features-list">
                                    {t.features.map((feature: string, idx: number) => {
                                        const featureData = features[idx % features.length];
                                        return (
                                            <div key={idx} className="about-feature-item">
                                                <div className={`feature-check icon-color-${idx % features.length}`}>
                                                    <featureData.icon size={20} />
                                                </div>
                                                <span className="feature-text">{feature}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        </div>

                        <div className="about-version-footer">
                            <p className="about-footer-version-text">MenTex {t.version}</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;

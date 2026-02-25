import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/api';
import './Landing.css';
import { translations } from '../i18n/translations';

interface LandingProps {
    lang: 'EN' | 'BM';
    setLang: (lang: 'EN' | 'BM') => void;
}

const Landing: React.FC<LandingProps> = ({ lang, setLang }) => {
    const navigate = useNavigate();
    const { currentUser, refreshProfile } = useAuth();
    const [greeting, setGreeting] = useState('');

    const handleLangToggle = async () => {
        const newLang = lang === 'EN' ? 'BM' : 'EN';
        setLang(newLang);

        if (currentUser) {
            try {
                await updateUserProfile(currentUser.uid, { preferredLanguage: newLang });
                await refreshProfile();
            } catch (err) {
                console.error("Failed to persist language choice", err);
            }
        }
    };

    const t = translations[lang].landing;
    const common = translations[lang].common;

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            let baseGreeting = "";
            const firstName = currentUser?.displayName?.split(' ')[0];

            if (hour >= 5 && hour < 12) baseGreeting = t.morning;
            else if (hour >= 12 && hour < (lang === 'EN' ? 17 : 14)) baseGreeting = t.afternoon;
            else if (hour >= (lang === 'EN' ? 17 : 14) && hour < (lang === 'EN' ? 21 : 19)) baseGreeting = t.evening;
            else baseGreeting = t.night;

            setGreeting(firstName ? `${baseGreeting}, ${firstName}` : `${baseGreeting}.`);
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [lang, currentUser, t]);

    const handleStart = () => {
        if (currentUser) {
            navigate('/check-in');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="landing-container">
            {/* Background elements */}
            <div className="landing-bg-decor" />
            <div className="landing-bg-decor landing-bg-decor-2" />
            <div className="landing-bg-grid" />

            <div className="lang-switch-container">
                <button
                    onClick={handleLangToggle}
                    className="lang-switch-btn"
                >
                    <Globe size={16} />
                    {lang === 'EN' ? 'Bahasa' : 'English'}
                </button>
            </div>

            <section className="landing-hero">
                <div className="landing-logo-container landing-reveal-1">
                    <img src="/branding/main logo.png" alt="MenTex Logo" className="landing-main-logo" />
                </div>

                <h1 className="landing-h1 landing-reveal-2">
                    {greeting}
                </h1>

                <p className="landing-p landing-reveal-3">
                    {currentUser ? t.welcomeBack(currentUser.displayName?.split(' ')[0] || common.user) : t.sub}
                </p>

                <button className="btn-primary landing-cta landing-reveal-4" onClick={handleStart}>
                    {currentUser ? t.btnDashboard : t.btnStart}
                </button>
            </section>

        </div>
    );
};

export default Landing;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShieldCheck,
    LockKeyhole,
    BrainCircuit,
    CheckCircle2,
    MessageCircleHeart,
    BarChart3,
    Shield,
    Stethoscope,
    ArrowRight
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { translations } from '../i18n/translations';
import './About.css';

interface AboutProps {
    lang: 'EN' | 'BM';
}

const About: React.FC<AboutProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    const t = translations[lang].about;

    const sdgItems = [
        { title: t.sdg.allAges.title, desc: t.sdg.allAges.desc },
        { title: t.sdg.proactive.title, desc: t.sdg.proactive.desc },
        { title: t.sdg.cost.title, desc: t.sdg.cost.desc },
        { title: t.sdg.therapist.title, desc: t.sdg.therapist.desc },
        { title: t.sdg.availability.title, desc: t.sdg.availability.desc },
        { title: t.sdg.privacy.title, desc: t.sdg.privacy.desc }
    ];

    const steps = [
        {
            title: t.flow.step1.title,
            desc: t.flow.step1.desc,
            path: '/check-in'
        },
        {
            title: t.flow.step2.title,
            desc: t.flow.step2.desc,
            path: '/weekly-report'
        },
        {
            title: t.flow.step3.title,
            desc: t.flow.step3.desc,
            path: '/my-therapist',
            goal: true
        }
    ];

    const features = [
        {
            icon: MessageCircleHeart,
            title: t.features.ai.title,
            desc: t.features.ai.desc,
            path: '/chat'
        },
        {
            icon: BarChart3,
            title: t.features.analytics.title,
            desc: t.features.analytics.desc,
            path: '/weekly-report'
        },
        {
            icon: Shield,
            title: t.features.secure.title,
            desc: t.features.secure.desc,
            path: '/check-in'
        },
        {
            icon: Stethoscope,
            title: t.features.resources.title,
            desc: t.features.resources.desc,
            path: '/help'
        }
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

                <div className="about-v2-scroll">
                    <div className="about-v2-wrap">
                        <section className={`about-v2-hero about-reveal ${theme === 'dark' ? 'hero-dark' : 'hero-light'}`}>
                            <img
                                src={theme === 'dark' ? '/branding/logo-dark.png' : '/branding/main logo.png'}
                                alt="MenTex"
                                className="about-v2-logo"
                            />
                            <h1>{t.headline}</h1>
                            <p>{t.subtitle}</p>
                            <div className="about-v2-badges">
                                <span><ShieldCheck size={14} /> {t.badges.sdg}</span>
                                <span><LockKeyhole size={14} /> {t.badges.private}</span>
                                <span><BrainCircuit size={14} /> {t.badges.ai}</span>
                            </div>
                        </section>

                        <section className="about-v2-section about-reveal about-reveal-delay-1">
                            <h2>{t.mission.title}</h2>
                            <div className="about-v2-mission-grid">
                                <article className="about-v2-card">
                                    <h3>🎯 {t.mission.purpose.title}</h3>
                                    <p>{t.mission.purpose.body}</p>
                                </article>
                                <article className="about-v2-card">
                                    <h3>🌐 {t.mission.access.title}</h3>
                                    <p>{t.mission.access.body}</p>
                                </article>
                                <article className="about-v2-card">
                                    <h3>💰 {t.mission.cost.title}</h3>
                                    <p>{t.mission.cost.body}</p>
                                </article>
                            </div>
                        </section>

                        <section id="how-it-works" className="about-v2-section about-reveal about-reveal-delay-2">
                            <h2>{t.flow.title}</h2>
                            <div className="about-v2-flow">
                                <button className="flow-step flow-step-click" onClick={() => navigate(steps[0].path)}>
                                    <div className="flow-step-num">1</div>
                                    <h4>{steps[0].title}</h4>
                                    <p>{steps[0].desc}</p>
                                    <span className="flow-step-arrow">→</span>
                                </button>
                                <ArrowRight className="flow-arrow flow-arrow-desktop" />
                                <ArrowRight className="flow-arrow flow-arrow-mobile" />
                                <button className="flow-step flow-step-click" onClick={() => navigate(steps[1].path)}>
                                    <div className="flow-step-num">2</div>
                                    <h4>{steps[1].title}</h4>
                                    <p>{steps[1].desc}</p>
                                    <span className="flow-step-arrow">→</span>
                                </button>
                                <ArrowRight className="flow-arrow flow-arrow-desktop" />
                                <ArrowRight className="flow-arrow flow-arrow-mobile" />
                                <button className="flow-step flow-step-goal flow-step-click" onClick={() => navigate(steps[2].path)}>
                                    <div className="flow-step-num">3</div>
                                    <h4>{steps[2].title}</h4>
                                    <p>{steps[2].desc}</p>
                                    <span className="flow-step-arrow">→</span>
                                </button>
                            </div>
                        </section>

                        <section className="about-v2-section about-reveal about-reveal-delay-3">
                            <h2>{t.sdg.title}</h2>
                            <div className="about-v2-sdg-grid">
                                {sdgItems.map((item, index) => (
                                    <div key={item.title} className={`sdg-row ${index % 2 === 0 ? 'sdg-even' : 'sdg-odd'}`}>
                                        <CheckCircle2 size={16} />
                                        <div className="sdg-content">
                                            <span>{item.title}</span>
                                            <p>{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="about-v2-section about-reveal about-reveal-delay-4">
                            <h2>{t.features.title}</h2>
                            <div className="about-v2-bento">
                                {features.map((feature) => (
                                    <button key={feature.title} className="bento-cell bento-cell-click" onClick={() => navigate(feature.path)}>
                                        <feature.icon size={18} />
                                        <h4>{feature.title}</h4>
                                        <p>{feature.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </section>

                        <section className="about-v2-cta about-reveal about-reveal-delay-5">
                            <h3>{t.cta.title}</h3>
                            <div className="about-v2-cta-actions">
                                <button onClick={() => navigate('/check-in')}>{t.cta.checkin}</button>
                                <a href="#how-it-works">{t.cta.how}</a>
                            </div>
                        </section>

                        <footer className="about-footer about-reveal about-reveal-delay-5">
                            <p>Powered by <span>Onebit Team</span></p>
                            <span className="version-tag">v1.3.0</span>
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;

import React, { useMemo, useState } from 'react';
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
import './About.css';

interface AboutProps {
    lang: 'EN' | 'BM';
}

const About: React.FC<AboutProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { theme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    const copy = useMemo(() => {
        if (lang === 'BM') {
            return {
                'about.hero.headline': 'Mendemokrasikan Kesejahteraan Mental Untuk Setiap Generasi',
                'about.hero.subtitle': 'MenTex menyokong SDG 3 dengan menjadikan sokongan mental lebih awal, selamat, dan mudah dicapai.',
                'about.badge.sdg': 'SDG Goal 3',
                'about.badge.private': 'Private & Encrypted',
                'about.badge.ai': 'AI + Human Backed',
                'about.mission.title': 'Misi Kami',
                'about.mission.purpose.title': 'Clear Purpose',
                'about.mission.purpose.body': 'Membantu pengguna memahami corak emosi lebih awal sebelum krisis berlaku.',
                'about.mission.access.title': 'Accessibility for All',
                'about.mission.access.body': 'Direka untuk semua peringkat umur dengan pengalaman yang mudah dan mesra.',
                'about.mission.cost.title': 'Affordable Care',
                'about.mission.cost.body': 'Menurunkan halangan kos untuk sokongan kesihatan mental harian.',
                'about.flow.title': 'AI-Driven. Human-Backed.',
                'about.flow.step1': 'Daily Check-ins',
                'about.flow.step2': 'Smart Analytics',
                'about.flow.step3': 'Therapist Ready',
                'about.sdg.title': 'Our Commitment to SDG Goal 3',
                'about.sdg.allAges': 'All-Age Design',
                'about.sdg.proactive': 'Proactive Intervention',
                'about.sdg.cost': 'Cost Reduction',
                'about.sdg.therapist': 'Therapist Integration',
                'about.sdg.availability': '24/7 Availability',
                'about.sdg.privacy': 'Private & Encrypted',
                'about.features.title': 'What MenTex Delivers',
                'about.features.ai': 'AI Conversations',
                'about.features.analytics': 'Mood Analytics',
                'about.features.secure': 'Secure Check-ins',
                'about.features.resources': 'Professional Resources',
                'about.cta.title': 'Start Your Wellness Journey Today',
                'about.cta.checkin': 'Start Daily Check-in',
                'about.cta.how': 'See How It Works'
            };
        }
        return {
            'about.hero.headline': 'Democratizing Mental Wellness for Every Generation',
            'about.hero.subtitle': 'MenTex aligns with UN SDG Goal 3 by making mental wellness support early, private, and accessible.',
            'about.badge.sdg': 'SDG Goal 3',
            'about.badge.private': 'Private & Encrypted',
            'about.badge.ai': 'AI + Human Backed',
            'about.mission.title': 'Our Mission',
            'about.mission.purpose.title': 'Clear Purpose',
            'about.mission.purpose.body': 'Help people detect emotional patterns early before they become crises.',
            'about.mission.access.title': 'Accessibility for All',
            'about.mission.access.body': 'Built for every age group with a simple, compassionate experience.',
            'about.mission.cost.title': 'Affordable Care',
            'about.mission.cost.body': 'Lower the cost barriers that block people from getting regular support.',
            'about.flow.title': 'AI-Driven. Human-Backed.',
            'about.flow.step1': 'Daily Check-ins',
            'about.flow.step2': 'Smart Analytics',
            'about.flow.step3': 'Therapist Ready',
            'about.sdg.title': 'Our Commitment to SDG Goal 3',
            'about.sdg.allAges': 'All-Age Design',
            'about.sdg.proactive': 'Proactive Intervention',
            'about.sdg.cost': 'Cost Reduction',
            'about.sdg.therapist': 'Therapist Integration',
            'about.sdg.availability': '24/7 Availability',
            'about.sdg.privacy': 'Private & Encrypted',
            'about.features.title': 'What MenTex Delivers',
            'about.features.ai': 'AI Conversations',
            'about.features.analytics': 'Mood Analytics',
            'about.features.secure': 'Secure Check-ins',
            'about.features.resources': 'Professional Resources',
            'about.cta.title': 'Start Your Wellness Journey Today',
            'about.cta.checkin': 'Start Daily Check-in',
            'about.cta.how': 'See How It Works'
        };
    }, [lang]);

    const t = (key: string) => copy[key as keyof typeof copy] || key;
    const sdgItems = [
        { title: t('about.sdg.allAges'), desc: 'Simple UI accessible for students to seniors.' },
        { title: t('about.sdg.proactive'), desc: 'Spot patterns before they become crises.' },
        { title: t('about.sdg.cost'), desc: 'Lower the financial barrier to mental support.' },
        { title: t('about.sdg.therapist'), desc: 'Make real-world therapy more efficient.' },
        { title: t('about.sdg.availability'), desc: 'Support that never sleeps or judges.' },
        { title: t('about.sdg.privacy'), desc: 'Your data belongs only to you.' }
    ];

    const steps = [
        {
            title: t('about.flow.step1'),
            desc: 'Log your mood and thoughts in seconds. Our AI listens without judgment, 24 hours a day.',
            path: '/check-in'
        },
        {
            title: t('about.flow.step2'),
            desc: 'MenTex detects patterns in your emotions over time and generates a clear weekly wellness report automatically.',
            path: '/weekly-report'
        },
        {
            title: t('about.flow.step3'),
            desc: 'Share your report directly with your therapist before your session. Turn check-ins into data your doctor can use.',
            path: '/my-therapist',
            goal: true
        }
    ];

    const features = [
        {
            icon: MessageCircleHeart,
            title: t('about.features.ai'),
            desc: 'Empathetic, real-time dialogue available 24/7. Our AI understands context and responds with care.',
            path: '/chat'
        },
        {
            icon: BarChart3,
            title: t('about.features.analytics'),
            desc: 'Visualize your emotional journey over days and weeks. Understand the why behind how you feel.',
            path: '/weekly-report'
        },
        {
            icon: Shield,
            title: t('about.features.secure'),
            desc: 'End-to-end encryption keeps your journal completely private. Nobody sees your data without your permission.',
            path: '/check-in'
        },
        {
            icon: Stethoscope,
            title: t('about.features.resources'),
            desc: 'Direct access to global helplines, therapist directories, and one-click report sharing with your doctor.',
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
                    pageTitle={lang === 'BM' ? 'Mengenai MenTex' : 'About MenTex'}
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
                            <h1>{t('about.hero.headline')}</h1>
                            <p>{t('about.hero.subtitle')}</p>
                            <div className="about-v2-badges">
                                <span><ShieldCheck size={14} /> {t('about.badge.sdg')}</span>
                                <span><LockKeyhole size={14} /> {t('about.badge.private')}</span>
                                <span><BrainCircuit size={14} /> {t('about.badge.ai')}</span>
                            </div>
                        </section>

                        <section className="about-v2-section about-reveal about-reveal-delay-1">
                            <h2>{t('about.mission.title')}</h2>
                            <div className="about-v2-mission-grid">
                                <article className="about-v2-card">
                                    <h3>🎯 {t('about.mission.purpose.title')}</h3>
                                    <p>{t('about.mission.purpose.body')}</p>
                                </article>
                                <article className="about-v2-card">
                                    <h3>🌐 {t('about.mission.access.title')}</h3>
                                    <p>{t('about.mission.access.body')}</p>
                                </article>
                                <article className="about-v2-card">
                                    <h3>💰 {t('about.mission.cost.title')}</h3>
                                    <p>{t('about.mission.cost.body')}</p>
                                </article>
                            </div>
                        </section>

                        <section id="how-it-works" className="about-v2-section about-reveal about-reveal-delay-2">
                            <h2>{t('about.flow.title')}</h2>
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
                            <h2>{t('about.sdg.title')}</h2>
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
                            <h2>{t('about.features.title')}</h2>
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
                            <h3>{t('about.cta.title')}</h3>
                            <div className="about-v2-cta-actions">
                                <button onClick={() => navigate('/check-in')}>{t('about.cta.checkin')}</button>
                                <a href="#how-it-works">{t('about.cta.how')}</a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About;

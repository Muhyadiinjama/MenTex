import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, ShieldAlert, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Help.css';
import { translations } from '../i18n/translations';

interface HelpProps {
    lang: 'EN' | 'BM';
}

const Help: React.FC<HelpProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const t = translations[lang].helpPage;

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

                <div className="help-scroll-area">
                    <div className="help-container">
                        <section className="help-crisis-banner">
                            <div className="crisis-title-wrap">
                                <ShieldAlert size={20} />
                                <h2>{t.crisis.title}</h2>
                            </div>
                            <p className="crisis-subtitle">{t.crisis.subtitle}</p>
                            <div className="crisis-links-grid">
                                <a href="tel:15555" className="crisis-link-card">
                                    <span><Phone size={16} /> Talian HEAL (MOH)</span>
                                    <span className="crisis-action">{t.crisis.call} 15555</span>
                                </a>
                                <a href="tel:+60376272929" className="crisis-link-card">
                                    <span><Phone size={16} /> Befrienders Kuala Lumpur</span>
                                    <span className="crisis-action">{t.crisis.call} +60 3-7627 2929</span>
                                </a>
                            </div>
                            <div className="support-ref-links">
                                <a
                                    className="website-card-link"
                                    href="https://findahelpline.com/organizations/talian-heal-help-with-empathy-and-love-15555"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Talian HEAL {t.crisis.website}</span>
                                    <ExternalLink size={14} />
                                </a>
                                <a
                                    className="website-card-link"
                                    href="https://www.befrienders.org.my"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Befrienders {t.crisis.website}</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </section>

                        <section className="card help-card">
                            <h3 className="help-section-title">{t.faqTitle}</h3>
                            <div className="faq-list">
                                {t.faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div className="faq-item" key={idx}>
                                            <button className="faq-question" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                                                <span>{faq.q}</span>
                                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                            {isOpen && <p className="faq-answer">{faq.a}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Help;

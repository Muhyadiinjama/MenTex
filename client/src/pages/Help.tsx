import React, { useState } from 'react';
import { Phone, ChevronDown, ChevronUp, ShieldAlert, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Help.css';

interface HelpProps {
    lang: 'EN' | 'BM';
}

const faqs = [
    {
        q: "How do I add my therapist's information?",
        a: 'Open My Therapist from the profile menu, tap Edit, fill in details, then Save.'
    },
    {
        q: 'How do I send my weekly report to my therapist?',
        a: 'Go to Analytics, review the brief, tap Send to Therapist, and confirm Send Report.'
    },
    {
        q: 'Is my data private and secure?',
        a: 'Your data is private to your account. Sharing only happens when you explicitly approve it.'
    },
    {
        q: 'How does the mood tracker work?',
        a: 'Daily check-ins build your mood history and weekly analytics insights.'
    },
    {
        q: 'What does the risk level mean?',
        a: 'Risk level reflects emotional strain based on mood trend, volatility, and report signals.'
    },
    {
        q: 'How do I delete my account or data?',
        a: 'Email support@mentex.app from your registered email and request deletion.'
    },
    {
        q: 'Can my therapist see my journal entries?',
        a: 'No. Therapists only see the brief that you preview and approve before sending.'
    },
    {
        q: 'What do I do if I feel the AI insight is wrong?',
        a: 'Use Send Feedback and rely on professional advice where needed.'
    }
];

const Help: React.FC<HelpProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

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
                    pageTitle={lang === 'BM' ? 'Bantuan & Sokongan' : 'Help & Support'}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="help-scroll-area">
                    <div className="help-container">
                        <section className="help-crisis-banner">
                            <div className="crisis-title-wrap">
                                <ShieldAlert size={20} />
                                <h2>Immediate Help (Malaysia)</h2>
                            </div>
                            <p className="crisis-subtitle">If you are in danger now, call emergency services immediately.</p>
                            <div className="crisis-links-grid">
                                <a href="tel:15555" className="crisis-link-card">
                                    <span><Phone size={16} /> Talian HEAL (MOH)</span>
                                    <span className="crisis-action">Call 15555</span>
                                </a>
                                <a href="tel:+60376272929" className="crisis-link-card">
                                    <span><Phone size={16} /> Befrienders Kuala Lumpur</span>
                                    <span className="crisis-action">Call +60 3-7627 2929</span>
                                </a>
                            </div>
                            <div className="support-ref-links">
                                <a
                                    className="website-card-link"
                                    href="https://findahelpline.com/organizations/talian-heal-help-with-empathy-and-love-15555"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Talian HEAL website</span>
                                    <ExternalLink size={14} />
                                </a>
                                <a
                                    className="website-card-link"
                                    href="https://www.befrienders.org.my"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>Befrienders website</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </section>

                        <section className="card help-card">
                            <h3 className="help-section-title">Frequently Asked Questions</h3>
                            <div className="faq-list">
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div className="faq-item" key={faq.q}>
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

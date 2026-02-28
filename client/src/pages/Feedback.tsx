import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User, Image, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Contact.css'; // Reusing Contact.css for consistency
import { translations } from '../i18n/translations';
import toast from 'react-hot-toast';
import { sendContactMessage } from '../services/api';

interface FeedbackProps {
    lang: 'EN' | 'BM';
}

const Feedback: React.FC<FeedbackProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, profile } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: profile?.name || currentUser?.displayName || '',
        email: currentUser?.email || '',
        subject: 'Send Feedback',
        message: '',
        screenshot: null as File | null
    });

    const t = translations[lang].feedback;
    const tContact = translations[lang].contact;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, screenshot: file }));
        }
    };

    const removeScreenshot = () => {
        setFormData(prev => ({ ...prev, screenshot: null }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submissionData = new FormData();
            submissionData.append('name', formData.name);
            submissionData.append('email', formData.email);
            submissionData.append('subject', formData.subject);
            submissionData.append('message', formData.message);

            if (formData.screenshot) {
                submissionData.append('screenshot', formData.screenshot);
            }

            await sendContactMessage(submissionData);

            toast.success(t.success);
            setFormData(prev => ({
                ...prev,
                message: '',
                screenshot: null
            }));
        } catch (error: any) {
            console.error('Feedback error:', error);
            const errorMsg = error.response?.data?.details || error.message || t.error;
            toast.error(errorMsg);
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

                <div className="contact-scroll-area">
                    <div className="contact-container">

                        <div className="contact-hero-section">
                            <h1 className="contact-title-h1">{t.title}</h1>
                            <p className="contact-subtitle">{t.subtitle}</p>
                        </div>

                        <div className="contact-grid">
                            {/* Feedback Form */}
                            <div className="card contact-form-card">
                                <h2 className="contact-form-title">{t.formTitle}</h2>
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="input-group-vertical">
                                        <label className="contact-label">{tContact.name}</label>
                                        <div className="input-with-icon">
                                            <User size={18} className="field-icon" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={tContact.name}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{tContact.email}</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} className="field-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={tContact.email}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{tContact.subject}</label>
                                        <div className="input-with-icon">
                                            <MessageSquare size={18} className="field-icon" />
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                readOnly
                                                required
                                                title={tContact.subject}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{tContact.message}</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder={t.placeholder}
                                            className="contact-textarea"
                                        />
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{tContact.uploadScreenshot}</label>
                                        <div className="screenshot-upload-wrapper">
                                            {!formData.screenshot ? (
                                                <label className="screenshot-dropzone">
                                                    <Image size={24} />
                                                    <span>{tContact.screenshotSubtitle}</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden-file-input"
                                                    />
                                                </label>
                                            ) : (
                                                <div className="screenshot-preview-card">
                                                    <div className="preview-info">
                                                        <Image size={20} className="preview-icon" />
                                                        <div className="preview-details">
                                                            <p className="preview-name">{formData.screenshot.name}</p>
                                                            <p className="preview-size">{(formData.screenshot.size / 1024).toFixed(1)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeScreenshot}
                                                        className="remove-screenshot-btn"
                                                        title={tContact.remove}
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} className="btn-primary contact-submit-btn">
                                        {loading ? tContact.sending : "Send Feedback"}
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>

                            {/* Info Card */}
                            <div className="contact-info-column">
                                <div className="card contact-info-card">
                                    <h3 className="info-card-title">{lang === 'EN' ? "Why your feedback matters" : "Mengapa maklum balas anda penting"}</h3>
                                    <div className="info-item">
                                        <div className="info-icon-box info-icon-box-heart">
                                            <Heart size={20} />
                                        </div>
                                        <div className="info-content">
                                            <p className="info-label">{lang === 'EN' ? "Community Driven" : "Didorong Komuniti"}</p>
                                            <p className="info-text info-text-small">
                                                {lang === 'EN'
                                                    ? "We build MenTex for you. Your suggestions directly influence our feature roadmap."
                                                    : "Kami membina MenTex untuk anda. Cadangan anda mempengaruhi terus hala tuju ciri kami."}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="info-divider"></div>
                                    <p className="info-text">
                                        {lang === 'EN'
                                            ? "We review every piece of feedback to make MenTex better for everyone."
                                            : "Kami menyemak setiap maklum balas untuk menjadikan MenTex lebih baik untuk semua orang."}
                                    </p>
                                </div>

                                <div className="contact-cta-card card">
                                    <h3 className="info-card-title">{tContact.directEmail}</h3>
                                    <p className="info-text">
                                        {lang === 'EN'
                                            ? "Prefer email? Reach out to us directly."
                                            : "Lebih suka emel? Hubungi kami terus."}
                                    </p>
                                    <a href="mailto:onebitdevelopers@gmail.com" className="btn-secondary contact-mini-cta contact-email-link">
                                        <Mail size={16} />
                                        onebitdevelopers@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Feedback;

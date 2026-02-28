import React, { useState } from 'react';
import { Mail, MessageSquare, Send, User, ChevronRight, Image, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './Contact.css';
import { translations } from '../i18n/translations';
import toast from 'react-hot-toast';
import { sendContactMessage } from '../services/api';

interface ContactProps {
    lang: 'EN' | 'BM';
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, profile } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: profile?.name || currentUser?.displayName || '',
        email: currentUser?.email || '',
        subject: '',
        message: '',
        customSubject: '',
        screenshot: null as File | null
    });

    const t = translations[lang].contact;

    const categoriesWithScreenshots = [
        t.subjects.report,
        t.subjects.feedback,
        t.subjects.improvement
    ];

    const showScreenshotUpload = categoriesWithScreenshots.includes(formData.subject);

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
            const finalSubject = formData.subject === 'CUSTOM' ? formData.customSubject : formData.subject;

            const submissionData = new FormData();
            submissionData.append('name', formData.name);
            submissionData.append('email', formData.email);
            submissionData.append('subject', finalSubject);
            submissionData.append('message', formData.message);

            if (formData.screenshot) {
                submissionData.append('screenshot', formData.screenshot);
            }

            await sendContactMessage(submissionData);
            toast.success(t.success);
            setFormData(prev => ({
                ...prev,
                subject: '',
                message: '',
                customSubject: '',
                screenshot: null
            }));
        } catch (error: any) {
            console.error('Contact error:', error);
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
                            <div className="card contact-form-card">
                                <h2 className="contact-form-title">{t.formTitle}</h2>
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="input-group-vertical">
                                        <label className="contact-label">{t.name}</label>
                                        <div className="input-with-icon">
                                            <User size={18} className="field-icon" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t.name}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{t.email}</label>
                                        <div className="input-with-icon">
                                            <Mail size={18} className="field-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={t.email}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{t.subject}</label>
                                        <div className="input-with-icon">
                                            <MessageSquare size={18} className="field-icon" />
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="contact-select"
                                                required
                                                title={t.subject}
                                            >
                                                <option value="" disabled>{t.subject}</option>
                                                <option value={t.subjects.report}>{t.subjects.report}</option>
                                                <option value={t.subjects.feedback}>{t.subjects.feedback}</option>
                                                <option value={t.subjects.improvement}>{t.subjects.improvement}</option>
                                                <option value={t.subjects.others}>{t.subjects.others}</option>
                                                <option value="CUSTOM">{t.subjects.custom}</option>
                                            </select>
                                        </div>
                                    </div>

                                    {formData.subject === 'CUSTOM' && (
                                        <div className="input-group-vertical animate-slide-down">
                                            <label className="contact-label">{t.subjects.custom}</label>
                                            <div className="input-with-icon">
                                                <MessageSquare size={18} className="field-icon" />
                                                <input
                                                    type="text"
                                                    name="customSubject"
                                                    onChange={handleChange}
                                                    required
                                                    placeholder={t.subjects.custom}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {showScreenshotUpload && (
                                        <div className="input-group-vertical animate-slide-down">
                                            <label className="contact-label">{t.uploadScreenshot}</label>
                                            <div className="screenshot-upload-wrapper">
                                                {!formData.screenshot ? (
                                                    <label className="screenshot-dropzone">
                                                        <Image size={24} />
                                                        <span>{t.screenshotSubtitle}</span>
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
                                                            title={t.remove}
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="input-group-vertical">
                                        <label className="contact-label">{t.message}</label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={5}
                                            placeholder={t.message}
                                            className="contact-textarea"
                                        />
                                    </div>

                                    <button type="submit" disabled={loading} className="btn-primary contact-submit-btn">
                                        {loading ? t.sending : t.send}
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>

                            <div className="contact-info-column">
                                <div className="card contact-info-card">
                                    <h3 className="info-card-title">{t.directEmail}</h3>
                                    <div className="info-item">
                                        <div className="info-icon-box">
                                            <Mail size={20} />
                                        </div>
                                        <div className="info-content">
                                            <p className="info-label">Email</p>
                                            <a href="mailto:onebitdevelopers@gmail.com" className="info-link">onebitdevelopers@gmail.com</a>
                                        </div>
                                    </div>
                                    <div className="info-divider"></div>
                                    <p className="info-text">
                                        {t.responseNotice}
                                    </p>
                                </div>

                                <div className="contact-cta-card card">
                                    <h3 className="info-card-title">{translations[lang].sidebar.checkin}</h3>
                                    <p className="info-text">
                                        {t.ctaNotice}
                                    </p>
                                    <button onClick={() => navigate('/check-in')} className="btn-secondary contact-mini-cta">
                                        {translations[lang].sidebar.checkin}
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Contact;

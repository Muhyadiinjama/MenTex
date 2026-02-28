import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, PencilLine, Save, Calendar, Phone, Mail, Building2, NotebookPen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/api';
import { translations } from '../i18n/translations';
import './MyTherapist.css';

interface MyTherapistProps {
    lang: 'EN' | 'BM';
}

type TherapistForm = {
    fullName: string;
    email: string;
    phone: string;
    clinicName: string;
    sessionSchedule: string;
    nextSessionDate: string;
    privateNotes: string;
};

const emptyForm: TherapistForm = {
    fullName: '',
    email: '',
    phone: '',
    clinicName: '',
    sessionSchedule: '',
    nextSessionDate: '',
    privateNotes: ''
};

const MyTherapist: React.FC<MyTherapistProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, profile, refreshProfile } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState<TherapistForm>(emptyForm);

    const t = translations[lang].therapist;

    useEffect(() => {
        const therapist = profile?.therapist;
        if (!therapist) {
            setForm(emptyForm);
            return;
        }
        setForm({
            fullName: therapist.fullName || '',
            email: therapist.email || '',
            phone: therapist.phone || '',
            clinicName: therapist.clinicName || '',
            sessionSchedule: therapist.sessionSchedule || '',
            nextSessionDate: therapist.nextSessionDate || '',
            privateNotes: therapist.privateNotes || ''
        });
    }, [profile?.therapist]);

    if (!currentUser) {
        return null;
    }

    const hasTherapist = Boolean(profile?.therapist?.fullName && profile?.therapist?.email);

    const handleSave = async () => {
        if (!form.fullName.trim() || !form.email.trim()) {
            toast.error(t.toast.required);
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile(currentUser.uid, { therapist: form });
            await refreshProfile();
            toast.success(t.toast.saved);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error(t.toast.saveFailed);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!currentUser) return;
        const confirmed = window.confirm(t.toast.deleteConfirm);
        if (!confirmed) return;
        setSaving(true);
        try {
            await updateUserProfile(currentUser.uid, {
                therapist: emptyForm,
                therapistReport: { lastSentAt: '' }
            });
            setForm(emptyForm);
            setIsEditing(false);
            await refreshProfile();
            toast.success(t.toast.deleted);
        } catch (error) {
            console.error(error);
            toast.error(t.toast.deleteFailed);
        } finally {
            setSaving(false);
        }
    };

    const renderValue = (label: string, value: string | undefined, fullWidth: boolean = false) => (
        <div className={`therapist-view-item ${fullWidth ? 'therapist-view-item-full' : ''}`}>
            <p className="therapist-view-label">{label}</p>
            <p className={`therapist-view-value ${!value?.trim() ? 'placeholder' : ''}`}>
                {value?.trim() ? value : t.notProvided}
            </p>
        </div>
    );

    return (
        <div className="dashboard-page-container">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={() => navigate('/chat')}
                currentChatId={null}
                userId={currentUser.uid}
                lang={lang}
            />
            <main className="main-content">
                <Navbar
                    pageTitle={t.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="therapist-scroll-area">
                    <div className="therapist-container">
                        <section className="therapist-card animate-fade-in">
                            <div className="therapist-header">
                                <div className="therapist-heading-wrap">
                                    <div>
                                        <h2 className="therapist-title">{t.heading}</h2>
                                        <p className="therapist-subtitle">{t.subtitle}</p>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <div id="therapist-header-actions">
                                        {hasTherapist && (
                                            <button
                                                id="therapist-delete-btn"
                                                onClick={handleDelete}
                                                title={t.actions.delete}
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        )}
                                        <button
                                            id="therapist-edit-btn"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <PencilLine size={20} />
                                            <span>{t.actions.edit}</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!hasTherapist && !isEditing ? (
                                <div className="therapist-empty-state animate-reveal">
                                    <p>{t.emptyState}</p>
                                    <p>{t.emptyAction}</p>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        {t.addTherapist}
                                    </button>
                                </div>
                            ) : isEditing ? (
                                <form
                                    className="therapist-form-grid animate-reveal"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSave();
                                    }}
                                >
                                    <label className="therapist-field">
                                        <span><Stethoscope size={16} /> {t.labels.name}</span>
                                        <input
                                            value={form.fullName}
                                            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Mail size={16} /> {t.labels.email}</span>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                            placeholder="doctor@example.com"
                                            required
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Phone size={16} /> {t.labels.phone}</span>
                                        <input
                                            value={form.phone}
                                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+60..."
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Building2 size={16} /> {t.labels.clinic}</span>
                                        <input
                                            value={form.clinicName}
                                            onChange={(e) => setForm((prev) => ({ ...prev, clinicName: e.target.value }))}
                                            placeholder="Clinic Name"
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Calendar size={16} /> {t.labels.schedule}</span>
                                        <input
                                            placeholder="Every Tuesday at 3:00 PM"
                                            value={form.sessionSchedule}
                                            onChange={(e) => setForm((prev) => ({ ...prev, sessionSchedule: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Calendar size={16} /> {t.labels.nextSession}</span>
                                        <input
                                            type="date"
                                            value={form.nextSessionDate}
                                            onChange={(e) => setForm((prev) => ({ ...prev, nextSessionDate: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field therapist-field-full">
                                        <span><NotebookPen size={16} /> {t.labels.notes}</span>
                                        <textarea
                                            rows={4}
                                            value={form.privateNotes}
                                            onChange={(e) => setForm((prev) => ({ ...prev, privateNotes: e.target.value }))}
                                            placeholder="Any special notes..."
                                        />
                                    </label>

                                    <div className="therapist-actions">
                                        <button type="submit" className="btn-primary therapist-save-btn" disabled={saving}>
                                            <Save size={18} />
                                            {saving ? t.actions.saving : t.actions.save}
                                        </button>
                                        <button
                                            type="button"
                                            className="therapist-cancel-btn"
                                            onClick={() => {
                                                setIsEditing(false);
                                                const therapist = profile?.therapist;
                                                if (!therapist) {
                                                    setForm(emptyForm);
                                                    return;
                                                }
                                                setForm({
                                                    fullName: therapist.fullName || '',
                                                    email: therapist.email || '',
                                                    phone: therapist.phone || '',
                                                    clinicName: therapist.clinicName || '',
                                                    sessionSchedule: therapist.sessionSchedule || '',
                                                    nextSessionDate: therapist.nextSessionDate || '',
                                                    privateNotes: therapist.privateNotes || ''
                                                });
                                            }}
                                        >
                                            {t.actions.cancel}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="therapist-view-grid animate-reveal">
                                    {renderValue(t.labels.name, form.fullName)}
                                    {renderValue(t.labels.email, form.email)}
                                    {renderValue(t.labels.phone, form.phone)}
                                    {renderValue(t.labels.clinic, form.clinicName)}
                                    {renderValue(t.labels.schedule, form.sessionSchedule)}
                                    {renderValue(
                                        t.labels.nextSession,
                                        form.nextSessionDate ? new Date(form.nextSessionDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : ''
                                    )}
                                    {renderValue(t.labels.notes, form.privateNotes, true)}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MyTherapist;

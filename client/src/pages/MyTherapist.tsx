import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, PencilLine, Save, Calendar, Phone, Mail, Building2, NotebookPen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/api';
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
            toast.error('Therapist full name and email are required.');
            return;
        }
        setSaving(true);
        try {
            await updateUserProfile(currentUser.uid, { therapist: form });
            await refreshProfile();
            toast.success('Therapist information saved.');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to save therapist info.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!currentUser) return;
        const confirmed = window.confirm('Delete therapist information?');
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
            toast.success('Therapist information deleted.');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete therapist info.');
        } finally {
            setSaving(false);
        }
    };

    const renderValue = (label: string, value?: string) => (
        <div className="therapist-view-row">
            <p className="therapist-view-label">{label}</p>
            <p className="therapist-view-value">{value?.trim() ? value : 'Not provided'}</p>
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
                    pageTitle={lang === 'BM' ? 'Terapis Saya' : 'My Therapist'}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="therapist-scroll-area">
                    <div className="therapist-container">
                        <section className="card therapist-card">
                            <div className="therapist-header">
                                <div className="therapist-heading-wrap">
                                    <span className="therapist-badge-icon"><Stethoscope size={18} /></span>
                                    <div>
                                        <h2 className="therapist-title">{lang === 'BM' ? 'Maklumat Terapis' : 'Therapist Information'}</h2>
                                        <p className="therapist-subtitle">
                                            {lang === 'BM'
                                                ? 'Simpan maklumat terapis anda untuk membolehkan penghantaran laporan mingguan.'
                                                : 'Save your therapist details to unlock weekly report sharing.'}
                                        </p>
                                    </div>
                                </div>

                                {!isEditing && (
                                    <div className="therapist-head-actions">
                                        {hasTherapist && (
                                            <button className="btn-secondary therapist-delete-btn" onClick={handleDelete} disabled={saving}>
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        )}
                                        <button className="btn-secondary therapist-edit-btn" onClick={() => setIsEditing(true)}>
                                            <PencilLine size={16} />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>

                            {!hasTherapist && !isEditing ? (
                                <div className="therapist-empty-state">
                                    <p>You haven&apos;t added your therapist yet.</p>
                                    <p>Add their info to unlock the Send Report feature.</p>
                                    <button className="btn-primary" onClick={() => setIsEditing(true)}>Add Therapist</button>
                                </div>
                            ) : isEditing ? (
                                <form
                                    className="therapist-form-grid"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSave();
                                    }}
                                >
                                    <label className="therapist-field">
                                        <span><Stethoscope size={16} /> Therapist full name</span>
                                        <input
                                            value={form.fullName}
                                            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Mail size={16} /> Therapist email address</span>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Phone size={16} /> Therapist phone number</span>
                                        <input
                                            value={form.phone}
                                            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Building2 size={16} /> Clinic / practice name (optional)</span>
                                        <input
                                            value={form.clinicName}
                                            onChange={(e) => setForm((prev) => ({ ...prev, clinicName: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Calendar size={16} /> Session day &amp; time</span>
                                        <input
                                            placeholder="Every Tuesday at 3:00 PM"
                                            value={form.sessionSchedule}
                                            onChange={(e) => setForm((prev) => ({ ...prev, sessionSchedule: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field">
                                        <span><Calendar size={16} /> Next session date</span>
                                        <input
                                            type="date"
                                            value={form.nextSessionDate}
                                            onChange={(e) => setForm((prev) => ({ ...prev, nextSessionDate: e.target.value }))}
                                        />
                                    </label>
                                    <label className="therapist-field therapist-field-full">
                                        <span><NotebookPen size={16} /> Private notes about your therapist</span>
                                        <textarea
                                            rows={4}
                                            value={form.privateNotes}
                                            onChange={(e) => setForm((prev) => ({ ...prev, privateNotes: e.target.value }))}
                                        />
                                    </label>

                                    <div className="therapist-actions">
                                        <button type="submit" className="btn-primary" disabled={saving}>
                                            <Save size={16} />
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        {hasTherapist && (
                                            <button type="button" className="btn-secondary therapist-delete-btn" onClick={handleDelete} disabled={saving}>
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="btn-secondary"
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
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="therapist-view-grid">
                                    {renderValue('Therapist full name', form.fullName)}
                                    {renderValue('Therapist email address', form.email)}
                                    {renderValue('Therapist phone number', form.phone)}
                                    {renderValue('Clinic / practice name', form.clinicName)}
                                    {renderValue('Session day & time', form.sessionSchedule)}
                                    {renderValue('Next session date', form.nextSessionDate ? new Date(form.nextSessionDate).toLocaleDateString() : '')}
                                    <div className="therapist-view-row therapist-view-row-full">
                                        <p className="therapist-view-label">Private notes</p>
                                        <p className="therapist-view-value">{form.privateNotes?.trim() || 'Not provided'}</p>
                                    </div>
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

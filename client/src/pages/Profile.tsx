import React, { useState, useEffect } from 'react';
import { Edit2, Check, X, Shield, User, Calendar, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import AvatarUpload from '../components/AvatarUpload';
import { updateUserProfile } from '../services/api';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import './Profile.css';
import { translations } from '../i18n/translations';

interface ProfileProps {
    lang: 'EN' | 'BM';
}

const Profile: React.FC<ProfileProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, profile, refreshProfile, updateUserPassword } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    // Editing States
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [details, setDetails] = useState({
        gender: '',
        dateOfBirth: ''
    });
    const [loading, setLoading] = useState(false);

    const t = translations[lang].profile;
    const loginT = translations[lang].login;
    const common = translations[lang].common;

    // Synchronize editedName and details with profile
    useEffect(() => {
        if (profile) {
            setEditedName(profile.name || currentUser?.displayName || '');
            setDetails({
                gender: profile.gender || '',
                dateOfBirth: profile.dateOfBirth || ''
            });
        }
    }, [profile, currentUser]);

    const handleSaveName = async () => {
        if (!currentUser || !editedName.trim()) return;
        setLoading(true);
        try {
            await updateProfile(currentUser, { displayName: editedName });
            await updateUserProfile(currentUser.uid, { name: editedName });
            await refreshProfile();
            toast.success(t.nameUpdated);
            setIsEditingName(false);
        } catch (error) {
            console.error(error);
            toast.error(t.nameUpdateError);
        } finally {
            setLoading(false);
        }
    };


    const handleSaveDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;
        setLoading(true);
        try {
            await updateUserProfile(currentUser.uid, {
                gender: details.gender,
                dateOfBirth: details.dateOfBirth
            });
            await refreshProfile();
            toast.success(t.profileUpdated);
        } catch (error) {
            console.error(error);
            toast.error(t.profileUpdateError);
        } finally {
            setLoading(false);
        }
    };
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error(t.passMatchError);
            return;
        }
        if (passwords.new.length < 6) {
            toast.error(t.passLengthError);
            return;
        }

        setLoading(true);
        const toastId = toast.loading(t.updatingPass);
        try {
            await updateUserPassword(passwords.new);
            toast.success(t.passUpdated, { id: toastId });
            setIsChangingPassword(false);
            setPasswords({ new: '', confirm: '' });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/requires-recent-login') {
                toast.error(t.reauthRequired, { id: toastId });
            } else {
                toast.error(error.message || common.error, { id: toastId });
            }
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

                <div className="profile-scroll-area">
                    <div className="profile-container">

                        <div className="card">
                            <div className="profile-user-header">
                                <div className="avatar-section">
                                    <AvatarUpload
                                        currentPhotoURL={profile?.photoURL || currentUser?.photoURL}
                                        onUploadSuccess={() => refreshProfile()}
                                    />
                                </div>

                                <div className="user-info-section">
                                    {isEditingName ? (
                                        <div className="name-edit-container">
                                            <input
                                                value={editedName}
                                                onChange={(e) => setEditedName(e.target.value)}
                                                className="name-input"
                                                autoFocus
                                                title={t.editName}
                                                placeholder={t.placeholderName}
                                            />
                                            <div className="action-buttons-flex">
                                                <button onClick={handleSaveName} disabled={loading} className="save-name-btn" title={common.save}>
                                                    <Check size={20} />
                                                </button>
                                                <button onClick={() => setIsEditingName(false)} className="cancel-name-btn" title={common.cancel}>
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="name-display-container">
                                            <h2 className="profile-name-h2">{profile?.name || currentUser?.displayName || common.user}</h2>
                                            <button
                                                onClick={() => { setEditedName(profile?.name || currentUser?.displayName || ''); setIsEditingName(true); }}
                                                className="edit-name-btn"
                                                title={t.editName}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <div className="profile-email">{currentUser?.email}</div>
                                </div>
                            </div>

                            <div className="profile-sections-grid">
                                <section className="profile-section">
                                    <div className="section-header">
                                        <User size={20} color="var(--color-primary)" />
                                        <h3 className="section-title">{t.accountDetails}</h3>
                                    </div>
                                    <div className="details-list">
                                        <div className="detail-item">
                                            <div className="detail-label">{common.email}</div>
                                            <div className="detail-value">{currentUser?.email}</div>
                                        </div>
                                        <div className="detail-item">
                                            <div className="detail-label">{t.memberSince}</div>
                                            <div className="detail-value">
                                                {currentUser?.metadata.creationTime
                                                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(lang === 'EN' ? 'en-US' : 'ms-MY', { month: 'long', year: 'numeric', day: 'numeric' })
                                                    : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="profile-section">
                                    <div className="section-header">
                                        <Smile size={20} color="var(--color-primary)" />
                                        <h3 className="section-title">{t.personalizedDetails}</h3>
                                    </div>
                                    <form onSubmit={handleSaveDetails} className="details-form">
                                        <div className="input-group-vertical">
                                            <label className="detail-label">{t.gender}</label>
                                            <div className="input-with-icon">
                                                <Smile size={18} className="field-icon" />
                                                <select
                                                    value={details.gender}
                                                    onChange={(e) => setDetails({ ...details, gender: e.target.value })}
                                                    required
                                                    className="profile-select"
                                                    title={t.gender}
                                                >
                                                    <option value="" disabled>{t.selectGender}</option>
                                                    <option value="Male">{loginT.male}</option>
                                                    <option value="Female">{loginT.female}</option>
                                                    <option value="Non-binary">{loginT.nonBinary}</option>
                                                    <option value="Prefer not to say">{loginT.preferNotToSay}</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="input-group-vertical">
                                            <label className="detail-label">{t.dob}</label>
                                            <div className="input-with-icon">
                                                <Calendar size={18} className="field-icon" />
                                                <input
                                                    type="date"
                                                    value={details.dateOfBirth}
                                                    onChange={(e) => setDetails({ ...details, dateOfBirth: e.target.value })}
                                                    required
                                                    title={t.dob}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" disabled={loading} className="btn-primary update-details-btn">
                                            {t.updateProfile}
                                        </button>
                                    </form>
                                </section>


                                <section className="profile-section">
                                    <div className="section-header">
                                        <Shield size={20} color="var(--color-primary)" />
                                        <h3 className="section-title">{t.security}</h3>
                                    </div>

                                    {isChangingPassword ? (
                                        <form onSubmit={handlePasswordChange} className="password-form">
                                            <div className="input-group">
                                                <label className="detail-label">{t.newPass}</label>
                                                <input
                                                    type="password"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                    required
                                                    minLength={6}
                                                    title={t.newPass}
                                                    placeholder={t.placeholderPass}
                                                />
                                            </div>
                                            <div className="input-group">
                                                <label className="detail-label">{t.confirmPass}</label>
                                                <input
                                                    type="password"
                                                    value={passwords.confirm}
                                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                                    required
                                                    minLength={6}
                                                    title={t.confirmPass}
                                                    placeholder={t.placeholderConfirm}
                                                />
                                            </div>
                                            <div className="action-buttons-flex">
                                                <button type="submit" disabled={loading} className="btn-primary">{t.updatePass}</button>
                                                <button type="button" onClick={() => setIsChangingPassword(false)} className="btn-secondary">{common.cancel}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <button
                                            onClick={() => setIsChangingPassword(true)}
                                            className="btn-primary change-password-trigger"
                                            title={t.changePass}
                                        >
                                            <Shield size={18} />
                                            {t.changePass}
                                        </button>
                                    )}
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;

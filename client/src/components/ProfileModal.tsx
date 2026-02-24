import React, { useEffect, useState } from 'react';
import { User, Mail, LogOut, X, Shield, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, UserProfile } from '../services/api';
import toast from 'react-hot-toast';
import './ProfileModal.css';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && currentUser) {
            loadProfile();
        }
    }, [isOpen, currentUser]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await getUserProfile(currentUser!.uid);
            setProfile(data);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
            onClose();
        } catch (error) {
            toast.error("Failed to logout");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-modal-overlay">
            {/* Backdrop */}
            <div
                className="profile-modal-backdrop"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="card profile-modal-container">
                {/* Header with Gradient */}
                <div className="profile-header">
                    <button
                        onClick={onClose}
                        className="profile-close-btn"
                        aria-label="Close profile"
                        title="Close profile"
                    >
                        <X size={18} />
                    </button>

                    <div className="profile-avatar-container">
                        {currentUser?.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="profile-avatar-img"
                            />
                        ) : (
                            <div className="profile-avatar-placeholder">
                                <User size={40} />
                            </div>
                        )}
                    </div>

                    <h2 className="profile-name">
                        {currentUser?.displayName || "Guest User"}
                    </h2>
                    <span className="profile-plan-badge">
                        <Shield size={14} /> Free Plan Member
                    </span>
                </div>

                {/* Body Details */}
                <div className="profile-modal-body">
                    {loading ? (
                        <div className="profile-loading">Loading profile...</div>
                    ) : (
                        <div className="profile-info-list">
                            <div className="profile-info-item">
                                <Mail size={20} color="var(--color-primary)" />
                                <div className="profile-info-content">
                                    <div className="profile-info-label">Email Address</div>
                                    <div className="profile-info-value">{profile?.email || currentUser?.email || 'N/A'}</div>
                                </div>
                            </div>

                            <div className="profile-info-grid">
                                <div className="profile-grid-item">
                                    <div className="profile-grid-label">Gender</div>
                                    <div className="profile-grid-value">{profile?.gender || 'Not Set'}</div>
                                </div>
                                <div className="profile-grid-item">
                                    <div className="profile-grid-label">Date of Birth</div>
                                    <div className="profile-grid-value">{profile?.dateOfBirth || 'Not Set'}</div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="profile-stats-section">
                                <div className="profile-stats-header">
                                    <Activity size={18} color="var(--color-primary)" />
                                    <span className="profile-stats-title">Your Activity</span>
                                </div>
                                <div className="profile-stats-grid">
                                    <div className="profile-stat-card">
                                        <div className="profile-stat-value profile-stat-primary">
                                            {localStorage.getItem('moodHistory') ? JSON.parse(localStorage.getItem('moodHistory')!).length : 0}
                                        </div>
                                        <div className="profile-stat-label">Mood Checks</div>
                                    </div>
                                    <div className="profile-stat-card">
                                        <div className="profile-stat-value profile-stat-success">Active</div>
                                        <div className="profile-stat-label">Account Status</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="profile-modal-footer">
                        <button
                            onClick={handleLogout}
                            className="btn-primary profile-logout-btn"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;

import React from 'react';
import { User, Settings, HelpCircle, LogOut, Info, Mail, MessageSquare, Stethoscope } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { translations } from '../i18n/translations';
import './ProfileMenu.css';

interface ProfileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    position?: 'bottom-sidebar' | 'top-right';
    lang: 'EN' | 'BM';
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isOpen, onClose, position = 'bottom-sidebar', lang }) => {
    const { currentUser, profile, logout } = useAuth();
    const navigate = useNavigate();
    const t = translations[lang].profileMenu;
    const common = translations[lang].common;

    if (!isOpen) return null;

    const handleLogout = async () => {
        try {
            await logout();
            toast.success(common.logoutSuccess);
            onClose();
        } catch (error) {
            toast.error(common.logoutError);
        }
    };

    interface MenuItemProps {
        icon: React.ElementType;
        label: string;
        onClick: () => void;
        separate?: boolean;
    }

    const MenuItem = ({ icon: Icon, label, onClick, separate = false }: MenuItemProps) => (
        <button
            onClick={onClick}
            className={`profile-menu-item ${separate ? 'separate' : ''}`}
        >
            <Icon size={18} color="var(--color-text-sub)" />
            {label}
        </button>
    );

    return (
        <>
            <div
                className="profile-menu-backdrop"
                onClick={(e) => { e.stopPropagation(); onClose(); }}
            />

            <div
                className={`profile-popover-menu ${position}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="profile-menu-header">
                    <div className="profile-menu-username">
                        {profile?.name || currentUser?.displayName || common.user}
                    </div>
                </div>

                <div className="profile-menu-items">
                    <MenuItem
                        icon={User}
                        label={t.myProfile}
                        onClick={() => { navigate('/profile'); onClose(); }}
                    />
                    <MenuItem
                        icon={Settings}
                        label={t.settings}
                        onClick={() => { navigate('/settings'); onClose(); }}
                    />
                    <MenuItem
                        icon={Stethoscope}
                        label={translations[lang].therapist.title}
                        onClick={() => { navigate('/my-therapist'); onClose(); }}
                    />
                    <MenuItem
                        icon={Info}
                        label={t.about}
                        onClick={() => { navigate('/about'); onClose(); }}
                    />
                    <MenuItem
                        icon={Mail}
                        label={t.contact}
                        onClick={() => { navigate('/contact'); onClose(); }}
                    />
                    <MenuItem
                        icon={MessageSquare}
                        label={translations[lang].feedback.title}
                        onClick={() => { navigate('/feedback'); onClose(); }}
                    />

                    <MenuItem
                        icon={HelpCircle}
                        label={t.help}
                        separate={true}
                        onClick={() => { navigate('/help'); onClose(); }}
                    />
                    <MenuItem
                        icon={LogOut}
                        label={t.logout}
                        onClick={handleLogout}
                    />
                </div>
            </div>
        </>
    );
};

export default ProfileMenu;

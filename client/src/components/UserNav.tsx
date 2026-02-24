import React, { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileMenu from './ProfileMenu';
import './UserNav.css';
import { translations } from '../i18n/translations';

interface UserNavProps {
    lang: 'EN' | 'BM';
}

const UserNav: React.FC<UserNavProps> = ({ lang }) => {
    const navigate = useNavigate();
    const { currentUser, profile } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!currentUser) {
        return (
            <button className="user-nav-login" onClick={() => navigate('/login')}>
                <LogIn size={18} />
                <span>{translations[lang].common.login}</span>
            </button>
        );
    }

    return (
        <div className="user-nav-container">
            <div
                className={`user-nav-trigger ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className="user-nav-avatar">
                    {profile?.photoURL || currentUser.photoURL ? (
                        <img src={profile?.photoURL || currentUser.photoURL || ''} alt="User" />
                    ) : (
                        <User size={20} />
                    )}
                </div>
            </div>

            <ProfileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                position="top-right"
                lang={lang}
            />
        </div>
    );
};

export default UserNav;

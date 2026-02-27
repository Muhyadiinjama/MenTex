import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './Preloader.css';

const Preloader: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="preloader">
            <div className="preloader-content">
                <img
                    src={theme === 'dark' ? "/branding/logo-dark.png" : "/branding/main%20logo.png"}
                    alt="MenTex Logo"
                    className="preloader-logo"
                />
            </div>
        </div>
    );
};

export default Preloader;

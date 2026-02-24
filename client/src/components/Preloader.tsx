import React from 'react';
import './Preloader.css';

const Preloader: React.FC = () => {
    return (
        <div className="preloader">
            <div className="preloader-content">
                <img
                    src="/branding/main%20logo.png"
                    alt="MenTex Logo"
                    className="preloader-logo"
                />
            </div>
        </div>
    );
};

export default Preloader;

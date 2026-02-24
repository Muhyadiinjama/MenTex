import React from 'react';
import { X, PhoneCall } from 'lucide-react';

interface SafetyPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const SafetyPopup: React.FC<SafetyPopupProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '360px', textAlign: 'center', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', right: 10, top: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={24} color="#666" />
                </button>

                <h2 style={{ color: 'var(--color-alert)', marginBottom: '8px' }}>You are not alone.</h2>
                <p style={{ marginBottom: '24px', lineHeight: '1.5', color: '#45536d' }}>
                    It sounds like you might be going through a tough time. Please reach out to someone who can help.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <a href="tel:15999" className="btn-primary" style={{ backgroundColor: '#E57373', textDecoration: 'none' }}>
                        <PhoneCall size={20} />
                        Talian Kasih 15999
                    </a>
                    <a href="tel:0376272929" className="btn-primary" style={{ backgroundColor: '#4A90E2', textDecoration: 'none' }}>
                        <PhoneCall size={20} />
                        Befrienders 03-76272929
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SafetyPopup;

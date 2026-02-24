import React from 'react';
import { Phone } from 'lucide-react';

interface CrisisButtonProps {
    onClick: () => void;
    fixed?: boolean;
}

const CrisisButton: React.FC<CrisisButtonProps> = ({ onClick, fixed = false }) => {
    if (fixed) {
        return (
            <div style={{
                position: 'fixed',
                bottom: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '90%',
                maxWidth: '440px',
                zIndex: 100
            }}>
                <button
                    onClick={onClick}
                    className="btn-alert crisis-pulse-btn"
                    style={{
                        width: '100%',
                        padding: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Phone size={18} />
                    Help is Here
                </button>
            </div>
        );
    }

    // Default: Small pill button (for headers)
    return (
        <button
            onClick={onClick}
            className="crisis-pulse-btn"
            style={{
                backgroundColor: 'var(--color-alert)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '50px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                boxShadow: '0 2px 8px rgba(229, 115, 115, 0.4)'
            }}
        >
            <Phone size={16} />
            Help
        </button>
    );
};

export default CrisisButton;

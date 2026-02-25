import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateUserProfile } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { } from 'firebase/auth'; // Placeholder if needed, but I'll just clean up
import './AvatarUpload.css';

interface AvatarUploadProps {
    currentPhotoURL?: string | null;
    onUploadSuccess: (url: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentPhotoURL, onUploadSuccess }) => {
    const { currentUser } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentPhotoURL || null);
    const [loading, setLoading] = useState(false);

    // Sync preview with currentPhotoURL when it changes
    React.useEffect(() => {
        if (currentPhotoURL) {
            setPreview(currentPhotoURL);
        }
    }, [currentPhotoURL]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 500 * 1024) { // 500KB limit for Base64
            toast.error('Image size must be less than 500KB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            setPreview(base64String);
            await handleUpload(base64String);
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async (base64String: string) => {
        if (!currentUser) return;
        setLoading(true);
        try {
            // 1. Update Backend Database (Server Side)
            // We use the backend only because Firebase Auth photoURL has a strict character limit (~2KB)
            // and our Base64 images are larger than that.
            await updateUserProfile(currentUser.uid, { photoURL: base64String });

            toast.success('Profile picture updated!');
            onUploadSuccess(base64String);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile picture');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="avatar-upload-container">
            <div className="avatar-preview-wrapper">
                {preview ? (
                    <img
                        src={preview}
                        alt="Profile"
                        className="avatar-preview-img"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <Camera size={32} color="#94a3b8" />
                )}
            </div>

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                aria-label="Upload profile picture"
                title="Upload profile picture"
                className="avatar-upload-btn"
            >
                {loading ? (
                    <div className="avatar-btn-spinner" />
                ) : (
                    <Camera size={16} />
                )}
            </button>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="display-none"
                accept="image/*"
                aria-label="Upload profile picture"
            />
        </div>
    );
};

export default AvatarUpload;

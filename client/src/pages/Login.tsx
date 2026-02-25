import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, CheckCircle, User, Calendar, Smile, ArrowRight } from 'lucide-react';
import { auth } from '../services/firebase';
import { updateUserProfile } from '../services/api';
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';
import './Login.css';
import { translations } from '../i18n/translations';


interface AuthError {
    code?: string;
    message?: string;
}

interface LoginProps {
    lang: 'EN' | 'BM';
}

const Login: React.FC<LoginProps> = ({ lang }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [signupStep, setSignupStep] = useState(1);
    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const t = translations[lang].login;
    const common = translations[lang].common;

    // Form State
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        dateOfBirth: '',
        gender: ''
    });

    // UI State
    const [loading, setLoading] = useState(false);
    const { loginWithEmail, signupWithEmail, signInWithGoogle, sendVerification, resetPassword, refreshProfile } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- STEP NAVIGATION ---

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error(t.emailRequired);
            return;
        }
        if (formData.password.length < 6) {
            toast.error(t.passLength);
            return;
        }
        setSignupStep(2);
    };

    const handleNextStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName) {
            toast.error(t.nameRequired);
            return;
        }
        setSignupStep(3);
    };

    const handlePrevStep = () => {
        setSignupStep(prev => prev - 1);
    };

    // --- SUBMISSION HANDLERS ---

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading(t.signingIn);

        try {
            await loginWithEmail(formData.email, formData.password);

            if (auth.currentUser && !auth.currentUser.emailVerified) {
                toast.error(t.verifyFirst, { id: toastId });
                setLoading(false);
                return;
            }

            toast.success(t.welcomeMsg, { id: toastId });
            navigate('/check-in');
        } catch (err) {
            console.error(err);
            handleAuthError(err as AuthError, toastId);
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.dateOfBirth || !formData.gender) {
            toast.error(t.completeFields);
            return;
        }

        setLoading(true);
        const toastId = toast.loading(t.creating);

        try {
            // 1. Create Auth User
            const cred = await signupWithEmail(formData.email, formData.password);
            const user = cred.user;

            // 2. Update Firebase Profile
            await updateProfile(user, { displayName: formData.fullName });

            // 3. Save DB Profile
            await updateUserProfile(user.uid, {
                name: formData.fullName,
                email: formData.email,
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth
            });

            // 4. Send Verification
            await sendVerification();

            toast.success(t.accountCreated, { id: toastId });
            setLoading(false);
            setSignupStep(4); // Show verification screen

        } catch (err) {
            console.error(err);
            handleAuthError(err as AuthError, toastId);
            setLoading(false);
        }
    };

    const handleAuthError = (err: AuthError, toastId: string) => {
        if (err.code === 'auth/email-already-in-use') {
            toast.error('That email is already in use.', { id: toastId });
        } else if (err.code === 'auth/weak-password') {
            toast.error(t.passLength, { id: toastId });
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
            toast.error('Invalid email or password.', { id: toastId });
        } else {
            toast.error(err.message || common.error, { id: toastId });
        }
    };

    const handleGoogleSignIn = async () => {
        const toastId = toast.loading(t.google);
        try {
            await signInWithGoogle();

            const user = auth.currentUser;
            if (user) {
                console.log("Syncing Google User:", { name: user.displayName, email: user.email, photo: user.photoURL });

                // Sync profile data to DB immediately
                await updateUserProfile(user.uid, {
                    name: user.displayName || '',
                    email: user.email || '',
                    photoURL: user.photoURL || undefined
                });

                await refreshProfile();

                toast.success(t.welcomeMsg, { id: toastId });
                navigate('/check-in');
                return;
            }

            toast.success(t.welcomeMsg, { id: toastId });
            navigate('/check-in');
        } catch (e: any) {
            console.error("Google sign in error:", e);

            let errorMessage = t.googleFailed;
            if (e.code === 'auth/popup-closed-by-user') {
                errorMessage = "Login cancelled (popup closed).";
            } else if (e.code === 'auth/unauthorized-domain') {
                errorMessage = "Login Failed: Domain not authorized. Please add 'localhost' to Authorized Domains in Firebase Console.";
            } else if (e.code === 'auth/operation-not-allowed') {
                errorMessage = "Login Failed: Google Sign-In is not enabled in Firebase.";
            } else if (e.message?.includes('Failed to fetch')) {
                errorMessage = "Sync Failed: Could not connect to the backend server. Check your connection or VITE_API_URL.";
            } else if (e.message) {
                errorMessage = `${t.googleFailed}: ${e.message}`;
            }

            toast.error(errorMessage, { id: toastId });
        }
    };

    const handleResendVerification = async () => {
        const toastId = toast.loading(t.sending);
        try {
            await sendVerification();
            toast.success(t.emailSent, { id: toastId });
        } catch (err) {
            toast.error(t.resendFailed, { id: toastId });
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) {
            toast.error(t.emailRequired);
            return;
        }
        setLoading(true);
        const toastId = toast.loading(t.sending);
        try {
            await resetPassword(formData.email);
            toast.success(t.resetSent, { id: toastId });
            setIsForgotPassword(false);
        } catch (err) {
            console.error(err);
            toast.error(t.resetFailed, { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    // --- RENDER HELPERS ---

    if (!isLogin && signupStep === 4) {
        return (
            <div className="verification-container">
                <div className="verification-card">
                    <CheckCircle size={48} color="green" className="verification-icon" />
                    <h2 className="verification-title">{t.verifyTitle}</h2>
                    <p className="verification-text">
                        {t.verifySent(formData.email)}<br />
                        {t.verifyCheck}
                    </p>
                    <div className="flex-row-gap-10">
                        <button onClick={() => { setIsLogin(true); setSignupStep(1); setLoading(false); }} className="btn-primary">
                            {t.goToLogin}
                        </button>
                        <button onClick={handleResendVerification} className="btn-secondary">
                            {t.resend}
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    // Main Card
    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-header-title">
                    {isLogin ? t.welcome : t.createAccount}
                </h2>
                <p className="login-header-subtitle">
                    {!isLogin ? t.step(signupStep) : t.signinContinue}
                </p>

                {/* LOGIN FORM */}
                {isLogin && !isForgotPassword && (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <Mail size={18} color="#999" />
                            <input type="email" name="email" placeholder={t.email} value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <Lock size={18} color="#999" />
                            <input type="password" name="password" placeholder={t.password} value={formData.password} onChange={handleChange} required />
                        </div>
                        <div className="forgot-password-link-container">
                            <button type="button" onClick={() => setIsForgotPassword(true)} className="forgot-password-btn">
                                {t.forgotPass}
                            </button>
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" title={loading ? t.signingIn : t.signIn}>
                            {loading ? t.signingIn : t.signIn}
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD FORM */}
                {isForgotPassword && (
                    <form onSubmit={handleForgotPassword} className="login-form">
                        <p className="forgot-password-description">
                            {t.forgotPassDesc}
                        </p>
                        <div className="input-group">
                            <Mail size={18} color="#999" />
                            <input type="email" name="email" placeholder={t.email} value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="flex-row-gap-10">
                            <button type="button" onClick={() => setIsForgotPassword(false)} className="btn-secondary" title={common.cancel}>{common.cancel}</button>
                            <button type="submit" disabled={loading} className="btn-primary" title={t.sendResetLink}>
                                {loading ? t.sending : t.sendResetLink}
                            </button>
                        </div>
                    </form>
                )}


                {/* SIGNUP STEP 1: EMAIL & PASSWORD */}
                {!isLogin && signupStep === 1 && (
                    <form onSubmit={handleNextStep1} className="login-form">
                        <div className="input-group">
                            <Mail size={18} color="#999" />
                            <input type="email" name="email" placeholder={t.email} value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <Lock size={18} color="#999" />
                            <input type="password" name="password" placeholder={`${t.password} (6+ chars)`} value={formData.password} onChange={handleChange} required minLength={6} />
                        </div>
                        <button type="submit" className="btn-primary" title={common.next}>
                            {common.next} <ArrowRight size={18} />
                        </button>
                    </form>
                )}


                {/* SIGNUP STEP 2: FULL NAME */}
                {!isLogin && signupStep === 2 && (
                    <form onSubmit={handleNextStep2} className="login-form">
                        <div className="input-group">
                            <User size={18} color="#999" />
                            <input type="text" name="fullName" placeholder={t.fullName} value={formData.fullName} onChange={handleChange} required autoFocus />
                        </div>
                        <div className="flex-row-gap-10">
                            <button type="button" onClick={handlePrevStep} className="btn-secondary" title={common.previous}>
                                {common.previous}
                            </button>
                            <button type="submit" className="btn-primary" title={common.next}>
                                {common.next}
                            </button>
                        </div>
                    </form>
                )}


                {/* SIGNUP STEP 3: DETAILS */}
                {!isLogin && signupStep === 3 && (
                    <form onSubmit={handleSignupSubmit} className="login-form">
                        <div className="input-group">
                            <Calendar size={18} color="#999" />
                            <input type="date" name="dateOfBirth" title={t.dob} value={formData.dateOfBirth} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <Smile size={18} color="#999" />
                            <select name="gender" title={t.gender} value={formData.gender} onChange={handleChange} required className="login-select">
                                <option value="" disabled>{t.selectGender}</option>
                                <option value="Male">{t.male}</option>
                                <option value="Female">{t.female}</option>
                                <option value="Non-binary">{t.nonBinary}</option>
                                <option value="Prefer not to say">{t.preferNotToSay}</option>
                            </select>
                        </div>
                        <div className="flex-row-gap-10">
                            <button type="button" onClick={handlePrevStep} className="btn-secondary" title={common.previous}>
                                {common.previous}
                            </button>
                            <button type="submit" disabled={loading} className="btn-primary" title={t.signUp}>
                                {loading ? t.creating : t.signUp}
                            </button>
                        </div>
                    </form>
                )}


                {/* FOOTER */}
                <div className="login-footer-separator">
                    <div className="login-footer-line"></div>
                    <span className="login-footer-text">{t.or}</span>
                    <div className="login-footer-line"></div>
                </div>

                <button onClick={handleGoogleSignIn} className="btn-google" title={t.google}>
                    <Chrome size={20} />
                    {t.google}
                </button>

                <div className="login-switch-prompt">
                    {isLogin ? t.noAccount : t.hasAccount}
                    <button
                        onClick={() => { setIsLogin(!isLogin); setSignupStep(1); setIsForgotPassword(false); }}
                        className="login-switch-btn">
                        {isLogin ? t.signUp : common.login}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default Login;


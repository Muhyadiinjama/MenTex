import React, { createContext, useContext, useState, useEffect } from "react";
import { User, onAuthStateChanged, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, UserCredential, sendPasswordResetEmail, updatePassword as firebaseUpdatePassword } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

interface UserProfile {
    name?: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    photoURL?: string;
    preferredLanguage?: 'EN' | 'BM';
}

interface AuthContextType {
    currentUser: User | null;
    profile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, pass: string) => Promise<void>;
    signupWithEmail: (email: string, pass: string) => Promise<UserCredential>;
    logout: () => Promise<void>;
    sendVerification: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateUserPassword: (newPassword: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:4000";

    const refreshProfile = async () => {
        if (auth.currentUser) {
            try {
                const res = await fetch(`${API_URL}/user/${auth.currentUser.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        } else {
            setProfile(null);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Auth error", error);
            throw error;
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass);
    };

    const signupWithEmail = async (email: string, pass: string) => {
        return await createUserWithEmailAndPassword(auth, email, pass);
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const sendVerification = async () => {
        const user = auth.currentUser; // Use direct auth instance for immediate access
        if (user) {
            await sendEmailVerification(user);
        } else {
            throw new Error("No user logged in to verify.");
        }
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const updateUserPassword = async (newPassword: string) => {
        if (auth.currentUser) {
            await firebaseUpdatePassword(auth.currentUser, newPassword);
        } else {
            throw new Error("No user logged in.");
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                await refreshProfile();
            } else {
                setProfile(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        profile,
        loading,
        signInWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
        sendVerification,
        resetPassword,
        updateUserPassword,
        refreshProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

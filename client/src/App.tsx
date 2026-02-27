import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import MoodCheckIn from './pages/MoodCheckIn';
import ChatWithAI from './pages/ChatWithAI';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';
import Preloader from './components/Preloader';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './app.css';

import { Toaster } from 'react-hot-toast';

import MoodTrackerPage from './pages/MoodTrackerPage';
import MoodHistoryPage from './pages/MoodHistoryPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Feedback from './pages/Feedback';
import JournalPage from './pages/JournalPage';

function AppContent() {
  const { profile } = useAuth();
  const [lang, setLang] = useState<'EN' | 'BM'>('EN');
  const [safetyOpen, setSafetyOpen] = useState(false);

  // Sync lang with profile preference
  useEffect(() => {
    if (profile?.preferredLanguage) {
      setLang(profile.preferredLanguage);
    }
  }, [profile?.preferredLanguage]);

  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Landing lang={lang} setLang={setLang} />} />
        <Route path="/login" element={<Login lang={lang} />} />
        <Route
          path="/check-in"
          element={
            <PrivateRoute>
              <MoodCheckIn lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatWithAI
                lang={lang}
                safetyOpen={safetyOpen}
                setSafetyOpen={setSafetyOpen}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings lang={lang} />
            </PrivateRoute>
          }
        />
        {/* New Mood Tracking Routes */}
        <Route
          path="/mood-tracker"
          element={
            <PrivateRoute>
              <MoodTrackerPage lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/mood-history"
          element={
            <PrivateRoute>
              <MoodHistoryPage lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/weekly-report"
          element={
            <PrivateRoute>
              <WeeklyReportPage lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/journal"
          element={
            <PrivateRoute>
              <JournalPage lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <About lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PrivateRoute>
              <Contact lang={lang} />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <Feedback lang={lang} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show preloader for 1 second
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      {loading ? (
        <Preloader />
      ) : (
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;

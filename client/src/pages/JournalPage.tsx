import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { PlusCircle, Save, Trash2, Edit3, Loader2, Heart, Briefcase, Home, Coffee, MessageCircle, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Skeleton from '../components/Skeleton';
import { API_URL } from "../config";
import "./JournalPage.css";

import { translations } from "../i18n/translations";

interface JournalEntry {
    _id: string;
    title: string;
    content: string;
    category?: string;
    moodInsights?: string[];
    createdAt: string;
}

export default function JournalPage({ lang }: { lang: "EN" | "BM" }) {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);

    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    const t = translations[lang].journal;

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Personal");
    const [isSaving, setIsSaving] = useState(false);

    const categories = [
        { id: 'Personal', label: t.categories.personal, icon: Heart, color: '#0F766E' },
        { id: 'Work', label: t.categories.work, icon: Briefcase, color: '#334155' },
        { id: 'Health', label: t.categories.health, icon: Sun, color: '#d08770' },
        { id: 'Reflection', label: t.categories.reflection, icon: Moon, color: '#b48ead' },
        { id: 'Family', label: t.categories.family, icon: Home, color: '#ffb347' },
        { id: 'Other', label: t.categories.other, icon: Coffee, color: '#a3be8c' },
    ];

    useEffect(() => {
        if (currentUser?.uid) {
            fetchJournals();
        }
    }, [currentUser?.uid]);

    const fetchJournals = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/journal/${currentUser?.uid}`);
            if (!res.ok) throw new Error("Failed to load journals");
            const data = await res.json();
            setEntries(data);
        } catch (err) {
            console.error("Error fetching journals:", err);
            toast.error(t.toast.loadFailed);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (talkToAi = false) => {
        if (!title.trim() || !content.trim()) {
            toast.error(t.toast.fieldsRequired);
            return;
        }

        try {
            setIsSaving(true);
            if (currentId) {
                // Update
                const res = await fetch(`${API_URL}/api/journal/${currentId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, category })
                });
                if (!res.ok) throw new Error("Update failed");
                const data = await res.json();

                setEntries(entries.map(e => e._id === currentId ? data : e));
                toast.success(t.toast.updated);
            } else {
                // Create
                const res = await fetch(`${API_URL}/api/journal`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser?.uid,
                        title,
                        content,
                        category
                    })
                });
                if (!res.ok) throw new Error("Creation failed");
                const data = await res.json();

                setEntries([data, ...entries]);
                toast.success(t.toast.saved);
            }

            if (talkToAi) {
                navigate('/chat', {
                    state: {
                        initialMessage: t.aiReflectionPrompt(title, category, content),
                        fromJournal: true
                    }
                });
            } else {
                handleCancel();
            }
        } catch (err) {
            console.error("Error saving journal:", err);
            toast.error(t.toast.saveFailed);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(t.toast.deleteConfirm)) {
            try {
                const res = await fetch(`${API_URL}/api/journal/${id}`, { method: 'DELETE' });
                if (!res.ok) throw new Error("Delete failed");
                setEntries(entries.filter(e => e._id !== id));
                toast.success(t.toast.deleted);
            } catch (err) {
                console.error("Error deleting journal:", err);
                toast.error(t.toast.deleteFailed);
            }
        }
    };

    const editEntry = (entry: JournalEntry) => {
        setTitle(entry.title);
        setContent(entry.content);
        setCategory(entry.category || "Personal");
        setCurrentId(entry._id);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentId(null);
        setTitle("");
        setContent("");
        setCategory("Personal");
    };

    return (
        <div className="dashboard-page-container">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={() => navigate('/chat')}
                currentChatId={null}
                userId={currentUser?.uid || 'guest'}
                lang={lang}
            />

            <main className="main-content">
                <Navbar
                    pageTitle={t.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="dashboard-scroll-area">
                    <div className="journal-page">
                        <div className="journal-header-section animate-fade-in">
                            <div className="journal-intro">
                                <h1>{t.title} ✍️</h1>
                                <p>{t.subtitle}</p>
                            </div>

                            {!isEditing && (
                                <button className="new-journal-btn" onClick={() => setIsEditing(true)}>
                                    <PlusCircle size={20} />
                                    {t.newPage}
                                </button>
                            )}
                        </div>

                        <div className="journal-main-content">
                            {isEditing ? (
                                <div className="journal-editor-card animate-fade-in">
                                    <div className="editor-section">
                                        <label className="editor-label">{t.selectCategory}</label>
                                        <div className="category-selector">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`cat-btn ${category === cat.id ? 'active' : ''}`}
                                                    style={{ '--cat-color': cat.color } as any}
                                                >
                                                    <cat.icon size={18} />
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="editor-section">
                                        <input
                                            type="text"
                                            className="journal-title-input-premium"
                                            placeholder={t.titlePlaceholder}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="editor-section">
                                        <textarea
                                            className="journal-body-input-premium custom-scrollbar"
                                            placeholder={t.contentPlaceholder}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="editor-footer">
                                        <button className="btn-secondary" onClick={handleCancel} disabled={isSaving}>
                                            {translations[lang].common.cancel}
                                        </button>
                                        <div className="save-actions">
                                            <button className="btn-outline" onClick={() => handleSave(false)} disabled={isSaving}>
                                                {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                                                {t.saveOnly}
                                            </button>
                                            <button className="btn-primary" onClick={() => handleSave(true)} disabled={isSaving}>
                                                <MessageCircle size={18} />
                                                {t.saveTalkAi}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="journal-list-view">
                                    {loading ? (
                                        <div className="entries-masonry">
                                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                                <div key={i} className="premium-journal-card" style={{ height: '240px' }}>
                                                    <div className="card-top">
                                                        <Skeleton width={80} height={24} />
                                                        <Skeleton width={100} height={16} />
                                                    </div>
                                                    <Skeleton width="100%" height={28} className="mt-2" />
                                                    <Skeleton width="100%" height={100} className="mt-2" />
                                                    <div className="entry-footer">
                                                        <Skeleton circle width={36} height={36} />
                                                        <Skeleton circle width={36} height={36} />
                                                        <Skeleton width={80} height={32} className="ml-auto" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : entries.length === 0 ? (
                                        <div className="empty-state-card animate-fade-in">
                                            <div className="empty-illustration">🍃</div>
                                            <h3>{t.emptyTitle}</h3>
                                            <p>{t.emptyText}</p>
                                            <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                                {t.writeNow}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="entries-masonry">
                                            {entries.map(entry => {
                                                const cat = categories.find(c => c.id === entry.category) || categories[0];
                                                return (
                                                    <div key={entry._id} className="premium-journal-card animate-slide-up">
                                                        <div className="card-top">
                                                            <div className="entry-cat-badge" style={{ backgroundColor: cat.color + '22', color: cat.color }}>
                                                                <cat.icon size={14} />
                                                                {cat.label}
                                                            </div>
                                                            <span className="entry-date">{format(new Date(entry.createdAt), "MMM d, yyyy")}</span>
                                                        </div>
                                                        <h3 className="entry-title">{entry.title}</h3>
                                                        <p className="entry-snippet">{entry.content}</p>

                                                        {entry.moodInsights && entry.moodInsights.length > 0 && (
                                                            <div className="entry-moods">
                                                                {entry.moodInsights.map((mood, idx) => (
                                                                    <span key={idx} className="mood-tag">{mood}</span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="entry-footer">
                                                            <button onClick={() => editEntry(entry)} className="action-circle-btn" title={translations[lang].common.edit}>
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(entry._id)} className="action-circle-btn danger" title={translations[lang].common.delete}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate('/chat', { state: { initialMessage: t.aiReflectionPromptShort(entry.title, entry.content) } })}
                                                                className="talk-ai-mini-btn"
                                                            >
                                                                {t.aiAdvice}
                                                                <ArrowRight size={14} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import axios from "axios";
import { PlusCircle, Save, Trash2, Edit3, Loader2, Heart, Briefcase, Home, Coffee, MessageCircle, ArrowRight, Sun, Moon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import "./JournalPage.css";

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

    // Editor State
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("Personal");
    const [isSaving, setIsSaving] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

    const categories = [
        { id: 'Personal', label: lang === 'BM' ? 'Peribadi' : 'Personal', icon: Heart, color: '#0F766E' },
        { id: 'Work', label: lang === 'BM' ? 'Kerja' : 'Work', icon: Briefcase, color: '#334155' },
        { id: 'Health', label: lang === 'BM' ? 'Kesihatan' : 'Health', icon: Sun, color: '#d08770' },
        { id: 'Reflection', label: lang === 'BM' ? 'Refleksi' : 'Reflection', icon: Moon, color: '#b48ead' },
        { id: 'Family', label: lang === 'BM' ? 'Keluarga' : 'Family', icon: Home, color: '#ffb347' },
        { id: 'Other', label: lang === 'BM' ? 'Lain-lain' : 'Other', icon: Coffee, color: '#a3be8c' },
    ];

    useEffect(() => {
        if (currentUser?.uid) {
            fetchJournals();
        }
    }, [currentUser?.uid]);

    const fetchJournals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE}/api/journal/${currentUser?.uid}`);
            setEntries(res.data);
        } catch (err) {
            console.error("Error fetching journals:", err);
            toast.error(lang === "BM" ? "Gagal memuat jurnal" : "Failed to load journals");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (talkToAi = false) => {
        if (!title.trim() || !content.trim()) {
            toast.error(lang === "BM" ? "Sila isikan tajuk dan kandungan" : "Please enter title and content");
            return;
        }

        try {
            setIsSaving(true);
            if (currentId) {
                // Update
                const res = await axios.put(`${API_BASE}/api/journal/${currentId}`, { title, content, category });
                setEntries(entries.map(e => e._id === currentId ? res.data : e));
                toast.success(lang === "BM" ? "Jurnal dikemas kini" : "Journal updated");
            } else {
                // Create
                const res = await axios.post(`${API_BASE}/api/journal`, {
                    userId: currentUser?.uid,
                    title,
                    content,
                    category
                });
                setEntries([res.data, ...entries]);
                toast.success(lang === "BM" ? "Jurnal disimpan" : "Journal saved");
            }

            if (talkToAi) {
                navigate('/chat', {
                    state: {
                        initialMessage: `I just wrote a journal entry titled "${title}" in the ${category} category. Here's what I wrote: "${content}". Can you provide some therapeutic reflections or advice based on this?`,
                        fromJournal: true
                    }
                });
            } else {
                handleCancel();
            }
        } catch (err) {
            console.error("Error saving journal:", err);
            toast.error(lang === "BM" ? "Gagal menyimpan jurnal" : "Failed to save journal");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm(lang === "BM" ? "Adakah anda pasti mahu memadam jurnal ini?" : "Are you sure you want to delete this journal?")) {
            try {
                await axios.delete(`${API_BASE}/api/journal/${id}`);
                setEntries(entries.filter(e => e._id !== id));
                toast.success(lang === "BM" ? "Jurnal dipadam" : "Journal deleted");
            } catch (err) {
                console.error("Error deleting journal:", err);
                toast.error(lang === "BM" ? "Gagal memadam jurnal" : "Failed to delete journal");
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
                    pageTitle={lang === "BM" ? "Jurnal Saya" : "My Journal"}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="dashboard-scroll-area">
                    <div className="journal-page">
                        <div className="journal-header-section animate-fade-in">
                            <div className="journal-intro">
                                <h1>{lang === "BM" ? "Jurnal Saya" : "My Journal"} ✍️</h1>
                                <p>{lang === "BM" ? "Ruang selamat untuk fikiran dan emosi anda." : "A safe space for your thoughts and emotions."}</p>
                            </div>

                            {!isEditing && (
                                <button className="new-journal-btn" onClick={() => setIsEditing(true)}>
                                    <PlusCircle size={20} />
                                    {lang === "BM" ? "Halaman Baru" : "New Page"}
                                </button>
                            )}
                        </div>

                        <div className="journal-main-content">
                            {isEditing ? (
                                <div className="journal-editor-card animate-fade-in">
                                    <div className="editor-section">
                                        <label className="editor-label">{lang === "BM" ? "Pilih Kategori" : "Select Category"}</label>
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
                                            placeholder={lang === "BM" ? "Tajuk entri anda..." : "Title of your entry..."}
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="editor-section">
                                        <textarea
                                            className="journal-body-input-premium custom-scrollbar"
                                            placeholder={lang === "BM" ? "Luahkan apa yang tersirat..." : "Express what's on your mind..."}
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>

                                    <div className="editor-footer">
                                        <button className="btn-secondary" onClick={handleCancel} disabled={isSaving}>
                                            {lang === "BM" ? "Batal" : "Cancel"}
                                        </button>
                                        <div className="save-actions">
                                            <button className="btn-outline" onClick={() => handleSave(false)} disabled={isSaving}>
                                                {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                                                {lang === "BM" ? "Simpan Sahaja" : "Save Only"}
                                            </button>
                                            <button className="btn-primary" onClick={() => handleSave(true)} disabled={isSaving}>
                                                <MessageCircle size={18} />
                                                {lang === "BM" ? "Simpan & Borak dengan AI" : "Save & Talk to AI"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="journal-list-view">
                                    {loading ? (
                                        <div className="loading-state">
                                            <div className="spinner"></div>
                                            <p>{lang === "BM" ? "Menghimpun memori..." : "Gathering memories..."}</p>
                                        </div>
                                    ) : entries.length === 0 ? (
                                        <div className="empty-state-card animate-fade-in">
                                            <div className="empty-illustration">🍃</div>
                                            <h3>{lang === "BM" ? "Mulakan Perjalanan" : "Begin the Journey"}</h3>
                                            <p>{lang === "BM" ? "Halaman ini menunggu kata-kata anda. Tulis sesuatu yang kecil hari ini." : "This page is waiting for your words. Write something small today."}</p>
                                            <button className="btn-primary" onClick={() => setIsEditing(true)}>
                                                {lang === "BM" ? "Tulis Sekarang" : "Write Now"}
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
                                                                {cat.id}
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
                                                            <button onClick={() => editEntry(entry)} className="action-circle-btn" title="Edit">
                                                                <Edit3 size={16} />
                                                            </button>
                                                            <button onClick={() => handleDelete(entry._id)} className="action-circle-btn danger" title="Delete">
                                                                <Trash2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => navigate('/chat', { state: { initialMessage: `I'm reflecting on my journal entry titled "${entry.title}": "${entry.content}". What advice can you give me based on this?` } })}
                                                                className="talk-ai-mini-btn"
                                                            >
                                                                {lang === 'BM' ? 'Nasihat AI' : 'AI Advice'}
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

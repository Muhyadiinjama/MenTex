import React, { useEffect, useState } from 'react';
import { getMoodHistory, deleteMoodEntry, updateMoodNote } from '../../services/moodService';
import { format } from 'date-fns';
import { translations } from '../../i18n/translations';
import { ms } from 'date-fns/locale';
import { X, Edit2, Trash2, MoreVertical, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import './MoodHistory.css';

interface MoodHistoryProps {
    userId: string;
    lang: string;
}

interface MoodEntry {
    _id: string;
    emoji: string;
    moodScore: number;
    note: string;
    timestamp: string;
}

const MoodHistory: React.FC<MoodHistoryProps> = ({ userId, lang }) => {
    const [history, setHistory] = useState<MoodEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);
    const [isEditingNote, setIsEditingNote] = useState(false);
    const [editNoteText, setEditNoteText] = useState('');
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    // Fallback to EN if translation is missing
    const t = translations[lang as keyof typeof translations]?.dashboard || translations['EN'].dashboard;
    const common = translations[lang as keyof typeof translations]?.common || translations['EN'].common;

    useEffect(() => {
        const handleClickOutside = () => setOpenDropdownId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await getMoodHistory(userId);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchHistory();
    }, [userId]);

    const handleDeleteEntry = async (id: string) => {
        if (!window.confirm(lang === 'BM' ? 'Adakah anda pasti mahu memadamkan rekod ini?' : 'Are you sure you want to delete this entry?')) return;

        try {
            await deleteMoodEntry(id);
            toast.success(lang === 'BM' ? 'Rekod berjaya dipadam' : 'Entry deleted successfully');
            setSelectedEntry(null);
            fetchHistory();
        } catch (error) {
            console.error("Failed to delete entry", error);
            toast.error(lang === 'BM' ? 'Gagal memadam rekod' : 'Failed to delete entry');
        }
    };

    const handleSaveNote = async () => {
        if (!selectedEntry) return;

        try {
            await updateMoodNote(selectedEntry._id, editNoteText);
            toast.success(lang === 'BM' ? 'Nota berjaya dikemas kini' : 'Note updated successfully');

            // Update local state without full refetch for better UX
            const updatedHistory = history.map(entry =>
                entry._id === selectedEntry._id ? { ...entry, note: editNoteText } : entry
            );
            setHistory(updatedHistory);
            setSelectedEntry({ ...selectedEntry, note: editNoteText });
            setIsEditingNote(false);
        } catch (error) {
            console.error("Failed to update note", error);
            toast.error(lang === 'BM' ? 'Gagal mengemas kini nota' : 'Failed to update note');
        }
    };

    const startEditing = () => {
        setEditNoteText(selectedEntry?.note || '');
        setIsEditingNote(true);
    };

    if (loading) return <div className="text-center p-4">{common.loading}</div>;

    if (history.length === 0) {
        return (
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">{t.noMoods}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="mood-history-title">{t.last7Days}</h3>
            <div className="mood-history-grid">
                {history.map((entry) => (
                    <div
                        key={entry._id}
                        className="mood-history-item"
                        onClick={() => {
                            setSelectedEntry(entry);
                            setIsEditingNote(false);
                        }}
                        role="button"
                        tabIndex={0}
                    >
                        <div className="mood-history-item-head">
                            <span className="mood-history-date">
                                {format(new Date(entry.timestamp), 'EEE, MMM d', { locale: lang === 'BM' ? ms : undefined })}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="mood-history-emoji mt-1" role="img" aria-label="mood">
                                    {entry.emoji}
                                </span>
                                <div className="action-menu-container" style={{ marginTop: '2px' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === entry._id ? null : entry._id);
                                        }}
                                        className={`action-menu-btn ${openDropdownId === entry._id ? 'active' : ''}`}
                                        aria-label="More options"
                                    >
                                        <MoreVertical size={18} />
                                    </button>
                                    {openDropdownId === entry._id && (
                                        <div className="action-dropdown-menu">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedEntry(entry);
                                                    setIsEditingNote(true);
                                                    setOpenDropdownId(null);
                                                }}
                                                className="action-dropdown-item"
                                            >
                                                <Edit2 size={14} />
                                                {common.edit}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteEntry(entry._id);
                                                    setOpenDropdownId(null);
                                                }}
                                                className="action-dropdown-item delete-action"
                                            >
                                                <Trash2 size={14} />
                                                {common.delete}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <p className="mood-history-preview">
                            {entry.note?.trim() || (lang === 'EN' ? 'No note added.' : 'Tiada nota ditambah.')}
                        </p>
                    </div>
                ))}
            </div>

            {selectedEntry && (
                <div className="mood-history-overlay" onClick={() => setSelectedEntry(null)}>
                    <div className="mood-history-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="mood-history-modal-header">
                            <div className="mood-history-modal-title-wrap">
                                <span className="mood-history-modal-emoji">{selectedEntry.emoji}</span>
                                <div>
                                    <h4 className="mood-history-modal-title">
                                        {selectedEntry.moodScore === 5 ? 'Great' : selectedEntry.moodScore === 4 ? 'Okay' : selectedEntry.moodScore === 3 ? 'Tired' : selectedEntry.moodScore === 2 ? 'Anxious' : 'Sad'}
                                    </h4>
                                    <p className="mood-history-modal-date">
                                        {format(new Date(selectedEntry.timestamp), 'EEEE, MMM d, h:mm a', { locale: lang === 'BM' ? ms : undefined })}
                                    </p>
                                </div>
                            </div>
                            <div className="modal-actions-wrap">
                                {!isEditingNote && (
                                    <button
                                        onClick={startEditing}
                                        className="modal-action-icon"
                                        title={common.edit}
                                        aria-label={common.edit}
                                    >
                                        <Edit2 size={16} strokeWidth={1.5} />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteEntry(selectedEntry._id)}
                                    className="modal-action-icon"
                                    title={common.delete}
                                    aria-label={common.delete}
                                >
                                    <Trash2 size={16} strokeWidth={1.5} />
                                </button>
                                <button
                                    className="modal-action-icon"
                                    type="button"
                                    onClick={() => setSelectedEntry(null)}
                                    aria-label="Close note details"
                                >
                                    <X size={16} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                        <div className="mood-history-modal-body px-6 pb-6">
                            <p className="edit-note-label">
                                {lang === 'EN' ? 'Saved reason' : 'Sebab disimpan'}
                            </p>

                            {isEditingNote ? (
                                <div className="edit-note-form">
                                    <textarea
                                        value={editNoteText}
                                        onChange={(e) => setEditNoteText(e.target.value)}
                                        className="edit-note-textarea"
                                        placeholder={lang === 'EN' ? 'Add your note here...' : 'Tambah nota anda di sini...'}
                                        autoFocus
                                    />
                                    <div className="edit-note-actions">
                                        <button
                                            onClick={() => setIsEditingNote(false)}
                                            className="edit-note-btn"
                                        >
                                            {common.cancel}
                                        </button>
                                        <button
                                            onClick={handleSaveNote}
                                            className="edit-note-btn"
                                        >
                                            {common.save}
                                            <ChevronDown size={14} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="mood-history-modal-text mt-2 block w-full border border-transparent">
                                    {selectedEntry.note?.trim() || (lang === 'EN' ? 'No note added for this check-in.' : 'Tiada nota ditambah untuk daftar masuk ini.')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MoodHistory;

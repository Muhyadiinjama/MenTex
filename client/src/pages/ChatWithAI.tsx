import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { streamChat, createChat, getChat } from '../services/api';
import SafetyPopup from '../components/SafetyPopup';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import './ChatWithAI.css';
import { translations } from '../i18n/translations';

interface Message {
    id: number | string;
    text: string;
    sender: 'user' | 'ai';
}

interface ChatWithAIProps {
    lang: 'EN' | 'BM';
    setSafetyOpen: (open: boolean) => void;
    safetyOpen: boolean;
}

const ChatWithAI: React.FC<ChatWithAIProps> = ({ lang, setSafetyOpen, safetyOpen }) => {
    const location = useLocation();
    // const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 850);
    const [userId, setUserId] = useState<string>('');
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const t = translations[lang].chat;
    const common = translations[lang].common;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            text: t.initial,
            sender: 'ai'
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sidebarRefresh, setSidebarRefresh] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const skipLoadRef = useRef(false);

    // Initialize User ID
    useEffect(() => {
        if (authLoading) return;
        if (currentUser) {
            setUserId(currentUser.uid);
        } else {
            let id = localStorage.getItem('mindful_user_id');
            if (!id) {
                id = Math.random().toString(36).substring(2) + Date.now().toString(36);
                localStorage.setItem('mindful_user_id', id);
            }
            setUserId(id);
        }
    }, [currentUser, authLoading]);

    // Handle initial message from dashboard or mood check-in
    useEffect(() => {
        if (authLoading || !userId) return;

        if (location.state?.initialMood && !isLoading) {
            let moodText = lang === 'EN'
                ? `I'm feeling ${location.state.initialMood} ${location.state.moodEmoji || ''}`
                : `Saya rasa ${location.state.initialMood} ${location.state.moodEmoji || ''}`;

            // If the user added a note, include it for the AI
            if (location.state.moodNote) {
                moodText += lang === 'EN'
                    ? `. Specifically: ${location.state.moodNote}`
                    : `. Khususnya: ${location.state.moodNote}`;
            }

            handleSend(moodText);
            // Clear state so it doesn't re-trigger
            window.history.replaceState({}, document.title);
        } else if (location.state?.initialMessage && !isLoading) {
            handleSend(location.state.initialMessage);
            window.history.replaceState({}, document.title);
        }
    }, [location.state, userId, authLoading]);

    // Load Chat History
    useEffect(() => {
        if (skipLoadRef.current) {
            skipLoadRef.current = false;
            return;
        }
        if (currentChatId) {
            loadChatHistory(currentChatId);
        } else {
            setMessages([{
                id: 'init',
                text: t.initial,
                sender: 'ai'
            }]);
        }
    }, [currentChatId, lang]);

    const loadChatHistory = async (id: string) => {
        setIsLoading(true);
        try {
            const chat = await getChat(id);
            const formatted: Message[] = chat.messages.map(m => ({
                id: m.id,
                text: m.content,
                sender: m.role === 'user' ? 'user' : 'ai'
            }));
            setMessages(formatted);
        } catch (error) {
            console.error("Failed to load chat", error);
        } finally {
            setIsLoading(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = typeof textOverride === 'string' ? textOverride : input;
        if (!textToSend.trim()) return;

        // Safety Logic
        const safetyRegex = /(suicide|kill myself|bunuh diri|cedera|mati|hurt myself|die)/i;
        if (safetyRegex.test(textToSend)) {
            setSafetyOpen(true);
            setMessages(prev => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
            setInput("");
            return;
        }

        const userText = textToSend;
        const tempId = Date.now();

        // Optimistic UI Update
        setMessages(prev => [...prev, { id: tempId, text: userText, sender: 'user' }]);
        setMessages(prev => [...prev, { id: tempId + 1, text: '', sender: 'ai' }]);
        setInput("");
        setIsLoading(true);

        try {
            let activeChatId = currentChatId;

            if (!activeChatId) {
                const title = userText.substring(0, 30) + (userText.length > 30 ? '...' : '');
                const newChat = await createChat(userId, title);
                activeChatId = newChat.id;
                skipLoadRef.current = true;
                setCurrentChatId(activeChatId);
                setSidebarRefresh(prev => prev + 1);
            }

            interface MoodEntry {
                date: string;
                moodId: string;
                note?: string;
            }

            // Retrieve Mood Context
            let moodContext = "";
            try {
                const moodHistoryRaw = localStorage.getItem('moodHistory');
                if (moodHistoryRaw) {
                    const moodHistory: MoodEntry[] = JSON.parse(moodHistoryRaw);
                    const recentMoods = moodHistory.slice(0, 3).map((m) =>
                        `${new Date(m.date).toLocaleDateString()} ${new Date(m.date).toLocaleTimeString()}: Mood=${m.moodId}, Note=${m.note || 'None'}`
                    ).join('\n');

                    if (recentMoods) {
                        moodContext = `Recent Mood History:\n${recentMoods}`;
                    }
                }
            } catch (e) {
                console.error("Error reading mood history", e);
            }

            await streamChat({
                chatId: activeChatId,
                userId: userId,
                message: userText,
                moodContext: moodContext
            }, (textChunk) => {
                setMessages(prev => {
                    const newMsgs = [...prev];
                    const lastMsg = newMsgs[newMsgs.length - 1];
                    if (lastMsg.sender === 'ai' && lastMsg.id === tempId + 1) {
                        lastMsg.text = textChunk;
                    }
                    return newMsgs;
                });
            });

        } catch (error) {
            console.error("Error", error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === tempId + 1
                        ? { ...msg, text: t.error }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (authLoading) {
        return <div className="chat-loading-screen">{common.loading}</div>;
    }

    return (
        <div className="dashboard-page-container">
            <Sidebar
                key={sidebarRefresh}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onSelectChat={(id) => {
                    setCurrentChatId(id);
                    if (window.innerWidth <= 850) setIsSidebarOpen(false);
                }}
                currentChatId={currentChatId}
                userId={userId}
                lang={lang}
            />

            <main className="main-content">
                <Navbar
                    pageTitle={t.title}
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(true)}
                    lang={lang}
                />

                <div className="chat-content-flex-wrap">
                    <div className="chat-container">
                        {/* Header Info (Sub-header) */}
                        <div className="chat-info-bar">
                            <div className="chat-title-group">
                                <div className="chat-user-info">
                                    <div className="chat-user-name">
                                        {currentUser?.displayName || common.user}
                                    </div>
                                    <span className="online-status">
                                        <span className="status-dot"></span>
                                        {isLoading ? common.thinking : common.online}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="chat-body">
                            {messages.map((m) => (
                                <div key={m.id} className={`message-wrapper ${m.sender}`}>
                                    <div className={`markdown-content message-bubble ${m.sender}`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                            components={{
                                                a: ({ node: _node, ...props }) => (
                                                    <a {...props} />
                                                )
                                            }}
                                        >
                                            {m.text}
                                        </ReactMarkdown>
                                    </div>
                                    {m.sender === 'ai' && (
                                        <span className="ai-label">MenTex</span>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="typing-indicator">
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                    <span className="typing-dot"></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} className="scroll-anchor" />
                        </div>

                        {/* Input Area */}
                        <div className="input-area-container">
                            {/* Removed local storage warning from original since user might be logged in */}
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={t.placeholder}
                                    className="chat-input-field"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={isLoading || !input.trim()}
                                    title={common.sendMessage}
                                    aria-label={common.sendMessage}
                                    className={`send-button ${input.trim() ? 'active' : 'disabled'}`}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                            <div className="storage-info">
                                {currentUser ? t.savedAccount : t.savedDevice}
                            </div>
                        </div>

                        <SafetyPopup isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />
                    </div>
                </div>
            </main>
        </div>
    );
};
export default ChatWithAI;

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, X, MessageCircle, Trash2, MoreVertical, PanelLeftClose, Plus, BookOpen } from 'lucide-react';
import { getChats, Chat, deleteChat } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ConfirmationModal from './ConfirmationModal';
import './Sidebar.css';
import { translations } from '../i18n/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChat: (chatId: string | null) => void;
  currentChatId: string | null;
  userId: string;
  lang: 'EN' | 'BM';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSelectChat, currentChatId, userId, lang }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, profile } = useAuth();
  const { theme } = useTheme();
  const t = translations[lang].sidebar;
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (userId) {
      loadChats();
    }
  }, [userId, isOpen, currentUser, profile]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await getChats(userId);
      setChats(data);
    } catch (error) {
      console.error("Error loading chats", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    onSelectChat(null);
    if (window.innerWidth < 850) onClose();
  };

  const handleChatClick = (chatId: string) => {
    onSelectChat(chatId);
    if (window.innerWidth < 850) onClose();
  };

  const handleMenuClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === chatId ? null : chatId);
  };

  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setChatToDelete(chatId);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete);
      setChats(prev => prev.filter(c => c.id !== chatToDelete));
      if (currentChatId === chatToDelete) {
        onSelectChat(null);
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    } finally {
      setChatToDelete(null);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/dashboard' },
    { icon: Plus, label: t.checkin, path: '/check-in' },
    { icon: BookOpen, label: lang === 'BM' ? 'Jurnal' : 'Journal', path: '/journal' },
    { icon: LayoutDashboard, label: t.analytics, path: '/weekly-report' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <ConfirmationModal
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={confirmDelete}
        title={t.deleteChatTitle}
        message={t.deleteChatConfirm}
        confirmLabel={t.deleteLabel}
        cancelLabel={translations[lang].common.cancel}
        isDanger={true}
      />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="sidebar-overlay mobile-only"
        />
      )}

      {/* Sidebar Container */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div
            className="sidebar-logo-container"
            onClick={() => {
              navigate('/dashboard');
              if (window.innerWidth < 850) onClose();
            }}
          >
            <img
              src={theme === 'dark' ? "/branding/logo-dark.png" : "/branding/logo-sidebar.png"}
              alt="MenTex"
              className="sidebar-logo"
            />
          </div>
          <div className="sidebar-header-actions">
            <button
              onClick={onClose}
              className="sidebar-toggle-action desktop-only"
              title={t.collapse}
            >
              <PanelLeftClose size={20} />
            </button>
            <button
              onClick={onClose}
              className="sidebar-toggle-action mobile-only"
              title={t.close}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={handleNewChat}
          className="btn-primary sidebar-new-chat"
        >
          <Plus size={20} />
          {t.newChat}
        </button>

        {/* History List */}
        <div className="sidebar-history">
          <div className="sidebar-history-label">
            {t.recentChats}
          </div>
          {loading ? (
            <div className="sidebar-loading">{translations[lang].common.loading}</div>
          ) : chats.length === 0 ? (
            <div className="sidebar-no-history">{t.noHistory}</div>
          ) : (
            <div className="chat-list">
              {chats.map(chat => (
                <div
                  key={chat.id}
                  onClick={() => handleChatClick(chat.id)}
                  className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                >
                  <MessageCircle size={16} className="chat-item-icon" />
                  <span className="chat-item-title">{chat.title || t.untitledChat}</span>

                  <button
                    onClick={(e) => handleMenuClick(e, chat.id)}
                    className="chat-item-menu-btn"
                    title={t.menu}
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Context Menu */}
                  {activeMenuId === chat.id && (
                    <div className="chat-context-menu">
                      <button
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        className="delete-chat-btn"
                      >
                        <Trash2 size={14} />
                        {t.deleteLabel}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 850) onClose();
              }}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}

        </nav>
      </div>
    </>
  );
};

export default Sidebar;

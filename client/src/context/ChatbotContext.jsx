import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { aiService } from '../services/aiService';

const ChatbotContext = createContext(null);

const STORAGE_KEY = 'tara_typing_ai_chat_sessions_v2';

const INITIAL_GREETING = {
  id: 'greet_init',
  role: 'assistant',
  content: `👋 **Hi there! I'm your Tara AI Typing Coach.**`,
  timestamp: new Date().toISOString(),
};

const createNewSession = (title = 'New Discussion') => ({
  id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title,
  isPinned: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [INITIAL_GREETING],
});

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);

  // Load conversations from localStorage
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // Migrate from old key if exists
      const oldStored = localStorage.getItem('tara_typing_ai_chat_sessions_v1');
      if (oldStored) {
        const parsedOld = JSON.parse(oldStored);
        if (Array.isArray(parsedOld) && parsedOld.length > 0) {
          return parsedOld;
        }
      }
    } catch (e) {
      console.warn('Could not parse stored chat sessions:', e);
    }
    return [createNewSession('Typing Tips & Coaching')];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return conversations[0]?.id || '';
  });

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn('Failed to save chat sessions to localStorage:', e);
    }
  }, [conversations]);

  const currentSession = useMemo(() => {
    return (
      conversations.find((c) => c.id === currentSessionId) ||
      conversations[0] ||
      createNewSession('Typing Coaching')
    );
  }, [conversations, currentSessionId]);

  // Open / Close / Toggle actions
  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const toggleChat = () => {
    setIsOpen((prev) => {
      if (!prev) setIsMinimized(false);
      return !prev;
    });
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  // Start a new chat session (like ChatGPT)
  const startNewChat = () => {
    const newSession = createNewSession();
    setConversations((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setIsHistoryOpen(false);
    setAttachedFile(null);
  };

  // Select existing session
  const selectSession = (id) => {
    setCurrentSessionId(id);
    setIsHistoryOpen(false);
    setAttachedFile(null);
  };

  // Pin / Unpin a session
  const togglePinSession = (id, e) => {
    if (e) e.stopPropagation();
    setConversations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  // Delete a session
  const deleteSession = (id, e) => {
    if (e) e.stopPropagation();
    setConversations((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh = createNewSession();
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Clear all history
  const clearAllHistory = () => {
    const fresh = createNewSession();
    setConversations([fresh]);
    setCurrentSessionId(fresh.id);
    setIsHistoryOpen(false);
    setAttachedFile(null);
  };

  // Send message (with optional file content)
  const sendMessage = async (text, fileOverride = null) => {
    const activeFile = fileOverride || attachedFile;
    if ((!text || !text.trim()) && !activeFile) return;
    if (isLoading) return;

    const rawQuery = (text || '').trim();
    
    // Construct user visible content vs prompt content
    let displayContent = rawQuery;
    let payloadPrompt = rawQuery;

    if (activeFile) {
      const fileHeader = `📄 [Attached File: ${activeFile.name} (${(activeFile.size / 1024).toFixed(1)} KB)]`;
      displayContent = rawQuery 
        ? `${fileHeader}\n\n${rawQuery}` 
        : `${fileHeader}\n\nPlease analyze this file content and provide typing drill / key insights.`;
      
      payloadPrompt = `[Attached File: ${activeFile.name}]\n\`\`\`\n${activeFile.content.slice(0, 4000)}\n\`\`\`\n\nUser Question/Instruction:\n${rawQuery || 'Please review this file and suggest a typing drill or summary.'}`;
    }

    const userMsg = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: displayContent,
      fileInfo: activeFile ? { name: activeFile.name, size: activeFile.size } : null,
      timestamp: new Date().toISOString(),
    };

    // Calculate auto title if this is the first user message
    const isFirstUserMsg = !currentSession.messages.some((m) => m.role === 'user');
    const autoTitle = isFirstUserMsg
      ? rawQuery
        ? rawQuery.length > 28
          ? rawQuery.slice(0, 28) + '...'
          : rawQuery
        : activeFile
        ? `File: ${activeFile.name.slice(0, 20)}`
        : 'Typing Discussion'
      : currentSession.title;

    // Append user message immediately
    const updatedMessagesWithUser = [...currentSession.messages, userMsg];

    setConversations((prev) =>
      prev.map((s) =>
        s.id === currentSession.id
          ? {
              ...s,
              title: autoTitle,
              updatedAt: new Date().toISOString(),
              messages: updatedMessagesWithUser,
            }
          : s
      )
    );

    // Clear attached file after attaching
    setAttachedFile(null);
    setIsLoading(true);

    try {
      // Prepare previous history for API context
      const historyPayload = updatedMessagesWithUser
        .filter((m) => m.id !== 'greet_init')
        .slice(-6)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await aiService.sendChatMessage({
        message: payloadPrompt,
        history: historyPayload,
      });

      const replyContent =
        response?.data?.reply ||
        response?.reply ||
        `Keep practicing regularly on Tara Typing to build speed and rhythm!`;

      const aiMsg = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        isStreaming: true,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...updatedMessagesWithUser, aiMsg],
              }
            : s
        )
      );
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Connection Note:** I could not reach the high-speed AI server right now. 

**Quick Coach Tip:** Make sure to sit up straight with your wrists slightly elevated above the keyboard. Practicing 15 minutes a day with 95%+ accuracy builds the fastest muscle memory!`,
        isStreaming: true,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((s) =>
          s.id === currentSession.id
            ? {
                ...s,
                messages: [...updatedMessagesWithUser, fallbackMsg],
              }
            : s
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const finishStreaming = (messageId) => {
    setConversations((prev) =>
      prev.map((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m.id === messageId ? { ...m, isStreaming: false } : m
        ),
      }))
    );
  };

  // Group conversations by Pin status & Date
  const groupedConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = conversations.filter((c) => {
      if (!query) return true;
      const matchTitle = c.title.toLowerCase().includes(query);
      const matchMsg = c.messages.some((m) => m.content.toLowerCase().includes(query));
      const matchDate = new Date(c.createdAt).toLocaleDateString().includes(query);
      return matchTitle || matchMsg || matchDate;
    });

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86400000;
    const last7Days = today - 7 * 86400000;
    const last30Days = today - 30 * 86400000;

    const groups = {
      '📌 Pinned Discussions': [],
      Today: [],
      Yesterday: [],
      'Previous 7 Days': [],
      'Previous 30 Days': [],
      Older: [],
    };

    filtered.forEach((conv) => {
      if (conv.isPinned) {
        groups['📌 Pinned Discussions'].push(conv);
        return;
      }

      const convTime = new Date(conv.updatedAt || conv.createdAt).getTime();
      if (convTime >= today) {
        groups.Today.push(conv);
      } else if (convTime >= yesterday) {
        groups.Yesterday.push(conv);
      } else if (convTime >= last7Days) {
        groups['Previous 7 Days'].push(conv);
      } else if (convTime >= last30Days) {
        groups['Previous 30 Days'].push(conv);
      } else {
        groups.Older.push(conv);
      }
    });

    return groups;
  }, [conversations, searchQuery]);

  return (
    <ChatbotContext.Provider
      value={{
        isOpen,
        isMinimized,
        isFullScreen,
        isLoading,
        searchQuery,
        setSearchQuery,
        isHistoryOpen,
        setIsHistoryOpen,
        attachedFile,
        setAttachedFile,
        conversations,
        currentSession,
        currentSessionId,
        groupedConversations,
        openChat,
        closeChat,
        toggleChat,
        toggleMinimize,
        toggleFullScreen,
        startNewChat,
        selectSession,
        togglePinSession,
        deleteSession,
        clearAllHistory,
        sendMessage,
        finishStreaming,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

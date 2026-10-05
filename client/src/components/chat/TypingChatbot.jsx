import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  Clock,
  Search,
  Bot,
  User,
  ArrowLeft,
  Copy,
  Check,
  Pin,
  PinOff,
  Paperclip,
  FileCode,
  FileText,
  Zap,
  Target,
  Keyboard,
  Shield,
  CornerDownLeft,
  Mic,
  MicOff,
} from 'lucide-react';
import { useChatbot } from '../../context/ChatbotContext';
import { toast } from 'react-toastify';

const QUICK_PROMPTS = [
  { icon: '🚀', label: 'Break 60 WPM plateau', query: 'How can I break through my 60 WPM typing speed plateau?' },
  { icon: '🎯', label: 'Fix backspace habit', query: 'How do I stop making mistakes and reduce my heavy backspace usage?' },
  { icon: '🖐️', label: 'Numbers & symbol keys', query: 'What is the correct finger placement for numbers (1-0) and special symbols?' },
  { icon: '⌨️', label: 'Best keyboard switches', query: 'Which mechanical keyboard switches (Red, Brown, Blue) are best for touch typing?' },
  { icon: '🧘', label: 'Ergonomic posture', query: 'What is the ideal sitting posture and wrist angle to prevent fatigue and RSI?' },
];

/**
 * Rich Formatted Markdown Message with Syntax Highlighted Code Blocks & Copy
 */
const FormattedMessage = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyCode = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderContent = (rawText) => {
    if (!rawText) return null;

    // Split by code blocks ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(rawText)) !== null) {
      const textBefore = rawText.slice(lastIndex, match.index);
      if (textBefore) {
        elements.push(renderTextParagraphs(textBefore, `text_${lastIndex}`));
      }

      const lang = match[1] || 'code';
      const code = match[2].trim();
      const codeKey = `code_${match.index}`;

      elements.push(
        <div key={codeKey} className="my-2.5 rounded-2xl border border-border/80 bg-slate-950 text-slate-100 overflow-hidden shadow-md max-w-full">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="uppercase font-bold text-[10px] text-primary">{lang}</span>
            <button
              type="button"
              onClick={() => handleCopyCode(code, codeKey)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              title="Copy code"
            >
              {copiedIndex === codeKey ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-3 text-xs font-mono overflow-x-auto text-emerald-300 leading-relaxed max-w-full whitespace-pre-wrap break-all [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    const remainingText = rawText.slice(lastIndex);
    if (remainingText) {
      elements.push(renderTextParagraphs(remainingText, `text_${lastIndex}`));
    }

    return elements;
  };

  const renderTextParagraphs = (text, keyPrefix) => {
    const lines = text.split('\n');
    return (
      <div key={keyPrefix} className="space-y-1 break-words [word-break:break-word]">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5 text-xs sm:text-sm">
                <span className="text-primary font-bold mt-1 shrink-0">•</span>
                <span className="flex-1 min-w-0 break-words">{formatInline(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Numbered list
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 my-0.5 text-xs sm:text-sm">
                <span className="text-primary font-bold font-mono text-xs mt-0.5 shrink-0">{numMatch[1]}.</span>
                <span className="flex-1 min-w-0 break-words">{formatInline(numMatch[2])}</span>
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Standard paragraph
          return (
            <p key={idx} className="text-xs sm:text-sm leading-relaxed my-0.5 break-words">
              {formatInline(line)}
            </p>
          );
        })}
      </div>
    );
  };

  const formatInline = (text) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] font-bold text-primary border border-border break-all">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-foreground/90">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative group max-w-full">
      <div className="space-y-1">{renderContent(content)}</div>
      <button
        type="button"
        onClick={handleCopyAll}
        className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-card/90 border border-border text-muted-foreground hover:text-foreground cursor-pointer shadow-md"
        title="Copy full response"
      >
        {copiedAll ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
      </button>
    </div>
  );
};

/**
 * Typewriter Message: Simulates live real-time ChatGPT typing streaming for new AI responses
 */
const TypewriterMessage = ({ content, isStreaming = false, onComplete, scrollContainerRef }) => {
  const [displayedLength, setDisplayedLength] = useState(() => (isStreaming ? 0 : content.length));

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedLength(content.length);
      return;
    }

    if (displayedLength >= content.length) {
      if (onComplete) onComplete();
      return;
    }

    // Dynamic typing speed: adapts to message length so it finishes in 1-2 seconds
    const totalChars = content.length;
    const step = totalChars > 500 ? 6 : totalChars > 250 ? 4 : totalChars > 100 ? 2 : 1;
    const intervalMs = totalChars > 500 ? 10 : 14;

    const timer = setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = Math.min(prev + step, totalChars);
        if (scrollContainerRef?.current) {
          scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
        return next;
      });
    }, intervalMs);

    return () => clearTimeout(timer);
  }, [displayedLength, content, isStreaming, onComplete, scrollContainerRef]);

  const textToRender = isStreaming && displayedLength < content.length
    ? content.slice(0, displayedLength)
    : content;

  const isStillTyping = isStreaming && displayedLength < content.length;

  return (
    <div className="relative group max-w-full">
      <FormattedMessage content={textToRender} />
      {isStillTyping && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary rounded-xs animate-pulse align-middle" />
      )}
    </div>
  );
};

export const TypingChatbot = () => {
  const {
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
  } = useChatbot();

  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const chatContainerRef = useRef(null);
  const outerModalRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition Web API for voice typing
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setInputMessage((prev) => {
              const trimmed = prev.trim();
              return trimmed ? `${trimmed} ${transcript.trim()}` : transcript.trim();
            });
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
          if (event.error !== 'no-speech') {
            toast.info(`Microphone: ${event.error}`);
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition initialization error:', e);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info('Speech-to-text is not supported by your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsListening(false);
      toast.info('🎙️ Voice input stopped');
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        toast.success('🎙️ Listening... Speak now to type!', { autoClose: 2000 });
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
        setIsListening(false);
      }
    }
  };

  // Auto-scroll ONLY the chat messages container (Never scroll outer modal or window)
  useEffect(() => {
    if (isOpen && !isHistoryOpen && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    if (outerModalRef.current) {
      outerModalRef.current.scrollTop = 0;
    }
  }, [currentSession?.messages, isLoading, isOpen, isHistoryOpen]);

  // Focus textarea when opened without scrolling parent container
  useEffect(() => {
    if (isOpen && !isMinimized && !isHistoryOpen) {
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        if (outerModalRef.current) {
          outerModalRef.current.scrollTop = 0;
        }
      }, 100);
    }
  }, [isOpen, isMinimized, isHistoryOpen, currentSessionId]);

  // Handle file upload / document read
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setAttachedFile({
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          content: text,
        });
        toast.success(`📎 Attached "${file.name}" for AI analysis!`, { autoClose: 2000 });
        inputRef.current?.focus();
      }
    };
    reader.onerror = () => {
      toast.error('Could not read file contents. Please try plain text/code files.');
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if ((!inputMessage.trim() && !attachedFile) || isLoading) return;
    sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (query) => {
    sendMessage(query);
  };

  return (
    <>
      {/* 1. FLOATING LAUNCHER BUTTON (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary via-purple-600 to-indigo-600 px-4 py-3 text-white shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 cursor-pointer select-none group border border-white/20"
          title="Open AI Typing Assistant & Chatbot (ChatGPT Mode)"
        >
          <div className="relative shrink-0">
            <Bot size={20} className="transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Tara Typing Coach
          </span>
          <span className="hidden sm:inline-block rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-black uppercase tracking-wider">
            AI
          </span>
        </button>
      )}

      {/* 2. MINIMIZED FLOATING PILL */}
      {isOpen && isMinimized && (
        <div
          onClick={toggleMinimize}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur-xl px-4 py-2.5 shadow-2xl text-foreground cursor-pointer transition-all hover:scale-102 select-none max-w-[90vw]"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shrink-0">
              <Bot size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span>AI Typing Coach</span>
                {currentSession.isPinned && <span className="text-[10px]">📌</span>}
              </p>
              <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">
                {currentSession.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMinimize();
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded-lg cursor-pointer"
              title="Expand"
            >
              <Maximize2 size={14} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeChat();
              }}
              className="p-1 text-muted-foreground hover:text-destructive rounded-lg cursor-pointer"
              title="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 3. FULL CHATBOT WINDOW */}
      {isOpen && !isMinimized && (
        <div
          ref={outerModalRef}
          onScroll={(e) => {
            if (e.currentTarget.scrollTop !== 0) e.currentTarget.scrollTop = 0;
            if (e.currentTarget.scrollLeft !== 0) e.currentTarget.scrollLeft = 0;
          }}
          style={
            !isFullScreen
              ? {
                  width: 'min(445px, calc(100vw - 1.5rem))',
                  height: 'min(560px, calc(100dvh - 2rem))',
                  maxHeight: 'calc(100dvh - 2rem)',
                }
              : undefined
          }
          className={`fixed z-50 flex flex-col bg-card border border-border/90 shadow-2xl shadow-black/60 text-foreground overflow-hidden select-none ${
            isFullScreen
              ? 'inset-2 sm:inset-4 md:inset-6 rounded-3xl'
              : 'bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-2xl sm:rounded-3xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Lighting Glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-52 h-52 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-52 h-52 rounded-full bg-purple-500/15 blur-3xl" />

          {/* CHATBOT TOP HEADER (Fixed Top / shrink-0) */}
          <div className="flex items-center justify-between border-b border-border bg-card px-3 sm:px-3.5 py-2.5 shrink-0 z-30 gap-1.5 shadow-xs select-none">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                className={`grid h-8 w-8 place-items-center rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isHistoryOpen
                    ? 'border-primary bg-primary/20 text-primary shadow-xs'
                    : 'border-border bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title="Toggle Past Chat History"
              >
                <Clock size={15} />
              </button>

              <div className="flex items-center gap-2 min-w-0">
                <div className="relative shrink-0">
                  <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-primary via-purple-600 to-indigo-600 text-white shadow-md shadow-primary/25">
                    <Bot size={16} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-2 ring-card" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground truncate">
                      Tara AI Coach
                    </h3>
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-1.5 py-0.2 text-[9px] font-extrabold text-primary uppercase shrink-0">
                      GPT
                    </span>
                    {currentSession.isPinned && <span title="Pinned conversation" className="text-[10px] shrink-0">📌</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {currentSession.title}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Right Action Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {/* + New Chat Button */}
              <button
                type="button"
                onClick={startNewChat}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-all shadow-xs cursor-pointer select-none active:scale-95 shrink-0"
                title="Start a fresh new chat"
              >
                <Plus size={14} className="stroke-[2.5]" />
                <span className="inline text-xs font-semibold">New</span>
              </button>

              {/* Pin / Unpin Button */}
              <button
                type="button"
                onClick={(e) => togglePinSession(currentSession.id, e)}
                className={`grid h-8 w-8 place-items-center rounded-xl border transition-colors cursor-pointer shrink-0 ${
                  currentSession.isPinned
                    ? 'border-amber-500/50 bg-amber-500/15 text-amber-500'
                    : 'border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={currentSession.isPinned ? 'Unpin this chat' : 'Pin chat to top'}
              >
                {currentSession.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullScreen}
                className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                title={isFullScreen ? 'Exit Fullscreen' : 'Expand to Fullscreen'}
              >
                {isFullScreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>

              {/* Minimize */}
              <button
                type="button"
                onClick={toggleMinimize}
                className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                title="Minimize"
              >
                <Minus size={13} />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeChat}
                className="grid h-8 w-8 place-items-center rounded-xl border border-border bg-muted/40 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer shrink-0"
                title="Close"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* MAIN BODY AREA */}
          <div className="flex-1 flex overflow-hidden relative min-h-0">
            
            {/* HISTORY SIDEBAR / SLIDE-IN OVERLAY (No Overlap) */}
            <div
              className={`flex flex-col border-r border-border/80 bg-card transition-all duration-200 z-30 ${
                isHistoryOpen
                  ? isFullScreen
                    ? 'w-72 sm:w-80 relative shrink-0'
                    : 'absolute inset-0 z-30 bg-card flex flex-col'
                  : 'w-0 hidden'
              }`}
            >
              {/* Sidebar Header & Search */}
              <div className="p-3 border-b border-border/80 space-y-2 bg-muted/20 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <Clock size={13} className="text-primary" /> Chat History
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(false)}
                    className="p-1 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Back to conversation"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search past chats..."
                    className="w-full rounded-xl border border-border bg-background pl-8 pr-7 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <button
                    type="button"
                    onClick={startNewChat}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 cursor-pointer select-none"
                  >
                    <Plus size={12} />
                    <span>+ New Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Delete all conversation history? This cannot be undone.')) {
                        clearAllHistory();
                      }
                    }}
                    className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 size={11} />
                    <span>Clear All</span>
                  </button>
                </div>
              </div>

              {/* Grouped History List */}
              <div className="flex-1 overflow-y-auto p-2.5 space-y-3 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden">
                {Object.entries(groupedConversations).map(([groupLabel, items]) => {
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={groupLabel} className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1.5 flex items-center gap-1">
                        {groupLabel}
                      </span>
                      <div className="space-y-0.5">
                        {items.map((session) => {
                          const isSelected = session.id === currentSessionId;

                          return (
                            <div
                              key={session.id}
                              onClick={() => selectSession(session.id)}
                              className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl border transition-all cursor-pointer group ${
                                isSelected
                                  ? 'bg-primary/15 border-primary shadow-xs text-foreground font-semibold'
                                  : 'border-transparent hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              <div className="min-w-0 flex-1 flex items-center gap-1.5">
                                {session.isPinned && (
                                  <span className="text-[10px] text-amber-500 shrink-0" title="Pinned">
                                    📌
                                  </span>
                                )}
                                <p className="text-xs truncate">{session.title}</p>
                              </div>

                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => togglePinSession(session.id, e)}
                                  className={`p-1 rounded-md transition-colors ${
                                    session.isPinned
                                      ? 'text-amber-500 hover:bg-amber-500/20'
                                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                  }`}
                                  title={session.isPinned ? 'Unpin' : 'Pin to top'}
                                >
                                  {session.isPinned ? <PinOff size={11} /> : <Pin size={11} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => deleteSession(session.id, e)}
                                  className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                  title="Delete conversation"
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {Object.values(groupedConversations).every((arr) => arr.length === 0) && (
                  <div className="text-center py-10 text-muted-foreground">
                    <Clock size={24} className="mx-auto text-muted-foreground/30 mb-2" />
                    <p className="text-xs font-semibold">No discussions found</p>
                  </div>
                )}
              </div>
            </div>

            {/* CHAT MESSAGES STREAM */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-background/30">
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-button]:hidden"
              >
                {currentSession.messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  const timeFormatted = new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2 sm:gap-2.5 max-w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shrink-0 mt-0.5 shadow-sm">
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`flex flex-col min-w-0 ${
                          isUser ? 'items-end max-w-[85%]' : 'items-start max-w-[92%]'
                        }`}
                      >
                        <div
                          className={`rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all max-w-full overflow-hidden ${
                            isUser
                              ? 'bg-gradient-to-r from-primary to-purple-600 text-white rounded-tr-xs font-medium text-xs sm:text-sm shadow-primary/20'
                              : 'bg-card border border-border text-foreground rounded-tl-xs shadow-black/5'
                          }`}
                        >
                          {isUser ? (
                            <FormattedMessage content={msg.content} />
                          ) : (
                            <TypewriterMessage
                              content={msg.content}
                              isStreaming={Boolean(msg.isStreaming)}
                              onComplete={() => finishStreaming(msg.id)}
                              scrollContainerRef={chatContainerRef}
                            />
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground/70 px-1 mt-1 font-mono">
                          {timeFormatted}
                        </span>
                      </div>

                      {isUser && (
                        <div className="grid h-7 w-7 place-items-center rounded-xl bg-muted border border-border text-muted-foreground shrink-0 mt-0.5 shadow-sm">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Live Loading / Streaming Indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 items-start justify-start animate-fadeIn">
                    <div className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs p-3 bg-card border border-border text-muted-foreground flex items-center gap-1.5 shadow-sm">
                      <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="text-xs font-medium text-muted-foreground ml-1.5">Coach thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* QUICK PROMPTS CHIPS (Smooth horizontal scroll without ugly scrollbar) */}
              {currentSession.messages.length <= 2 && (
                <div className="px-3.5 py-2 border-t border-border/80 bg-muted/20 shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground block mb-1.5 flex items-center gap-1">
                    <span>💡 Suggested Questions:</span>
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
                    {QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handlePromptClick(item.query)}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all cursor-pointer shadow-xs select-none shrink-0"
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT FOOTER (Unified Modern ChatGPT Capsule Layout) */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-border/80 bg-card shrink-0 space-y-2"
              >
                {/* Attached File Preview Chip */}
                {attachedFile && (
                  <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-primary/10 border border-primary/30 text-xs">
                    <div className="flex items-center gap-2 min-w-0 truncate">
                      <FileCode size={15} className="text-primary shrink-0" />
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-foreground block truncate">{attachedFile.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {(attachedFile.size / 1024).toFixed(1)} KB • Text/Code Document
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 text-muted-foreground hover:text-destructive rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove attached file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Main Unified Input Pill */}
                <div className="flex flex-col rounded-2xl border border-border bg-background focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-2 shadow-sm">
                  {/* Live Listening Audio Indicator Banner */}
                  {isListening && (
                    <div className="flex items-center justify-between px-2.5 py-1 mb-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 animate-pulse">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[11px] font-semibold">🎙️ Listening to your voice... Speak now to type</span>
                      </div>
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className="text-[10px] font-bold underline hover:text-red-700 cursor-pointer"
                      >
                        Stop
                      </button>
                    </div>
                  )}

                  {/* Textarea */}
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      isListening
                        ? 'Listening to speech...'
                        : attachedFile
                        ? 'Ask AI about this document, or press Enter...'
                        : 'Ask anything or click Voice to speak...'
                    }
                    className="w-full resize-none bg-transparent px-2 py-1 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none max-h-24 min-h-[32px] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:hidden"
                  />

                  {/* Actions Toolbar inside pill */}
                  <div className="flex items-center justify-between pt-1 px-1 border-t border-border/40">
                    <div className="flex items-center gap-1.5">
                      {/* Hidden File Input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.json,.js,.jsx,.ts,.tsx,.py,.cpp,.c,.java,.html,.css,.md,.csv,.log,.sql"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      {/* File Attach Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex items-center gap-1 p-1.5 rounded-lg border transition-all cursor-pointer ${
                          attachedFile
                            ? 'border-primary bg-primary/15 text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        title="Attach file / code to read and analyze"
                      >
                        <Paperclip size={14} />
                        <span className="text-[10px] hidden sm:inline font-medium">Attach File</span>
                      </button>

                      {/* Voice Speech-to-Text Button */}
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`relative flex items-center gap-1 p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isListening
                            ? 'border-red-500/60 bg-red-500/15 text-red-500 shadow-xs'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        title={isListening ? 'Stop listening (Voice typing)' : 'Speak to type (Voice input)'}
                      >
                        {isListening && (
                          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                          </span>
                        )}
                        {isListening ? <MicOff size={14} className="text-red-500 animate-pulse" /> : <Mic size={14} />}
                        <span className="text-[10px] hidden sm:inline font-medium">
                          {isListening ? 'Listening...' : 'Voice'}
                        </span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground hidden sm:inline">
                        Press <kbd className="font-mono text-[9px] bg-muted px-1 py-0.2 rounded border">Enter ↵</kbd>
                      </span>

                      {/* Send Button */}
                      <button
                        type="submit"
                        disabled={(!inputMessage.trim() && !attachedFile) || isLoading}
                        className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-to-tr from-primary to-purple-600 text-white shadow-md shadow-primary/25 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all cursor-pointer shrink-0"
                        title="Send Message"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
                  <span className="flex items-center gap-1">
                    <Shield size={10} className="text-emerald-500" />
                    <span>Private & Encrypted Local Sessions</span>
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Sparkles size={10} className="text-amber-500" />
                    ChatGPT Mode
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TypingChatbot;

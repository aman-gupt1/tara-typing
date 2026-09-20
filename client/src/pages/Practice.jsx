import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Type, Quote, SlidersHorizontal, Play } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useTypingContext } from '../context/TypingContext';
import CustomTextModal from '../components/typing/CustomTextModal';
import { practiceService } from '../services/practiceService';

const modes = [
  {
    mode: 'time',
    icon: Clock,
    title: 'Time Practice',
    desc: 'Practice with a set time duration.',
    detail: '15s · 30s · 60s · 120s',
    colorClass: 'icon-box-primary',
    hoverBorder: 'hover:border-blue-500/50',
    hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.4)]',
    titleHover: 'group-hover:text-blue-400',
  },
  {
    mode: 'words',
    icon: Type,
    title: 'Words Practice',
    desc: 'Practice with a specific word count.',
    detail: '10 · 25 · 50 · 100 words',
    colorClass: 'icon-box-practice',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]',
    titleHover: 'group-hover:text-emerald-400',
  },
  {
    mode: 'quote',
    icon: Quote,
    title: 'Quote Practice',
    desc: 'Practice with famous quotes and sayings.',
    detail: 'Curated quotes',
    colorClass: 'icon-box-lessons',
    hoverBorder: 'hover:border-purple-500/50',
    hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(168,85,247,0.4)]',
    titleHover: 'group-hover:text-purple-400',
  },
  {
    mode: 'custom',
    icon: SlidersHorizontal,
    title: 'Custom Practice',
    desc: 'Practice with your own text.',
    detail: 'Paste any paragraph',
    colorClass: 'icon-box-streak',
    hoverBorder: 'hover:border-orange-500/50',
    hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:to-transparent',
    iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(249,115,22,0.4)]',
    titleHover: 'group-hover:text-orange-400',
  },
];

export const Practice = () => {
  const { setTestConfig } = useTypingContext();
  const [customModalOpen, setCustomModalOpen] = useState(false);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await practiceService.getHistory();
        if (data && data.length > 0) {
          const formatted = data.map((item, idx) => ({
            id: item._id || String(idx),
            label: `${(item.mode || 'time').toUpperCase()} Mode — ${item.targetParam || `${item.duration || 30}s`}`,
            detail: `${item.wpm} WPM · ${item.accuracy}% Accuracy`,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent',
          }));
          setRecentSessions(formatted);
        } else {
          setRecentSessions([]);
        }
      } catch (err) {
        console.warn('Failed to load practice history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleStartMode = (modeType) => {
    if (modeType === 'custom') {
      setCustomModalOpen(true);
      return;
    }
    setTestConfig((prev) => ({
      ...prev,
      mode: modeType,
    }));
    navigate('/typing-test');
  };

  const handleCustomSubmit = (customText) => {
    setTestConfig((prev) => ({
      ...prev,
      mode: 'custom',
      customText,
    }));
    setCustomModalOpen(false);
    navigate('/typing-test');
  };

  return (
    <div className="w-full flex-1 bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Typing Practice — Tara Typing"
        description="Practice typing with time, words, quote and custom practice modes. Improve your WPM and accuracy."
      />

      <main className="w-full mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Title */}
        <h1 className="font-display text-3xl font-bold">Practice</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a practice mode to improve your typing skills.
        </p>

        {/* 4 Practice Mode Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modes.map((item, idx) => {
            const Icon = item.icon;
            const staggerClass = `stagger-${idx}`;
            return (
              <div
                key={item.title}
                className={`card-glass practice-mode-card group animate-page-enter ${staggerClass} flex flex-col items-center p-6 text-center rounded-2xl border border-border/80 transition-all duration-300 hover:-translate-y-2 cursor-pointer ${item.hoverBorder} ${item.hoverShadow} ${item.hoverBg}`}
              >
                <div className={`practice-mode-icon grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 ${item.colorClass || 'icon-box-primary'} ${item.iconHover}`}>
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h2 className={`practice-mode-title mt-4 font-semibold text-foreground transition-colors duration-300 ${item.titleHover}`}>{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                <p className="mt-2 text-xs text-muted-foreground/70">{item.detail}</p>
                
                <button
                  type="button"
                  onClick={() => handleStartMode(item.mode)}
                  className="bg-gradient-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98] select-none shadow-md shadow-primary/20"
                >
                  <Play size={14} /> Start Practice
                </button>
              </div>
            );
          })}
        </div>

        {/* Recent Practice List */}
        <h2 className="mt-12 font-display text-xl font-bold">Recent Practice</h2>
        <div className="card-glass group mt-4 divide-y divide-border rounded-2xl border border-border/80 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] overflow-hidden">
          {recentSessions.length > 0 ? (
            recentSessions.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors icon-box-practice">
                    <Clock size={17} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{item.date}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-muted-foreground">
              {loadingHistory ? 'Loading your practice history...' : 'No practice sessions recorded yet. Start practicing above to build muscle memory!'}
            </div>
          )}
        </div>
      </main>

      <CustomTextModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        onSubmit={handleCustomSubmit}
      />
    </div>
  );
};

export default Practice;

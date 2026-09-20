import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Target, Zap, Trophy, BookOpen, Users } from 'lucide-react';
import SEO from '../components/common/SEO';
import statsService from '../services/statsService';
import { formatCompactNumber } from '../utils/formatters';

const features = [
  {
    icon: Target,
    title: "Accurate Results",
    desc: "Get precise WPM and accuracy with detailed insights.",
    colorClass: "icon-box-accuracy",
    hoverBorder: "hover:border-emerald-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.25)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-transparent",
    iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.4)]",
    titleHover: "group-hover:text-emerald-400",
  },
  {
    icon: Zap,
    title: "Real-Time Stats",
    desc: "See your progress in real time with beautiful charts.",
    colorClass: "icon-box-primary",
    hoverBorder: "hover:border-blue-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.25)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent",
    iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.4)]",
    titleHover: "group-hover:text-blue-400",
  },
  {
    icon: Trophy,
    title: "Fun & Competitive",
    desc: "Compete with typists around the world.",
    colorClass: "icon-box-achievements",
    hoverBorder: "hover:border-amber-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-amber-500/[0.08] hover:to-transparent",
    iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(245,158,11,0.4)]",
    titleHover: "group-hover:text-amber-400",
  },
  {
    icon: BookOpen,
    title: "Practice & Improve",
    desc: "Practice daily and become a better typist.",
    colorClass: "icon-box-lessons",
    hoverBorder: "hover:border-purple-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.25)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent",
    iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(168,85,247,0.4)]",
    titleHover: "group-hover:text-purple-400",
  },
];

const steps = [
  {
    n: "1",
    title: "Pick a test",
    desc: "Choose 15s, 30s, 60s or 120s — words, quotes or custom text.",
    hoverBorder: "hover:border-blue-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.22)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-blue-500/[0.05] hover:to-transparent",
    badgeGlow: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(59,130,246,0.45)]",
    titleHover: "group-hover:text-blue-400",
  },
  {
    n: "2",
    title: "Start typing",
    desc: "The timer starts on your first keystroke. Stay accurate.",
    hoverBorder: "hover:border-purple-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.22)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-purple-500/[0.05] hover:to-transparent",
    badgeGlow: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(168,85,247,0.45)]",
    titleHover: "group-hover:text-purple-400",
  },
  {
    n: "3",
    title: "Track progress",
    desc: "Review WPM, accuracy and consistency, then beat your best.",
    hoverBorder: "hover:border-emerald-500/50",
    hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(16,185,129,0.22)]",
    hoverBg: "hover:bg-gradient-to-b hover:from-emerald-500/[0.05] hover:to-transparent",
    badgeGlow: "group-hover:scale-110 group-hover:shadow-[0_0_14px_rgba(16,185,129,0.45)]",
    titleHover: "group-hover:text-emerald-400",
  },
];

const floatingKeys = [
  { ch: "T", className: "left-[8%] top-[12%]", rot: "-8deg", delay: "0s" },
  { ch: "A", className: "right-[14%] top-[6%]", rot: "10deg", delay: "0.8s" },
  { ch: "R", className: "right-[8%] top-[38%]", rot: "-6deg", delay: "1.6s" },
  { ch: "A", className: "left-[16%] bottom-[10%]", rot: "8deg", delay: "2.2s" },
];

export const Home = () => {
  const [publicStats, setPublicStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const data = await statsService.getPublicStats();
        if (isMounted && data) {
          setPublicStats(data);
        }
      } catch (err) {
        console.warn('Failed to load public stats:', err);
      } finally {
        if (isMounted) {
          setLoadingStats(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      icon: Keyboard,
      value: publicStats ? formatCompactNumber(publicStats.testsCompleted, true) : '—',
      label: "Tests Completed",
      colorClass: "icon-box-primary",
      hoverBorder: "hover:border-blue-500/50",
      hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.25)]",
      hoverBg: "hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent",
      iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]",
      textHover: "group-hover:text-blue-400",
    },
    {
      icon: Users,
      value: publicStats ? formatCompactNumber(publicStats.typists, true) : '—',
      label: "Typists",
      colorClass: "icon-box-practice",
      hoverBorder: "hover:border-cyan-500/50",
      hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(6,182,212,0.25)]",
      hoverBg: "hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:to-transparent",
      iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]",
      textHover: "group-hover:text-cyan-400",
    },
    {
      icon: BookOpen,
      value: publicStats ? formatCompactNumber(publicStats.lessons, true) : '—',
      label: "Lessons",
      colorClass: "icon-box-lessons",
      hoverBorder: "hover:border-purple-500/50",
      hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.25)]",
      hoverBg: "hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent",
      iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]",
      textHover: "group-hover:text-purple-400",
    },
    {
      icon: Zap,
      value: publicStats ? formatCompactNumber(publicStats.bestWpm, false) : '—',
      label: "Best WPM",
      colorClass: "icon-box-streak",
      hoverBorder: "hover:border-orange-500/50",
      hoverShadow: "hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.25)]",
      hoverBg: "hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:to-transparent",
      iconHover: "group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.35)]",
      textHover: "group-hover:text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Tara Typing — Free Online Typing Test"
        description="Type Faster. Think Sharper. Free online typing speed test with real-time WPM and accuracy tracking."
      />

      <main>
        {/* Hero Section */}
        <section className="relative">
          {/* Subtle Ambient Radial Glow (isolated so it never clips the keyboard) */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div
              className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
            />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            {/* Left Hero Content */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <p className="hero-tagline-badge mb-3 relative inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-xs font-medium text-primary select-none">
                <span className="hero-border-beam" aria-hidden="true" />
                <span className="relative z-10">Free Online Typing Test</span>
              </p>
              
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Type Faster.
                <br />
                Think Sharper.
                <br />
                <span className="text-gradient">Achieve More.</span>
              </h1>

              <p className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
                Test your typing speed, improve accuracy and track your progress with Tara Typing.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/typing-test"
                  className="bg-gradient-primary glow-primary rounded-xl px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.03] select-none"
                >
                  Start Typing Test
                </Link>
                <Link
                  to="/practice"
                  className="rounded-xl border border-border bg-card px-7 py-3.5 font-semibold text-foreground transition-colors hover:bg-accent select-none"
                >
                  Practice Now
                </Link>
              </div>
            </div>

            {/* Right Hero: Floating 3D Animated Keyboard */}
            <div
              className="relative mx-auto w-full max-w-lg lg:scale-125 lg:origin-center lg:-translate-x-2 xl:-translate-x-4"
              aria-hidden="true"
            >
              {/* Floating keycaps */}
              {floatingKeys.map((key, idx) => (
                <span
                  key={idx}
                  style={{ "--float-rot": key.rot, animationDelay: key.delay }}
                  className={`animate-float-key hero-keycap-glow absolute ${key.className} grid h-14 w-14 place-items-center rounded-2xl border font-display text-xl font-extrabold select-none z-10 backdrop-blur transition-all duration-200
                    border-primary/30 bg-slate-100 text-slate-900
                    dark:border-primary/40 dark:bg-[#131526] dark:text-white`}
                >
                  {key.ch}
                </span>
              ))}

              {/* Keyboard Chassis */}
              <div className="hero-keyboard-glow mx-auto mt-16 grid rotate-[-4deg] grid-cols-10 gap-1.5 p-4 rounded-2xl transition-all duration-200
                border border-primary/25 bg-[#f7f4fc]/95 dark:border-primary/25 dark:bg-[#0c0e1a]/95">
                {"QWERTYUIOPASDFGHJKL;ZXCVBNM,.".split("").map((ch, i) => (
                  <span
                    key={i}
                    className={`grid h-9 place-items-center rounded-md border text-[11px] font-semibold select-none transition-all duration-150 ${
                      "TARA".includes(ch)
                        ? "border-pink-500 bg-pink-50/90 text-pink-600 font-bold shadow-[0_1px_2px_rgba(0,0,0,0.05)] border-b-2 border-b-pink-400 dark:border-pink-500 dark:bg-pink-500/15 dark:text-pink-400 dark:shadow-none dark:border-b dark:font-bold"
                        : "border-slate-200/90 bg-white text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_0_rgba(203,213,225,0.7)] hover:bg-slate-50 dark:border-white/[0.08] dark:bg-[#141729] dark:text-slate-300 dark:shadow-none dark:hover:bg-[#191c33]"
                    }`}
                  >
                    {ch}
                  </span>
                ))}
                <span className="col-span-10 mt-1 grid h-9 place-items-center rounded-md border border-slate-200/90 bg-white text-[11px] font-medium text-slate-600 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_1px_0_rgba(203,213,225,0.7)] select-none dark:border-white/[0.08] dark:bg-[#141729] dark:text-slate-400 dark:shadow-none">
                  Space
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6" aria-label="Statistics">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`card-glass home-stat-card group animate-page-enter stagger-${i} flex flex-col items-center gap-1 p-5 text-center transition-all duration-300 hover:-translate-y-1.5 cursor-default ${stat.hoverBorder} ${stat.hoverShadow} ${stat.hoverBg}`}
                >
                  <div className={`mb-1 grid h-10 w-10 place-items-center rounded-xl transition-all duration-300 ${stat.colorClass || 'icon-box-primary'} ${stat.iconHover}`}>
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className={`font-display text-2xl font-bold text-foreground transition-colors duration-300 ${stat.textHover}`}>
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Tara Typing Section */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="text-center font-display text-3xl font-bold text-foreground">
            Why Choose <span className="text-gradient">Tara Typing?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
            Everything you need to measure and improve your typing speed — free, fast and beautiful.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className={`card-glass home-feature-card group animate-page-enter stagger-${idx} p-6 rounded-2xl border border-border/80 transition-all duration-300 hover:-translate-y-1.5 cursor-default ${feat.hoverBorder} ${feat.hoverShadow} ${feat.hoverBg}`}
                >
                  <div className={`home-feature-icon mb-4 grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 ${feat.colorClass || 'icon-box-primary'} ${feat.iconHover}`}>
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className={`home-feature-title font-semibold text-foreground transition-colors duration-300 ${feat.titleHover}`}>{feat.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-y border-border bg-card/40 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 className="text-center font-display text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`home-step-card group relative rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-1.5 cursor-default ${step.hoverBorder} ${step.hoverShadow} ${step.hoverBg}`}
                >
                  <span className={`home-step-badge bg-gradient-primary absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full font-display text-sm font-bold text-primary-foreground glow-primary transition-all duration-300 ${step.badgeGlow}`}>
                    {step.n}
                  </span>
                  <h3 className={`home-step-title mt-3 font-semibold text-foreground transition-colors duration-300 ${step.titleHover}`}>{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link
                to="/typing-test"
                className="bg-gradient-primary glow-primary inline-block rounded-xl px-8 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.03] select-none"
              >
                Take the Free Typing Test
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;

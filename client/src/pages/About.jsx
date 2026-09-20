import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Check, CirclePlay, Gauge, Globe2, Keyboard,
  LockKeyhole, Medal, ShieldCheck, Sparkles, Target, Trophy, Users, Zap,
} from 'lucide-react';
import SEO from '../components/common/SEO';

/* ─── Static Data with Distinct Hover Themes (like Settings Page) ─── */
const features = [
  {
    icon: Gauge,
    title: 'Take Typing Tests',
    description: 'Test your typing speed and accuracy instantly.',
    color: 'icon-box-primary',
    hoverBorder: 'hover:border-blue-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(59,130,246,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent dark:hover:from-[#09152C] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    titleHover: 'group-hover:text-blue-500 dark:group-hover:text-blue-300',
  },
  {
    icon: Keyboard,
    title: 'Practice Typing',
    description: 'Improve with multiple practice modes.',
    color: 'icon-box-practice',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(16,185,129,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-transparent dark:hover:from-[#09221C] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    titleHover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-300',
  },
  {
    icon: BookOpen,
    title: 'Learn Touch Typing',
    description: 'Build better habits and type with confidence.',
    color: 'icon-box-lessons',
    hoverBorder: 'hover:border-amber-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(245,158,11,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-amber-500/[0.08] hover:to-transparent dark:hover:from-[#241A0A] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    titleHover: 'group-hover:text-amber-500 dark:group-hover:text-amber-300',
  },
  {
    icon: Trophy,
    title: 'Try Daily Challenge',
    description: 'A new challenge every day.',
    color: 'icon-box-streak',
    hoverBorder: 'hover:border-purple-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(168,85,247,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent dark:hover:from-[#1A102E] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    titleHover: 'group-hover:text-purple-500 dark:group-hover:text-purple-300',
  },
  {
    icon: Users,
    title: 'View Leaderboard',
    description: 'See top typists worldwide.',
    color: 'icon-box-achievements',
    hoverBorder: 'hover:border-rose-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(244,63,94,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-rose-500/[0.08] hover:to-transparent dark:hover:from-[#280D1A] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-rose-500/20 group-hover:text-rose-400 group-hover:shadow-[0_0_15px_rgba(244,63,94,0.35)]',
    titleHover: 'group-hover:text-rose-500 dark:group-hover:text-rose-300',
  },
];

const reasons = [
  {
    icon: Zap,
    title: 'Improve Your Speed',
    description: 'Practice regularly and increase your WPM.',
    color: 'icon-box-primary',
    hoverBorder: 'hover:border-orange-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(249,115,22,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:to-transparent dark:hover:from-[#281308] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-orange-500/20 group-hover:text-orange-400 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    titleHover: 'group-hover:text-orange-500 dark:group-hover:text-orange-300',
  },
  {
    icon: Target,
    title: 'Boost Accuracy',
    description: 'Reduce errors and type with precision.',
    color: 'icon-box-accuracy',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(16,185,129,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-emerald-500/[0.08] hover:to-transparent dark:hover:from-[#09221C] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    titleHover: 'group-hover:text-emerald-500 dark:group-hover:text-emerald-300',
  },
  {
    icon: Gauge,
    title: 'Track Progress',
    description: 'Detailed stats and insights to track your growth.',
    color: 'icon-box-lessons',
    hoverBorder: 'hover:border-purple-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(168,85,247,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent dark:hover:from-[#1A102E] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:text-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    titleHover: 'group-hover:text-purple-500 dark:group-hover:text-purple-300',
  },
  {
    icon: Globe2,
    title: 'Global Leaderboard',
    description: 'Compete with typists worldwide.',
    color: 'icon-box-streak',
    hoverBorder: 'hover:border-cyan-500/50',
    hoverShadow: 'hover:shadow-[0_14px_32px_-6px_rgba(6,182,212,0.28)]',
    hoverBg: 'hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:to-transparent dark:hover:from-[#091D2C] dark:hover:to-[#0B1220]',
    iconHover: 'group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    titleHover: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-300',
  },
];

const guestBenefits   = ['Take typing tests', 'Practice typing', 'Learn touch typing', 'Try daily challenges', 'View public leaderboard', 'Explore the platform'];
const accountBenefits = ['Save your test history', 'Track your progress', 'Personal dashboard', 'Achievements & badges', 'Streak tracking', 'Personalized experience'];
const keyboardRows    = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];


/* ─── Sub-components ─────────────────────────────────────── */
function SectionHeading({ title, titleBlue, description }) {
  return (
    <div className="max-w-2xl text-left">
      <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}{titleBlue && <> <span className="text-primary">{titleBlue}</span></>}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      )}
    </div>
  );
}

function FeatureCard({ item }) {
  const Icon = item.icon;
  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-2xl border border-border/80 bg-card/90 dark:bg-[#0B1220]/90 p-5 sm:p-6 shadow-md backdrop-blur-sm transition-all duration-300 ease-out cursor-default hover:-translate-y-1.5 ${item.hoverBorder} ${item.hoverShadow} ${item.hoverBg}`}
    >
      <div>
        <div
          className={`grid h-11 w-11 place-items-center rounded-xl transition-all duration-300 ease-out ${item.color} ${item.iconHover}`}
        >
          <Icon size={20} aria-hidden="true" />
        </div>
        <h3 className={`mt-4 font-semibold text-foreground transition-colors duration-200 ${item.titleHover}`}>
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
          {item.description}
        </p>
      </div>
    </article>
  );
}

function TypingVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl py-8 sm:py-10" aria-hidden="true">
      <div className="absolute inset-x-10 top-10 h-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="group/visual relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 shadow-[0_20px_50px_-22px_rgba(37,99,235,0.5)] backdrop-blur sm:p-7 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_24px_50px_-15px_rgba(59,130,246,0.35)]">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />Live typing session
          </div>
          <Sparkles size={16} className="text-primary transition-transform duration-300 group-hover/visual:rotate-12 group-hover/visual:scale-110" />
        </div>
        <div className="mt-7 rounded-2xl border border-border bg-background/70 p-3 shadow-inner sm:p-4">
          {keyboardRows.map((row, rowIndex) => (
            <div key={row} className={`mb-1.5 flex justify-center gap-1.5 ${rowIndex === 2 ? 'mb-0' : ''}`}>
              {row.split('').map((key) => (
                <span
                  key={key}
                  className={`grid h-8 w-8 place-items-center rounded-md border text-[10px] font-semibold shadow-sm sm:h-10 sm:w-10 sm:text-xs transition-colors duration-200 ${'TARA'.includes(key) ? 'border-primary/60 bg-primary/20 text-primary' : 'border-border bg-card text-muted-foreground'}`}
                >
                  {key}
                </span>
              ))}
            </div>
          ))}
          <div className="mx-auto mt-1.5 grid h-8 w-3/5 place-items-center rounded-md border border-border bg-card font-display text-[10px] font-semibold tracking-[0.12em] text-muted-foreground shadow-sm sm:h-10 sm:text-xs">SPACE</div>
        </div>
      </div>
      <div className="absolute -left-2 top-1/4 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-left-8 transition-transform duration-300 hover:scale-105"><p className="text-[10px] font-medium text-muted-foreground">Speed</p><p className="font-display text-sm font-bold text-primary">120 WPM</p></div>
      <div className="absolute -right-2 top-14 rounded-xl border border-border bg-card px-3 py-2 shadow-lg sm:-right-7 transition-transform duration-300 hover:scale-105"><p className="text-[10px] font-medium text-muted-foreground">Accuracy</p><p className="font-display text-sm font-bold text-emerald-500">98%</p></div>
      <div className="absolute bottom-0 right-4 flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary shadow-lg sm:right-10 transition-transform duration-300 hover:scale-105"><Medal size={14} />Keep Improving</div>
    </div>
  );
}

function ComparisonCard({ title, description, benefits, account = false }) {
  const theme = account
    ? {
        border: 'border-primary/40 hover:border-blue-500/60',
        shadow: 'hover:shadow-[0_16px_36px_-6px_rgba(0,102,255,0.28)]',
        bg: 'bg-primary/[0.035] hover:bg-gradient-to-b hover:from-blue-500/[0.1] hover:to-transparent dark:hover:from-[#081530] dark:hover:to-[#0B1220]',
        iconHover: 'group-hover:scale-110 group-hover:bg-blue-500/25 group-hover:text-blue-300 group-hover:shadow-[0_0_15px_rgba(0,102,255,0.35)]',
        titleHover: 'group-hover:text-primary dark:group-hover:text-blue-300',
        checkBg: 'bg-primary/10 text-primary',
        iconBox: 'icon-box-primary',
        IconComp: LockKeyhole,
      }
    : {
        border: 'border-border/80 hover:border-cyan-500/50',
        shadow: 'hover:shadow-[0_16px_36px_-6px_rgba(6,182,212,0.26)]',
        bg: 'bg-card/90 dark:bg-[#0B1220]/90 hover:bg-gradient-to-b hover:from-cyan-500/[0.08] hover:to-transparent dark:hover:from-[#091D2C] dark:hover:to-[#0B1220]',
        iconHover: 'group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]',
        titleHover: 'group-hover:text-cyan-500 dark:group-hover:text-cyan-300',
        checkBg: 'bg-emerald-500/10 text-emerald-500',
        iconBox: 'bg-muted text-muted-foreground',
        IconComp: Sparkles,
      };

  return (
    <article
      className={`group relative flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6 shadow-md backdrop-blur-sm transition-all duration-300 ease-out cursor-default hover:-translate-y-1.5 ${theme.border} ${theme.shadow} ${theme.bg}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className={`font-display text-xl font-bold text-foreground transition-colors duration-200 ${theme.titleHover}`}>
              {title}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
              {description}
            </p>
          </div>
          <div
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-300 ease-out ${theme.iconBox} ${theme.iconHover}`}
          >
            <theme.IconComp size={18} />
          </div>
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2 text-sm text-foreground">
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${theme.checkBg}`}>
                <Check size={13} strokeWidth={3} />
              </span>
              <span className="truncate">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      {account ? (
        <Link
          to="/register"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Create an Account <ArrowRight size={16} />
        </Link>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">Get started instantly. No signup required.</p>
      )}
    </article>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */
export const About = () => (
  <div className="min-h-full bg-background text-foreground">
    <SEO title="About — Tara Typing" description="Tara Typing is a free online typing test platform built to help you improve your typing speed, accuracy and consistency." />
    <main className="overflow-hidden">

      {/* 1. HERO */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:pb-10 lg:pt-14">
          <div className="animate-page-enter">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary"><Sparkles size={14} />✦ About Us</p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">About <span className="text-gradient">Tara Typing</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">Tara Typing is a free online typing test platform built to help you improve your typing speed, accuracy and consistency. Whether you are a student, developer, writer or professional, our typing tests, practice modes and performance tracking help you type faster and think sharper — every single day.</p>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Zap size={16} className="text-primary" />Free to use</span>
              <span className="inline-flex items-center gap-2"><Users size={16} className="text-emerald-500" />No signup required</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-cyan-500" />Safe &amp; private</span>
              <span className="inline-flex items-center gap-2"><Globe2 size={16} className="text-orange-500" />Used worldwide</span>
            </div>
          </div>
          <TypingVisual />
        </div>
      </section>

      {/* 2. WHAT YOU CAN DO */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
        <SectionHeading title="What You Can Do" description="Explore these features without creating an account." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <FeatureCard key={feature.title} item={feature} />
          ))}
        </div>
      </section>

      {/* 3. WITHOUT LOGIN vs WITH LOGIN */}
      <section className="bg-card/30 py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="Without Login vs" titleBlue="With Login" description="Try now or create an account for a better experience." />
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ComparisonCard title="No Login"   description="No account? No problem!"           benefits={guestBenefits}   />
            <ComparisonCard title="With Login" description="Create an account to unlock more." benefits={accountBenefits} account />
          </div>
        </div>
      </section>

      {/* 4. PRIVACY */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="group relative rounded-2xl border border-border/80 bg-card/90 dark:bg-[#0B1220]/90 p-7 sm:flex sm:items-center sm:justify-between sm:gap-10 sm:p-10 shadow-md backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-[0_16px_36px_-6px_rgba(16,185,129,0.25)] hover:bg-gradient-to-r hover:from-emerald-500/[0.07] hover:via-card hover:to-card dark:hover:from-[#09221C] dark:hover:via-[#0B1220] dark:hover:to-[#0B1220]">
          <div className="flex gap-4">
            <div className="icon-box-primary grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all duration-300 ease-out group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <ShieldCheck size={21} />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground transition-colors duration-200 group-hover:text-emerald-500 dark:group-hover:text-emerald-300">
                Your Privacy Matters
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground transition-colors duration-200 group-hover:text-foreground/85">
                Your personal performance data is associated with your account and is only available to you through your authenticated dashboard. We never share your private information.
              </p>
            </div>
          </div>
          <div className="mt-6 shrink-0 sm:mt-0 sm:text-right">
            <p className="text-sm font-medium text-foreground">Your data is safe with us.</p>
            <Link to="/about" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover">
              Learn more <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. WHY TARA TYPING */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <SectionHeading title="Why Tara Typing?" description="Simple tools. Real progress." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <FeatureCard key={reason.title} item={reason} />
          ))}
        </div>
      </section>

      {/* 6. CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-2 sm:px-6 sm:pb-16 sm:pt-3">
        <div className="group relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/15 via-card to-card px-6 py-12 text-center sm:px-12 sm:py-16 shadow-lg backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.3)]">
          <div className="pointer-events-none absolute -right-16 top-0 h-48 w-96 rounded-full border border-primary/20 transition-transform duration-500 group-hover:scale-110" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-44 w-96 rounded-full border border-primary/20 transition-transform duration-500 group-hover:scale-110" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl transition-colors duration-200 group-hover:text-blue-500 dark:group-hover:text-blue-300">
              Ready to improve your typing?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Start a test now and take the first step towards a faster, more confident you.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/typing-test"
                className="bg-gradient-primary glow-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                <CirclePlay size={18} />Start Typing Test
              </Link>
              <Link
                to="/practice"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3.5 font-semibold text-foreground transition-colors hover:bg-accent/10 hover:border-primary/40"
              >
                Explore Practice
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
);

export default About;

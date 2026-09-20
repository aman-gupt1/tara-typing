import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Trophy, Users, Play, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import SEO from '../components/common/SEO';
import UserAvatar from '../components/common/UserAvatar';
import { useTypingContext } from '../context/TypingContext';
import { useAuth } from '../context/AuthContext';
import { challengeService } from '../services/challengeService';

function getSecondsUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000));
}

function useCountdown(initialSeconds = 43200) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    setSeconds(initialSeconds);
    const interval = setInterval(() => {
      setSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [initialSeconds]);

  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return { h, m, s };
}

export const DailyChallenge = () => {
  const { setTestConfig } = useTypingContext();
  const { user } = useAuth();
  const [challengeData, setChallengeData] = useState(null);
  const [todayResult, setTodayResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchChallenge = async () => {
      try {
        const [chalRes, userRes] = await Promise.allSettled([
          challengeService.getTodayChallenge(),
          user ? challengeService.getTodayResult() : Promise.resolve(null),
        ]);

        if (isMounted && chalRes.status === 'fulfilled' && chalRes.value?.challenge) {
          setChallengeData(chalRes.value.challenge);
        }
        if (isMounted && userRes.status === 'fulfilled' && userRes.value) {
          setTodayResult(userRes.value);
        }
      } catch (err) {
        console.warn('Challenge fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchChallenge();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const remainingSeconds = challengeData?.endsInSeconds ?? getSecondsUntilMidnight();
  const time = useCountdown(remainingSeconds);

  const handleStart = () => {
    if (challengeData) {
      setTestConfig({
        duration: challengeData.duration || 60,
        mode: 'custom',
        customText: challengeData.text,
        isDailyChallenge: true,
        challengeId: challengeData._id,
      });
      navigate('/typing-test');
    }
  };

  if (loading && !challengeData) {
    return (
      <div className="w-full flex-1 flex items-center justify-center bg-background text-muted-foreground min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm font-medium">Loading today's challenge...</span>
        </div>
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="w-full flex-1 bg-background text-foreground transition-colors duration-200">
        <div className="mx-auto max-w-xl py-24 text-center">
          <p className="text-muted-foreground">Unable to load today's challenge. Please try again later.</p>
        </div>
      </div>
    );
  }

  const userScore =
    todayResult ||
    challengeData?.topScores?.find(
      (s) =>
        (s.user && user?._id && String(s.user) === String(user._id)) ||
        (user?.username && s.username === user.username) ||
        (user?.name && s.name === user.name)
    );

  const hasCompletedToday = Boolean(todayResult || userScore);

  // Formatted date for header
  const dateObj = challengeData.date
    ? new Date(challengeData.date.includes('T') ? challengeData.date : `${challengeData.date}T00:00:00`)
    : new Date();
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Formatted duration, content, and difficulty
  const durSec = challengeData.duration || 60;
  const durationFormatted =
    durSec >= 60 && durSec % 60 === 0
      ? `${durSec / 60} Minute${durSec / 60 > 1 ? 's' : ''}`
      : `${durSec} Seconds`;

  const contentFormatted = challengeData.contentCategory || 'Mixed Text';
  const difficultyFormatted = challengeData.difficulty
    ? challengeData.difficulty.charAt(0).toUpperCase() + challengeData.difficulty.slice(1)
    : 'Medium';

  return (
    <div className="w-full flex-1 bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Daily Challenge — Tara Typing"
        description="A new typing challenge every day. Test your limits, compete with other typists and climb today's top scores."
      />

      <main className="w-full mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm shrink-0">
              <Flame size={26} aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
                Daily Challenge
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                A new challenge every day. Test your limits!
              </p>
            </div>
          </div>

          {/* Right Header Cards: Today & Participants Today */}
          <div className="flex items-center gap-3">
            <div className="card-glass group px-4 py-2.5 min-w-[130px] rounded-2xl border border-border/80 text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_8px_20px_-4px_rgba(245,158,11,0.22)] cursor-default">
              <div className="text-[11px] font-medium text-muted-foreground group-hover:text-amber-400 transition-colors">Today</div>
              <div className="font-display text-sm font-bold text-foreground truncate mt-0.5">
                {formattedDate}
              </div>
            </div>
            <div className="card-glass group px-4 py-2.5 min-w-[130px] rounded-2xl border border-border/80 text-left transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_8px_20px_-4px_rgba(16,185,129,0.22)] cursor-default">
              <div className="text-[11px] font-medium text-muted-foreground group-hover:text-emerald-400 transition-colors">Participants Today</div>
              <div className="font-display text-sm font-bold text-primary group-hover:text-emerald-400 transition-colors truncate mt-0.5">
                {(challengeData.participantsCount || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Main Content with Balanced Heights */}
        <div className="mt-8 grid gap-5 sm:gap-6 lg:grid-cols-12 items-stretch">
          {/* Left Column: Main Today's Challenge Card */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="card-glass daily-featured-card group relative flex flex-col justify-between h-full overflow-hidden p-5 sm:p-6 rounded-3xl border border-primary/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-500/60 hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.3)] hover:bg-gradient-to-b hover:from-blue-500/[0.06] hover:to-transparent cursor-default">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl group-hover:bg-primary/25 transition-colors duration-500"
                aria-hidden="true"
              />

              <div>
                {/* Header: Title + Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-300" role="img" aria-label="target">🎯</span>
                    <h2 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-blue-400 transition-colors">
                      {challengeData.title || 'Touch Typing Challenge'}
                    </h2>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    Today's Challenge
                  </span>
                </div>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {challengeData.description || 'Focus on keeping a steady typing cadence across punctuation and uppercase shifts.'}
                </p>

                {/* Countdown Timer */}
                <div className="mt-3.5">
                  <div className="text-[11px] font-medium text-muted-foreground mb-1.5">Ends in</div>
                  <div className="grid grid-cols-3 gap-2.5" aria-label="Time remaining">
                    {[
                      { v: time.h, l: 'Hours' },
                      { v: time.m, l: 'Minutes' },
                      { v: time.s, l: 'Seconds' },
                    ].map((item) => (
                      <div
                        key={item.l}
                        className="rounded-xl border border-border/80 bg-background/70 px-2.5 py-2 text-center shadow-inner group-hover:border-primary/40 transition-colors"
                      >
                        <div className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight">{item.v}</div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">{item.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Compact Information Blocks */}
                <div className="mt-3.5 grid grid-cols-3 gap-2 sm:gap-2.5 text-center">
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-2 group-hover:border-primary/30 transition-colors">
                    <div className="text-[10px] sm:text-[11px] text-muted-foreground">Time</div>
                    <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-0.5">{durationFormatted}</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-2 group-hover:border-primary/30 transition-colors">
                    <div className="text-[10px] sm:text-[11px] text-muted-foreground">Content</div>
                    <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-0.5">{contentFormatted}</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-2 group-hover:border-primary/30 transition-colors">
                    <div className="text-[10px] sm:text-[11px] text-muted-foreground">Difficulty</div>
                    <div className="font-display text-xs sm:text-sm font-bold text-foreground mt-0.5">{difficultyFormatted}</div>
                  </div>
                </div>

                {/* Trophy Visual */}
                <div className="mt-3.5 flex justify-center" aria-hidden="true">
                  <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300">
                    <Trophy size={28} />
                  </div>
                </div>

                {/* Participants Count */}
                <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={13} className="text-primary" /> {(challengeData.participantsCount || 0).toLocaleString()} participants today
                </p>
              </div>

              {/* Start / Completed Button */}
              {hasCompletedToday ? (
                <div className="mt-4 flex flex-col gap-1.5">
                  <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-success/15 border border-success/30 px-5 py-3 font-semibold text-sm text-success select-none">
                    <CheckCircle2 size={16} /> Challenge Completed Today
                  </div>
                  <p className="text-center text-[11px] text-muted-foreground">
                    Your score has been recorded. Check your rank and stats on the right!
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleStart}
                  className="bg-gradient-primary glow-primary mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-sm text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] select-none shadow-lg shadow-primary/20"
                >
                  <Play size={15} fill="currentColor" /> Start Challenge
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Top Scores Today + Your Result Today */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4 sm:gap-5">
            {/* Top Scores Today Card */}
            <div className="card-glass daily-featured-card group p-5 rounded-2xl border border-border/80 flex flex-col justify-between flex-1 transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/50 hover:shadow-[0_14px_30px_-6px_rgba(245,158,11,0.22)] hover:bg-gradient-to-b hover:from-amber-500/[0.05] hover:to-transparent cursor-default">
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <h2 className="font-display text-sm sm:text-base font-bold flex items-center gap-2 text-foreground group-hover:text-amber-400 transition-colors">
                    <span role="img" aria-label="trophy" className="group-hover:scale-110 transition-transform">🏆</span> Top Scores Today
                  </h2>
                  <Link
                    to="/leaderboard"
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors"
                  >
                    View Leaderboard &rarr;
                  </Link>
                </div>

                {challengeData.topScores && challengeData.topScores.length > 0 ? (
                  <ol className="flex flex-col divide-y divide-border/40">
                    {challengeData.topScores.slice(0, 4).map((score, idx) => {
                      const isFirst = score.rank === 1 || idx === 0;
                      const isSecond = score.rank === 2 || idx === 1;
                      const isThird = score.rank === 3 || idx === 2;

                      const rankBadge = isFirst
                        ? 'text-amber-400 font-black'
                        : isSecond
                        ? 'text-slate-300 font-bold'
                        : isThird
                        ? 'text-amber-600 dark:text-amber-500 font-bold'
                        : 'text-muted-foreground font-semibold';

                      return (
                        <li key={`${score.rank}-${score.username || idx}`} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className={`w-4 text-center text-xs font-display ${rankBadge}`}>
                              #{score.rank || idx + 1}
                            </span>
                            <UserAvatar
                              src={score.avatar}
                              name={score.name}
                              username={score.username}
                              className="h-7 w-7 rounded-full border border-border/60 shrink-0"
                              textClassName="text-[11px]"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs sm:text-sm font-medium text-foreground leading-tight">
                                {score.name}
                              </p>
                              <p className="truncate text-[10px] text-muted-foreground">
                                @{score.username || 'user'}
                              </p>
                            </div>
                          </span>
                          <div className="text-right shrink-0">
                            <span className="font-display text-xs sm:text-sm font-bold text-primary block leading-tight">
                              {score.wpm} WPM
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {score.accuracy}% Acc
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-xs sm:text-sm font-medium text-foreground">No scores recorded yet today.</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Be the first to compete!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Your Result Today Card */}
            <div className="card-glass daily-featured-card group p-5 rounded-2xl border border-border/80 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_14px_30px_-6px_rgba(16,185,129,0.22)] hover:bg-gradient-to-b hover:from-emerald-500/[0.05] hover:to-transparent cursor-default">
              <h2 className="mb-3 font-display text-sm sm:text-base font-bold flex items-center gap-2 text-foreground group-hover:text-emerald-400 transition-colors">
                <span role="img" aria-label="user" className="group-hover:scale-110 transition-transform">👤</span> Your Result Today
              </h2>
              {userScore ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 sm:p-3 group-hover:border-emerald-500/30 transition-colors">
                      <div className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">{userScore.wpm}</div>
                      <div className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">WPM</div>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 sm:p-3 group-hover:border-emerald-500/30 transition-colors">
                      <div className="font-display text-base sm:text-lg font-bold text-foreground leading-tight">{userScore.accuracy}%</div>
                      <div className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">Accuracy</div>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-background/60 p-2.5 sm:p-3 group-hover:border-emerald-500/30 transition-colors">
                      <div className="font-display text-base sm:text-lg font-bold text-primary group-hover:text-emerald-400 transition-colors leading-tight">#{userScore.rank || 1}</div>
                      <div className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground">Rank</div>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-success font-medium">
                    <CheckCircle2 size={14} /> Completed
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-card/30 p-4 text-center group-hover:border-emerald-500/40 transition-colors">
                  <p className="text-xs text-muted-foreground">
                    You haven't participated in today's challenge yet.
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-primary group-hover:text-emerald-400 transition-colors">
                    Click "Start Challenge" to record your score!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Feature Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: 'Improve Daily',
              desc: 'Build consistency and see real progress.',
              icon: TrendingUp,
              iconColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
              hoverBorder: 'hover:border-blue-500/50',
              hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(59,130,246,0.25)]',
              hoverBg: 'hover:bg-gradient-to-b hover:from-blue-500/[0.08] hover:to-transparent',
              iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.35)]',
              titleHover: 'group-hover:text-blue-400',
            },
            {
              title: 'Compete',
              desc: 'Challenge yourself and climb the ranks.',
              icon: Trophy,
              iconColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
              hoverBorder: 'hover:border-amber-500/50',
              hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(245,158,11,0.25)]',
              hoverBg: 'hover:bg-gradient-to-b hover:from-amber-500/[0.08] hover:to-transparent',
              iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35)]',
              titleHover: 'group-hover:text-amber-400',
            },
            {
              title: 'Stay Consistent',
              desc: 'A new challenge every day to keep you motivated.',
              icon: Flame,
              iconColor: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
              hoverBorder: 'hover:border-orange-500/50',
              hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(249,115,22,0.25)]',
              hoverBg: 'hover:bg-gradient-to-b hover:from-orange-500/[0.08] hover:to-transparent',
              iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(249,115,22,0.35)]',
              titleHover: 'group-hover:text-orange-400',
            },
            {
              title: 'Earn Achievements',
              desc: 'Complete challenges and unlock rewards.',
              icon: Award,
              iconColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
              hoverBorder: 'hover:border-purple-500/50',
              hoverShadow: 'hover:shadow-[0_12px_28px_-6px_rgba(168,85,247,0.25)]',
              hoverBg: 'hover:bg-gradient-to-b hover:from-purple-500/[0.08] hover:to-transparent',
              iconHover: 'group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.35)]',
              titleHover: 'group-hover:text-purple-400',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`card-glass daily-feature-card group p-4 rounded-2xl border border-border/80 flex items-start gap-3.5 transition-all duration-300 hover:-translate-y-1.5 cursor-default ${item.hoverBorder} ${item.hoverShadow} ${item.hoverBg}`}
              >
                <div className={`grid h-10 w-10 place-items-center rounded-xl border shrink-0 transition-all duration-300 ${item.iconColor} ${item.iconHover}`}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className={`font-semibold text-sm text-foreground transition-colors duration-300 ${item.titleHover}`}>{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default DailyChallenge;

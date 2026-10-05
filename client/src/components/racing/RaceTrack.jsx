import React from 'react';
import { Flag, Trophy, Zap } from 'lucide-react';

export default function RaceTrack({ racers = [], currentUserId = null }) {
  // Sort racers by progress descending for rank preview
  const sortedRacers = [...racers].sort((a, b) => {
    if (a.finished && b.finished) return (a.finishRank || 99) - (b.finishRank || 99);
    if (a.finished) return -1;
    if (b.finished) return 1;
    return (b.progress || 0) - (a.progress || 0);
  });

  return (
    <div className="w-full bg-card border border-border rounded-2xl p-5 shadow-lg backdrop-blur transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h3 className="text-base font-bold text-foreground tracking-wide">Live Race Track</h3>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {racers.length} Racer{racers.length > 1 ? 's' : ''} on Grid
        </span>
      </div>

      <div className="space-y-4">
        {racers.map((racer, index) => {
          const isUser = racer.id === currentUserId || racer.isCurrentUser;
          const progress = Math.min(100, Math.max(0, racer.progress || 0));
          const rank = sortedRacers.findIndex(r => r.id === racer.id) + 1;

          return (
            <div
              key={racer.id || index}
              className={`relative rounded-xl p-3 border transition-all duration-300 ${
                isUser
                  ? 'bg-primary/10 border-primary/50 shadow-md shadow-primary/10'
                  : 'bg-muted/30 dark:bg-slate-950/60 border-border'
              }`}
            >
              {/* Racer Header Info */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{racer.avatar || '🏎️'}</span>
                  <span className={`text-sm font-bold ${isUser ? 'text-primary' : 'text-foreground'}`}>
                    {racer.name}
                  </span>
                  {isUser && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
                      YOU
                    </span>
                  )}
                  {racer.isBot && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                      BOT
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-semibold text-muted-foreground">
                    <span className="text-amber-500 dark:text-amber-400 font-bold">{Math.round(racer.wpm || 0)}</span> WPM
                  </span>

                  {racer.finished ? (
                    <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40">
                      <Trophy className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                      <span>{racer.finishRank === 1 ? '1st 🥇' : racer.finishRank === 2 ? '2nd 🥈' : racer.finishRank === 3 ? '3rd 🥉' : `${racer.finishRank}th`}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-mono text-muted-foreground">
                      Rank #{rank}
                    </span>
                  )}
                </div>
              </div>

              {/* Race Track Asphalt Lane */}
              <div className="relative h-10 bg-slate-900 rounded-lg overflow-hidden border border-slate-800/90 flex items-center px-2">
                {/* Center Road Dash Lines */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-slate-700/60 z-0 pointer-events-none" />

                {/* Finish Line Checkered Strip */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-7 border-l-2 border-slate-700/80 flex items-center justify-center opacity-80 z-0"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 6px, #fff 6px, #fff 12px)'
                  }}
                >
                  <Flag className="w-3.5 h-3.5 text-white drop-shadow-md z-10" />
                </div>

                {/* Dynamic Car / Racer Progress Marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-10 flex items-center"
                  style={{
                    left: `calc(${progress * 0.88}% + 4px)`
                  }}
                >
                  <div
                    className="relative flex items-center justify-center p-1.5 rounded-lg shadow-md transition-transform"
                    style={{
                      backgroundColor: racer.carColor || '#38bdf8',
                      boxShadow: `0 0 12px ${racer.carColor || '#38bdf8'}66`
                    }}
                  >
                    <span className="text-sm select-none">🏎️</span>
                  </div>
                </div>
              </div>

              {/* Bottom Progress Bar Indicator */}
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: racer.carColor || '#38bdf8'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

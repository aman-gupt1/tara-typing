import { motion } from 'framer-motion';
import { Timer, Zap, Target, AlertCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const StatsBar = ({
  timeLeft,
  totalDuration,
  wpm,
  accuracy,
  errors,
  status,
}) => {
  const { settings } = useSettings();

  const progressPercentage = totalDuration > 0
    ? Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100))
    : 0;

  return (
    <div className="w-full bg-dark-900/90 backdrop-blur-md rounded-2xl border border-white/[0.08] p-4 sm:p-5 shadow-lg">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
        
        {/* Time Left */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/[0.04]">
          <div className="w-10 h-10 rounded-xl icon-box-primary flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Time</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
              {timeLeft}s
            </p>
          </div>
        </div>

        {/* Live WPM */}
        {settings.liveWpm && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/[0.04]">
            <div className="w-10 h-10 rounded-xl icon-box-streak flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">WPM</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {wpm}
              </p>
            </div>
          </div>
        )}

        {/* Live Accuracy */}
        {settings.showAccuracy && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/[0.04]">
            <div className="w-10 h-10 rounded-xl icon-box-accuracy flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Accuracy</p>
              <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">
                {accuracy}%
              </p>
            </div>
          </div>
        )}

        {/* Errors */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-850 border border-white/[0.04]">
          <div className="w-10 h-10 rounded-xl icon-box-errors flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Errors</p>
            <p className={`text-xl sm:text-2xl font-extrabold font-mono ${errors > 0 ? 'text-red-400' : 'text-slate-300'}`}>
              {errors}
            </p>
          </div>
        </div>

      </div>

      {/* Dynamic Progress Bar */}
      {status === 'running' && (
        <div className="w-full bg-dark-800 h-1.5 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: 'linear' }}
          />
        </div>
      )}
    </div>
  );
};

export default StatsBar;

import { RotateCcw, Volume2, VolumeX, FileText, Quote, Type, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const TestControls = ({
  duration,
  onDurationChange,
  mode,
  onModeChange,
  onRestart,
  onOpenCustomModal,
  disabled = false,
}) => {
  const { settings, updateSetting } = useSettings();

  const durations = [15, 30, 60, 120];
  const modes = [
    { id: 'words', label: 'Words', icon: Type },
    { id: 'quote', label: 'Quote', icon: Quote },
    { id: 'custom', label: 'Custom', icon: FileText },
  ];

  const handleSoundToggle = () => {
    updateSetting('soundType', settings.soundType === 'off' ? 'mechanical' : 'off');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-dark-900/80 border border-white/[0.08] backdrop-blur-md">
      
      {/* Mode Selector */}
      <div className="flex items-center gap-1.5 bg-dark-850 p-1 rounded-xl border border-white/[0.06]">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              disabled={disabled}
              onClick={() => {
                onModeChange(m.id);
                if (m.id === 'custom' && onOpenCustomModal) {
                  onOpenCustomModal();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-md shadow-brand-purple/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Duration Selector (for Words / Custom modes) */}
      <div className="flex items-center gap-1 bg-dark-850 p-1 rounded-xl border border-white/[0.06]">
        <Clock className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" />
        {durations.map((d) => {
          const isActive = duration === d;
          return (
            <button
              key={d}
              disabled={disabled}
              onClick={() => onDurationChange(d)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {d}s
            </button>
          );
        })}
      </div>

      {/* Right Controls: Restart & Sound */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSoundToggle}
          className={`p-2 rounded-xl border transition-all ${
            settings.soundType !== 'off'
              ? 'bg-brand-purple/15 text-brand-purple border-brand-purple/30'
              : 'bg-dark-850 text-slate-500 border-white/[0.06] hover:text-slate-300'
          }`}
          title={settings.soundType !== 'off' ? `Sound: ${settings.soundType}` : "Sound: Off"}
        >
          {settings.soundType !== 'off' ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-slate-200 hover:text-white border border-white/[0.08] hover:border-brand-purple/40 text-xs font-semibold transition-all group"
          title="Restart Test (Tab + Enter)"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-brand-pink" />
          <span>Restart</span>
          <span className="hidden sm:inline-block px-1 py-0.5 text-[9px] bg-white/10 rounded text-slate-400">Tab</span>
        </button>
      </div>

    </div>
  );
};

export default TestControls;

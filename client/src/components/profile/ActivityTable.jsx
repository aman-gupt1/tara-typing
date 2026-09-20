import { formatDate } from '../../utils/formatters';
import { Zap, Target, Clock, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export const ActivityTable = ({ results = [] }) => {
  if (!results || results.length === 0) {
    return (
      <div className="card-glass p-8 rounded-2xl text-center text-muted-foreground text-sm">
        No typing tests taken yet. Start a test to record your typing history!
      </div>
    );
  }

  return (
    <div className="card-glass w-full overflow-x-auto rounded-2xl">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border uppercase tracking-wider text-[10px] sm:text-xs">
          <tr>
            <th className="py-3.5 px-4">Mode / Duration</th>
            <th className="py-3.5 px-4">Net WPM</th>
            <th className="py-3.5 px-4">Raw WPM</th>
            <th className="py-3.5 px-4">Accuracy</th>
            <th className="py-3.5 px-4">Errors</th>
            <th className="py-3.5 px-4">Consistency</th>
            <th className="py-3.5 px-4">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-foreground font-mono">
          {results.map((item, idx) => (
            <tr key={item.id || idx} className="hover:bg-accent/40 transition-colors">
              <td className="py-3.5 px-4 font-sans font-medium flex items-center gap-2">
                <Badge variant={item.mode === 'quote' ? 'pink' : item.mode === 'custom' ? 'cyan' : 'purple'} size="sm">
                  {item.mode || 'words'}
                </Badge>
                <span className="text-muted-foreground text-xs">{item.duration || item.totalDuration || 30}s</span>
              </td>
              <td className="py-3.5 px-4 font-bold text-primary text-base">
                {item.wpm}
              </td>
              <td className="py-3.5 px-4 text-muted-foreground">
                {item.rawWpm || item.wpm}
              </td>
              <td className="py-3.5 px-4 font-semibold text-pink">
                {item.accuracy}%
              </td>
              <td className={`py-3.5 px-4 ${item.errors > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                {item.errors || 0}
              </td>
              <td className="py-3.5 px-4 text-foreground">
                {item.consistency || 95}%
              </td>
              <td className="py-3.5 px-4 font-sans text-xs text-muted-foreground">
                {formatDate(item.completedAt || item.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;

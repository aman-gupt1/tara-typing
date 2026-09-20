import { Zap, Target, Award, User as UserIcon } from 'lucide-react';
import Badge from '../common/Badge';
import UserAvatar from '../common/UserAvatar';

export const LeaderboardTable = ({ leaderboard = [], currentUsername = '' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-3xl bg-dark-900/80 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-dark-850/80 text-slate-400 font-semibold border-b border-white/[0.06] uppercase tracking-wider text-[10px] sm:text-xs">
          <tr>
            <th className="py-4 px-4 sm:px-6 w-16">Rank</th>
            <th className="py-4 px-4 sm:px-6">Typist</th>
            <th className="py-4 px-4 sm:px-6">Speed (WPM)</th>
            <th className="py-4 px-4 sm:px-6">Accuracy</th>
            <th className="py-4 px-4 sm:px-6">Tests Taken</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.04] text-slate-200">
          {leaderboard.map((user) => {
            const isSelf = user.isCurrentUser || (currentUsername && user.username === currentUsername);

            return (
              <tr
                key={user.rank + user.username}
                className={`transition-colors ${
                  isSelf
                    ? 'bg-brand-purple/15 hover:bg-brand-purple/20 border-l-4 border-l-brand-pink font-semibold'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank */}
                <td className="py-4 px-4 sm:px-6 font-mono font-bold">
                  {user.rank === 1 ? (
                    <span className="w-7 h-7 rounded-xl bg-amber-400 text-dark-950 flex items-center justify-center text-xs font-black shadow-md">
                      #1
                    </span>
                  ) : user.rank === 2 ? (
                    <span className="w-7 h-7 rounded-xl bg-slate-300 text-dark-950 flex items-center justify-center text-xs font-black shadow-md">
                      #2
                    </span>
                  ) : user.rank === 3 ? (
                    <span className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center text-xs font-black shadow-md">
                      #3
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm pl-2">#{user.rank}</span>
                  )}
                </td>

                {/* User */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={user.avatar}
                      name={user.name}
                      username={user.username}
                      className="w-9 h-9 rounded-xl ring-1 ring-white/10"
                      textClassName="text-sm"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white text-sm truncate">{user.name}</p>
                        {isSelf && (
                          <Badge variant="pink" size="sm">You</Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate font-mono">@{user.username}</p>
                    </div>
                  </div>
                </td>

                {/* WPM */}
                <td className="py-4 px-4 sm:px-6 font-mono font-bold text-brand-pink text-base sm:text-lg">
                  {user.wpm} <span className="text-xs font-sans text-slate-400 font-normal">WPM</span>
                </td>

                {/* Accuracy */}
                <td className="py-4 px-4 sm:px-6 font-mono font-semibold text-brand-cyan">
                  {user.accuracy}%
                </td>

                {/* Tests */}
                <td className="py-4 px-4 sm:px-6 font-mono text-slate-400">
                  {user.tests || 50}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;

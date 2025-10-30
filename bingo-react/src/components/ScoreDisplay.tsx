import type { ScoreDisplayProps } from '../types';

interface UserStats {
  bestScore: number;
  totalGames: number;
  averageScore: number;
  totalLines: number;
  totalCells: number;
}

export function ScoreDisplay({ score, stats }: ScoreDisplayProps & { stats: UserStats | null }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
      <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple/10 to-accent-teal/10 border border-accent-purple/20">
        <span className="font-semibold text-sm sm:text-base text-accent-teal">Current: </span>
        <span className="text-sm sm:text-base font-bold">{score.total} / 85</span>
      </div>
      
      {stats && stats.totalGames > 0 && (
        <div className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-teal/10 to-accent-purple/10 border border-accent-teal/20">
          <span className="font-semibold text-sm sm:text-base text-accent-purple">Best: </span>
          <span className="text-sm sm:text-base font-bold">{stats.bestScore} / 85</span>
        </div>
      )}
      
      <div className="text-xs sm:text-sm text-white/70 font-medium">
        {score.cells} cells • {score.lines} lines
        {stats && stats.totalGames > 0 && (
          <span className="ml-2">• {stats.totalGames} games</span>
        )}
      </div>
    </div>
  );
}

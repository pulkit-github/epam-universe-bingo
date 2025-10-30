import React, { useState } from 'react';
import { useUserStats } from '../contexts/UserStatsContext';

export function UserStats() {
  const { stats, loading, error } = useUserStats();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 hover:from-accent-blue/30 hover:to-accent-purple/30 border border-accent-blue/30 text-sm font-medium transition-all"
      >
        📊 My Stats
      </button>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-cosmic-800/90 to-cosmic-700/90 border border-accent-purple/30 rounded-xl p-6 shadow-card">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/80">Loading your stats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-cosmic-800/90 to-cosmic-700/90 border border-accent-purple/30 rounded-xl p-6 shadow-card max-w-md mx-4">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-accent-teal text-cosmic-900 rounded-lg font-medium hover:bg-accent-teal/80 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-cosmic-800/90 to-cosmic-700/90 border border-accent-purple/30 rounded-xl p-6 shadow-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-accent-teal">Your Cosmic Journey</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {stats && stats.totalGames > 0 ? (
          <div className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-accent-teal/10 to-accent-purple/10 border border-accent-teal/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-teal">{stats.bestScore}</div>
                <div className="text-sm text-white/70">Best Score</div>
              </div>
              <div className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-accent-purple/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-purple">{stats.totalGames}</div>
                <div className="text-sm text-white/70">Games Played</div>
              </div>
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-teal/10 border border-accent-blue/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-blue">{stats.averageScore}</div>
                <div className="text-sm text-white/70">Average Score</div>
              </div>
              <div className="bg-gradient-to-br from-accent-teal/10 to-accent-purple/10 border border-accent-teal/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-accent-teal">{stats.totalLines}</div>
                <div className="text-sm text-white/70">Total Lines</div>
              </div>
            </div>

            {/* Recent Games */}
            {stats.recentScores && stats.recentScores.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Games</h3>
                <div className="space-y-3">
                  {stats.recentScores.slice(0, 5).map((game, index) => (
                    <div key={game._id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-accent-teal">{game.persona.title}</div>
                          <div className="text-sm text-white/70 mt-1">{game.persona.desc}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-accent-purple">{game.score}/85</div>
                          <div className="text-xs text-white/60">
                            {game.cells} cells • {game.lines} lines
                          </div>
                          <div className="text-xs text-white/50">
                            {new Date(game.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-white mb-2">Start Your Cosmic Journey!</h3>
            <p className="text-white/70 mb-6">
              Play your first game to see your statistics and track your progress through the EPAM Universe.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-accent-teal text-cosmic-900 rounded-lg font-medium hover:bg-accent-teal/80 transition-colors"
            >
              Let's Play!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

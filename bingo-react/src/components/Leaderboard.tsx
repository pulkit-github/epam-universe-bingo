import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import { PERSONAS } from '../constants';

interface LeaderboardEntry {
  _id: string;
  bestScore: number;
  userName: string;
  userEmail: string;
  totalGames: number;
  lastPlayed: string;
}

interface RecentScore {
  _id: string;
  score: number;
  cells: number;
  lines: number;
  persona: { title: string; desc: string };
  gameTime: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

interface LeaderboardStats {
  totalPlayers: number;
  totalGames: number;
  averageScore: number;
  highestScore: number;
}

interface PersonaScore {
  _id: string;
  score: number;
  cells: number;
  lines: number;
  persona: { title: string; desc: string };
  gameTime: number;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<'global' | 'recent' | 'persona' | 'stats'>('global');
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [recentScores, setRecentScores] = useState<RecentScore[]>([]);
  const [personaScores, setPersonaScores] = useState<PersonaScore[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGlobalLeaderboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardAPI.getGlobal(50, 1);
      setGlobalLeaderboard(response.data);
    } catch (err: any) {
      setError('Failed to load global leaderboard');
      console.error('Global leaderboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentScores = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardAPI.getRecent(20);
      setRecentScores(response.data);
    } catch (err: any) {
      setError('Failed to load recent scores');
      console.error('Recent scores error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonaScores = async (persona: string) => {
    if (!persona) return;
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardAPI.getByPersona(persona);
      setPersonaScores(response.data);
    } catch (err: any) {
      setError('Failed to load persona scores');
      console.error('Persona scores error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leaderboardAPI.getStats();
      setStats(response.data);
    } catch (err: any) {
      setError('Failed to load leaderboard statistics');
      console.error('Stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'global') {
      fetchGlobalLeaderboard();
    } else if (activeTab === 'recent') {
      fetchRecentScores();
    } else if (activeTab === 'persona' && selectedPersona) {
      fetchPersonaScores(selectedPersona);
    } else if (activeTab === 'stats') {
      fetchStats();
    }
  }, [activeTab, selectedPersona]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatGameTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-cosmic-800/80 to-cosmic-700/80 border border-accent-purple/20 rounded-xl p-4 sm:p-6 shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="title-font text-accent-teal text-xl sm:text-2xl font-bold">🏆 Cosmic Leaderboards</h2>
        
        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-2">
          <button
            onClick={() => setActiveTab('global')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'global'
                ? 'bg-accent-teal/20 border-2 border-accent-teal/50 text-accent-teal'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            Global
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'recent'
                ? 'bg-accent-purple/20 border-2 border-accent-purple/50 text-accent-purple'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            Recent
          </button>
          <button
            onClick={() => setActiveTab('persona')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'persona'
                ? 'bg-accent-blue/20 border-2 border-accent-blue/50 text-accent-blue'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            By Persona
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-accent-teal/20 border-2 border-accent-teal/50 text-accent-teal'
                : 'bg-white/5 hover:bg-white/10 border border-white/10'
            }`}
          >
            Stats
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
            className="w-full p-3 rounded-lg bg-white/5 border border-accent-purple/20 text-white text-sm font-medium"
          >
            <option value="global">Global Leaderboard</option>
            <option value="recent">Recent Scores</option>
            <option value="persona">By Persona</option>
            <option value="stats">Statistics</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="title-font neon-text">Loading cosmic data...</div>
        </div>
      )}

      {!loading && !error && (
        <>
          {activeTab === 'global' && (
            <div className="space-y-3">
              <div className="text-sm text-white/60 mb-4">
                Top players by their best scores across all games
              </div>
              {globalLeaderboard.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No players found. Be the first to join the cosmic leaderboard! 🚀
                </div>
              ) : (
                globalLeaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border ${
                      index < 3
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                        : 'bg-white/5 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`text-xl sm:text-2xl font-bold ${
                        index === 0 ? 'text-yellow-400' : 
                        index === 1 ? 'text-gray-300' : 
                        index === 2 ? 'text-orange-400' : 'text-white/60'
                      }`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm sm:text-base">{entry.userName}</div>
                        <div className="text-xs sm:text-sm text-white/60 hidden sm:block">{entry.userEmail}</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <div className="font-bold text-base sm:text-lg">{entry.bestScore}/85</div>
                      <div className="text-xs sm:text-sm text-white/60">
                        {entry.totalGames} games • {formatDate(entry.lastPlayed)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="space-y-3">
              <div className="text-sm text-white/60 mb-4">
                Latest high scores from across the universe
              </div>
              {recentScores.length === 0 ? (
                <div className="text-center py-8 text-white/60">
                  No recent scores found. Start playing to see your scores here! 🌌
                </div>
              ) : (
                recentScores.map((score, index) => (
                  <div
                    key={score._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="text-base sm:text-lg font-bold text-white/60">#{index + 1}</div>
                      <div>
                        <div className="font-semibold text-white text-sm sm:text-base">{score.userId.name}</div>
                        <div className="text-xs sm:text-sm text-white/60">{score.persona.title}</div>
                      </div>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <div className="font-bold text-base sm:text-lg">{score.score}/85</div>
                      <div className="text-xs sm:text-sm text-white/60">
                        {score.cells} cells • {score.lines} lines • {formatGameTime(score.gameTime)}
                      </div>
                      <div className="text-xs text-white/50">{formatDate(score.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'persona' && (
            <div className="space-y-4">
              <div className="text-sm text-white/60 mb-4">
                Top scores by cosmic persona type
              </div>
              <div className="mb-4">
                <select
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="">Select a persona...</option>
                  {PERSONAS.map((persona) => (
                    <option key={persona.title} value={persona.title} className="bg-gray-800">
                      {persona.title}
                    </option>
                  ))}
                </select>
              </div>
              {selectedPersona && (
                <>
                  {personaScores.length === 0 ? (
                    <div className="text-center py-8 text-white/60">
                      No scores found for {selectedPersona}. Be the first! 🌟
                    </div>
                  ) : (
                    personaScores.map((score, index) => (
                      <div
                        key={score._id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border ${
                          index < 3
                            ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className={`text-xl sm:text-2xl font-bold ${
                            index === 0 ? 'text-purple-400' : 
                            index === 1 ? 'text-pink-300' : 
                            index === 2 ? 'text-purple-300' : 'text-white/60'
                          }`}>
                            {index === 0 ? '👑' : index === 1 ? '⭐' : index === 2 ? '🌟' : `#${index + 1}`}
                          </div>
                          <div>
                            <div className="font-semibold text-white text-sm sm:text-base">{score.userId.name}</div>
                            <div className="text-xs sm:text-sm text-white/60">{score.persona.title}</div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right mt-2 sm:mt-0">
                          <div className="font-bold text-base sm:text-lg">{score.score}/85</div>
                          <div className="text-xs sm:text-sm text-white/60">
                            {score.cells} cells • {score.lines} lines • {formatGameTime(score.gameTime)}
                          </div>
                          <div className="text-xs text-white/50">{formatDate(score.createdAt)}</div>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-accent-teal/20 to-accent-blue/20 border border-accent-teal/30 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-accent-teal">{stats.totalPlayers}</div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">Total Players</div>
              </div>
              <div className="bg-gradient-to-br from-accent-purple/20 to-accent-teal/20 border border-accent-purple/30 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-accent-purple">{stats.totalGames}</div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">Total Games</div>
              </div>
              <div className="bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 border border-accent-blue/30 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-accent-blue">{stats.averageScore.toFixed(1)}</div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">Average Score</div>
              </div>
              <div className="bg-gradient-to-br from-accent-teal/20 to-accent-purple/20 border border-accent-teal/30 rounded-lg p-3 sm:p-4">
                <div className="text-xl sm:text-2xl font-bold text-accent-teal">{stats.highestScore}</div>
                <div className="text-xs sm:text-sm text-white/80 font-medium">Highest Score</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import { Board } from './components/Board';
import { ScoreDisplay } from './components/ScoreDisplay';
import { GameControls } from './components/GameControls';
import { ResultModal } from './components/ResultModal';
import { Leaderboard } from './components/Leaderboard';
import { ShareModal } from './components/ShareModal';
import { ParticleEffect } from './components/ParticleEffect';
import { CosmicBackground } from './components/CosmicBackground';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserStatsProvider, useUserStats } from './contexts/UserStatsContext';
import { PERSONAS } from './constants';
import { computeLines, scoreFromSelection, personaForScore } from './utils';
import { scoreAPI } from './services/api';
import { useGameState } from './hooks/useGameState';

function GameApp() {
  const { user, logout } = useAuth();
  const { stats, refreshStats } = useUserStats();
  const [currentView, setCurrentView] = useState<'game' | 'leaderboard'>('game');
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Use database-driven game state instead of local storage
  const {
    board,
    selected,
    showResult,
    gameStartTime,
    loading: gameStateLoading,
    error: gameStateError,
    toggleTile,
    resetSelections,
    // shuffleBoard,
    setShowResult
  } = useGameState();

  const completedLines = useMemo(() => computeLines(selected), [selected]);
  const score = useMemo(() => scoreFromSelection(selected), [selected]);
  const persona = useMemo(() => personaForScore(score.total, PERSONAS), [score]);

  async function saveScore() {
    if (!user) return;
    
    try {
      const gameTime = Math.floor((Date.now() - gameStartTime.getTime()) / 1000);
      await scoreAPI.saveScore({
        score: score.total,
        cells: score.cells,
        lines: score.lines,
        persona,
        board,
        selected,
        completedLines,
        gameTime
      });
      
      // Refresh stats after saving score
      await refreshStats();
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-700 text-white relative">
      <CosmicBackground />
      <ParticleEffect />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="space-y-6">
          <header className="text-center">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
              <div className="text-sm text-white/60">
                Welcome, {user?.name}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setCurrentView('game')}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                    currentView === 'game'
                      ? 'bg-accent-teal/20 border-2 border-accent-teal/50 text-accent-teal shadow-glow'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  🎮 Game
                </button>
                <button
                  onClick={() => setCurrentView('leaderboard')}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                    currentView === 'leaderboard'
                      ? 'bg-accent-purple/20 border-2 border-accent-purple/50 text-accent-purple'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  🏆 Leaderboard
                </button>
                {/* <UserStats /> */}
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-medium transition-all"
                >
                  Logout
                </button>
              </div>
            </div>
            <h1 className="title-font neon-text text-2xl sm:text-3xl md:text-4xl font-bold">
              EPAM Universe Bingo: Chart Your Cosmic Path
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {currentView === 'game' 
                ? 'Select tiles that describe your journey. Complete lines for bonus points!'
                : 'See how you rank among the cosmic explorers!'
              }
            </p>
          </header>

          {currentView === 'game' ? (
            <>
              {gameStateLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin w-8 h-8 border-2 border-accent-teal border-t-transparent rounded-full"></div>
                  <span className="ml-3 text-white/80">Loading game...</span>
                </div>
              ) : gameStateError ? (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
                  <p className="text-red-400">{gameStateError}</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              ) : (
                <>
                  <Board
                    board={board}
                    selected={selected}
                    completedLines={completedLines}
                    onToggle={toggleTile}
                  />

                  <section className="flex flex-wrap items-center justify-between gap-3">
                    <ScoreDisplay score={score} stats={stats} />
                    <div className="flex gap-2">
                      {score.total > 0 && (
                        <button
                          onClick={() => setShowShareModal(true)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent-purple/20 to-accent-teal/20 hover:from-accent-purple/30 hover:to-accent-teal/30 border border-accent-purple/30 text-sm font-medium transition-all"
                        >
                          🌟 Share Result
                        </button>
                      )}
                      <GameControls
                        // onShuffle={shuffleBoard}
                        onReset={resetSelections}
                        onGetResult={() => {
                          setShowResult(true);
                          saveScore();
                        }}
                      />
                    </div>
                  </section>

                  <ResultModal
                    persona={persona}
                    score={score}
                    isOpen={showResult}
                    onClose={() => setShowResult(false)}
                  />

                  <details className="mt-2 bg-white/5 border border-white/10 rounded p-4">
                    <summary className="cursor-pointer font-semibold">How to Play</summary>
                    <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-white/90">
                      <li>Click tiles that are true for you. Click again to unselect.</li>
                      <li>Complete any row, column, or diagonal to earn +5 bonus points.</li>
                      <li>Press Get Result to see your cosmic persona.</li>
                      {/* <li>Use Shuffle to get a fresh board. Progress is saved automatically.</li> */}
                    </ul>
                  </details>
                </>
              )}
            </>
          ) : (
            <Leaderboard />
          )}

          <ShareModal
            persona={persona}
            score={score}
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
          />
        </div>
      </div>
    </div>
  );
}

function AuthApp() {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cosmic-900 via-cosmic-800 to-cosmic-700 flex items-center justify-center">
        <div className="title-font neon-text text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return isLogin ? (
      <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
    ) : (
      <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
    );
  }

  return <GameApp />;
}

function App() {
  return (
    <AuthProvider>
      <UserStatsProvider>
        <AuthApp />
      </UserStatsProvider>
    </AuthProvider>
  );
}

export default App;

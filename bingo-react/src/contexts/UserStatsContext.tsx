import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { scoreAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface UserStats {
  bestScore: number;
  totalGames: number;
  averageScore: number;
  totalLines: number;
  totalCells: number;
  recentScores: Array<{
    _id: string;
    score: number;
    cells: number;
    lines: number;
    persona: { title: string; desc: string };
    createdAt: string;
  }>;
}

interface UserStatsContextType {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export function UserStatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!user) {
      setStats(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [statsData, recentScores] = await Promise.all([
        scoreAPI.getStats(),
        scoreAPI.getMyScores()
      ]);

      setStats({
        bestScore: statsData.bestScore || 0,
        totalGames: statsData.totalGames || 0,
        averageScore: Math.round(statsData.averageScore || 0),
        totalLines: statsData.totalLines || 0,
        totalCells: statsData.totalCells || 0,
        recentScores: recentScores || []
      });
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
      setError('Failed to load your statistics');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <UserStatsContext.Provider value={{ stats, loading, error, refreshStats }}>
      {children}
    </UserStatsContext.Provider>
  );
}

export function useUserStats() {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error('useUserStats must be used within a UserStatsProvider');
  }
  return context;
}

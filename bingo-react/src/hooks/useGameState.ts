import { useState, useEffect, useCallback } from 'react';
import { gameStateAPI } from '../services/api';

interface GameState {
  board: string[];
  selected: boolean[];
  showResult: boolean;
  gameStartTime: string;
  lastUpdated: string;
}

interface UseGameStateReturn {
  board: string[];
  selected: boolean[];
  showResult: boolean;
  gameStartTime: Date;
  loading: boolean;
  error: string | null;
  setBoard: (board: string[]) => void;
  setSelected: (selected: boolean[]) => void;
  setShowResult: (showResult: boolean) => void;
  toggleTile: (index: number) => void;
  resetSelections: () => Promise<void>;
  shuffleBoard: () => Promise<void>;
  resetGame: () => Promise<void>;
  saveGameState: () => Promise<void>;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    selected: Array(25).fill(false),
    showResult: false,
    gameStartTime: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load game state from database
  const loadGameState = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameStateAPI.getCurrent();
      setGameState(response.data);
    } catch (err) {
      console.error('Failed to load game state:', err);
      setError('Failed to load game state');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save game state to database
  const saveGameState = useCallback(async () => {
    try {
      await gameStateAPI.save({
        board: gameState.board,
        selected: gameState.selected,
        showResult: gameState.showResult
      });
    } catch (err) {
      console.error('Failed to save game state:', err);
      setError('Failed to save game state');
    }
  }, [gameState.board, gameState.selected, gameState.showResult]);

  // Auto-save when game state changes (with debouncing)
  useEffect(() => {
    if (!loading && gameState.board.length > 0) {
      const timeoutId = setTimeout(() => {
        saveGameState();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [gameState.board, gameState.selected, gameState.showResult, loading, saveGameState]);

  // Load initial game state
  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  const setBoard = useCallback((board: string[]) => {
    setGameState(prev => ({ ...prev, board }));
  }, []);

  const setSelected = useCallback((selected: boolean[]) => {
    setGameState(prev => ({ ...prev, selected }));
  }, []);

  const setShowResult = useCallback((showResult: boolean) => {
    setGameState(prev => ({ ...prev, showResult }));
  }, []);

  const toggleTile = useCallback((index: number) => {
    setGameState(prev => {
      const newSelected = [...prev.selected];
      newSelected[index] = !newSelected[index];
      return { ...prev, selected: newSelected };
    });
  }, []);

  const resetSelections = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gameStateAPI.clearSelections();
      setGameState(response.data.gameState);
    } catch (err) {
      console.error('Failed to reset selections:', err);
      setError('Failed to reset selections');
    } finally {
      setLoading(false);
    }
  }, []);

  const shuffleBoard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gameStateAPI.shuffle();
      setGameState(response.data.gameState);
    } catch (err) {
      console.error('Failed to shuffle board:', err);
      setError('Failed to shuffle board');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetGame = useCallback(async () => {
    try {
      setLoading(true);
      const response = await gameStateAPI.reset();
      setGameState(response.data.gameState);
    } catch (err) {
      console.error('Failed to reset game:', err);
      setError('Failed to reset game');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    board: gameState.board,
    selected: gameState.selected,
    showResult: gameState.showResult,
    gameStartTime: new Date(gameState.gameStartTime),
    loading,
    error,
    setBoard,
    setSelected,
    setShowResult,
    toggleTile,
    resetSelections,
    shuffleBoard,
    resetGame,
    saveGameState
  };
}

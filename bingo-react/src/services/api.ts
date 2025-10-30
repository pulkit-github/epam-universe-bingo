import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData: { email: string; password: string; name: string }) =>
    api.post('/auth/register', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  getProfile: () => api.get('/auth/profile'),
};

export const scoreAPI = {
  saveScore: (scoreData: {
    score: number;
    cells: number;
    lines: number;
    persona: { title: string; desc: string };
    board: string[];
    selected: boolean[];
    completedLines: number[][];
    gameTime: number;
  }) => api.post('/scores/save', scoreData),
  
  getMyScores: () => api.get('/scores/my-scores'),
  
  getBestScore: () => api.get('/scores/best-score'),
  
  getStats: () => api.get('/scores/stats'),
};

export const leaderboardAPI = {
  getGlobal: (limit = 50, page = 1) =>
    api.get(`/leaderboard/global?limit=${limit}&page=${page}`),
  
  getRecent: (limit = 20) =>
    api.get(`/leaderboard/recent?limit=${limit}`),
  
  getByPersona: (persona: string) =>
    api.get(`/leaderboard/by-persona?persona=${persona}`),
  
  getStats: () => api.get('/leaderboard/stats'),
};

export const gameStateAPI = {
  getCurrent: () => api.get('/game-state/current'),
  
  save: (gameState: {
    board: string[];
    selected: boolean[];
    showResult?: boolean;
  }) => api.post('/game-state/save', gameState),
  
  reset: () => api.post('/game-state/reset'),
  
  shuffle: () => api.post('/game-state/shuffle'),
  
  clearSelections: () => api.post('/game-state/clear-selections'),
};

export default api;

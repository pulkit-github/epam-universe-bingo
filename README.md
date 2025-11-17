EPAM Universe Bingo
====================

An interactive, full‑stack Bingo game with a cosmic theme, user authentication, score tracking, leaderboards, user statistics, and rich social sharing. Built with React + TypeScript on the frontend and Node.js + Express + MongoDB on the backend.

Features
--------
- User authentication (register/login) with JWT
- Interactive 5×5 Bingo board, real‑time scoring, line bonuses
- Persona assignment based on score
- Save scores and game details to MongoDB
- Global and persona‑based leaderboards
- Personal stats (games played, best/average scores, history)
- Social sharing (Twitter, LinkedIn, Facebook, WhatsApp, Telegram) and shareable image generation
- Responsive, animated UI (cosmic background, particles)

Monorepo Layout
---------------
- `bingo-react/` – Frontend app (Vite + React + TS)
  - `src/components/` UI components (Board, ResultModal, ShareModal, Leaderboard, etc.)
  - `src/contexts/` Auth and UserStats providers
  - `src/services/api.ts` API client
  - `src/hooks/useGameState.ts` Game state management
- `bingo-react/bingo-backend/` – Backend API (Express + MongoDB)
  - `routes/` auth, scores, leaderboard, gameState routes
  - `models/` Mongoose models (`User`, `Score`, `GameState`)
  - `server.js` Express bootstrap

Quick Start
-----------

Prerequisites: Node 18+, npm, and MongoDB (or MongoDB Atlas connection string).

1) Backend
----------
1. Open a terminal in `bingo-react/bingo-backend/`
2. Install deps:
   ```bash
   npm install
   ```
3. Create `.env` from `env.example` and set values:
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-super-secret
   PORT=5000
   CORS_ORIGIN=http://localhost:5173
   ```
4. Start the API:
   ```bash
   npm run dev
   ```

2) Frontend
-----------
1. Open a new terminal in `bingo-react/`
2. Install deps:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open the URL Vite prints (typically `http://localhost:5173`).

Key Endpoints (Backend)
-----------------------
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/profile`
- Scores: `POST /api/scores/save`, `GET /api/scores/my-scores`, `GET /api/scores/best-score`, `GET /api/scores/stats`
- Leaderboard: `GET /api/leaderboard/global`, `GET /api/leaderboard/recent`, `GET /api/leaderboard/by-persona`, `GET /api/leaderboard/stats`
- Game State: see `routes/gameState.js`

Database Schema (Overview)
--------------------------
For complete details, see `bingo-react/bingo-backend/README.md`.

- User
  - `email` (unique), `password` (hashed), `name`, `createdAt`
  - Indexes: unique index on `email`

- Score
  - `userId` (ref User), `score` (0–85), `cells`, `lines`, `persona { title, desc }`,
    `board` (string[]), `selected` (boolean[]), `completedLines` (number[][]), `gameTime`, `createdAt`

- GameState
  - Per-user game persistence, e.g. `board` (string[]), `selected` (boolean[]), `updatedAt`

Social Sharing
--------------
- `ShareModal.tsx` and `src/utils/shareUtils.ts` provide multi‑platform sharing and downloadable images.
- Triggered from the Result Modal or the Share button when score > 0.

Environment & Security
----------------------
- Keep secrets (.env) out of version control.
- CORS must include your frontend origin.

Deployment
----------
- Backend: Render, Railway, or similar (set environment variables accordingly)
- DB: MongoDB Atlas (recommended)
- Frontend: Vercel/Netlify/Static host (configure API base URL)

Screenshots
-----------
- See `Picture1.png` for UI reference.

License
-------
Copyright © 2025. All rights reserved.



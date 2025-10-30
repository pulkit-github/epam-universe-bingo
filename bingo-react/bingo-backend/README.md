# EPAM Universe Bingo - Backend API

Node.js + Express + MongoDB backend for the EPAM Universe Bingo game.

## Features

- **User Authentication** - JWT-based login/register
- **Score Tracking** - Save and retrieve player scores
- **Leaderboard** - Global and persona-based rankings
- **User Stats** - Personal statistics and game history

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Scores
- `POST /api/scores/save` - Save game score
- `GET /api/scores/my-scores` - Get user's scores
- `GET /api/scores/best-score` - Get user's best score
- `GET /api/scores/stats` - Get user's statistics

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/recent` - Recent high scores
- `GET /api/leaderboard/by-persona` - Scores by persona
- `GET /api/leaderboard/stats` - Leaderboard statistics

## Database Schema

### User
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Score
```javascript
{
  userId: ObjectId (ref: User),
  score: Number (0-85),
  cells: Number,
  lines: Number,
  persona: { title: String, desc: String },
  board: [String],
  selected: [Boolean],
  completedLines: [[Number]],
  gameTime: Number,
  createdAt: Date
}
```

## Deployment

### MongoDB Atlas (Recommended)
1. Create free MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Railway/Render
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## Environment Variables

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bingo-game
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
CORS_ORIGIN=http://localhost:3000
```

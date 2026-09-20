# Tara Typing — Modern Online Typing Platform (MERN)

> "Type Faster. Think Sharper."

A high-performance, full-stack MERN typing speed test and practice platform built with React, Vite, Tailwind CSS, Framer Motion, Recharts, Node.js, Express, and MongoDB.

---

## ✨ Key Features

- **⚡ High-Precision Typing Engine**: Instant local keystroke processing, net/raw WPM calculations, accuracy percentages, consistency variance tracking, and dynamic autoscrolling.
- **🎹 Real-Time Visual Keyboard**: 5-row interactive QWERTY on-screen keyboard synchronized with physical keystrokes and next-key target hints.
- **🔊 Tactile Audio Synthesis**: Native Web Audio mechanical switch ("thock"), typewriter, and electronic pip sound effects with zero latency.
- **📊 Comprehensive Analytics & Charts**: Interactive Recharts speed progression graphs and accuracy curves.
- **🎯 Multiple Practice Modes**:
  - **Time Practice** (15s, 30s, 60s, 120s)
  - **Words Practice** (10, 25, 50, 100 words)
  - **Quote Practice** (Curated literature & philosophy quotes)
  - **Custom Practice** (Paste or write custom text/code)
- **🏆 Global Leaderboard**: Ranked leaderboards filtered by time (Today, This Week, This Month, All Time) and durations (15s, 30s, 60s, 120s) with top 3 podium spotlights.
- **🔥 Daily Challenges**: Daily synchronized typing challenge with live countdown timer to midnight reset and daily rankings.
- **👤 Typist Profiles & Dashboard**: Streak tracking, lifetime metrics, badges/achievements showcase, and in-place Edit Profile modal.
- **⚙️ Custom Preferences**: Caret styles (line, block, underline), customizable font sizes, switch audio types, and dark/light themes.
- **📱 Fully Responsive**: Custom fixed `100dvh` slide-over mobile drawer with body scroll lock, zero horizontal scroll, and optimized touch layouts.
- **🛡️ Secure REST API Architecture**: Modular Node.js / Express backend with JWT authentication, bcrypt hashing, rate limiting, and MongoDB/Mongoose models.

---

## 🏗️ Architecture

```
tara-typing/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Button, Card, Modal, Badge, SEO
│   │   │   ├── layout/         # Navbar, MobileSidebar, Footer, Layout
│   │   │   ├── typing/         # TypingArea, Keyboard, StatsBar, Controls
│   │   │   ├── profile/        # EditProfileModal, Achievements, Activity
│   │   │   ├── dashboard/      # WpmChart, AccuracyChart
│   │   │   └── leaderboard/    # PodiumCard, LeaderboardTable
│   │   ├── pages/              # Home, TypingTest, Result, Practice, etc.
│   │   ├── context/            # Auth, Theme, Settings, Typing Contexts
│   │   ├── hooks/              # useTypingEngine, useSound
│   │   ├── services/           # authService, typingService, leaderboardService, etc.
│   │   ├── utils/              # typingCalculations, soundEngine, formatters
│   │   ├── data/               # words, quotes, mockLeaderboard, mockAchievements
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/                 # favicon.svg, robots.txt, sitemap.xml
│   └── package.json
│
├── server/
│   ├── controllers/            # auth, profile, typing, leaderboard, challenge, practice
│   ├── models/                 # User, TypingResult, DailyChallenge, PracticeSession
│   ├── routes/                 # Express API routes
│   ├── middleware/             # authMiddleware, errorMiddleware, rateLimiter
│   ├── config/                 # db.js
│   ├── utils/                  # generateToken.js, seedDatabase.js
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root and configure values:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tara_typing
JWT_SECRET=your_jwt_secret_key
```

### 3. Run Development Servers
To run both client and server concurrently:
```bash
npm run dev
```

Or run them independently:
- **Client (Vite on port 5173)**:
  ```bash
  npm run dev:client
  ```
- **Server (Express on port 5000)**:
  ```bash
  npm run dev:server
  ```

### 4. Build for Production
```bash
npm run build
```

---

## 📜 License
MIT © 2026 Tara Typing. Free Online Typing Test.

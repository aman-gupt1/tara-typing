# ⚡ Tara Typing — Full-Stack MERN Touch Typing Platform

<div align="center">

> *"Type Faster. Think Sharper. Master Touch Typing with Real-Time Precision."*

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Tara Typing** is a modern, high-performance, full-stack web application designed to help individuals of all skill levels improve their keyboard speed, accuracy, and touch typing muscle memory. It combines a real-time keystroke evaluation engine, an interactive visual keyboard, zero-latency mechanical sound synthesis, structured touch typing courses, global leaderboards, daily typing challenges, and a dedicated **Admin Governance Suite**.

[Key Features](#-key-features) • [How It Works](#-how-it-works-simple-explanation) • [System Architecture](#-system-architecture) • [Database Schemas](#-database-schemas) • [Admin Dashboard](#-admin-dashboard--governance) • [Setup Guide](#-installation--setup-guide)

</div>

---

## 📖 About The Project

Typing speed and accuracy are essential digital life skills for students, developers, writers, and professionals. Many existing typing websites suffer from intrusive advertisements, clumsy user interfaces, high-latency audio files, or lack of guided progressive learning.

**Tara Typing** was engineered from the ground up to solve these problems by providing:
- A clean, focused, distraction-free glassmorphic interface.
- Instant, sub-millisecond local keystroke calculation (Net WPM, Raw WPM, Accuracy, and Consistency).
- A 19-lesson touch typing curriculum that guides learners from basic home row keys to full alphanumeric typing and code syntax.
- Real-time competitive leaderboards and synchronized daily challenges to keep users engaged and motivated.
- A full-fledged Admin Suite with user moderation, account suspension controls, audit trails, and curriculum management.

---

## 🌟 Key Features

### 1. ⚡ High-Precision Typing Engine
- **Instant Keystroke Validation**: Character-by-character validation processed immediately on keypress. Correct letters glow green, mistakes highlight in red, and the smooth cursor moves without stutter.
- **Accurate Real-Time Telemetry**:
  - **Net WPM**: Standardized Words Per Minute excluding mistakes.
  - **Raw WPM**: Absolute typing speed including all keystrokes.
  - **Accuracy %**: Ratio of correct keystrokes to total attempts.
  - **Consistency Score**: Measures rhythm and pacing stability across the entire test.
- **Dynamic Auto-Scroll**: For multi-line passages, the text smoothly scrolls with the user's cursor without sudden jumps.
- **Test Controls**: Quick restart shortcuts (`Tab + Enter`), pause/resume, and customizable time durations (`15s`, `30s`, `60s`, `120s`).

### 2. 🎹 Interactive On-Screen Visual Keyboard
- **5-Row QWERTY Layout**: Matches physical keyboards with precise spacing and labels.
- **Physical Keypress Synchronization**: Pressing any key on your physical keyboard lights up the corresponding virtual key on screen instantly.
- **Touch-Typing Finger Guides**: Color-coded key zones showing which finger should press which key.
- **Target Key Indicator**: Highlights the upcoming character so learners never lose their place.

### 3. 🔊 Tactile Mechanical Audio Synthesis (Zero Lag)
- Utilizes the native browser **Web Audio API** to synthesize mechanical switch acoustics mathematically in real time, avoiding bulky MP3 downloads:
  - **Mechanical "Thock"**: Deep, resonant linear switch sound.
  - **Vintage Typewriter**: Authentic mechanical typewriter clack with carriage return bell.
  - **Clicky Switch**: Crisp tactile blue switch click.
  - **Electronic Beep**: Subtle digital pip for minimal distraction.
- Adjustable volume with instant mute toggle.

### 4. 📚 Touch Typing Curriculum (19+ Structured Lessons)
- Comprehensive course structure organized from foundational basics to expert programming syntax:
  - **Home Row Mastery**: `A`, `S`, `D`, `F` and `J`, `K`, `L`, `;`
  - **Top Row Navigation**: `Q`, `W`, `E`, `R`, `T` and `Y`, `U`, `I`, `O`, `P`
  - **Bottom Row Navigation**: `Z`, `X`, `C`, `V`, `B` and `N`, `M`, `,`, `.`, `/`
  - **Numbers & Special Symbols**: Top number row and Shift characters (`!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`)
  - **Code Syntax**: Brackets `{}`, `[]`, `<>`, semicolons, quotes, and indentation practice.
- Visual hand placement guides and strict accuracy benchmarks required to pass and unlock subsequent lessons.

### 5. 🏆 Global Leaderboard & Hall of Fame
- **100% Fully Responsive Design**: Seamless experience across smartphones (<640px), tablets (640-1024px), and ultra-wide desktop monitors.
- **Olympic Top-3 Podium**: Side-by-side 3-column Olympic arrangement featuring Gold (#1 Center elevated), Silver (#2 Left), and Bronze (#3 Right) crowns, laurels, and avatar rings.
- **Flexible Filters**:
  - **Time Periods**: `Today`, `This Week`, `This Month`, `All Time`.
  - **Durations**: `15s`, `30s`, `60s`, `120s`.
- **Dual-View User Experience**:
  - **Mobile**: Native card list where Rank, Avatar (with first-letter fallback), Username, Location, bold WPM, and Accuracy badge fit comfortably with **zero horizontal scrolling**.
  - **Desktop**: Detailed sortable table with user rank, WPM, accuracy, tests completed, location flag, and relative active time.
- **Search & Smart Pagination**: Filter typists by name, username, or country, with compact pagination navigation.

### 6. 🔥 Synchronized Daily Challenge
- A new, curated typing paragraph released every 24 hours.
- Live countdown timer showing hours, minutes, and seconds until midnight reset.
- Global typists compete on the exact same challenge text to earn daily bragging rights.

### 7. 👤 User Profiles & Progress Analytics
- **Personalized Avatar**: Upload custom profile pictures via Cloudinary or enjoy automatic vibrant initial avatars.
- **Recharts Visualizations**: Interactive speed progression charts tracking WPM changes and accuracy trends over time.
- **Lifetime Statistics**: Best WPM, Average WPM, Total tests completed, Total practice duration, Current streak, and Longest streak.
- **Achievements & Badges**: Unlock milestones such as *"First Test Completed"*, *"50+ WPM Speedster"*, *"Century 100+ WPM"*, *"Night Owl"*, and *"Streak Master"*.

### 8. 🛠️ Admin Dashboard & Governance
- Dedicated administration suite located at `/admin`.
- **User Management**: View all registered accounts, test totals, registration dates, and toggle **Active / Suspended status**. Suspended accounts are immediately blocked from logging in.
- **Typing Tests Audit**: Complete chronological inspection of all typing tests submitted across the platform.
- **Learning Content Manager**: Create, edit, and organize courses and touch typing lessons.
- **Telemetry & Analytics**: Overview of platform health, total users, tests completed, and engagement.

### 9. 🛡️ Enterprise Security & Protected Routing
- **Role-Based Access Control**:
  - Public Protected Routes (`/profile`, `/dashboard`, `/settings`): Requires valid user authentication.
  - Admin Protected Routes (`/admin/*`): Strictly enforces `role === 'admin'`. Unauthorized users are safely redirected.
- **Synchronized Session Logout**: If an administrator logs out from the public site, their session terminates across both the public area and the Admin Dashboard, redirecting cleanly to Home.
- **Security Standards**:
  - Passwords hashed using Argon2.
  - Signed JSON Web Tokens (JWT) stored in HTTP-Only, SameSite cookies.
  - Rate limiting on API endpoints to prevent brute-force attacks.
  - Strict Cross-Origin Resource Sharing (CORS) policies.

---

## 💡 How It Works (Simple Explanation)

If you are new to the platform or exploring the codebase, here is a simple overview of how everything connects:

```
+-----------------------------------------------------------------------+
|                             USER BROWSER                              |
|                                                                       |
|   1. User types in TypingArea  ---->  useTypingEngine processes keys  |
|   2. Key hits Web Audio API    ---->  Plays instant mechanical audio  |
|   3. Screen Keyboard highlights --->  Visual feedback & finger guides |
|   4. Test finishes             ---->  Calculates Net WPM & Accuracy   |
+-----------------------------------+-----------------------------------+
                                    |
                                    | Axios HTTP Request (with JWT)
                                    v
+-----------------------------------------------------------------------+
|                          EXPRESS REST API                             |
|                                                                       |
|   1. Auth Middleware verifies JWT token & checks if user isActive    |
|   2. Typing Controller saves attempt to MongoDB                      |
|   3. Updates User's Best WPM, Average WPM, and Streak count           |
|   4. Leaderboard Service re-ranks typists dynamically                 |
+-----------------------------------+-----------------------------------+
                                    |
                                    | Mongoose ODM Queries
                                    v
+-----------------------------------------------------------------------+
|                          MONGODB DATABASE                             |
|                                                                       |
|   Stores: Users, TypingResults, Courses, Lessons, DailyChallenges     |
+-----------------------------------------------------------------------+
```

1. **Typing Experience**: When you visit `/typing-test`, the client loads text. As you press keys, the frontend hooks track elapsed time, count correct/incorrect characters, and play audio feedback immediately.
2. **Result Submission**: Upon completing the timer, the client sends a `POST` request to `/api/typing/submit`. The server validates the data and writes a record to MongoDB.
3. **Leaderboard Refresh**: The `/leaderboard` endpoint aggregates top scores grouped by timeframe and duration, instantly reflecting your rank.
4. **Administration**: Administrators can log in to `/admin` to monitor tests, edit lessons, or suspend malicious accounts.

---

## 🏗️ System Architecture

```
tara-typing/
├── client/                      # Frontend Application (React + Vite)
│   ├── public/                  # Static assets, icons, manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # AdminTopNavbar, AdminSidebar, UserStatusModal
│   │   │   ├── common/          # Button, Card, Modal, UserAvatar, SEO, SkeletonBox
│   │   │   ├── layout/          # Navbar, MobileSidebar, Footer, ProtectedRoute
│   │   │   ├── typing/          # TypingArea, VirtualKeyboard, StatsBar, TestControls
│   │   │   ├── profile/         # EditProfileModal, BadgesShowcase, ActivityCalendar
│   │   │   ├── dashboard/       # SpeedGraph, AccuracyCurve, StatsOverview
│   │   │   └── leaderboard/     # PodiumCard, TableRankBadge, Top3Podium
│   │   ├── pages/               # Home, TypingTest, Leaderboard, Practice, Learn, Profile, Admin
│   │   ├── context/             # AuthContext, ThemeContext, SettingsContext, TypingContext
│   │   ├── hooks/               # useTypingEngine, useSoundEngine, useResponsive
│   │   ├── services/            # Axios API services (auth, typing, leaderboard, admin)
│   │   ├── utils/               # wpmCalculators, soundSynthesizer, formatters
│   │   ├── App.jsx              # Main route definitions & context wrapper
│   │   ├── main.jsx             # React DOM root entry
│   │   └── index.css            # Tailwind directives & global styling
│   ├── vite.config.js           # Vite build configuration
│   └── package.json
│
├── server/                      # Backend API (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/              # MongoDB connection & Cloudinary setup
│   │   ├── controllers/         # Business logic for auth, profile, typing, admin
│   │   ├── models/              # Mongoose schemas (User, TypingResult, Course, Lesson, etc.)
│   │   ├── routes/              # Express API endpoints
│   │   │   ├── admin/           # Dedicated admin sub-routes
│   │   │   ├── auth.routes.js
│   │   │   ├── typing.routes.js
│   │   │   ├── leaderboard.routes.js
│   │   │   └── ...
│   │   ├── middleware/          # authMiddleware, adminMiddleware, rateLimiter, errorMiddleware
│   │   ├── seeds/               # Database seed scripts (Admin initial account)
│   │   ├── utils/               # JWT generator, token verification helpers
│   │   ├── app.js               # Express application initialization & middleware setup
│   │   └── server.js            # Server entry point & database bootstrapper
│   └── package.json
│
├── README.md                    # Project Documentation
└── .gitignore
```

---

## 🗄️ Database Schemas

### 1. `User` Model
Represents registered users, their profile details, high scores, streaks, and account status.
```javascript
{
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Argon2 hash
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }, // Managed by admin to suspend accounts
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: 'Global' },
  bestWpm: { type: Number, default: 0 },
  averageWpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  testsCompleted: { type: Number, default: 0 },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActiveDate: { type: Date }
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. `TypingResult` Model
Stores individual test attempts for leaderboards, history, and personal progress graphs.
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wpm: { type: Number, required: true },
  rawWpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  consistency: { type: Number, default: 0 },
  duration: { type: Number, required: true }, // 15, 30, 60, 120
  mode: { type: String, enum: ['time', 'words', 'quote', 'custom', 'challenge'], default: 'time' },
  errors: { type: Number, default: 0 },
  keystrokes: {
    total: Number,
    correct: Number,
    incorrect: Number
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. `Course` & `Lesson` Models
Supports touch-typing structured learning modules.
```javascript
// Course
{
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  order: Number,
  category: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  lessonsCount: Number
}

// Lesson
{
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  targetKeys: [{ type: String }],          // Example: ['a', 's', 'd', 'f']
  practiceText: { type: String, required: true },
  targetWpm: { type: Number, default: 20 },
  minAccuracy: { type: Number, default: 90 },
  instructions: String
}
```

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Log in with email/username and password | Public |
| `POST` | `/api/auth/logout` | Terminate session and clear authentication cookie | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user data and permissions | Private |

### 🏆 Public & Leaderboard (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/stats/public` | Global statistics (total tests, typists, etc.) | Public |
| `GET` | `/api/leaderboard` | Filtered leaderboard entries (period, duration) | Public |
| `GET` | `/api/daily-challenge` | Active daily challenge text and rankings | Public |
| `GET` | `/api/lessons` | List of touch typing courses and lessons | Public |

### ⌨️ Typing & Profile (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/typing/submit` | Submit a completed test result | Private / Guest |
| `GET` | `/api/typing/history` | Chronological test history of logged-in user | Private |
| `GET` | `/api/profile` | Current user profile details and statistics | Private |
| `PUT` | `/api/profile` | Update profile information (name, bio, location) | Private |
| `POST` | `/api/profile/avatar` | Upload profile image to Cloudinary | Private |

### 🛡️ Admin Suite (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all users with status, test counts, and dates | Admin Only |
| `PATCH` | `/api/admin/users/:id/status` | Activate or suspend a user account | Admin Only |
| `GET` | `/api/admin/typing-tests` | Comprehensive log of all platform typing tests | Admin Only |
| `GET` | `/api/admin/learning` | Retrieve course curriculum management data | Admin Only |
| `POST` | `/api/admin/learning/lesson` | Create a new touch-typing lesson | Admin Only |
| `GET` | `/api/admin/analytics` | High-level user engagement and platform metrics | Admin Only |

---

## 💻 Tech Stack Summary

| Area | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18.3 | Dynamic, declarative user interface |
| **Tooling & Bundler** | Vite 5.4 | Ultra-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS 3.4 | Modern glassmorphism, responsive utilities, custom themes |
| **Icons & Graphics** | Lucide React | Clean, lightweight modern icons |
| **Charts** | Recharts 2.15 | Responsive SVG-based WPM and accuracy progression charts |
| **Animations** | Framer Motion & Canvas Confetti | Smooth modal transitions and celebratory test completion effects |
| **Audio** | HTML5 Web Audio API | Zero-latency algorithmic mechanical switch audio synthesis |
| **Backend Framework** | Node.js + Express 4.21 | RESTful API server architecture |
| **Database** | MongoDB + Mongoose 8.9 | Schema-based document database for records and metrics |
| **Authentication** | JWT + Cookie-Parser + Argon2 | Secure session tokens and cryptographic password hashing |
| **File Storage** | Multer + Cloudinary 2.11 | Scalable cloud image hosting for user avatars |
| **API Protection** | Express Rate Limit + CORS | Defense against DDoS, brute force, and cross-site requests |

---

## 🚀 Installation & Setup Guide

Follow these steps to run the complete project locally on your development machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server running on `mongodb://localhost:27017` or a free MongoDB Atlas connection string)
- [Git](https://git-scm.com/)

---

### Step 1: Clone The Repository
```bash
git clone https://github.com/aman-gupt1/tara-typing.git
cd "Tara Typing"
```

---

### Step 2: Configure The Backend (`server`)

1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an environment configuration file `.env` inside `server/`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/tara_typing
   JWT_SECRET=your_super_secret_jwt_random_key_here
   JWT_EXPIRES_IN=7d

   # Optional (Required only for custom profile picture uploads)
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. **Seed The Administrator Account**:
   Run the database seed script to automatically create the initial admin user:
   ```bash
   npm run seed
   ```
   *Default Admin Credentials:*
   - **Email:** `admin@taratyping.com`
   - **Password:** `Admin@12345`

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Server will run at: `http://localhost:5000`*

---

### Step 3: Configure The Frontend (`client`)

1. Open a new terminal tab and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file in `client/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Application will be live at: `http://localhost:5173`*

---

### Step 4: Build For Production

To test production bundling and performance:

```bash
# Build optimized frontend assets
cd client
npm run build

# Start production server
cd ../server
npm start
```

---

## 📱 Mobile Responsiveness Highlights

- **Zero Horizontal Scrolling**: The entire application, including the podium, filters, table data, and profile graphs, has been crafted to adapt dynamically to viewports as small as 320px.
- **Dynamic Mobile Drawer**: The mobile navigation bar slides out smoothly with locked body scrolling so users cannot accidentally scroll the background page while navigating.
- **Smart Touch Targets**: All interactive elements (period tabs, duration selectors, pagination buttons) have generous touch surfaces (`min-h-[40px]`) conforming to mobile accessibility guidelines.

---

## 🛡️ Security Highlights

1. **Active/Suspended State Enforcement**: The authentication middleware checks `user.isActive` on every authenticated request. When an administrator suspends an account, active sessions are immediately revoked.
2. **Synchronized Logout**: Terminating a session on the public client clears authentication tokens completely, locking down both the public routes and the Admin Dashboard.
3. **Argon2 Password Hashing**: Utilizes industry-standard Argon2 hashing with cryptographic salts, protecting user passwords against rainbow table and brute-force attacks.

---

## 👥 Authors & Acknowledgments

- **Lead Developer**: Aman Gupta ([@aman-gupt1](https://github.com/aman-gupt1))
- **Project**: Tara Typing Platform
- **License**: [MIT License](LICENSE)

---

<div align="center">
  <sub>Built with ❤️ for passionate typists, developers, and learners worldwide.</sub>
</div>

# ⚡ Tara Typing — Full-Stack MERN Typing Platform

<div align="center">

> *"Type Faster. Think Sharper. Master Touch Typing with Real-Time Feedback."*

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Tara Typing** ek modern, high-performance, aur complete MERN-stack web application hai jo users ko typing speed, accuracy, aur touch-typing skills sikhne aur improve karne me madad karta hai. Isme advanced typing engine, interactive on-screen keyboard, real-time audio sound effects, touch typing courses, global leaderboards, daily challenges, aur ek powerful dedicated **Admin Governance Dashboard** shamil hai.

[Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Database Models](#-database-models) • [Admin Suite](#-admin-dashboard--governance) • [Hindi Guide](#-aasan-bhasha-me-project-samjho-hindi--hinglish)

</div>

---

## 🌟 Key Features

### 1. ⚡ High-Precision Typing Engine
- **Instant Keystroke Validation**: Har single keystroke ka real-time local processing. Sahi character pe green, galat pe red aur cursor active rehta hai.
- **Accurate Metrics**:
  - **Net WPM** (Words Per Minute minus penalties)
  - **Raw WPM** (Total keys pressed / 5 / minutes)
  - **Accuracy %** (Correct characters vs total strokes)
  - **Consistency Score** (Keystroke variance over time)
- **Smooth Auto-Scroll**: Lambe paragraphs me cursor ke sath text automatically scroll hota hai bina screen jerk ke.
- **Pause & Resume**: Space / ESC / click se smooth control.

### 2. 🎹 Interactive On-Screen Visual Keyboard
- **5-Row QWERTY Layout**: Screen par standard QWERTY keyboard visually show hota hai.
- **Synchronized Feedback**: Jaise hi user physical keyboard par koi key press karta hai, screen par wo key illuminate ho jati hai.
- **Touch-Typing Finger Guides**: Kis finger se kaunsi key press karni hai uska color-coded guide.
- **Next-Key Target Indicator**: Agla character kaunsa dabana hai wo key highlight hoti hai.

### 3. 🔊 Tactile Audio Synthesis (Zero Lag)
- Pure **Web Audio API** synthesize karta hai mechanical keyboard sounds:
  - **Mechanical "Thock"** (Deep linear switch sound)
  - **Vintage Typewriter** (Classic mechanical typewriter with bell)
  - **Clicky Switch** (Blue switch tactile snap)
  - **Electronic Beep** (Soft digital pip)
- Zero external MP3 loading latency. Sound engine directly browser me sound generate karta hai.

### 4. 📚 Touch Typing Curriculum (19+ Structured Lessons)
- Beginners se lekar Advanced programmers tak ke liye complete step-by-step curriculum:
  - **Home Row Mastery**: `A S D F` & `J K L ;` keys
  - **Top Row Practice**: `Q W E R T` & `Y U I O P`
  - **Bottom Row Practice**: `Z X C V B` & `N M , . /`
  - **Number Row & Symbols**: `1-0`, `! @ # $ % ^ & * ( )`
  - **Coding Syntax**: Javascript, Python, HTML/CSS brackets, semicolons, quotes.
- Live hand positioning diagram aur real-time lesson passing criteria (minimum WPM aur Accuracy).

### 5. 🏆 Global Leaderboard & Hall of Fame
- **100% Fully Responsive Layout**: Mobile phones (<640px), tablets, aur wide desktop monitors sabhi screens par perfectly fit hota hai.
- **Olympic Top-3 Podium**: Gold (#1 Center elevated), Silver (#2 Left), aur Bronze (#3 Right) medals, crowns, aur laurel wreaths ke sath.
- **Filter By Time Period**:
  - `Today` (Daily top rankers)
  - `This Week`
  - `This Month`
  - `All Time`
- **Filter By Duration**: `15s`, `30s`, `60s`, `120s`.
- **Dual Responsive UI**:
  - **Mobile**: Touch-friendly typist card list — bina kisi horizontal scroll ke WPM, Accuracy, Avatar, aur Rank saaf dikhte hain.
  - **Desktop**: Full sortable table with Rank, Avatar, Username, WPM, Accuracy, Tests, Location, and Last Active timestamp.
- **Live Search**: Instant filter by name, username, or location.

### 6. 🔥 Synchronized Daily Challenge
- Har din midnight reset hone wala unique typing challenge.
- Live countdown timer till next day reset.
- Global typists ek hi passage type karte hain aur daily leaderboard par rank karte hain.

### 7. 👤 User Profiles & Analytics
- **Cloudinary Avatar Upload**: Apni photo upload karein ya auto-generated colorful first-letter initial avatar payein.
- **Interactive Recharts Graphs**: Time ke sath WPM speed improvement aur accuracy progression charts.
- **Metrics Tracked**: Best WPM, Average WPM, Total tests completed, Total time spent typing, Current streak, Longest streak.
- **Milestone Badges**: "First Test Taken", "50+ WPM Club", "Century 100+ WPM", "Night Owl", "Streak Master".

### 8. 🛠️ Admin Dashboard & Governance
- Dedicated admin portal (`/admin`) for full platform management.
- **User Management**: Sabhi registered users ki list, registration date, best WPM, role, aur **Active / Suspend Status Switch**.
  - Agar admin kisi user ko block/suspend karta hai, wo user login nahi kar payega.
- **Typing Tests Inspection**: Platform par huye sabhi tests ka full audit log.
- **Course & Lesson Manager**: Naye lessons add karna, update karna, ya delete karna.
- **Leaderboards & Achievements**: Hall of Fame monitoring.

### 9. 🛡️ Enterprise Security & Protected Routing
- **Role-Based Protected Routes**:
  - Public Protected Route: `/profile`, `/dashboard`, `/settings` (User logged in hona zaroori hai).
  - Admin Protected Route: `/admin/*` (Kewal role === 'admin' users access kar sakte hain).
- **Session Synchronized Logout**: Agar admin public website se logout karta hai, toh Admin Dashboard se bhi automatically logout ho jata hai aur Homepage par redirect ho jata hai.
- **Security Best Practices**:
  - Argon2 / Bcrypt secure password hashing.
  - HTTP-Only Cookies & JWT Bearer token authentication.
  - Express Rate Limiting (Brute-force protection).
  - CORS security policies.

---

## 🏗️ Architecture & Directory Structure

```
Tara-Typing/
├── client/                      # Frontend (React 18 + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/           # AdminTopNavbar, AdminSidebar, UserStatusModal
│   │   │   ├── common/          # Button, Card, Modal, UserAvatar, SEO, SkeletonBox
│   │   │   ├── layout/          # Navbar, MobileSidebar, Footer, ProtectedRoute
│   │   │   ├── typing/          # TypingArea, VirtualKeyboard, StatsBar, TestControls
│   │   │   ├── profile/         # EditProfileModal, BadgesShowcase, ActivityCalendar
│   │   │   ├── dashboard/       # SpeedGraph, AccuracyCurve, StatsOverview
│   │   │   └── leaderboard/     # PodiumCard, TableRankBadge, Top3Podium
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with hero, live preview, features
│   │   │   ├── TypingTest.jsx   # Live typing engine page
│   │   │   ├── Leaderboard.jsx  # 100% Responsive global leaderboards
│   │   │   ├── Practice.jsx     # Words, quotes, custom practice modes
│   │   │   ├── Learn.jsx        # Touch typing course curriculum & lessons
│   │   │   ├── DailyChallenge.jsx
│   │   │   ├── Profile.jsx      # User profile, history, badges
│   │   │   ├── admin/           # Admin dashboard, users, tests, courses, analytics
│   │   │   └── NotFound.jsx
│   │   ├── context/             # AuthContext, ThemeContext, SettingsContext, TypingContext
│   │   ├── hooks/               # useTypingEngine, useSoundEngine, useResponsive
│   │   ├── services/            # Axios API wrappers (auth, typing, leaderboard, admin)
│   │   ├── utils/               # wpmCalculators, soundSynthesizer, formatters
│   │   ├── App.jsx              # Main router & provider setup
│   │   ├── main.jsx             # React DOM entry point
│   │   └── index.css            # Tailwind directives & custom glassmorphism styles
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                      # Backend (Node.js + Express.js + MongoDB)
│   ├── src/
│   │   ├── config/              # db.js (MongoDB connection), cloudinary.js
│   │   ├── controllers/         # auth, profile, typing, leaderboard, challenge, admin
│   │   ├── models/              # User, TypingResult, Course, Lesson, DailyChallenge
│   │   ├── routes/              # Public & Admin Express routers
│   │   │   ├── admin/           # adminUser, adminTypingTest, adminLeaderboard, etc.
│   │   │   ├── auth.routes.js
│   │   │   ├── leaderboard.routes.js
│   │   │   ├── typing.routes.js
│   │   │   └── ...
│   │   ├── middleware/          # authMiddleware, adminMiddleware, rateLimiter, errorMiddleware
│   │   ├── seeds/               # admin.seed.js (Creates default admin user)
│   │   ├── utils/               # jwtTokenGenerator, responseFormatter
│   │   ├── app.js               # Express application config & middleware mounting
│   │   └── server.js            # HTTP Server bootstrap & DB connection
│   └── package.json
│
├── README.md                    # Project Documentation
└── .gitignore
```

---

## 🗄️ Database Models (MongoDB / Mongoose)

### 1. `User` Schema
```javascript
{
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true }, // Argon2 hash
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true }, // Admin block/unblock control
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: 'India' },
  bestWpm: { type: Number, default: 0 },
  averageWpm: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  testsCompleted: { type: Number, default: 0 },
  streak: { current: Number, longest: Number, lastActiveDate: Date },
  createdAt: { type: Date, default: Date.now }
}
```

### 2. `TypingResult` Schema
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  wpm: { type: Number, required: true },
  rawWpm: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  consistency: { type: Number, default: 0 },
  duration: { type: Number, required: true }, // 15, 30, 60, 120 seconds
  mode: { type: String, enum: ['time', 'words', 'quote', 'custom', 'challenge'], default: 'time' },
  errors: { type: Number, default: 0 },
  keystrokes: { total: Number, correct: Number, incorrect: Number },
  createdAt: { type: Date, default: Date.now }
}
```

### 3. `Course` & `Lesson` Schema
```javascript
// Course
{
  title: String,
  slug: { type: String, unique: true },
  description: String,
  order: Number,
  category: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  lessonsCount: Number
}

// Lesson
{
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  order: Number,
  targetKeys: [String],        // e.g. ['a', 's', 'd', 'f']
  practiceText: String,
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
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Login with username/email & password | Public |
| `POST` | `/api/auth/logout` | Clear auth cookies & terminate session | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile & role | Private |

### 🏆 Public & Leaderboards (`/api`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/stats/public` | Global statistics (total tests, typists, etc.) | Public |
| `GET` | `/api/leaderboard` | Top typists filtered by period & duration | Public |
| `GET` | `/api/daily-challenge` | Today's active challenge & leaderboard | Public |
| `GET` | `/api/lessons` | List of touch-typing courses & lessons | Public |

### ⌨️ Typing & Results (`/api/typing`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/typing/submit` | Save test result & update user stats | Private / Guest |
| `GET` | `/api/typing/history` | Logged-in user's test attempt history | Private |

### 🛡️ Admin Suite (`/api/admin`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/admin/users` | List all registered users with stats | Admin Only |
| `PATCH` | `/api/admin/users/:id/status` | Block / Activate user account | Admin Only |
| `GET` | `/api/admin/typing-tests` | Audit log of all completed tests | Admin Only |
| `GET` | `/api/admin/learning` | Manage courses and touch-typing lessons | Admin Only |
| `POST` | `/api/admin/learning/lesson` | Add new practice lesson | Admin Only |
| `GET` | `/api/admin/analytics` | High-level platform telemetry & graphs | Admin Only |

---

## 💻 Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18 (Vite, Fast Refresh, ES Modules) |
| **Styling & Design** | Tailwind CSS v3, Glassmorphism, Custom CSS Variables |
| **Animations & UI** | Framer Motion, Lucide React Icons, Canvas-Confetti |
| **Data Visualization** | Recharts (Responsive area charts, WPM curves) |
| **Audio Synthesis** | Native HTML5 Web Audio API (zero audio file assets) |
| **Backend Runtime** | Node.js (v18+) with Express.js REST API |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (JSON Web Tokens), Cookie-Parser, Argon2 Password Hash |
| **Cloud Storage** | Cloudinary (User Profile Avatars) |
| **Security** | Express Rate Limit, Helmet, CORS Protection |

---

## 🚀 Quick Start (Installation & Setup)

Follow these steps to run the complete project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.0 or higher)
- [MongoDB](https://www.mongodb.com/) (Local MongoDB Community Server running on `localhost:27017` or MongoDB Atlas URI)
- [Git](https://git-scm.com/)

---

### Step 1: Clone Repository
```bash
git clone https://github.com/aman-gupt1/tara-typing.git
cd "Tara Typing"
```

---

### Step 2: Configure Server Backend
1. Go into the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/tara_typing
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d

   # Optional (Cloudinary Avatar Uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. **Seed the Admin User**:
   ```bash
   npm run seed
   ```
   *Creates the default administrator account:*
   - **Email:** `admin@taratyping.com`
   - **Password:** `Admin@12345`

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Server will run at: `http://localhost:5000`*

---

### Step 3: Configure Client Frontend
1. Open a new terminal and navigate to `client`:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file in `client/.env` (optional, defaults to localhost:5000):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Client will open at: `http://localhost:5173`*

---

### Step 4: Build for Production
To create optimized production builds:
```bash
# In client/
npm run build

# In server/
npm start
```

---

## 📖 Aasan Bhasha Me Project Samjho (Hindi / Hinglish)

Agar aap non-technical hain ya project ko aasan shabdon me samajhna chahte hain, toh ye summary aapke liye hai:

### 1. Tara Typing Kya Hai?
**Tara Typing** ek aisi website hai jahan koi bhi insaan aakar apni keyboard typing speed test kar sakta hai, naye touch-typing lessons seekh sakta hai, aur doosre logon ke sath compete kar sakta hai.

### 2. Website Par Kya Kya Features Hain?
1. **Typing Test Engine**: Screen par words aate hain. Jaise hi aap type karte ho, green ya red color me pata chalta hai ki aapne sahi type kiya ya galat. Net WPM (Speed) aur Accuracy instantly calculate hoti hai.
2. **Interactive Keyboard & Sound Effects**: Aapke typing ke sath-sath screen par keyboard ki keys press hoti dikhti hain aur mechanical keyboard ("thock" sound) aawaz aati hai.
3. **19+ Touch Typing Lessons**: Ungliyon ko bina dekhe kaise type karein (`A S D F` Home row se start hokar complete alphabet, numbers aur code syntax tak).
4. **Global Leaderboard**: Duniyabhar ke sabse fast typists ki list. Top 3 logon ko Olympic style Gold, Silver aur Bronze podium par dikhaya jata hai. Chahe aap mobile me chalao ya computer me, ye 100% responsive hai (mobile me scroll karne ki jhanjhat nahi).
5. **Daily Challenge**: Har din ek naya challenge milta hai jisme sabhi users hissa le sakte hain.
6. **User Profile**: Aapki ab tak ki best speed, average speed, tests count, aur streak track hoti hai.

### 3. Admin Dashboard Ka Kya Kaam Hai?
Website ka ek alag secret control panel hai (`/admin`):
- **User Block/Unblock**: Admin kisi bhi user ko suspend ya unblock kar sakta hai. Blocked user website par login nahi kar sakta.
- **Audit Logs**: Admin dekh sakta hai ki kis user ne kitne tests diye hain aur kiski kya speed hai.
- **Course & Lesson Control**: Naye lessons add kar sakta hai ya puraane edit kar sakta hai.
- **Auto-Logout Security**: Agar Admin public website se logout karta hai, toh Admin dashboard se bhi apne aap logout ho jata hai.

---

## 👥 Contributors & Feedback
Built with ❤️ for passionate typists and learners worldwide.

- **Author:** Aman Gupta ([@aman-gupt1](https://github.com/aman-gupt1))
- **Project:** Tara Typing
- **License:** [MIT License](LICENSE)

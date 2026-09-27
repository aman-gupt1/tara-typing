# ⚡ Tara Typing — Modern Touch Typing Platform

<div align="center">

> *"Type Faster. Think Sharper. Master Touch Typing with Real-Time Precision."*

[![React](https://img.shields.io/badge/React-18.3-blue.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg?logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-4.21-lightgrey.svg?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%208-emerald.svg?logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A sleek, high-performance, full-stack MERN typing platform featuring instant keystroke evaluation, an interactive visual keyboard, zero-latency mechanical switch audio, 19+ structured touch typing lessons, competitive global leaderboards, and an enterprise admin suite.

</div>

---

## 📸 Screenshots & UI Showcase

### 🌐 Public Typist & Learner Interface

| 🏠 Landing Page & Hero | ⚡ Live Typing Test & Virtual Keyboard |
| :---: | :---: |
| ![Landing Page](screenshots/01-home-hero.png) | ![Typing Test](screenshots/02-typing-test.png) |

| 📚 Touch Typing Curriculum (19+ Lessons) | 🏆 100% Responsive Leaderboard |
| :---: | :---: |
| ![Learn Typing](screenshots/03-learn-typing.png) | ![Leaderboard](screenshots/04-leaderboard.png) |

| 🔥 Synchronized Daily Challenge | 👤 Typist Profile & Analytics |
| :---: | :---: |
| ![Daily Challenge](screenshots/05-daily-challenge.png) | ![User Profile](screenshots/06-user-profile.png) |

| ⚙️ Custom Preferences, Accent Themes & Mechanical Audio |
| :---: |
| ![Settings](screenshots/07-settings.png) |

<br/>

### 🛠️ Admin Suite (`/admin`)

| 📊 Telemetry & Control Center | 👥 User Management & Active/Suspend Switch |
| :---: | :---: |
| ![Admin Dashboard](screenshots/08-admin-dashboard.png) | ![Admin Users](screenshots/09-admin-users.png) |

| 📖 Touch Typing Curriculum Management Engine |
| :---: |
| ![Admin Curriculum](screenshots/10-admin-curriculum.png) |

---

## ✨ Key Features

- **⚡ Real-Time Typing Engine**: Instant local keystroke processing calculating Net WPM, Raw WPM, Accuracy %, and Consistency without screen lag.
- **🎹 Synchronized Virtual Keyboard**: 5-row interactive QWERTY layout with physical keypress lighting and color-coded touch typing finger placement guides.
- **🔊 Tactile Audio Synthesis**: Zero-latency mechanical switch acoustics (Thock, Typewriter, Clicky, Beep) synthesized natively with the Web Audio API.
- **📚 19+ Touch Typing Lessons**: Step-by-step structured curriculum guiding learners from Home Row (`ASDF JKL;`) to numbers, symbols, and code syntax.
- **🏆 Responsive Global Leaderboard**: Side-by-side Olympic podium (Gold, Silver, Bronze) with zero horizontal scrolling on mobile and sortable tables on desktop.
- **🔥 Synchronized Daily Challenge**: A new challenge passage released every 24 hours with a live countdown timer and daily rankings.
- **👤 Analytics & Streaks**: Recharts speed progression graphs, streak tracking, lifetime personal records, and unlockable milestone badges.
- **🛡️ Admin Governance Suite**: Role-based access control, user active/suspend status switch (blocks suspended logins), and curriculum management.

---

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Charts & Audio** | Recharts (Speed/Accuracy Curves), Web Audio API (Synthesized Switches) |
| **Backend** | Node.js, Express.js REST API |
| **Database** | MongoDB with Mongoose ODM |
| **Auth & Security** | JWT (HTTP-Only Cookies), Argon2 Password Hash, Express Rate Limit |
| **Media Storage** | Cloudinary & Multer (Avatar Uploads) |

---

## 📁 Project Structure

```
Tara-Typing/
├── client/              # React 18 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/  # Typing engine, visual keyboard, admin, layout
│   │   ├── pages/       # Home, TypingTest, Learn, Leaderboard, Admin, Profile
│   │   ├── context/     # Auth, Settings, Theme, and Typing states
│   │   └── hooks/       # useTypingEngine, useSoundEngine
│   └── package.json
├── server/              # Node.js + Express + MongoDB REST API
│   ├── src/
│   │   ├── controllers/ # Auth, typing, profile, leaderboard, admin logic
│   │   ├── models/      # User, TypingResult, Course, Lesson schemas
│   │   ├── routes/      # Express API route endpoints
│   │   ├── middleware/  # JWT auth, admin guard, rate limiting
│   │   └── seeds/       # Database admin seed script
│   └── package.json
├── screenshots/         # Application visual previews
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance or MongoDB Atlas connection string)

### 2. Backend Setup
```bash
cd server
npm install
```
Create `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/tara_typing
JWT_SECRET=your_secret_jwt_key
```
Seed the initial admin account:
```bash
npm run seed
# Default Admin: admin@taratyping.com | Admin@12345
```
Start server:
```bash
npm run dev
# Server running at http://localhost:5000
```

### 3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
# Client live at http://localhost:5173
```

---

## 👥 Authors & License

- **Lead Developer**: Aman Gupta ([@aman-gupt1](https://github.com/aman-gupt1))
- **License**: [MIT License](LICENSE)

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { taraToastTransition } from './utils/toastTransition';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { TypingProvider } from './context/TypingContext';
import { LearnProvider } from './context/LearnContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import TypingTest from './pages/TypingTest';
import Result from './pages/Result';
import Practice from './pages/Practice';
import Learn from './pages/Learn';
import LessonDetail from './pages/LessonDetail';
import Leaderboard from './pages/Leaderboard';
import DailyChallenge from './pages/DailyChallenge';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';
import PageTransition from './components/common/PageTransition';

// Admin Dashboard Components & Pages
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminTypingTests from './pages/admin/AdminTypingTests';
import AdminLeaderboard from './pages/admin/AdminLeaderboard';
import AdminChallenges from './pages/admin/AdminChallenges';
import AdminLearning from './pages/admin/AdminLearning';
import AdminAchievements from './pages/admin/AdminAchievements';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminSettingsPage from './pages/admin/AdminSettings';
import AdminSecurity from './pages/admin/AdminSecurity';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const { theme } = useTheme();
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Layout>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/typing-test" element={<PageTransition><TypingTest /></PageTransition>} />
            <Route path="/result" element={<PageTransition><Result /></PageTransition>} />
            <Route path="/practice" element={<PageTransition><Practice /></PageTransition>} />
            <Route path="/learn" element={<PageTransition><Learn /></PageTransition>} />
            <Route
              path="/learn/lesson/:lessonId"
              element={
                <PageTransition>
                  <LessonDetail />
                </PageTransition>
              }
            />
            <Route
              path="/learn/lesson/:slug"
              element={
                <PageTransition>
                  <LessonDetail />
                </PageTransition>
              }
            />
            <Route
              path="/learn/:slug"
              element={
                <PageTransition>
                  <LessonDetail />
                </PageTransition>
              }
            />
            <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
            <Route path="/daily-challenge" element={<PageTransition><DailyChallenge /></PageTransition>} />
            <Route
              path="/dashboard"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Navigate to="/profile" replace />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/profile"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route
              path="/settings"
              element={
                <PageTransition>
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                </PageTransition>
              }
            />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />

            {/* Admin Dashboard Routes (Strictly Guarded for Authenticated Admins) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="typing-tests" element={<AdminTypingTests />} />
              <Route path="leaderboard" element={<AdminLeaderboard />} />
              <Route path="challenges" element={<AdminChallenges />} />
              <Route path="learning" element={<AdminLearning />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="security" element={<AdminSecurity />} />
            </Route>

            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Layout>

      {/* Centralized Toast Notifications matching active theme & refined animation */}
      <ToastContainer
        transition={taraToastTransition}
        position="top-right"
        autoClose={2800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        limit={3}
        className="tara-toast-container"
        toastClassName="tara-toast"
        bodyClassName="tara-toast-body"
        progressClassName="tara-toast-progress"
        theme={theme === 'dark' ? 'dark' : 'light'}
      />
    </>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ThemeProvider>
        <AuthProvider>
          <SettingsProvider>
            <TypingProvider>
              <LearnProvider>
                <AppContent />
              </LearnProvider>
            </TypingProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

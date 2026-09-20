import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Github, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login, demoLogin, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    remember: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rawFrom = location.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}`
    : null;
  const from = (rawFrom && !rawFrom.startsWith('/login') && !rawFrom.startsWith('/register'))
    ? rawFrom
    : '/profile';

  // If already authenticated, redirect to destination or profile
  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.password) {
      setError('Please enter your email/username and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(formData.id, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate(from, { replace: true });
    } catch {
      // Handled in AuthContext
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Login — Tara Typing"
        description="Log in to Tara Typing to track your typing progress, compete on leaderboards and unlock achievements."
      />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card-glass w-full max-w-md p-8 shadow-2xl border border-border/60 hover:border-primary/50 hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.2)] transition-all duration-300">
          <h1 className="font-display text-2xl font-bold text-foreground">Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back!</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            <div>
              <label htmlFor="login-id" className="mb-1.5 block text-sm font-medium text-foreground">
                Email or Username
              </label>
              <input
                id="login-id"
                type="text"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                placeholder="Enter your email or username"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-colors"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <button type="button" className="text-xs text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.remember}
                onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                className="h-4 w-4 rounded border-input accent-[var(--primary)]"
              />
              Remember me
            </label>

            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary glow-primary w-full rounded-xl px-4 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.01] select-none"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Quick Demo Sign In */}
          <div className="mt-3">
            <button
              type="button"
              onClick={handleDemo}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 select-none"
            >
              <Sparkles size={16} /> Try as Demo User (1-Click)
            </button>
          </div>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDemo}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors select-none"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.7 0 3.2.58 4.4 1.72l3.28-3.2C17.7 1.8 15.1.8 12 .8 7.6.8 3.7 3.3 1.9 7l3.8 2.94C6.6 7.1 9 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.2 12.26c0-.86-.08-1.5-.24-2.18H12v4.14h6.4c-.13 1.07-.82 2.68-2.36 3.76l3.56 2.76c2.14-1.97 3.6-4.88 3.6-8.48z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.72 14.06A6.9 6.9 0 0 1 5.34 12c0-.72.13-1.41.36-2.06L1.9 7a11.2 11.2 0 0 0 0 10l3.82-2.94z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.2c3.06 0 5.63-1 7.5-2.74l-3.56-2.76c-.95.66-2.24 1.12-3.94 1.12-3 0-5.4-2.06-6.3-4.76L1.9 17c1.8 3.7 5.7 6.2 10.1 6.2z"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              onClick={handleDemo}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card text-foreground px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors select-none"
            >
              <Github size={16} aria-hidden="true" /> GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Github, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!/^[a-zA-Z0-9_]{3,}$/.test(formData.username)) {
      errs.username = 'Min 3 chars: letters, numbers, _';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Enter a valid email';
    }
    if (formData.password.length < 6) {
      errs.password = 'Min 6 characters';
    }
    if (formData.confirm !== formData.password) {
      errs.confirm = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(formData.name, formData.username, formData.email, formData.password);
      navigate('/profile');
    } catch (err) {
      setErrors({ form: err?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    try {
      await demoLogin();
      navigate('/profile');
    } catch {
      // Handled in AuthContext
    }
  };

  const renderField = (id, label, type, fieldKey, placeholder) => (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={formData[fieldKey]}
        onChange={(e) => setFormData({ ...formData, [fieldKey]: e.target.value })}
        placeholder={placeholder}
        aria-invalid={!!errors[fieldKey]}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-colors"
      />
      {errors[fieldKey] && (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {errors[fieldKey]}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-1 flex-col bg-background text-foreground transition-colors duration-200">
      <SEO
        title="Register — Tara Typing"
        description="Create your Tara Typing account to track your progress and compete on the global leaderboard."
      />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="card-glass w-full max-w-md p-8 shadow-2xl border border-border/60 hover:border-primary/50 hover:shadow-[0_16px_36px_-8px_rgba(59,130,246,0.2)] transition-all duration-300">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-foreground">Create Account</h1>
            <Sparkles size={18} className="text-pink" aria-hidden="true" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">Join Tara Typing today!</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4" noValidate>
            {renderField('reg-name', 'Full Name', 'text', 'name', 'Enter your full name')}
            {renderField('reg-username', 'Username', 'text', 'username', 'Choose a username')}
            {renderField('reg-email', 'Email', 'email', 'email', 'Enter your email')}
            {renderField('reg-password', 'Password', 'password', 'password', 'Create a password')}
            {renderField('reg-confirm', 'Confirm Password', 'password', 'confirm', 'Confirm your password')}

            {errors.form && (
              <p role="alert" className="text-sm text-destructive">
                {errors.form}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-primary glow-primary mt-1 w-full rounded-xl px-4 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.01] select-none"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* 1-Click Demo Shortcut */}
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
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent select-none"
            >
              <Github size={16} aria-hidden="true" /> GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;

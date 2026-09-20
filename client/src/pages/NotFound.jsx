import { Link } from 'react-router-dom';
import { Keyboard, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';
import SEO from '../components/common/SEO';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <SEO title="404 — Page Not Found | Tara Typing" />
      <div className="w-16 h-16 rounded-2xl bg-brand-purple/15 text-brand-purple flex items-center justify-center border border-brand-purple/30 shadow-glow-purple">
        <Keyboard className="w-8 h-8" />
      </div>
      <h1 className="text-5xl sm:text-6xl font-black font-mono bg-gradient-to-r from-white via-brand-pink to-brand-purple bg-clip-text text-transparent">
        404
      </h1>
      <h2 className="text-xl sm:text-2xl font-bold text-white">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-400 max-w-sm">
        The key combination you typed doesn't correspond to an existing route on Tara Typing.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;

import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border py-2 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6 md:flex-row md:justify-between">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center gap-1 md:items-start">
          <Link to="/" className="group flex items-center gap-1.5 select-none" aria-label="Tara Typing home">
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              Tara<span className="text-gradient"> Typing</span>
            </span>
            <Sparkles size={14} className="text-pink transition-transform group-hover:rotate-12" />
          </Link>
          <p className="text-xs text-muted-foreground">Type Faster. Think Sharper.</p>
        </div>

        {/* Links */}
        <nav
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          <Link to="/typing-test" className="transition-colors hover:text-foreground">
            Typing Test
          </Link>
          <Link to="/practice" className="transition-colors hover:text-foreground">
            Practice
          </Link>
          <Link to="/learn" className="transition-colors hover:text-foreground">
            Learn Typing
          </Link>
          <Link to="/leaderboard" className="transition-colors hover:text-foreground">
            Leaderboard
          </Link>
          <Link to="/daily-challenge" className="transition-colors hover:text-foreground">
            Daily Challenge
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          © 2026 Tara Typing. Free online typing test.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

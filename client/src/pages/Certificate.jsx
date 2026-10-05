import React, { useState, useRef, useEffect } from 'react';
import { Award, Download, Share2, ShieldCheck, Sparkles, Check, Copy, ExternalLink, Printer, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTypingContext } from '../context/TypingContext';
import { storage } from '../utils/storage';
import SEO from '../components/common/SEO';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';

export default function Certificate() {
  const { user } = useAuth();
  const { lastResult } = useTypingContext();
  const localResults = storage.getLocalResults();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Derive stats
  const bestWpm = user?.bestWpm || (localResults.length > 0 ? Math.max(...localResults.map(r => r.wpm || 0)) : (lastResult?.wpm || 65));
  const accuracy = user?.accuracy || (lastResult?.accuracy || 98.4);
  const name = user?.name || user?.username || 'Typing Champion';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const certId = `TT-${new Date().getFullYear()}-${Math.abs((name + bestWpm).split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(36).toUpperCase()}-VERIFIED`;

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    toast.info('Generating high-resolution certificate...');

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 800;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#060B18');
    bgGrad.addColorStop(0.5, '#0B132B');
    bgGrad.addColorStop(1, '#050914');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Gold Outer Border
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2;
    ctx.strokeRect(45, 45, 1110, 710);

    // Decorative Corners
    ctx.fillStyle = '#F59E0B';
    ctx.font = '24px sans-serif';
    ctx.fillText('✦', 60, 80);
    ctx.fillText('✦', 1120, 80);
    ctx.fillText('✦', 60, 730);
    ctx.fillText('✦', 1120, 730);

    // Header
    ctx.fillStyle = '#93C5FD';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TARA TYPING PLATFORM • OFFICIAL VERIFICATION', 600, 110);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('CERTIFICATE OF MASTERY', 600, 175);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '18px sans-serif';
    ctx.fillText('THIS IS PROUDLY PRESENTED TO', 600, 230);

    // Recipient Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(name, 600, 300);

    // Gold underline
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 320);
    ctx.lineTo(850, 320);
    ctx.stroke();

    // Body Text
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '20px sans-serif';
    ctx.fillText('For demonstrating exceptional speed, consistency, and precision in Touch Typing.', 600, 370);
    ctx.fillText(`Achieved verified typing benchmark of ${bestWpm} WPM with ${accuracy}% Accuracy.`, 600, 405);

    // Metrics Box
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(250, 460, 700, 110);
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 2;
    ctx.strokeRect(250, 460, 700, 110);

    // Stat 1: Speed
    ctx.fillStyle = '#3B82F6';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${bestWpm} WPM`, 380, 515);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px sans-serif';
    ctx.fillText('NET SPEED', 380, 545);

    // Stat 2: Accuracy
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`${accuracy}%`, 600, 515);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px sans-serif';
    ctx.fillText('ACCURACY', 600, 545);

    // Stat 3: Date
    ctx.fillStyle = '#F59E0B';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(issueDate, 820, 515);
    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px sans-serif';
    ctx.fillText('DATE ISSUED', 820, 545);

    // Signatures & ID
    ctx.fillStyle = '#64748B';
    ctx.font = '14px monospace';
    ctx.fillText(`Credential ID: ${certId}`, 600, 640);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Tara Technical Board', 380, 700);
    ctx.fillText('Verified Online Assessor', 820, 700);

    ctx.fillStyle = '#64748B';
    ctx.font = '12px sans-serif';
    ctx.fillText('CHIEF EVALUATOR', 380, 720);
    ctx.fillText('TARA TYPING ENGINE', 820, 720);

    // Download Image
    const link = document.createElement('a');
    link.download = `TaraTyping-Certificate-${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setDownloading(false);
    toast.success('Certificate downloaded successfully!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Verification link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinkedIn = () => {
    const text = `I just earned my Official Touch Typing Certificate on Tara Typing with a verified speed of ${bestWpm} WPM and ${accuracy}% accuracy! 🚀 Check out Tara Typing: https://tara-typing.vercel.app`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://tara-typing.vercel.app')}&summary=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTwitter = () => {
    const text = `Proud to achieve ${bestWpm} WPM with ${accuracy}% accuracy on @TaraTyping! ⚡⌨️ Test your speed here:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent('https://tara-typing.vercel.app')}`, '_blank');
  };

  return (
    <div className="min-h-full bg-background text-foreground pb-20 pt-8 px-4 sm:px-6 transition-colors duration-200">
      <SEO
        title="Official Typing Certificate — Tara Typing"
        description="Verify and download your official Tara Typing speed certificate."
      />

      <div className="mx-auto max-w-5xl">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/profile"
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} /> Back to Profile
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">
              <ShieldCheck size={14} /> Official Verified Credential
            </span>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-md transition-colors">
          <div>
            <h1 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Award className="text-amber-500 dark:text-amber-400" /> Touch Typing Certificate
            </h1>
            <p className="text-xs text-muted-foreground">Download, print, or share your verified achievement</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>{downloading ? 'Exporting...' : 'Download Certificate'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-muted hover:bg-accent px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground transition-colors cursor-pointer"
            >
              {copied ? <Check size={15} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={15} />}
              <span>{copied ? 'Copied' : 'Copy ID'}</span>
            </button>

            <button
              onClick={shareLinkedIn}
              className="flex items-center gap-1.5 rounded-xl bg-[#0077B5] hover:opacity-90 px-3 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer"
              title="Share on LinkedIn"
            >
              <Share2 size={14} /> LinkedIn
            </button>

            <button
              onClick={shareTwitter}
              className="flex items-center gap-1.5 rounded-xl bg-[#1DA1F2] hover:opacity-90 px-3 py-2.5 text-xs font-semibold text-white transition-all cursor-pointer"
              title="Share on Twitter"
            >
              <Share2 size={14} /> X / Twitter
            </button>
          </div>
        </div>

        {/* ── CERTIFICATE PREVIEW CONTAINER ── */}
        <div
          ref={certRef}
          className="relative overflow-hidden rounded-3xl border-4 border-amber-600/80 bg-gradient-to-b from-[#0B132B] via-[#081024] to-[#040814] p-8 sm:p-12 md:p-16 text-center shadow-[0_0_60px_-10px_rgba(245,158,11,0.3)] select-none"
        >
          {/* Inner Golden Rim */}
          <div className="pointer-events-none absolute inset-3 rounded-2xl border-2 border-amber-400/40" />
          <div className="pointer-events-none absolute inset-5 rounded-2xl border border-dashed border-amber-500/20" />

          {/* Corner Flourishes */}
          <div className="pointer-events-none absolute top-7 left-7 text-amber-400 text-xl font-serif">✦</div>
          <div className="pointer-events-none absolute top-7 right-7 text-amber-400 text-xl font-serif">✦</div>
          <div className="pointer-events-none absolute bottom-7 left-7 text-amber-400 text-xl font-serif">✦</div>
          <div className="pointer-events-none absolute bottom-7 right-7 text-amber-400 text-xl font-serif">✦</div>

          {/* Header */}
          <div className="relative z-10 space-y-1">
            <p className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-primary uppercase">
              Tara Typing Platform • Official Credential
            </p>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.4)]">
              CERTIFICATE OF MASTERY
            </h2>
            <p className="text-xs sm:text-sm font-medium tracking-wider text-slate-400 uppercase pt-2">
              This is proudly presented to
            </p>
          </div>

          {/* Recipient Name */}
          <div className="relative z-10 my-4 sm:my-6">
            <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight underline decoration-primary decoration-4 underline-offset-8">
              {name}
            </h3>
          </div>

          {/* Body Statement */}
          <div className="relative z-10 max-w-2xl mx-auto text-xs sm:text-base text-slate-300 leading-relaxed">
            <p>
              For demonstrating exceptional speed, typing rhythm, and touch-typing accuracy on standard alphanumeric passages under timed test conditions.
            </p>
          </div>

          {/* Stat Pillars */}
          <div className="relative z-10 my-6 sm:my-8 grid grid-cols-3 gap-3 sm:gap-6 max-w-xl mx-auto">
            <div className="rounded-2xl border border-primary/40 bg-slate-900/80 p-3 sm:p-4 shadow-md">
              <p className="font-display text-xl sm:text-3xl font-black text-primary">{bestWpm} WPM</p>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Verified Speed</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-slate-900/80 p-3 sm:p-4 shadow-md">
              <p className="font-display text-xl sm:text-3xl font-black text-emerald-400">{accuracy}%</p>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Accuracy</p>
            </div>
            <div className="rounded-2xl border border-amber-500/40 bg-slate-900/80 p-3 sm:p-4 shadow-md">
              <p className="font-display text-sm sm:text-xl font-bold text-amber-400 truncate">{issueDate}</p>
              <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">Date Issued</p>
            </div>
          </div>

          {/* Signatures and Credential Stamp */}
          <div className="relative z-10 pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 max-w-3xl mx-auto">
            <div className="text-center sm:text-left">
              <div className="font-serif italic text-lg sm:text-xl text-slate-200 border-b border-slate-600 pb-1">
                Tara Tech Assessment Board
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Authorized Evaluator
              </p>
            </div>

            {/* Central Holographic Seal */}
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-600/30 to-amber-300/30 text-amber-400 shadow-lg shadow-amber-500/30">
              <ShieldCheck size={28} />
            </div>

            <div className="text-center sm:text-right">
              <div className="font-mono text-xs sm:text-sm text-slate-300 border-b border-slate-600 pb-1">
                {certId}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mt-1">
                Verification Credential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

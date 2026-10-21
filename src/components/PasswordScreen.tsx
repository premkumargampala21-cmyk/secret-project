import React, { useState, useEffect, useRef } from 'react';
import { Lock, Heart, Eye, EyeOff, Sparkles, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { BotanicalRose } from './RoseDecorations';
import { fireBirthdayConfetti, fireHeartBurst } from '../utils/confetti';

interface PasswordScreenProps {
  onAuthenticated: (token: string) => void;
}

export const PasswordScreen: React.FC<PasswordScreenProps> = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = useRef(false);

  // Auto focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const triggerUnlock = (token: string) => {
    fireBirthdayConfetti();
    fireHeartBurst();
    onAuthenticated(token);
  };

  const handleAttemptLogin = async (passToTry: string) => {
    const clean = passToTry.trim();
    if (!clean || isSubmitting.current) return;

    isSubmitting.current = true;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: clean }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        triggerUnlock(data.token);
      } else {
        // Check client-side backup matching to ensure she NEVER gets stuck
        const norm = clean.toLowerCase().replace(/\s+/g, '');
        const clientValid = [
          'sarni23',
          'sarni',
          'sarani',
          'saranilu',
          'saraniluuu',
          'saraniluuuu',
          'bangaram',
          'bangaram23',
          'january23',
          'jan23',
          '23',
        ];

        if (clientValid.includes(norm)) {
          // Instant client fallback token
          const fallbackToken = `${Date.now()}.romantic_session`;
          triggerUnlock(fallbackToken);
        } else {
          setError(
            data.message ||
              "Oops! That's not our secret password, Bangaram... try again with love! 🥺❤️"
          );
          inputRef.current?.focus();
        }
      }
    } catch {
      // Offline/fallback check
      const norm = clean.toLowerCase().replace(/\s+/g, '');
      if (['sarni23', 'bangaram23', 'sarni', 'sarani', '23'].includes(norm)) {
        triggerUnlock(`${Date.now()}.offline_romantic_session`);
      } else {
        setError("Oops! That's not our secret password, Bangaram... try again with love! 🥺❤️");
      }
    } finally {
      setLoading(false);
      isSubmitting.current = false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter our secret password ❤️');
      return;
    }
    handleAttemptLogin(password);
  };

  // Instant auto-unlock when she types the full matching password
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (error) setError(null);

    const norm = val.trim().toLowerCase().replace(/\s+/g, '');
    const instantMatches = [
      'sarni23',
      'bangaram23',
      'saraniluuu',
      'saraniluuuu',
      'january23',
    ];

    if (instantMatches.includes(norm) && !isSubmitting.current) {
      handleAttemptLogin(val);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      {/* Soft Ambient Lights */}
      <div className="absolute top-1/4 left-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-rose-600/20 blur-[120px] pointer-events-none animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 sm:w-96 h-80 sm:h-96 rounded-full bg-purple-600/20 blur-[130px] pointer-events-none animate-pulse-glow"
        style={{ animationDelay: '2s' }}
      />

      {/* Main Glass Panel */}
      <div className="relative z-10 glass-panel rounded-3xl p-8 sm:p-12 max-w-md w-full border border-rose-300/30 shadow-[0_0_50px_rgba(244,63,94,0.22)] text-center animate-fadeIn">
        {/* Top Heart & Lock Emblem */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <BotanicalRose size={40} />
          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse">
            <Lock className="w-6 h-6 text-white" />
            <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300 absolute -bottom-0.5 -right-0.5" />
          </div>
          <BotanicalRose size={40} className="-scale-x-100" />
        </div>

        {/* Header */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Private & Protected Just For Us</span>
        </div>

        <h1 className="font-serif-romantic text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug mb-2">
          A Little Secret for My Bangaram ❤️
        </h1>

        <p className="font-serif-romantic text-xs sm:text-sm text-rose-200/80 mb-6 max-w-xs mx-auto leading-relaxed">
          Enter our special shared password to instantly open your magical birthday surprise.
        </p>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-300/70">
              <KeyRound className="w-4 h-4" />
            </div>

            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handleInputChange}
              placeholder="Enter our secret password..."
              disabled={loading}
              autoComplete="current-password"
              className="w-full pl-10 pr-11 py-3.5 rounded-2xl bg-black/40 border border-rose-400/30 text-white placeholder-rose-300/40 text-sm sm:text-base focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30 transition-all"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-rose-300/70 hover:text-white transition-colors cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Friendly Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs leading-relaxed animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Unlock Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button py-3.5 px-6 rounded-2xl text-sm sm:text-base font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Opening your surprise... 💗</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Unlock My Surprise 💗</span>
                <ArrowRight className="w-4 h-4 text-rose-300" />
              </span>
            )}
          </button>
        </form>

        {/* Romantic Hint Clue */}
        <div className="mt-6 pt-4 border-t border-rose-500/15">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-rose-300/70 hover:text-rose-200 underline transition-colors cursor-pointer"
          >
            {showHint ? 'Hide Clue 🤫' : 'Need a little clue? 💌'}
          </button>

          {showHint && (
            <div className="mt-2 text-xs text-amber-200/90 font-serif-romantic italic animate-fadeIn bg-rose-950/40 p-2.5 rounded-xl border border-rose-400/20">
              <p>Hint: Your name + the date in January when our love began!</p>
              <p className="mt-1 font-mono text-[11px] text-white">
                <span className="bg-rose-900/60 px-1.5 py-0.5 rounded mr-1">sarni23</span>
                or
                <span className="bg-rose-900/60 px-1.5 py-0.5 rounded ml-1">bangaram23</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { CakeAnimation } from './CakeAnimation';
import { BirthdayWishes } from './BirthdayWishes';
import { BotanicalRose, RoseCornerAccent } from './RoseDecorations';
import { ChevronRight, Sparkles, Heart } from 'lucide-react';
import { fireBirthdayConfetti } from '../utils/confetti';

interface BirthdaySurpriseScreenProps {
  onContinueStory: () => void;
}

export const BirthdaySurpriseScreen: React.FC<BirthdaySurpriseScreenProps> = ({
  onContinueStory,
}) => {
  useEffect(() => {
    // Automatically shower floating confetti upon entering the birthday screen!
    fireBirthdayConfetti();
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Decorative corner roses */}
      <RoseCornerAccent position="top-left" />
      <RoseCornerAccent position="top-right" />

      {/* Main Heading */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/20 text-rose-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Today Is The Most Special Day</span>
        </div>

        <h1 className="font-serif-romantic text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          HAPPY BIRTHDAY,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200">
            SARANILUUU! ❤️🎂
          </span>
        </h1>

        <div className="flex items-center justify-center gap-2 mt-4 text-rose-300/80 text-xs sm:text-sm">
          <span>🌹</span>
          <span className="font-script text-lg sm:text-xl text-rose-200">Celebrating the love of my life</span>
          <span>🌹</span>
        </div>
      </div>

      {/* Animated Birthday Cake */}
      <CakeAnimation />

      {/* Animated Birthday Wishes Revealed One by One */}
      <BirthdayWishes />

      {/* Navigation Button */}
      <div className="mt-12 text-center relative z-10">
        <button
          onClick={onContinueStory}
          className="glass-button px-8 sm:px-10 py-4 rounded-full text-sm sm:text-base font-bold text-white flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer"
        >
          <span>CONTINUE OUR STORY ❤️</span>
          <ChevronRight className="w-5 h-5 text-rose-200" />
        </button>
      </div>
    </div>
  );
};

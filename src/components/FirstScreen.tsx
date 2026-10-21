import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { BotanicalRose } from './RoseDecorations';
import { fireBirthdayConfetti } from '../utils/confetti';
import { romanticAudio } from '../utils/audioEngine';

interface FirstScreenProps {
  onOpenSurprise: () => void;
}

export const FirstScreen: React.FC<FirstScreenProps> = ({ onOpenSurprise }) => {
  const handleOpen = () => {
    fireBirthdayConfetti();
    onOpenSurprise();
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 py-12">
      {/* Central Ambient Glow */}
      <div className="absolute w-[22rem] sm:w-[32rem] h-[22rem] sm:h-[32rem] rounded-full bg-gradient-to-tr from-rose-500/20 via-purple-500/20 to-pink-500/20 blur-[100px] pointer-events-none animate-pulse-glow" />

      {/* Main Container with Glassmorphism */}
      <div className="relative z-10 glass-panel rounded-3xl p-8 sm:p-14 max-w-xl w-full border border-rose-300/25 shadow-[0_0_50px_rgba(244,63,94,0.18)]">
        {/* Top Rose and Sparkle Embellishment */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <BotanicalRose size={48} />
          <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300 animate-pulse">
            <Heart className="w-5 h-5 fill-rose-500/60 text-rose-400" />
          </div>
          <BotanicalRose size={48} className="-scale-x-100" />
        </div>

        {/* Sweet Pre-Kicker */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium tracking-wide mb-5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Made With All My Love</span>
        </div>

        {/* Main Text */}
        <h1 className="font-serif-romantic text-4xl sm:text-6xl font-bold text-white tracking-tight leading-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          Hey Bangaram ❤️
        </h1>

        {/* Subtitle */}
        <p className="font-serif-romantic text-lg sm:text-2xl text-rose-200/95 font-medium leading-relaxed mb-8 max-w-md mx-auto">
          "I made something special just for you..."
        </p>

        {/* Soft Glowing Button */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleOpen}
            className="glass-button w-full sm:w-auto px-10 py-4 rounded-full text-base sm:text-lg font-bold text-white tracking-wide flex items-center justify-center gap-3 shadow-2xl transition-all cursor-pointer"
          >
            <span>OPEN YOUR SURPRISE 💌</span>
          </button>

          <span className="text-[11px] text-rose-300/70 font-script text-base">
            Turn up the sound for the best experience 🎵
          </span>
        </div>

        {/* Subtle Bottom Accent */}
        <div className="mt-8 pt-6 border-t border-rose-500/15 flex items-center justify-center gap-2 text-rose-400/60 text-xs">
          <span>✨</span>
          <span>A Magical Birthday Journey</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
};

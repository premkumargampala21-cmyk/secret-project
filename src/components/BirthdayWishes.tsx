import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight, ChevronLeft, Sparkles, Check } from 'lucide-react';
import { fireHeartBurst } from '../utils/confetti';

interface BirthdayWishesProps {
  onCompleteAll?: () => void;
}

export const BirthdayWishes: React.FC<BirthdayWishesProps> = ({ onCompleteAll }) => {
  const wishes = [
    {
      id: 1,
      text: 'Today is all about you, my Bangaram. ❤️',
      emoji: '🌹',
      accent: 'from-rose-500/20 to-pink-500/20',
    },
    {
      id: 2,
      text: 'You make my world more beautiful just by being in it. 🥹',
      emoji: '✨',
      accent: 'from-pink-500/20 to-purple-500/20',
    },
    {
      id: 3,
      text: 'May all your dreams come true, and may your life always be filled with happiness, love, and beautiful memories. 💗',
      emoji: '💫',
      accent: 'from-purple-500/20 to-rose-500/20',
    },
    {
      id: 4,
      text: 'You deserve all the happiness in the world. 🌹',
      emoji: '🕊️',
      accent: 'from-red-500/20 to-rose-500/20',
    },
    {
      id: 5,
      text: 'Happy Birthday, my favourite person! ❤️',
      emoji: '👑',
      accent: 'from-rose-500/30 to-amber-500/20',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(1);

  const handleNext = () => {
    if (currentIndex < wishes.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      if (nextIdx + 1 > unlockedCount) {
        setUnlockedCount(nextIdx + 1);
        fireHeartBurst();
      }
      if (nextIdx === wishes.length - 1) {
        onCompleteAll?.();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentWish = wishes[currentIndex];

  return (
    <div className="w-full max-w-xl mx-auto mt-6 px-4">
      {/* Progress Dots */}
      <div className="flex items-center justify-center gap-2.5 mb-5">
        {wishes.map((w, idx) => (
          <button
            key={w.id}
            onClick={() => {
              if (idx < unlockedCount) {
                setCurrentIndex(idx);
              }
            }}
            className={`transition-all duration-300 rounded-full flex items-center justify-center ${
              idx === currentIndex
                ? 'w-8 h-2.5 bg-gradient-to-r from-rose-400 to-pink-500 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
                : idx < unlockedCount
                ? 'w-2.5 h-2.5 bg-rose-400/60 hover:bg-rose-300'
                : 'w-2.5 h-2.5 bg-rose-950/60 border border-rose-800/40'
            }`}
            aria-label={`Wish ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Wish Card */}
      <div className="relative glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-400/20 transition-all duration-500 min-h-[170px] flex flex-col justify-between overflow-hidden">
        {/* Soft background glow */}
        <div
          className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-gradient-to-br ${currentWish.accent} blur-2xl pointer-events-none transition-all duration-700`}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 text-xs text-rose-300/80">
            <span className="flex items-center gap-1 font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Special Wish {currentIndex + 1} of {wishes.length}
            </span>
            <span className="text-base">{currentWish.emoji}</span>
          </div>

          <p className="font-serif-romantic text-lg sm:text-2xl text-white font-medium leading-relaxed tracking-wide text-balance animate-fadeIn">
            "{currentWish.text}"
          </p>
        </div>

        {/* Card Controls */}
        <div className="relative z-10 flex items-center justify-between pt-5 mt-4 border-t border-rose-500/15">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-colors ${
              currentIndex === 0
                ? 'text-rose-400/30 cursor-not-allowed'
                : 'text-rose-200 hover:text-white hover:bg-rose-500/20'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < wishes.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-4 py-2 rounded-full text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <span>Next Wish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-rose-300 font-medium px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-400/30">
              <Check className="w-3.5 h-3.5 text-rose-300" />
              All Wishes Revealed
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

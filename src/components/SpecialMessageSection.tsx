import React from 'react';
import { Heart, Sparkles, Gift, ChevronRight } from 'lucide-react';
import { BotanicalRose } from './RoseDecorations';

interface SpecialMessageSectionProps {
  onContinue: () => void;
}

export const SpecialMessageSection: React.FC<SpecialMessageSectionProps> = ({ onContinue }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Gift className="w-3.5 h-3.5 text-rose-300" />
          <span>A Special Birthday Note</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          A SPECIAL MESSAGE FOR YOU ❤️
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Special Message Card */}
      <div className="w-full relative animate-fadeIn">
        {/* Glowing Aura Backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />

        <div className="relative glass-panel rounded-3xl p-8 sm:p-12 border border-rose-400/30 shadow-2xl text-center text-white">
          {/* Top Heart & Sparkle Badge */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse">
            <Heart className="w-8 h-8 fill-current" />
          </div>

          {/* Requested Exact Content */}
          <div className="font-serif-romantic space-y-6 text-base sm:text-xl leading-relaxed text-rose-50 max-w-xl mx-auto">
            <p className="italic text-rose-200 font-medium text-lg sm:text-2xl leading-relaxed">
              "If I could choose one beautiful thing to celebrate today,
              it would be the happiness of having you in my life."
            </p>

            <p className="font-sans text-sm sm:text-base text-rose-100/90 leading-relaxed">
              Thank you for being part of my story.
            </p>

            <p className="font-sans text-sm sm:text-base text-rose-100/90 leading-relaxed">
              I hope your birthday is as beautiful and special as you are.
            </p>

            <div className="py-6 border-y border-rose-500/25">
              <p className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
                Happy Birthday, my Bangaram! ❤️🥹🎂
              </p>
              <p className="font-script text-xl sm:text-2xl text-rose-300 mt-2">
                Made with love, just for you. 💗
              </p>
            </div>
          </div>

          {/* Decorative roses */}
          <div className="flex items-center justify-center gap-4 my-6">
            <BotanicalRose size={40} />
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <BotanicalRose size={40} className="-scale-x-100" />
          </div>

          {/* Transition Button to Will You Marry Me */}
          <div className="pt-4">
            <button
              onClick={onContinue}
              className="glass-button px-8 sm:px-10 py-4 rounded-full text-base sm:text-lg font-bold text-white flex items-center justify-center gap-2.5 shadow-2xl transition-all cursor-pointer hover:scale-105 active:scale-95 mx-auto"
            >
              <span>ONE LAST THING, BANGARAM... 💍</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

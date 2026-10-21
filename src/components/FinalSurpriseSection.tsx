import React, { useState } from 'react';
import { Sparkles, Heart, RotateCcw, PartyPopper } from 'lucide-react';
import { fireBirthdayConfetti, fireHeartBurst, fireContinuousCelebration } from '../utils/confetti';
import { BotanicalRose } from './RoseDecorations';

interface FinalSurpriseSectionProps {
  onRestart: () => void;
}

export const FinalSurpriseSection: React.FC<FinalSurpriseSectionProps> = ({ onRestart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [saidYes, setSaidYes] = useState(false);

  const handleOpenBox = () => {
    setIsOpen(true);
    fireContinuousCelebration(4000);
    fireHeartBurst();
  };

  const handleProposalYes = (answerType: 'yes' | 'million') => {
    setSaidYes(true);
    fireContinuousCelebration(6000);
    fireBirthdayConfetti();
    fireHeartBurst();
  };

  const handleReplayCelebration = () => {
    fireContinuousCelebration(3500);
    fireHeartBurst();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>One Last Question For You</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          ONE LAST THING, BANGARAM... ❤️
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-4" />
      </div>

      {!isOpen ? (
        /* Velvet Ring Box Before Opening */
        <div className="flex flex-col items-center my-6">
          <div className="relative group cursor-pointer" onClick={handleOpenBox}>
            {/* Ambient pulsing halo */}
            <div className="absolute inset-0 bg-rose-500/30 rounded-full blur-3xl animate-pulse" />

            {/* 3D Ring Box Graphic */}
            <div className="relative w-64 h-64 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105">
              {/* Ribbon Bow on top */}
              <div className="relative z-20 -mb-2 flex items-center justify-center">
                <div className="w-12 h-10 rounded-full border-4 border-amber-300 bg-amber-400/30 transform -rotate-25 shadow-lg" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 z-30 shadow-md flex items-center justify-center -mx-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-950" />
                </div>
                <div className="w-12 h-10 rounded-full border-4 border-amber-300 bg-amber-400/30 transform rotate-25 shadow-lg" />
              </div>

              {/* Box Lid */}
              <div className="relative z-10 w-52 h-14 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-xl shadow-xl border-t border-rose-300/40 flex items-center justify-center">
                <div className="w-7 h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 shadow-sm" />
              </div>

              {/* Box Body */}
              <div className="relative w-48 h-36 bg-gradient-to-b from-rose-700 via-rose-800 to-purple-950 rounded-b-2xl shadow-2xl border border-rose-500/30 flex items-center justify-center overflow-hidden">
                <div className="w-7 h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 shadow-md" />
                <div className="absolute inset-0 flex items-center justify-around pointer-events-none opacity-40">
                  <span className="text-xs text-white">✨</span>
                  <span className="text-xs text-white">✨</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenBox}
            className="mt-8 glass-button px-8 py-3.5 rounded-full text-base sm:text-lg font-bold text-white flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
          >
            <span>OPEN YOUR FINAL SURPRISE 💍</span>
          </button>
        </div>
      ) : (
        /* The Grand Proposal Reveal */
        <div className="w-full relative animate-fadeIn">
          {/* Glowing Aura */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />

          <div className="relative glass-panel rounded-3xl p-6 sm:p-12 border border-rose-400/30 shadow-2xl text-center text-white">
            {/* Lead-in Message */}
            <p className="font-script text-2xl sm:text-3xl text-rose-300/90 mb-4 tracking-wide">
              chivariga okamata..
            </p>

            {/* Glowing Ring Container */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 via-rose-500/30 to-purple-500/20 border-2 border-amber-300/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(251,191,36,0.6)] animate-pulse">
              <span className="text-5xl filter drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
                💍
              </span>
            </div>

            {/* Big Will You Marry Me Typography */}
            <div className="relative py-8 px-6 sm:px-10 rounded-3xl bg-gradient-to-b from-rose-950/60 via-purple-950/70 to-pink-950/60 border-2 border-rose-400/50 shadow-[0_0_40px_rgba(244,63,94,0.35)] overflow-hidden mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-amber-400/15 to-pink-500/10 blur-xl pointer-events-none" />

              <h3 className="font-serif-romantic text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-rose-200 to-pink-100 drop-shadow-[0_4px_20px_rgba(251,191,36,0.6)] mb-4">
                WILL YOU MARRY ME?
              </h3>

              <p className="text-rose-200 text-sm sm:text-base font-serif-romantic max-w-lg mx-auto leading-relaxed">
                Will you hold my hand through all our tomorrows, laugh with me, dream with me, and make me the happiest person in the universe?
              </p>

              {/* Proposal Interactive Buttons */}
              {!saidYes ? (
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => handleProposalYes('yes')}
                    className="glass-button px-8 sm:px-10 py-3.5 rounded-full text-base sm:text-lg font-bold text-white flex items-center gap-2 shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>YES! 💍💖</span>
                  </button>

                  <button
                    onClick={() => handleProposalYes('million')}
                    className="px-8 sm:px-10 py-3.5 rounded-full text-base sm:text-lg font-bold text-white bg-gradient-to-r from-amber-500 via-rose-500 to-pink-600 hover:from-amber-600 hover:to-pink-700 flex items-center gap-2 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>A Million Times YES! 🥹❤️</span>
                  </button>
                </div>
              ) : (
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-rose-500/25 to-purple-500/25 border-2 border-rose-300/40 animate-fadeIn">
                  <p className="font-serif-romantic text-2xl sm:text-3xl font-bold text-amber-200 mb-2">
                    She Said YES! 💍✨🥹
                  </p>
                  <p className="text-sm sm:text-base text-rose-100 max-w-md mx-auto leading-relaxed">
                    I promise to stand by you, hold your hand, and love you unconditionally for all our lifetimes, Bangaram ❤️
                  </p>
                </div>
              )}
            </div>

            {/* Decorative roses */}
            <div className="flex items-center justify-center gap-4 my-6">
              <BotanicalRose size={40} />
              <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-pulse" />
              <BotanicalRose size={40} />
            </div>

            {/* Interactive Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={handleReplayCelebration}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <PartyPopper className="w-4 h-4" />
                <span>Celebrate Again 🎉</span>
              </button>

              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-rose-200 bg-white/10 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Experience From Beginning ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

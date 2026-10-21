import React, { useState } from 'react';
import { Sparkles, Wind, Flame } from 'lucide-react';
import { fireBirthdayConfetti, fireHeartBurst } from '../utils/confetti';

interface CakeAnimationProps {
  onWishMade?: () => void;
}

export const CakeAnimation: React.FC<CakeAnimationProps> = ({ onWishMade }) => {
  const [candlesLit, setCandlesLit] = useState(true);
  const [wishMade, setWishMade] = useState(false);

  const handleBlowCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      setWishMade(true);
      fireBirthdayConfetti();
      fireHeartBurst();
      onWishMade?.();
    } else {
      setCandlesLit(true);
      setWishMade(false);
      fireHeartBurst();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative select-none py-6">
      {/* Interactive Birthday Cake Container */}
      <div className="relative w-80 sm:w-96 h-76 flex flex-col items-center justify-end pb-4">
        {/* Soft magical glow under cake */}
        <div className="absolute bottom-6 w-72 h-16 bg-rose-500/25 blur-2xl rounded-full pointer-events-none" />

        {/* Candles row */}
        <div className="flex items-end justify-center gap-6 sm:gap-8 mb-[-2px] z-20">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              onClick={handleBlowCandles}
              title={candlesLit ? "Click to blow out candle" : "Click to relight"}
              className="flex flex-col items-center cursor-pointer group"
            >
              {/* Flame */}
              {candlesLit ? (
                <div className="relative flame-animated mb-1">
                  {/* Outer flame halo */}
                  <div className="w-4 h-6 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 blur-[1px] shadow-[0_0_14px_#ff9900]" />
                  {/* Inner flame core */}
                  <div className="absolute inset-x-1 bottom-0.5 h-3 rounded-full bg-white opacity-90" />
                </div>
              ) : (
                <div className="h-6 flex items-center justify-center mb-1">
                  {/* Gentle smoke curl */}
                  <div className="w-1.5 h-4 bg-gray-400/40 rounded-full blur-[1px] animate-pulse" />
                </div>
              )}

              {/* Candle wick */}
              <div className="w-0.5 h-2 bg-stone-700" />

              {/* Candle stick with decorative spiral */}
              <div
                className="w-3.5 h-12 rounded-t-sm shadow-md transition-transform group-hover:scale-105"
                style={{
                  background:
                    i === 1
                      ? 'repeating-linear-gradient(45deg, #fb7185, #fb7185 4px, #fff1f2 4px, #fff1f2 8px)'
                      : 'repeating-linear-gradient(-45deg, #e879f9, #e879f9 4px, #fae8ff 4px, #fae8ff 8px)',
                }}
              />
            </div>
          ))}
        </div>

        {/* Cake Tier 1 (Top Layer) */}
        <div className="relative w-44 sm:w-48 h-14 rounded-t-2xl z-10 shadow-lg border-t-2 border-rose-200/40 bg-gradient-to-b from-[#f472b6] via-[#ec4899] to-[#be185d] flex items-center justify-center">
          {/* Frosting dripping scallops */}
          <div className="absolute -bottom-1 inset-x-0 flex justify-around">
            {Array.from({ length: 7 }).map((_, idx) => (
              <div
                key={idx}
                className="w-6 h-4 bg-[#fff1f2] rounded-b-full shadow-sm"
              />
            ))}
          </div>
          {/* Sweet strawberries and sparkle on top */}
          <div className="absolute -top-3.5 inset-x-3 flex justify-between px-2">
            {['🍓', '✨', '🍓'].map((item, idx) => (
              <span key={idx} className="text-sm filter drop-shadow">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Cake Tier 2 (Middle Layer) */}
        <div className="relative w-64 sm:w-72 h-18 rounded-t-xl z-0 shadow-xl border-t border-rose-300/30 bg-gradient-to-b from-[#e11d48] via-[#be123c] to-[#881337] flex flex-col items-center justify-center">
          {/* Gold pearl piping */}
          <div className="absolute top-1.5 inset-x-2 flex justify-between px-3">
            {Array.from({ length: 13 }).map((_, idx) => (
              <div
                key={idx}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-200 to-yellow-400 shadow-[0_0_4px_#fbbf24]"
              />
            ))}
          </div>

          {/* Sweet Heart & Bangaram Inscription */}
          <div className="px-2 text-center z-10 mt-1">
            <span className="font-script text-xl sm:text-2xl text-rose-100 font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] flex items-center justify-center gap-2">
              <span>❤️</span>
              <span>Bangaram</span>
              <span>❤️</span>
            </span>
          </div>

          {/* Frosting drips */}
          <div className="absolute -bottom-1.5 inset-x-0 flex justify-around">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div
                key={idx}
                className="w-5 h-3.5 bg-[#fdf2f8] rounded-b-full shadow-inner"
              />
            ))}
          </div>
        </div>

        {/* Cake Tier 3 (Bottom Layer) */}
        <div className="relative w-76 sm:w-84 h-18 rounded-t-xl shadow-2xl border-t border-purple-300/30 bg-gradient-to-b from-[#9d174d] via-[#701a75] to-[#4a044e] flex items-center justify-center">
          {/* Decorative filigree ribbon */}
          <div className="w-full px-6 flex justify-between items-center text-pink-300/70 text-xs">
            <span>🌹</span>
            <span className="tracking-widest uppercase font-semibold text-[10px] text-pink-200/90">
              Forever My Love
            </span>
            <span>🌹</span>
          </div>
        </div>

        {/* Cake Stand / Plate */}
        <div className="w-84 sm:w-92 h-3.5 bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.6)] border-b border-amber-400" />
        <div className="w-36 h-3 bg-gradient-to-b from-amber-200 to-amber-400 rounded-b-lg shadow-md" />
      </div>

      {/* Interactive Action: Make a Wish & Blow */}
      <div className="mt-2 flex flex-col items-center gap-2">
        <button
          onClick={handleBlowCandles}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-white glass-panel border border-rose-400/30 hover:border-rose-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_16px_rgba(244,63,94,0.3)] cursor-pointer"
        >
          {candlesLit ? (
            <>
              <Wind className="w-4 h-4 text-rose-300 animate-pulse" />
              <span>Make a wish & blow out the candles 🌬️</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Relight the candles 🕯️</span>
            </>
          )}
        </button>

        {wishMade && (
          <div className="text-center animate-bounce mt-1">
            <span className="text-xs sm:text-sm text-rose-300 font-script text-base flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              May every wish in your beautiful heart come true today! ✨
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

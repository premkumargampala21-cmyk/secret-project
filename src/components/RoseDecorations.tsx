import React from 'react';

interface RoseProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const BotanicalRose: React.FC<RoseProps> = ({ className = '', size = 56, glow = true }) => {
  return (
    <div
      className={`inline-flex items-center justify-center ${glow ? 'drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transform transition-transform duration-500 hover:scale-110"
      >
        <defs>
          <linearGradient id="roseGradRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d6d" />
            <stop offset="50%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>
          <linearGradient id="roseGradPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff758f" />
            <stop offset="60%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="70%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Emerald leaves behind */}
        <path
          d="M30 68 C 15 72, 8 55, 18 42 C 30 52, 35 60, 30 68 Z"
          fill="url(#leafGrad)"
          opacity="0.9"
        />
        <path
          d="M70 68 C 85 72, 92 55, 82 42 C 70 52, 65 60, 70 68 Z"
          fill="url(#leafGrad)"
          opacity="0.9"
        />

        {/* Stem connection */}
        <path
          d="M48 70 Q 50 85, 46 95"
          stroke="#166534"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Outer petals */}
        <path
          d="M50 20 C 35 15, 20 28, 22 45 C 24 60, 42 74, 50 78 C 58 74, 76 60, 78 45 C 80 28, 65 15, 50 20 Z"
          fill="url(#roseGradRed)"
        />

        {/* Mid petals */}
        <path
          d="M32 36 C 28 48, 38 64, 50 70 C 62 64, 72 48, 68 36 C 64 25, 36 25, 32 36 Z"
          fill="url(#roseGradPink)"
        />

        {/* Swirling inner bud layers */}
        <path
          d="M40 38 C 36 46, 44 58, 50 60 C 56 58, 64 46, 60 38 C 56 30, 44 30, 40 38 Z"
          fill="url(#roseGradRed)"
        />
        <path
          d="M45 42 C 43 47, 47 54, 50 55 C 53 54, 57 47, 55 42 C 53 37, 47 37, 45 42 Z"
          fill="#ff758f"
        />
        {/* Core spiral highlight */}
        <circle cx="50" cy="45" r="3.5" fill="#ffe4e6" />
      </svg>
    </div>
  );
};

export const RoseCornerAccent: React.FC<{ position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({
  position = 'top-right',
}) => {
  const getStyles = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4 -scale-x-100';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4 -scale-x-100 rotate-180';
      case 'bottom-right':
        return 'bottom-4 right-4 rotate-180';
    }
  };

  return (
    <div className={`absolute pointer-events-none opacity-60 z-0 ${getStyles()}`}>
      <div className="relative">
        <BotanicalRose size={54} />
        <span className="text-xs text-rose-300/40 block mt-1 text-center font-script">✨</span>
      </div>
    </div>
  );
};

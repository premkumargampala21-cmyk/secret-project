import React, { useMemo } from 'react';

interface Heart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export const FloatingHearts: React.FC = () => {
  const hearts: Heart[] = useMemo(() => {
    const colors = [
      'rgba(244, 63, 94, 0.65)',   // rose-500
      'rgba(236, 72, 153, 0.6)',   // pink-500
      'rgba(225, 29, 72, 0.55)',   // red-600
      'rgba(217, 70, 239, 0.5)',   // fuchsia-500
      'rgba(168, 85, 247, 0.45)',  // purple-500
      'rgba(251, 113, 133, 0.6)',  // rose-400
      'rgba(255, 255, 255, 0.5)',  // warm white sparkle
    ];

    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 24,
      duration: 12 + Math.random() * 16,
      delay: Math.random() * 12,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.25 + Math.random() * 0.45,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Soft ambient glowing light orbs */}
      <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-rose-600/15 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] rounded-full bg-purple-600/15 blur-[140px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-2/3 left-1/3 w-80 h-80 rounded-full bg-pink-500/15 blur-[100px] animate-pulse-glow" style={{ animationDelay: '4s' }} />

      {/* Floating hearts */}
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-[-10%]"
          style={{
            left: `${h.left}%`,
            animation: `floatUpward ${h.duration}s linear infinite`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes floatUpward {
          0% {
            transform: translateY(0vh) translateX(0px) rotate(0deg) scale(0.85);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          50% {
            transform: translateY(-55vh) translateX(18px) rotate(14deg) scale(1.05);
            opacity: 0.8;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-115vh) translateX(-18px) rotate(-14deg) scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

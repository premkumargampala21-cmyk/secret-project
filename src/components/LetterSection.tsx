import React, { useState, useEffect } from 'react';
import { Mail, Heart, ChevronRight, Sparkles, BookOpen, FastForward } from 'lucide-react';
import { BotanicalRose } from './RoseDecorations';
import { fireHeartBurst } from '../utils/confetti';

interface LetterSectionProps {
  onContinue: () => void;
}

export const LetterSection: React.FC<LetterSectionProps> = ({ onContinue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(0);

  const paragraphs = [
    {
      type: 'greeting',
      content: 'Happy Birthday, naa Bangaram! 🥹❤️🎂',
    },
    {
      type: 'body',
      content:
        'Bangaram, nuvvu naa life loki raavadam, January 23 na mana love story start avvadam naaku chaala special. ❤️ Nuvvu first ga nee feelings cheppina aa moment eppatiki naa heart lo special memory ga untundhi. 🫂💗 niku gurthundha apudu ye discussion yala start ayindho.....',
    },
    {
      type: 'quote',
      content:
        '"Nenu prathi sari naa feelings ni words lo cheppalekapovachu, kaani nuvvu naaku entha important-o maatallo explain cheyyalenu. Nee face meedha smile undali adhi na valla kakapoyina parly, nee dreams anni nijam avvali, nuvvu badha padina prathi sari malli navvadaniki oka reason dorakaali… aa reason nene avvalani korukuntunna, pichi fellow! 🥹❤️🩹"',
    },
    {
      type: 'body',
      content:
        'Mana madhya enni misunderstandings vachina, okarinokaram ardham chesukuntu, kalisi enno beautiful memories create chesukovalani korukuntunna. Nee happiness, nee dreams, nee future naaku chaala important, bangaram. ❤️🫶🏻',
    },
    {
      type: 'promise',
      content:
        'niku ye problem ochina nenu nilabadatha nachey pattukunna ninnu yappatiki vodhalalenu.... 🤝❤️',
    },
    {
      type: 'body',
      content:
        'Thank you for coming into my life and making it more beautiful. Nuvvu naa life lo undatam naaku chaala special. Eppudu happy ga undu, naa bangaram. Nee smile choodatam kanna naaku inkem kaavali! 🥹💗',
    },
    {
      type: 'playful',
      content:
        'Actually nv gayyali ..ninnu barinchadam chala kastamy ,ninnu nenu thappa yavaru barinchaleru bangaram... 😉❤️',
    },
    {
      type: 'closing',
      content:
        'Happy Birthday, my love! ❤️🎂 Nuvvu naaku eppatiki chaala special. Love you so much, bangaram! 🫂💋❤️',
    },
  ];

  const handleOpenLetter = () => {
    setIsOpen(true);
    setRevealedParagraphs(1);
    fireHeartBurst();
  };

  useEffect(() => {
    if (isOpen && revealedParagraphs < paragraphs.length) {
      const timer = setTimeout(() => {
        setRevealedParagraphs((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isOpen, revealedParagraphs, paragraphs.length]);

  const handleShowAll = () => {
    setRevealedParagraphs(paragraphs.length);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Unspoken Feelings</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          THINGS I NEVER TOLD YOU 💌
        </h2>
        <p className="font-serif-romantic text-sm sm:text-base text-rose-200/90 mt-2 max-w-md mx-auto">
          Every word written straight from my heart to yours...
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-4" />
      </div>

      {!isOpen ? (
        /* Envelope in closed state */
        <div className="w-full max-w-md flex flex-col items-center my-6">
          <div className="relative group cursor-pointer" onClick={handleOpenLetter}>
            {/* Ambient envelope glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/30 to-purple-600/30 blur-2xl rounded-3xl" />

            {/* Envelope visual */}
            <div className="relative w-80 sm:w-96 h-56 bg-gradient-to-br from-[#3b0d28] via-[#2a081d] to-[#1a0512] rounded-2xl border-2 border-rose-400/40 shadow-2xl p-6 flex flex-col justify-between items-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
              {/* Envelope flap */}
              <div
                className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#5c133f] to-[#3a0a27] border-b border-rose-400/40"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />

              {/* Gold Wax Seal */}
              <div className="relative z-10 mt-14 w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.6)] flex items-center justify-center border-2 border-amber-300 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-rose-950 fill-rose-950" />
              </div>

              {/* Recipient tag */}
              <div className="relative z-10 text-center">
                <span className="font-script text-2xl text-rose-200 block drop-shadow">
                  For My Bangaram ❤️
                </span>
                <span className="text-[10px] uppercase tracking-widest text-rose-400/80">
                  Tap To Open With Love
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenLetter}
            className="mt-8 glass-button px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
          >
            <Mail className="w-5 h-5 text-rose-200" />
            <span>OPEN YOUR LETTER ❤️</span>
          </button>
        </div>
      ) : (
        /* Letter revealed state */
        <div className="w-full relative animate-fadeIn">
          {/* Glowing backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-600/15 via-purple-600/10 to-transparent blur-3xl rounded-3xl" />

          {/* Letter parchment sheet */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-12 border border-rose-400/30 shadow-2xl text-white">
            {/* Letter Header */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-300">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-rose-300 font-semibold block">
                    My Whole Heart
                  </span>
                  <span className="font-script text-xl text-rose-100 font-bold">
                    For My Bangaram
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {revealedParagraphs < paragraphs.length && (
                  <button
                    onClick={handleShowAll}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs transition cursor-pointer"
                    title="Skip typing reveal"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>Show All</span>
                  </button>
                )}
                <BotanicalRose size={40} />
              </div>
            </div>

            {/* Letter Body: Revealed with smooth animated pacing */}
            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-rose-50 font-serif-romantic">
              {paragraphs.slice(0, revealedParagraphs).map((para, idx) => {
                if (para.type === 'greeting') {
                  return (
                    <p
                      key={idx}
                      className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 animate-fadeIn"
                    >
                      {para.content}
                    </p>
                  );
                }

                if (para.type === 'quote') {
                  return (
                    <p
                      key={idx}
                      className="border-l-2 border-rose-400/40 pl-4 py-1 italic text-rose-200 animate-fadeIn"
                    >
                      {para.content}
                    </p>
                  );
                }

                if (para.type === 'promise') {
                  return (
                    <p
                      key={idx}
                      className="font-medium text-pink-200 font-sans text-base sm:text-lg animate-fadeIn"
                    >
                      {para.content}
                    </p>
                  );
                }

                if (para.type === 'playful') {
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-rose-950/40 border border-rose-400/25 animate-fadeIn"
                    >
                      <p className="text-sm sm:text-base text-rose-200 italic font-sans leading-relaxed">
                        {para.content}
                      </p>
                    </div>
                  );
                }

                if (para.type === 'closing') {
                  return (
                    <div key={idx} className="pt-2 animate-fadeIn">
                      <p className="text-xl sm:text-2xl font-bold text-white">
                        Happy Birthday, my love! ❤️🎂
                      </p>
                      <p className="font-script text-xl sm:text-2xl text-rose-300 mt-1">
                        Nuvvu naaku eppatiki chaala special. Love you so much, bangaram! 🫂💋❤️
                      </p>
                    </div>
                  );
                }

                return (
                  <p key={idx} className="font-sans text-sm sm:text-base text-rose-100/90 leading-relaxed animate-fadeIn">
                    {para.content}
                  </p>
                );
              })}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-10 pt-6 border-t border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setRevealedParagraphs(0);
                }}
                className="text-xs text-rose-300/80 hover:text-white transition-colors underline cursor-pointer"
              >
                Fold Letter Back ✉️
              </button>

              <button
                onClick={onContinue}
                className="glass-button px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white flex items-center gap-2 shadow-xl cursor-pointer"
              >
                <span>A SPECIAL MESSAGE FOR YOU ❤️</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

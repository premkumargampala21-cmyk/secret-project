import React from 'react';
import { Calendar, Heart, Sparkles, ChevronRight, Compass, ShieldCheck, Flame } from 'lucide-react';
import { BotanicalRose } from './RoseDecorations';

interface LoveStorySectionProps {
  onContinue: () => void;
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ onContinue }) => {
  const timelineMilestones = [
    {
      date: 'January 23',
      title: 'When You Shared Your Heart First',
      description:
        'January 23 will always be the most sacred date in my heart. That was the day our beautiful journey began—when you spoke your feelings first with honest courage. That one moment changed my whole universe.',
      badge: 'The Beginning of Us',
      icon: Calendar,
      accent: 'from-rose-500 to-pink-600',
    },
    {
      date: 'Our Early Days',
      title: 'Discussions, Laughter & Endless Talks',
      description:
        'Do you remember how our discussions started and where they led? Every late conversation, every silly debate, and every moment spent understanding each other built the strong foundation of our love.',
      badge: 'Growing Together',
      icon: Compass,
      accent: 'from-pink-500 to-purple-600',
    },
    {
      date: 'Through Every Storm',
      title: 'Understanding Each Other Deeper',
      description:
        'No matter what misunderstandings came our way, we always chose to listen, forgive, and hold on tighter. Through every high and low, our bond has only grown stronger and deeper with time.',
      badge: 'Unshakable Love',
      icon: ShieldCheck,
      accent: 'from-purple-600 to-rose-600',
    },
    {
      date: 'Every Single Day',
      title: 'Holding Hands & Never Letting Go',
      description:
        'Niku ye problem ochina nenu nilabadatha... nachey pattukunna ninnu yappatiki vodhalalenu. You are the smile on my face, the peace in my heart, and the love of my entire life.',
      badge: 'Forever Promise',
      icon: Flame,
      accent: 'from-rose-500 to-amber-500',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-medium mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-400" />
          <span>Our Journey From January 23</span>
        </div>
        <h2 className="font-serif-romantic text-3xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-md">
          OUR LOVE STORY ❤️
        </h2>
        <p className="font-serif-romantic text-sm sm:text-base text-rose-200/90 mt-2 max-w-lg mx-auto">
          "Sometimes the most beautiful life begins with one honest feeling and one special moment."
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full mx-auto mt-4" />
      </div>

      {/* Animated Timeline */}
      <div className="relative w-full max-w-3xl mb-12">
        {/* Glowing vertical line */}
        <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-1 -translate-x-1/2 bg-gradient-to-b from-rose-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,0.6)]" />

        <div className="space-y-10 sm:space-y-12">
          {timelineMilestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            const Icon = milestone.icon;

            return (
              <div
                key={milestone.date}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                } gap-6 sm:gap-10`}
              >
                {/* Central Glowing Icon Node */}
                <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-4 border-[#0f0714] shadow-[0_0_15px_rgba(244,63,94,0.7)] flex items-center justify-center text-white z-10">
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Content Card */}
                <div className="ml-14 sm:ml-0 sm:w-1/2 pl-0 sm:px-6">
                  <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-rose-400/25 shadow-xl hover:border-rose-400/50 transition-all duration-300 hover:-translate-y-1 group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-400/30 text-rose-200">
                        {milestone.badge}
                      </span>
                      <span className="font-serif-romantic text-xs sm:text-sm font-bold text-amber-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {milestone.date}
                      </span>
                    </div>

                    <h3 className="font-serif-romantic text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-rose-200 transition-colors">
                      {milestone.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Romantic Quote Card */}
      <div className="w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-rose-400/30 text-center mb-10 shadow-2xl relative">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BotanicalRose size={32} />
          <Heart className="w-5 h-5 text-rose-400 fill-rose-400 animate-pulse" />
          <BotanicalRose size={32} className="-scale-x-100" />
        </div>
        <p className="font-serif-romantic text-base sm:text-lg text-rose-100 italic leading-relaxed">
          "I am so deeply grateful that our paths crossed on January 23 and that you chose to share your heart with me. Every day since has been a gift."
        </p>
      </div>

      {/* Navigation Button to Special Memories */}
      <div>
        <button
          onClick={onContinue}
          className="glass-button px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold text-white flex items-center gap-2.5 shadow-xl transition-all cursor-pointer"
        >
          <span>OUR SPECIAL MEMORIES 📸</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

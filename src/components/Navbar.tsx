import React from 'react';
import { Heart, LogOut } from 'lucide-react';
import { MusicBar } from './MusicBar';

export type ScreenType =
  | 'first'
  | 'birthday'
  | 'story'
  | 'memories'
  | 'letter'
  | 'special'
  | 'final';

interface NavbarProps {
  onTitleClick?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTitleClick, onLogout }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#120718]/85 backdrop-blur-md border-b border-rose-500/15">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 sm:gap-4 px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Brand wordmark with heart symbol in front */}
        <button
          onClick={onTitleClick}
          className="text-xs sm:text-base md:text-lg font-serif-romantic font-bold tracking-tight text-white hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 sm:gap-2 text-left cursor-pointer group"
        >
          <Heart className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">For My Bangaram</span>
          <span className="sm:hidden">Bangaram ❤️</span>
          <Heart className="hidden sm:inline-block w-4 h-4 sm:w-5 sm:h-5 text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)] group-hover:scale-110 transition-transform" />
        </button>

        {/* Right Actions: Music Controller & Logout */}
        <div className="flex items-center gap-2 shrink-0">
          <MusicBar />

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-full glass-panel border border-rose-400/20 text-rose-300/80 hover:text-white hover:bg-rose-500/20 transition-all cursor-pointer"
              title="Lock / Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

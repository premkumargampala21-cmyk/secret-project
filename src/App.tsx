/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FloatingHearts } from './components/FloatingHearts';
import { Navbar, ScreenType } from './components/Navbar';
import { PasswordScreen } from './components/PasswordScreen';
import { FirstScreen } from './components/FirstScreen';
import { BirthdaySurpriseScreen } from './components/BirthdaySurpriseScreen';
import { LoveStorySection } from './components/LoveStorySection';
import { MemoriesSection } from './components/MemoriesSection';
import { LetterSection } from './components/LetterSection';
import { SpecialMessageSection } from './components/SpecialMessageSection';
import { FinalSurpriseSection } from './components/FinalSurpriseSection';
import { Heart } from 'lucide-react';

export default function App() {
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bangaram_auth_token');
    } catch {
      return null;
    }
  });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('first');

  // Verify stored token with backend
  useEffect(() => {
    const verifySession = async () => {
      const savedToken = localStorage.getItem('bangaram_auth_token');
      if (!savedToken) {
        setCheckingAuth(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });
        const data = await res.json();
        if (data.authenticated) {
          setAuthToken(savedToken);
        } else {
          localStorage.removeItem('bangaram_auth_token');
          setAuthToken(null);
        }
      } catch {
        // In case of transient offline, keep token
      } finally {
        setCheckingAuth(false);
      }
    };

    verifySession();
  }, []);

  const handleAuthenticated = (token: string) => {
    try {
      localStorage.setItem('bangaram_auth_token', token);
    } catch {
      // ignore
    }
    setAuthToken(token);
    setCurrentScreen('first');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem('bangaram_auth_token');
    } catch {
      // ignore
    }
    setAuthToken(null);
    setCurrentScreen('first');
  };

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setCurrentScreen('first');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading state while checking session
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0f0714] text-white flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
          <Heart className="w-8 h-8 fill-rose-500" />
        </div>
        <p className="font-serif-romantic text-base text-rose-200 animate-pulse">
          Opening our special world... ❤️
        </p>
      </div>
    );
  }

  // If not authenticated, show romantic password gate
  if (!authToken) {
    return (
      <div className="relative min-h-screen bg-[#0f0714] text-[#fff5f7] flex flex-col justify-between selection:bg-rose-500 selection:text-white">
        <FloatingHearts />
        <PasswordScreen onAuthenticated={handleAuthenticated} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0f0714] text-[#fff5f7] flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Background Floating Hearts & Ambient Glows */}
      <FloatingHearts />

      {/* Top Navbar with title, music player, and secure logout */}
      <Navbar onTitleClick={handleRestart} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* 1. Opening Screen: Hey Bangaram */}
        {currentScreen === 'first' && (
          <FirstScreen
            onOpenSurprise={() => navigateTo('birthday')}
          />
        )}

        {/* 2. Birthday Surprise Screen with Cake & Wishes */}
        {currentScreen === 'birthday' && (
          <BirthdaySurpriseScreen
            onContinueStory={() => navigateTo('story')}
          />
        )}

        {/* 3. Our Love Story - January 23 Timeline */}
        {currentScreen === 'story' && (
          <LoveStorySection
            onContinue={() => navigateTo('memories')}
          />
        )}

        {/* 4. Our Special Memories - Shared Cloud Photo Gallery */}
        {currentScreen === 'memories' && (
          <MemoriesSection
            authToken={authToken}
            onContinue={() => navigateTo('letter')}
          />
        )}

        {/* 5. Things I Never Told You - Handwritten Love Letter */}
        {currentScreen === 'letter' && (
          <LetterSection
            onContinue={() => navigateTo('special')}
          />
        )}

        {/* 6. Special Birthday Message before Proposal */}
        {currentScreen === 'special' && (
          <SpecialMessageSection
            onContinue={() => navigateTo('final')}
          />
        )}

        {/* 7. Special Proposal Reveal: WILL YOU MARRY ME? */}
        {currentScreen === 'final' && (
          <FinalSurpriseSection
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Subtle Romantic Footer */}
      <footer className="relative z-20 py-6 px-4 text-center border-t border-rose-500/10 text-xs text-rose-300/60">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif-romantic tracking-wide flex items-center justify-center gap-1.5">
            <span className="text-rose-500">❤️</span>
            <span>For My Bangaram</span>
            <span className="text-rose-500">❤️</span>
            <span className="mx-1 opacity-50">|</span>
            <span>Happy Birthday</span>
          </p>
          <p className="font-script text-base text-rose-300/80">
            Forever & always in love with you
          </p>
        </div>
      </footer>
    </div>
  );
}

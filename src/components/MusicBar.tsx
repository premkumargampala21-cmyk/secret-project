import React, { useState, useEffect } from 'react';
import { Play, Pause, Heart, Volume2, VolumeX } from 'lucide-react';
import { romanticAudio, AudioPlayerState } from '../utils/audioEngine';

export const MusicBar: React.FC = () => {
  const [state, setState] = useState<AudioPlayerState>(romanticAudio.getState());
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);

  useEffect(() => {
    const unsubscribe = romanticAudio.subscribe((newState) => {
      setState(newState);
      if (!isSeeking) {
        setSeekValue(newState.currentTime);
      }
    });
    return unsubscribe;
  }, [isSeeking]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.toggle();
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSeekValue(val);
  };

  const handleSeekCommit = () => {
    setIsSeeking(false);
    romanticAudio.seek(seekValue);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(clickX / rect.width, 1));
    const targetTime = ratio * (state.duration || 1);
    romanticAudio.seek(targetTime);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.toggleMute();
  };

  const currentTimeFormatted = romanticAudio.formatTime(isSeeking ? seekValue : state.currentTime);
  const durationFormatted = state.duration > 0 ? romanticAudio.formatTime(state.duration) : '--:--';
  const progressPercent = state.duration > 0 ? ((isSeeking ? seekValue : state.currentTime) / state.duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:py-2 rounded-full glass-panel border border-rose-400/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md select-none max-w-full">
      {/* Glowing Animated Heart while song is playing */}
      <div className="relative flex items-center justify-center shrink-0">
        {state.isPlaying && (
          <div className="absolute inset-0 w-5 h-5 rounded-full bg-rose-500/60 blur-md animate-ping" />
        )}
        <div
          className={`relative z-10 transition-transform duration-300 ${
            state.isPlaying ? 'scale-110 drop-shadow-[0_0_10px_rgba(244,63,94,0.9)]' : 'opacity-70'
          }`}
        >
          <Heart
            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
              state.isPlaying
                ? 'fill-rose-500 text-rose-400 animate-pulse'
                : 'text-rose-300 fill-rose-500/30'
            }`}
          />
        </div>
      </div>

      {/* Play / Pause Button */}
      <button
        onClick={handleTogglePlay}
        className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all duration-300 shrink-0 cursor-pointer ${
          state.isPlaying
            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.7)] animate-pulse'
            : 'bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white border border-rose-400/30'
        }`}
        title={state.isPlaying ? 'Pause Sakhiye' : 'Play Sakhiye'}
        aria-label={state.isPlaying ? 'Pause music' : 'Play music'}
      >
        {state.isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-current" />
        )}
      </button>

      {/* Song Details & Scrubber Timeline */}
      <div className="flex flex-col min-w-[120px] sm:min-w-[180px] md:min-w-[220px]">
        {/* Track Title and Time */}
        <div className="flex items-center justify-between gap-2 text-left mb-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[11px] sm:text-xs font-serif-romantic font-bold text-rose-100 tracking-wide truncate">
              Sakhiye ❤️
            </span>
            <span className="hidden md:inline-block text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-400/20">
              Youth
            </span>
          </div>

          <div className="text-[10px] sm:text-[11px] font-mono text-rose-300/90 whitespace-nowrap">
            <span>{currentTimeFormatted}</span>
            <span className="mx-0.5 text-rose-400/50">/</span>
            <span>{durationFormatted}</span>
          </div>
        </div>

        {/* Progress Bar with Seek Track */}
        <div
          onClick={handleProgressClick}
          className="relative w-full h-2 rounded-full bg-black/40 border border-rose-500/20 cursor-pointer overflow-hidden group/seek"
          title="Click to seek"
        >
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-300 rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(244,63,94,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />

          <input
            type="range"
            min={0}
            max={state.duration || 100}
            step={0.1}
            value={isSeeking ? seekValue : state.currentTime}
            onMouseDown={() => setIsSeeking(true)}
            onTouchStart={() => setIsSeeking(true)}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            aria-label="Seek track"
          />
        </div>
      </div>

      {/* Mute / Unmute Button */}
      <button
        onClick={handleToggleMute}
        className="p-1.5 rounded-full text-rose-300/80 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        title={state.isMuted ? 'Unmute' : 'Mute'}
        aria-label="Mute toggle"
      >
        {state.isMuted ? (
          <VolumeX className="w-3.5 h-3.5 text-rose-400" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
};

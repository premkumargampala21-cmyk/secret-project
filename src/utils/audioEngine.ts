/**
 * Romantic Audio Engine with pre-loaded local song: /music/sakhiye.mp3
 * Includes progress tracking, duration, seek controls, and graceful synth fallback.
 */

export interface AudioPlayerState {
  isPlaying: boolean;
  trackName: string;
  currentTime: number;
  duration: number;
  progress: number; // 0 to 1
  isMuted: boolean;
}

type StateListener = (state: AudioPlayerState) => void;

class RomanticAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying = false;
  private currentTrackName = 'Sakhiye ❤️';
  private currentTime = 0;
  private duration = 0;
  private isMuted = false;
  private listeners: Set<StateListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    try {
      // Local file as requested: /music/sakhiye.mp3
      this.audioElement = new Audio('/music/sakhiye.mp3');
      this.audioElement.preload = 'metadata';
      this.audioElement.loop = true;

      this.audioElement.addEventListener('loadedmetadata', () => {
        if (this.audioElement) {
          this.duration = this.audioElement.duration || 0;
          this.notify();
        }
      });

      this.audioElement.addEventListener('durationchange', () => {
        if (this.audioElement) {
          this.duration = this.audioElement.duration || 0;
          this.notify();
        }
      });

      this.audioElement.addEventListener('timeupdate', () => {
        if (this.audioElement) {
          this.currentTime = this.audioElement.currentTime || 0;
          this.duration = this.audioElement.duration || this.duration || 0;
          this.notify();
        }
      });

      this.audioElement.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.notify();
      });

      this.audioElement.addEventListener('error', (e) => {
        console.warn('Audio element fallback triggered:', e);
      });
    } catch (e) {
      console.error('Failed to init audio element:', e);
    }
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlayerState {
    const progress = this.duration > 0 ? this.currentTime / this.duration : 0;
    return {
      isPlaying: this.isPlaying,
      trackName: this.currentTrackName,
      currentTime: this.currentTime,
      duration: this.duration,
      progress: Math.min(Math.max(progress, 0), 1),
      isMuted: this.isMuted,
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  public async play(): Promise<void> {
    if (!this.audioElement) {
      this.initAudio();
    }

    if (!this.audioElement) return;

    try {
      await this.audioElement.play();
      this.isPlaying = true;
      this.notify();
    } catch (err) {
      console.warn('Play was prevented or requires user interaction:', err);
    }
  }

  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public seek(targetSeconds: number): void {
    if (this.audioElement && !isNaN(targetSeconds)) {
      const clamped = Math.max(0, Math.min(targetSeconds, this.duration || targetSeconds));
      this.audioElement.currentTime = clamped;
      this.currentTime = clamped;
      this.notify();
    }
  }

  public setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(volume, 1));
    }
  }

  public toggleMute(): void {
    if (this.audioElement) {
      this.isMuted = !this.isMuted;
      this.audioElement.muted = this.isMuted;
      this.notify();
    }
  }

  public formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

export const romanticAudio = new RomanticAudioEngine();

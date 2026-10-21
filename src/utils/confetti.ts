import confetti from 'canvas-confetti';

export function fireBirthdayConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ff4d6d', '#ff758f', '#c9184a', '#ffd166', '#a855f7'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#ffb703', '#fb8500', '#ff007f', '#ffffff'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#ff4d6d', '#d946ef', '#ec4899', '#f43f5e'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#ffe5ec', '#ffb3c1', '#fb6f92', '#ffffff'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#ffd700', '#ff69b4', '#9333ea'],
  });
}

export function fireHeartBurst() {
  const heartDefaults = {
    spread: 360,
    ticks: 120,
    gravity: 0.4,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['circle'] as ('circle' | 'square')[],
    colors: ['#ff0055', '#ff3366', '#ff6699', '#ff99bb', '#ffffff', '#ffd700'],
    zIndex: 9999,
  };

  confetti({
    ...heartDefaults,
    particleCount: 50,
    scalar: 1.2,
    origin: { x: 0.5, y: 0.5 },
  });
}

export function fireContinuousCelebration(durationMs = 3000) {
  const animationEnd = Date.now() + durationMs;
  const colors = ['#f43f5e', '#ec4899', '#d946ef', '#fb7185', '#ffd700'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors,
      zIndex: 9999,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}

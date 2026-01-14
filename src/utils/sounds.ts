// Sound utility using Web Audio API for Pomodoro timer

let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
};

// Pleasant "start" sound - upward chime
export const playStartSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create three-note ascending chime
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = now + index * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.exponentialRampToValueAtTime(0.15, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.5);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });
  } catch (err) {
    console.error('Failed to play start sound:', err);
  }
};

// Alert "complete" sound - bell-like notification
export const playCompleteSound = () => {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create a bell-like sound with multiple harmonics
    const baseFreq = 880; // A5
    const harmonics = [1, 2, 3, 4.2, 5.4];
    const gains = [0.3, 0.15, 0.1, 0.05, 0.03];

    harmonics.forEach((harmonic, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = baseFreq * harmonic;

      gain.gain.setValueAtTime(0, now);
      gain.gain.exponentialRampToValueAtTime(gains[index], now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);

      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    });

    // Add a second "ding" for emphasis
    setTimeout(() => {
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.type = 'sine';
      osc2.frequency.value = baseFreq;

      const startTime = ctx.currentTime;
      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.exponentialRampToValueAtTime(0.2, startTime + 0.01);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + 1.5);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(startTime);
      osc2.stop(startTime + 2);

      osc2.onended = () => {
        osc2.disconnect();
        gain2.disconnect();
      };
    }, 400);
  } catch (err) {
    console.error('Failed to play complete sound:', err);
  }
};

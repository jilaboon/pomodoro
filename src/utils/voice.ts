// Voice utility using Web Speech API for Pomodoro timer

export interface VoiceSettings {
  name: string;
  voiceURI: string;
}

// Get available voices
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return window.speechSynthesis.getVoices();
};

// Speak a message with selected voice
export const speak = (text: string, voiceURI?: string) => {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice if specified
  if (voiceURI) {
    const voices = getAvailableVoices();
    const selectedVoice = voices.find(voice => voice.voiceURI === voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
  }

  utterance.rate = 1.0; // Normal speed
  utterance.pitch = 1.0; // Normal pitch
  utterance.volume = 1.0; // Full volume

  window.speechSynthesis.speak(utterance);
};

// Preview voice with user's name
export const previewVoice = (name: string, voiceURI: string) => {
  speak(`${name}, how is this sound?`, voiceURI);
};

// Work complete announcement
export const announceWorkComplete = (name: string, voiceURI?: string) => {
  speak(`${name}, time to take a break!`, voiceURI);
};

// Break complete announcement
export const announceBreakComplete = (name: string, voiceURI?: string) => {
  speak(`${name}, break's over! Time to focus!`, voiceURI);
};

// Load voice settings from localStorage
export const loadVoiceSettings = (): VoiceSettings | null => {
  const stored = localStorage.getItem('voiceSettings');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// Save voice settings to localStorage
export const saveVoiceSettings = (settings: VoiceSettings) => {
  localStorage.setItem('voiceSettings', JSON.stringify(settings));
};

import { useState, useEffect, useRef } from 'react';
import type { TimerMode, TimerStatus, PomodoroSettings, TimerState } from '../types';
import { playStartSound, playCompleteSound } from '../utils/sounds';

const DEFAULT_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  breakMinutes: 5,
  cycles: 4,
};

interface UseTimerCallbacks {
  onWorkComplete?: (workMinutes: number) => void;
  onBreakComplete?: () => void;
}

export const useTimer = (callbacks?: UseTimerCallbacks) => {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<TimerMode>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(settings.workMinutes * 60);
  const [currentCycle, setCurrentCycle] = useState(1);

  const intervalRef = useRef<number | null>(null);

  const state: TimerState = {
    mode,
    status,
    timeLeft,
    currentCycle,
    settings,
  };

  useEffect(() => {
    if (status === 'running' && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, timeLeft]);

  const handleTimerComplete = () => {
    // Play completion sound
    playCompleteSound();

    if (mode === 'work') {
      callbacks?.onWorkComplete?.(settings.workMinutes);
      if (currentCycle < settings.cycles) {
        setMode('break');
        setTimeLeft(settings.breakMinutes * 60);
        setStatus('idle');
      } else {
        setStatus('idle');
        reset();
      }
    } else {
      callbacks?.onBreakComplete?.();
      setMode('work');
      setCurrentCycle((prev) => prev + 1);
      setTimeLeft(settings.workMinutes * 60);
      setStatus('idle');
    }
  };

  const start = () => {
    playStartSound();
    setStatus('running');
  };

  const pause = () => {
    setStatus('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const reset = () => {
    setStatus('idle');
    setMode('work');
    setCurrentCycle(1);
    setTimeLeft(settings.workMinutes * 60);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    if (status === 'idle') {
      setTimeLeft(mode === 'work' ? newSettings.workMinutes * 60 : newSettings.breakMinutes * 60);
    }
  };

  return {
    state,
    start,
    pause,
    reset,
    updateSettings,
  };
};

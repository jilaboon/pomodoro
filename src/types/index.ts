export type TimerMode = 'work' | 'break';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  workMinutes: number;
  breakMinutes: number;
  cycles: number;
}

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;
  currentCycle: number;
  settings: PomodoroSettings;
}

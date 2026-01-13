export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface GameStats {
  totalWorkSessions: number;
  totalBreakSessions: number;
  totalWorkMinutes: number;
}

export interface GameState {
  xp: number;
  level: number;
  streak: number;
  lastCompletionDate: string;
  badges: string[];
  stats: GameStats;
}

export const BADGES: Record<string, Badge> = {
  first_pomodoro: {
    id: 'first_pomodoro',
    name: 'First Pomodoro',
    description: 'Complete your first work session',
    icon: '🍅',
  },
  consistency: {
    id: 'consistency',
    name: 'Consistency',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
  },
  grinder: {
    id: 'grinder',
    name: 'Grinder',
    description: 'Complete 10 work sessions',
    icon: '💪',
  },
};

export const XP_REWARDS = {
  WORK_SESSION: 10,
  BREAK_SESSION: 2,
} as const;

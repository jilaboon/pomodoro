import type { GameState } from '../types/gamification';
import { XP_REWARDS } from '../types/gamification';

const STORAGE_KEY = 'pomodoro_game_state';

const DEFAULT_GAME_STATE: GameState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastCompletionDate: '',
  badges: [],
  stats: {
    totalWorkSessions: 0,
    totalBreakSessions: 0,
    totalWorkMinutes: 0,
  },
};

export const loadGameState = (): GameState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading game state:', error);
  }
  return { ...DEFAULT_GAME_STATE };
};

export const saveGameState = (state: GameState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXPForNextLevel = (level: number): number => {
  return level * 100;
};

export const getCurrentLevelProgress = (xp: number, level: number): number => {
  const previousLevelXP = (level - 1) * 100;
  const nextLevelXP = level * 100;
  const currentLevelXP = xp - previousLevelXP;
  const totalLevelXP = nextLevelXP - previousLevelXP;
  return (currentLevelXP / totalLevelXP) * 100;
};

const isSameDay = (date1: string, date2: string): boolean => {
  if (!date1 || !date2) return false;
  const d1 = new Date(date1).toDateString();
  const d2 = new Date(date2).toDateString();
  return d1 === d2;
};

const isNextDay = (lastDate: string, currentDate: string): boolean => {
  if (!lastDate) return false;
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  const diffTime = current.getTime() - last.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

export const updateStreak = (state: GameState): GameState => {
  const today = new Date().toISOString().split('T')[0];

  if (isSameDay(state.lastCompletionDate, today)) {
    return state;
  }

  if (isNextDay(state.lastCompletionDate, today)) {
    return {
      ...state,
      streak: state.streak + 1,
      lastCompletionDate: today,
    };
  }

  return {
    ...state,
    streak: 1,
    lastCompletionDate: today,
  };
};

export const checkAndAwardBadges = (state: GameState): { state: GameState; newBadges: string[] } => {
  const newBadges: string[] = [];
  const badges = [...state.badges];

  if (
    state.stats.totalWorkSessions >= 1 &&
    !badges.includes('first_pomodoro')
  ) {
    badges.push('first_pomodoro');
    newBadges.push('first_pomodoro');
  }

  if (state.streak >= 3 && !badges.includes('consistency')) {
    badges.push('consistency');
    newBadges.push('consistency');
  }

  if (
    state.stats.totalWorkSessions >= 10 &&
    !badges.includes('grinder')
  ) {
    badges.push('grinder');
    newBadges.push('grinder');
  }

  return {
    state: { ...state, badges },
    newBadges,
  };
};

export const completeWorkSession = (state: GameState, workMinutes: number): GameState => {
  let newState = {
    ...state,
    xp: state.xp + XP_REWARDS.WORK_SESSION,
    stats: {
      ...state.stats,
      totalWorkSessions: state.stats.totalWorkSessions + 1,
      totalWorkMinutes: state.stats.totalWorkMinutes + workMinutes,
    },
  };

  newState = updateStreak(newState);
  newState.level = calculateLevel(newState.xp);

  const { state: finalState } = checkAndAwardBadges(newState);
  return finalState;
};

export const completeBreakSession = (state: GameState): GameState => {
  let newState = {
    ...state,
    xp: state.xp + XP_REWARDS.BREAK_SESSION,
    stats: {
      ...state.stats,
      totalBreakSessions: state.stats.totalBreakSessions + 1,
    },
  };

  newState.level = calculateLevel(newState.xp);

  const { state: finalState } = checkAndAwardBadges(newState);
  return finalState;
};

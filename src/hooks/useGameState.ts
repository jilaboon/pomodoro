import { useState, useEffect } from 'react';
import type { GameState } from '../types/gamification';
import {
  loadGameState,
  saveGameState,
  completeWorkSession,
  completeBreakSession,
  checkAndAwardBadges,
  getCurrentLevelProgress,
} from '../utils/gamification';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(loadGameState);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const handleWorkComplete = (workMinutes: number) => {
    const newState = completeWorkSession(gameState, workMinutes);
    const { state: finalState, newBadges: badges } = checkAndAwardBadges(newState);
    setGameState(finalState);
    if (badges.length > 0) {
      setNewBadges(badges);
      setTimeout(() => setNewBadges([]), 5000);
    }
  };

  const handleBreakComplete = () => {
    const newState = completeBreakSession(gameState);
    const { state: finalState, newBadges: badges } = checkAndAwardBadges(newState);
    setGameState(finalState);
    if (badges.length > 0) {
      setNewBadges(badges);
      setTimeout(() => setNewBadges([]), 5000);
    }
  };

  const levelProgress = getCurrentLevelProgress(gameState.xp, gameState.level);

  return {
    gameState,
    newBadges,
    levelProgress,
    handleWorkComplete,
    handleBreakComplete,
  };
};

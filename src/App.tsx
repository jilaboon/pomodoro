import { useTimer } from './hooks/useTimer';
import { useGameState } from './hooks/useGameState';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { Stats } from './components/Stats';
import { BadgeNotification } from './components/BadgeNotification';
import { celebrateCompletion, celebrateBadge } from './utils/confetti';
import { useEffect } from 'react';
import './App.css';

function App() {
  const {
    gameState,
    newBadges,
    levelProgress,
    handleWorkComplete,
    handleBreakComplete,
  } = useGameState();

  const { state, start, pause, reset, updateSettings } = useTimer({
    onWorkComplete: (workMinutes) => {
      handleWorkComplete(workMinutes);
      celebrateCompletion();
    },
    onBreakComplete: () => {
      handleBreakComplete();
    },
  });

  useEffect(() => {
    if (newBadges.length > 0) {
      celebrateBadge();
    }
  }, [newBadges]);

  return (
    <div className={`app ${state.mode}-mode`}>
      <header className="app-header">
        <h1>Pomodoro Timer</h1>
      </header>

      <main className="app-main">
        <Timer
          state={state}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />

        <Settings
          settings={state.settings}
          onUpdate={updateSettings}
          disabled={state.status === 'running'}
        />

        <Stats gameState={gameState} levelProgress={levelProgress} />
      </main>

      <BadgeNotification badgeIds={newBadges} />
    </div>
  );
}

export default App;

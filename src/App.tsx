import { useTimer } from './hooks/useTimer';
import { useGameState } from './hooks/useGameState';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { Stats } from './components/Stats';
import { BadgeNotification } from './components/BadgeNotification';
import { NamePrompt } from './components/NamePrompt';
import { BreakGame } from './components/BreakGame';
import { celebrateCompletion, celebrateBadge } from './utils/confetti';
import { loadVoiceSettings, saveVoiceSettings, getAvailableVoices } from './utils/voice';
import { useEffect, useState } from 'react';
import './App.css';

// Deployment timestamp
const buildTime = import.meta.env.VITE_BUILD_TIME;
const DEPLOYMENT_TIME = buildTime
  ? new Date(buildTime).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  : 'unknown';

function App() {
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [isGameMode, setIsGameMode] = useState(false);

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

  // Check if user name is stored, if not show prompt
  useEffect(() => {
    const voiceSettings = loadVoiceSettings();
    if (!voiceSettings?.name) {
      setShowNamePrompt(true);
    }
  }, []);

  useEffect(() => {
    if (newBadges.length > 0) {
      celebrateBadge();
    }
  }, [newBadges]);

  useEffect(() => {
    if (state.mode !== 'break' && isGameMode) {
      setIsGameMode(false);
    }
  }, [state.mode, isGameMode]);

  const handleNameSubmit = (name: string) => {
    // Get available voices and use the first one as default
    const voices = getAvailableVoices();
    const defaultVoice = voices.length > 0 ? voices[0].voiceURI : '';

    saveVoiceSettings({
      name,
      voiceURI: defaultVoice,
    });

    setShowNamePrompt(false);
  };

  return (
    <div className={`app ${state.mode}-mode`}>
      {showNamePrompt && <NamePrompt onSubmit={handleNameSubmit} />}

      <div className="deployment-timestamp">v {DEPLOYMENT_TIME}</div>

      <header className="app-header">
        <h1>Pomodoro Timer</h1>
      </header>

      <main className="app-main">
        <Timer
          state={state}
          onStart={start}
          onPause={pause}
          onReset={reset}
          onEnterGameMode={() => setIsGameMode(true)}
          showGameModeButton={state.mode === 'break' && !isGameMode}
        />

        <Settings
          settings={state.settings}
          onUpdate={updateSettings}
          disabled={state.status === 'running'}
        />

        <Stats gameState={gameState} levelProgress={levelProgress} />
      </main>

      <BadgeNotification badgeIds={newBadges} />

      {isGameMode && <BreakGame onExit={() => setIsGameMode(false)} />}
    </div>
  );
}

export default App;

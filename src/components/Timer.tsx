import type { TimerState } from '../types';
import { CircularProgress } from './CircularProgress';

interface TimerProps {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Timer = ({ state, onStart, onPause, onReset }: TimerProps) => {
  const { mode, status, timeLeft, currentCycle, settings } = state;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    const totalTime = mode === 'work'
      ? settings.workMinutes * 60
      : settings.breakMinutes * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <div className="timer-container">
      <div className="timer-header">
        <h2 className={`mode-title ${mode}`}>
          {mode === 'work' ? 'Work Time' : 'Break Time'}
        </h2>
        <p className="cycle-counter">
          Cycle {currentCycle} of {settings.cycles}
        </p>
      </div>

      <div className="timer-display">
        <div className="circular-timer">
          <CircularProgress
            percentage={getProgressPercentage()}
            color={mode === 'work' ? '#ffd700' : '#90ee90'}
          />
          <div className="timer-center">
            <h1 className="time">{formatTime(timeLeft)}</h1>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {status === 'running' ? (
          <button onClick={onPause} className="btn btn-pause">
            Pause
          </button>
        ) : (
          <button onClick={onStart} className="btn btn-start">
            {status === 'paused' ? 'Resume' : 'Start'}
          </button>
        )}
        <button onClick={onReset} className="btn btn-reset">
          Reset
        </button>
      </div>
    </div>
  );
};

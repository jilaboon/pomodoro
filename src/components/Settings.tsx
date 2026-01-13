import { useState } from 'react';
import type { PomodoroSettings } from '../types';

interface SettingsProps {
  settings: PomodoroSettings;
  onUpdate: (settings: PomodoroSettings) => void;
  disabled: boolean;
}

export const Settings = ({ settings, onUpdate, disabled }: SettingsProps) => {
  const [workMinutes, setWorkMinutes] = useState(settings.workMinutes);
  const [breakMinutes, setBreakMinutes] = useState(settings.breakMinutes);
  const [cycles, setCycles] = useState(settings.cycles);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    onUpdate({
      workMinutes,
      breakMinutes,
      cycles,
    });
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setWorkMinutes(settings.workMinutes);
    setBreakMinutes(settings.breakMinutes);
    setCycles(settings.cycles);
    setIsExpanded(false);
  };

  return (
    <div className="settings-container">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn btn-settings"
        disabled={disabled}
      >
        {isExpanded ? 'Hide Settings' : 'Show Settings'}
      </button>

      {isExpanded && (
        <div className="settings-panel">
          <div className="setting-group">
            <label htmlFor="workMinutes">Work Minutes:</label>
            <input
              id="workMinutes"
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(Number(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="breakMinutes">Break Minutes:</label>
            <input
              id="breakMinutes"
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="cycles">Cycles:</label>
            <input
              id="cycles"
              type="number"
              min="1"
              max="10"
              value={cycles}
              onChange={(e) => setCycles(Number(e.target.value))}
            />
          </div>

          <div className="settings-actions">
            <button onClick={handleSave} className="btn btn-save">
              Save
            </button>
            <button onClick={handleCancel} className="btn btn-cancel">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

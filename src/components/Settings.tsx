import { useState, useEffect } from 'react';
import type { PomodoroSettings } from '../types';
import { getAvailableVoices, previewVoice, loadVoiceSettings, saveVoiceSettings } from '../utils/voice';

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

  // Voice settings
  const [userName, setUserName] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Load voice settings
    const voiceSettings = loadVoiceSettings();
    if (voiceSettings) {
      setUserName(voiceSettings.name);
      setSelectedVoice(voiceSettings.voiceURI);
    }

    // Load available voices
    const loadVoices = () => {
      const availableVoices = getAvailableVoices();
      setVoices(availableVoices);

      // Set default voice if not already set
      if (!selectedVoice && availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].voiceURI);
      }
    };

    // Voices might not be loaded immediately
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleSave = () => {
    onUpdate({
      workMinutes,
      breakMinutes,
      cycles,
    });

    // Save voice settings
    if (userName.trim()) {
      saveVoiceSettings({
        name: userName.trim(),
        voiceURI: selectedVoice,
      });
    }

    setIsExpanded(false);
  };

  const handleCancel = () => {
    setWorkMinutes(settings.workMinutes);
    setBreakMinutes(settings.breakMinutes);
    setCycles(settings.cycles);

    // Restore voice settings
    const voiceSettings = loadVoiceSettings();
    if (voiceSettings) {
      setUserName(voiceSettings.name);
      setSelectedVoice(voiceSettings.voiceURI);
    }

    setIsExpanded(false);
  };

  const handlePreviewVoice = () => {
    if (userName.trim()) {
      previewVoice(userName.trim(), selectedVoice);
    }
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
          <h3 className="settings-section-title">Timer Settings</h3>

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

          <h3 className="settings-section-title">Voice Settings</h3>

          <div className="setting-group">
            <label htmlFor="userName">Your Name:</label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
            />
          </div>

          <div className="setting-group">
            <label htmlFor="voiceSelect">Voice:</label>
            <select
              id="voiceSelect"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="voice-select"
            >
              {voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </div>

          <div className="setting-group">
            <button
              onClick={handlePreviewVoice}
              className="btn btn-preview"
              disabled={!userName.trim()}
            >
              🔊 Preview Voice
            </button>
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

import { useState } from 'react';
import './NamePrompt.css';

interface NamePromptProps {
  onSubmit: (name: string) => void;
}

export const NamePrompt = ({ onSubmit }: NamePromptProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="name-prompt-overlay">
      <div className="name-prompt-modal">
        <h2>Welcome to Pomodoro Timer!</h2>
        <p>What's your name?</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
            maxLength={50}
          />
          <button type="submit" className="btn btn-save" disabled={!name.trim()}>
            Let's Go!
          </button>
        </form>
      </div>
    </div>
  );
};

import type { GameState } from '../types/gamification';
import { BADGES } from '../types/gamification';
import { getXPForNextLevel } from '../utils/gamification';

interface StatsProps {
  gameState: GameState;
  levelProgress: number;
}

export const Stats = ({ gameState, levelProgress }: StatsProps) => {
  const { xp, level, streak, badges, stats } = gameState;
  const nextLevelXP = getXPForNextLevel(level);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Your Progress</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card level-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-label">Level</div>
            <div className="stat-value">{level}</div>
            <div className="level-progress-bar">
              <div
                className="level-progress-fill"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="stat-subtext">
              {xp} / {nextLevelXP} XP
            </div>
          </div>
        </div>

        <div className="stat-card streak-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-label">Streak</div>
            <div className="stat-value">{streak}</div>
            <div className="stat-subtext">days</div>
          </div>
        </div>

        <div className="stat-card sessions-card">
          <div className="stat-icon">🍅</div>
          <div className="stat-content">
            <div className="stat-label">Work Sessions</div>
            <div className="stat-value">{stats.totalWorkSessions}</div>
            <div className="stat-subtext">{stats.totalWorkMinutes} min total</div>
          </div>
        </div>
      </div>

      <div className="badges-section">
        <h3>Badges</h3>
        <div className="badges-grid">
          {Object.values(BADGES).map((badge) => {
            const earned = badges.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`badge ${earned ? 'earned' : 'locked'}`}
                title={badge.description}
              >
                <div className="badge-icon">{badge.icon}</div>
                <div className="badge-name">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

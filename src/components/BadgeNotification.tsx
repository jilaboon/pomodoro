import { BADGES } from '../types/gamification';

interface BadgeNotificationProps {
  badgeIds: string[];
}

export const BadgeNotification = ({ badgeIds }: BadgeNotificationProps) => {
  if (badgeIds.length === 0) return null;

  return (
    <div className="badge-notification">
      <div className="badge-notification-content">
        <h3>🎉 Badge Earned!</h3>
        {badgeIds.map((id) => {
          const badge = BADGES[id];
          return (
            <div key={id} className="earned-badge">
              <span className="earned-badge-icon">{badge.icon}</span>
              <div>
                <div className="earned-badge-name">{badge.name}</div>
                <div className="earned-badge-desc">{badge.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

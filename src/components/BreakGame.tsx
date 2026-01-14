import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';

interface BreakGameProps {
  onExit: () => void;
}

interface Bubble {
  id: number;
  size: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  duration: number;
}

const MAX_BUBBLES = 18;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const createBubble = (id: number): Bubble => ({
  id,
  size: Math.round(randomBetween(28, 78)),
  x: Math.round(randomBetween(5, 90)),
  y: Math.round(randomBetween(10, 85)),
  dx: Math.round(randomBetween(-35, 35)),
  dy: Math.round(randomBetween(-30, 30)),
  duration: Math.round(randomBetween(6, 14)),
});

export const BreakGame = ({ onExit }: BreakGameProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextId = useRef(1);

  useEffect(() => {
    const initial = Array.from({ length: 10 }, () => createBubble(nextId.current++));
    setBubbles(initial);

    const interval = window.setInterval(() => {
      setBubbles((prev) => {
        if (prev.length >= MAX_BUBBLES) {
          return prev;
        }
        return [...prev, createBubble(nextId.current++)];
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
  };

  return (
    <div className="game-overlay" role="dialog" aria-label="Break game mode">
      <div className="game-ui">
        <div className="game-title">Break Game</div>
        <button type="button" className="btn btn-exit-game" onClick={onExit}>
          Exit Game
        </button>
      </div>

      <div className="game-hint">Tap bubbles to pop them</div>

      {bubbles.map((bubble) => {
        const style = {
          width: `${bubble.size}px`,
          height: `${bubble.size}px`,
          left: `${bubble.x}%`,
          top: `${bubble.y}%`,
          '--dx': bubble.dx,
          '--dy': bubble.dy,
          '--duration': `${bubble.duration}s`,
        } as CSSProperties;

        return (
          <button
            key={bubble.id}
            type="button"
            className="game-bubble"
            style={style}
            aria-label="Pop bubble"
            onClick={() => popBubble(bubble.id)}
          />
        );
      })}
    </div>
  );
};

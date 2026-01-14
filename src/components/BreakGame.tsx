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
  vx: number;
  vy: number;
}

const MAX_BUBBLES = 15;
const MIN_SPEED = 160;
const MAX_SPEED = 280;

const randomBetween = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const createBubble = (id: number, width: number, height: number): Bubble => {
  const size = Math.round(randomBetween(28, 70));
  const safeWidth = Math.max(width - size, 0);
  const safeHeight = Math.max(height - size, 0);
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(MIN_SPEED, MAX_SPEED);

  return {
    id,
    size,
    x: Math.round(randomBetween(0, safeWidth)),
    y: Math.round(randomBetween(0, safeHeight)),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
};

export const BreakGame = ({ onExit }: BreakGameProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const nextId = useRef(1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      boundsRef.current = { width: rect.width, height: rect.height };
      if (rect.width && rect.height) {
        const clamped = bubblesRef.current.map((bubble) => {
          const maxX = Math.max(rect.width - bubble.size, 0);
          const maxY = Math.max(rect.height - bubble.size, 0);
          return {
            ...bubble,
            x: Math.min(Math.max(bubble.x, 0), maxX),
            y: Math.min(Math.max(bubble.y, 0), maxY),
          };
        });
        if (clamped.length > 0) {
          bubblesRef.current = clamped;
          setBubbles(clamped);
        }
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);

    const interval = window.setInterval(() => {
      const { width: w, height: h } = boundsRef.current;
      if (!w || !h) return;
      if (bubblesRef.current.length === 0) {
        const initial = Array.from({ length: 10 }, () =>
          createBubble(nextId.current++, w, h)
        );
        bubblesRef.current = initial;
        setBubbles(initial);
        return;
      }
      if (bubblesRef.current.length >= MAX_BUBBLES) return;
      const next = [...bubblesRef.current, createBubble(nextId.current++, w, h)];
      bubblesRef.current = next;
      setBubbles(next);
    }, 700);

    return () => {
      window.removeEventListener('resize', updateBounds);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;

    const tick = (time: number) => {
      const lastTime = lastTimeRef.current ?? time;
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTimeRef.current = time;

      const { width, height } = boundsRef.current;
      if (width && height && bubblesRef.current.length > 0) {
        const next = bubblesRef.current.map((bubble) => {
          let nextX = bubble.x + bubble.vx * delta;
          let nextY = bubble.y + bubble.vy * delta;
          let nextVx = bubble.vx;
          let nextVy = bubble.vy;

          if (nextX <= 0) {
            nextX = 0;
            nextVx = Math.abs(nextVx);
          } else if (nextX + bubble.size >= width) {
            nextX = Math.max(width - bubble.size, 0);
            nextVx = -Math.abs(nextVx);
          }

          if (nextY <= 0) {
            nextY = 0;
            nextVy = Math.abs(nextVy);
          } else if (nextY + bubble.size >= height) {
            nextY = Math.max(height - bubble.size, 0);
            nextVy = -Math.abs(nextVy);
          }

          return {
            ...bubble,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
          };
        });

        bubblesRef.current = next;
        setBubbles(next);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const popBubble = (id: number) => {
    const next = bubblesRef.current.filter((bubble) => bubble.id !== id);
    bubblesRef.current = next;
    setBubbles(next);
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

      <div className="game-playfield" ref={containerRef}>
        {bubbles.map((bubble) => {
          const style = {
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
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
    </div>
  );
};

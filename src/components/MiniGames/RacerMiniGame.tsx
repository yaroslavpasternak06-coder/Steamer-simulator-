import React, { useState, useEffect, useCallback } from 'react';
import { Flame, ArrowLeft, ArrowRight, ShieldAlert } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

interface Obstacle {
  id: number;
  lane: number; // 0, 1, 2
  y: number; // percentage down the screen (0 to 100)
}

export const RacerMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [playerLane, setPlayerLane] = useState(1); // 0 = left, 1 = mid, 2 = right
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [speed, setSpeed] = useState(240); // km/h
  const [feedback, setFeedback] = useState<string | null>(null);

  // Spawning obstacles and moving them
  useEffect(() => {
    if (!active) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const updated: Obstacle[] = [];
        let hit = false;

        for (const obs of prev) {
          const nextY = obs.y + 6;
          // Check collision at player position (approx 75% to 90% Y)
          if (nextY >= 75 && nextY <= 90 && obs.lane === playerLane) {
            hit = true;
          } else if (nextY < 100) {
            updated.push({ ...obs, y: nextY });
          } else {
            // Successfully passed!
            onScore(15);
          }
        }

        if (hit) {
          sound.playMiniGameMiss();
          onMiss();
          setFeedback('💥 СТОЛКНОВЕНИЕ! Чат: ДРИФТЕР ГОДА ЛОЛ');
          setTimeout(() => setFeedback(null), 800);
          return [];
        }

        return updated;
      });
    }, 80);

    const spawnInterval = setInterval(() => {
      const lane = Math.floor(Math.random() * 3);
      setObstacles(prev => [
        ...prev,
        { id: Date.now() + Math.random(), lane, y: 0 }
      ]);
    }, 900);

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [active, playerLane, onScore, onMiss]);

  const moveLeft = useCallback(() => {
    sound.playClick();
    setPlayerLane(l => Math.max(0, l - 1));
  }, []);

  const moveRight = useCallback(() => {
    sound.playClick();
    setPlayerLane(l => Math.min(2, l + 1));
  }, []);

  // Keyboard left/right
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') moveLeft();
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') moveRight();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [moveLeft, moveRight]);

  return (
    <div className="relative w-full h-full bg-slate-950 p-3 border-2 border-pink-500/40 rounded-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Cyberpunk neon road perspective */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/60 via-slate-950 to-black pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-pink-500/40 text-pink-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Flame className="w-4 h-4 text-pink-400" /> CYBERRACER 2077 • ТРАССА NEON-CITY
        </span>
        <div className="flex items-center gap-2">
          <span>СКОРОСТЬ: <strong className="text-amber-400">{speed} КМ/Ч</strong></span>
        </div>
      </div>

      {feedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-xs font-black text-rose-400 bg-black/90 border border-rose-500 px-3 py-1 rounded-full animate-bounce">
          {feedback}
        </div>
      )}

      {/* 3 Lane Road */}
      <div className="relative z-10 w-full max-w-xs mx-auto h-48 bg-slate-900/90 rounded-xl border border-pink-500/30 grid grid-cols-3 overflow-hidden shadow-2xl my-auto">
        {/* Lane dividers */}
        <div className="border-r border-dashed border-pink-500/30" />
        <div className="border-r border-dashed border-pink-500/30" />
        <div />

        {/* Obstacles (other cars / drones) */}
        {obstacles.map(obs => (
          <div
            key={obs.id}
            className="absolute -translate-x-1/2 transition-transform duration-75 flex flex-col items-center pointer-events-none"
            style={{
              left: `${obs.lane === 0 ? 16.6 : obs.lane === 1 ? 50 : 83.3}%`,
              top: `${obs.y}%`
            }}
          >
            <div className="w-10 h-7 bg-red-600 rounded-md border border-amber-300 shadow-[0_0_10px_rgba(239,68,68,0.9)] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
          </div>
        ))}

        {/* Player Cybercar */}
        <div
          className="absolute bottom-3 -translate-x-1/2 transition-all duration-100 flex flex-col items-center z-15"
          style={{
            left: `${playerLane === 0 ? 16.6 : playerLane === 1 ? 50 : 83.3}%`
          }}
        >
          <div className="w-11 h-9 bg-cyan-400 rounded-lg border-2 border-white shadow-[0_0_15px_rgba(6,182,212,1)] flex items-center justify-center">
            <span className="text-[9px] font-black text-slate-900">CYBER</span>
          </div>
          <div className="w-6 h-1.5 bg-pink-500 blur-[2px] mt-0.5 rounded-full" />
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 flex gap-2 pt-1">
        <button
          onClick={moveLeft}
          className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono text-xs flex items-center justify-center gap-1 border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" /> ВЛЕВО [A]
        </button>
        <button
          onClick={moveRight}
          className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-mono text-xs flex items-center justify-center gap-1 border border-slate-700"
        >
          ВПРАВО [D] <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

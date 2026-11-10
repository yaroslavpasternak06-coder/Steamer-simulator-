import React, { useState, useEffect } from 'react';
import { Crosshair } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

interface Target {
  id: number;
  x: number; // percentage
  y: number; // percentage
  type: 'head' | 'body';
  expiresAt: number;
}

export const ShooterMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);
  const [lastHitText, setLastHitText] = useState<string | null>(null);

  // Spawn targets
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTargets(prev => {
        const now = Date.now();
        // Check expired
        const expired = prev.filter(t => t.expiresAt <= now);
        if (expired.length > 0) {
          onMiss();
          sound.playMiniGameMiss();
          setCombo(0);
        }
        const activeOnly = prev.filter(t => t.expiresAt > now);

        if (activeOnly.length < 3) {
          const isHead = Math.random() > 0.6;
          const newTarget: Target = {
            id: Date.now() + Math.random(),
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 65,
            type: isHead ? 'head' : 'body',
            expiresAt: Date.now() + 2000
          };
          return [...activeOnly, newTarget];
        }
        return activeOnly;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [active, onMiss]);

  const handleShoot = (target: Target, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playMiniGameHit();
    const newCombo = combo + 1;
    setCombo(newCombo);

    if (target.type === 'head') {
      const points = 25 * Math.min(newCombo, 5);
      onScore(points);
      setLastHitText(`💥 ХЕДШОТ! +${points} (x${newCombo})`);
    } else {
      const points = 10 * Math.min(newCombo, 4);
      onScore(points);
      setLastHitText(`🎯 ПОПАДАНИЕ! +${points}`);
    }

    setTargets(prev => prev.filter(t => t.id !== target.id));
    setTimeout(() => setLastHitText(null), 900);
  };

  return (
    <div 
      className="relative w-full h-full bg-slate-900 overflow-hidden cursor-crosshair select-none flex flex-col justify-between p-3 border-2 border-blue-500/30 rounded-xl"
      onClick={() => {
        onMiss();
        sound.playMiniGameMiss();
        setCombo(0);
      }}
    >
      {/* Background 3D grid illusion */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/60 via-slate-950 to-black pointer-events-none" />
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:30px_30px]" />

      {/* Top HUD */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-950/80 px-3 py-1.5 rounded-lg border border-blue-500/40 text-blue-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Crosshair className="w-4 h-4 text-rose-500 animate-spin" /> COUNTER-FRAG 2 • КАТКА В РАЗГАРЕ
        </span>
        <div className="flex items-center gap-3">
          <span>КОМБО: <strong className="text-amber-400 font-black text-sm">x{combo}</strong></span>
          <span className="text-slate-400">Кликай по врагам!</span>
        </div>
      </div>

      {/* Floating feedback */}
      {lastHitText && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-emerald-400 font-black text-base drop-shadow-[0_2px_10px_rgba(16,185,129,0.8)] animate-bounce">
          {lastHitText}
        </div>
      )}

      {/* Targets */}
      {targets.map(target => (
        <button
          key={target.id}
          onClick={(e) => handleShoot(target, e)}
          style={{ left: `${target.x}%`, top: `${target.y}%` }}
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-15 transition-transform hover:scale-110 active:scale-95 group focus:outline-none`}
        >
          {target.type === 'head' ? (
            <div className="relative flex items-center justify-center w-11 h-11 bg-rose-600 rounded-full border-2 border-amber-300 shadow-[0_0_15px_rgba(239,68,68,0.9)] animate-pulse">
              <span className="text-[10px] font-black text-white">HEAD</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-14 h-14 bg-blue-600/90 rounded-lg border-2 border-cyan-300 shadow-[0_0_12px_rgba(59,130,246,0.7)]">
              <span className="text-[11px] font-black text-white">TARGET</span>
            </div>
          )}
        </button>
      ))}

      {/* Crosshair bottom status */}
      <div className="relative z-10 flex justify-between items-center text-[11px] text-slate-400">
        <span>HP: 100/100</span>
        <span>БОМБА УСТАНОВЛЕНА НА «B»</span>
        <span>РАУНД: 14 - 12</span>
      </div>
    </div>
  );
};

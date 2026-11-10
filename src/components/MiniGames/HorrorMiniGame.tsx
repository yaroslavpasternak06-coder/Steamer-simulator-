import React, { useState, useEffect, useRef } from 'react';
import { Ghost, HeartPulse, Eye } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

export const HorrorMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [sanity, setSanity] = useState(80);
  const [barPosition, setBarPosition] = useState(50);
  const [targetZone, setTargetZone] = useState({ start: 40, end: 60 });
  const [screamerTriggered, setScreamerTriggered] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const directionRef = useRef(1);

  // Moving needle loop
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBarPosition(prev => {
        let next = prev + directionRef.current * 3;
        if (next >= 95) {
          next = 95;
          directionRef.current = -1;
        } else if (next <= 5) {
          next = 5;
          directionRef.current = 1;
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [active]);

  const handleCalmHeartbeat = () => {
    // Check if needle is inside target zone
    if (barPosition >= targetZone.start && barPosition <= targetZone.end) {
      sound.playMiniGameHit();
      const pts = 30;
      onScore(pts);
      setSanity(s => Math.min(100, s + 10));
      setFeedback('❤️ СЕРДЦЕБИЕНИЕ В НОРМЕ! Стример держит себя в руках!');
      // Move target zone
      const newStart = 15 + Math.floor(Math.random() * 55);
      setTargetZone({ start: newStart, end: newStart + 22 });
      setTimeout(() => setFeedback(null), 800);
    } else {
      sound.playMiniGameMiss();
      onMiss();
      setSanity(s => Math.max(10, s - 20));
      setFeedback('😱 СКРИМЕР! Стример подпрыгнул на кресле!');
      setScreamerTriggered(true);
      setTimeout(() => {
        setScreamerTriggered(false);
        setFeedback(null);
      }, 700);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 p-4 border-2 border-purple-500/40 rounded-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(0,0,0,0.95)_100%)] pointer-events-none z-5" />

      {/* Screamer flash */}
      {screamerTriggered && (
        <div className="absolute inset-0 z-30 bg-red-600/80 flex flex-col items-center justify-center animate-ping">
          <Ghost className="w-24 h-24 text-white" />
          <span className="text-2xl font-black text-white uppercase mt-2">БУУУ! 👻</span>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Ghost className="w-4 h-4 text-purple-400" /> PHOBIA: НОЧНОЙ КОШМАР • ОСОБНЯК
        </span>
        <div className="flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-rose-500 animate-pulse" />
          <span>РАССУДОК: <strong>{sanity}%</strong></span>
        </div>
      </div>

      {/* Center atmospheric visual */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        <Eye className="w-12 h-12 text-purple-400/80 animate-pulse mb-3" />
        <div className="text-xs text-slate-300 text-center max-w-xs font-mono mb-3">
          Призрак бродит в темноте! Жми кнопку «УСПОКОИТЬСЯ», когда ползунок в зеленой зоне пульса!
        </div>

        {/* Pulse / Heartbeat QTE bar */}
        <div className="w-full max-w-md h-8 bg-slate-900 rounded-full border-2 border-purple-500/50 relative overflow-hidden shadow-inner">
          {/* Target zone */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-500/40 border-x-2 border-emerald-400"
            style={{ left: `${targetZone.start}%`, width: `${targetZone.end - targetZone.start}%` }}
          />

          {/* Needle */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-rose-500 rounded-full shadow-[0_0_12px_rgba(244,63,94,1)] transform -translate-x-1/2 transition-all duration-75"
            style={{ left: `${barPosition}%` }}
          />
        </div>

        {feedback && (
          <div className="mt-3 text-xs font-bold text-amber-300 animate-bounce">
            {feedback}
          </div>
        )}
      </div>

      {/* Action button */}
      <div className="relative z-10 pt-2">
        <button
          onClick={handleCalmHeartbeat}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-rose-700 hover:from-purple-600 hover:to-rose-600 text-white font-mono font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 border border-purple-400/40"
        >
          <HeartPulse className="w-4 h-4 text-white animate-ping" />
          СДЕЛАТЬ ВДОХ (ТАЙМИНГ В ЗОНУ)
        </button>
      </div>
    </div>
  );
};

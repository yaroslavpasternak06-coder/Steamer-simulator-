import React, { useState, useEffect, useCallback } from 'react';
import { Swords, Zap } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

const KEYS = ['Q', 'W', 'E', 'R'];
const SPELL_NAMES: Record<string, { name: string; color: string; desc: string }> = {
  Q: { name: 'Sun Strike', color: 'bg-amber-600 border-amber-400 text-amber-100', desc: 'Урон по площади' },
  W: { name: 'Ghost Walk', color: 'bg-sky-600 border-sky-400 text-sky-100', desc: 'Инвиз' },
  E: { name: 'Chaos Meteor', color: 'bg-rose-600 border-rose-400 text-rose-100', desc: 'Падение метеора' },
  R: { name: 'RAMPAGE BLAST', color: 'bg-purple-600 border-purple-400 text-purple-100', desc: 'УЛЬТИМЕЙТ' }
};

export const MobaMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [comboSequence, setComboSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateNewCombo = useCallback(() => {
    const len = 3 + Math.floor(Math.random() * 2);
    const seq = Array.from({ length: len }, () => KEYS[Math.floor(Math.random() * KEYS.length)]);
    setComboSequence(seq);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (active) {
      generateNewCombo();
    }
  }, [active, generateNewCombo]);

  const handleKeyPress = useCallback((key: string) => {
    if (!active || comboSequence.length === 0) return;

    if (key === comboSequence[currentIndex]) {
      sound.playMiniGameHit();
      const nextIdx = currentIndex + 1;
      
      if (nextIdx >= comboSequence.length) {
        // Completed combo!
        const newStreak = streak + 1;
        setStreak(newStreak);
        const points = 35 + newStreak * 10;
        onScore(points);
        setFeedback(`⚡ ТИМФАЙТ ВЫИГРАН! +${points} (Стрик x${newStreak})`);
        generateNewCombo();
        setTimeout(() => setFeedback(null), 1000);
      } else {
        setCurrentIndex(nextIdx);
      }
    } else {
      // Missed key
      sound.playMiniGameMiss();
      setStreak(0);
      onMiss();
      setFeedback('❌ МИССКЛИК! Тиммейты пингуют на карту');
      setTimeout(() => setFeedback(null), 900);
      generateNewCombo();
    }
  }, [active, comboSequence, currentIndex, streak, onScore, onMiss, generateNewCombo]);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (KEYS.includes(k)) {
        handleKeyPress(k);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="relative w-full h-full bg-slate-950 p-4 border-2 border-red-500/30 rounded-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Background magical runes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-purple-950/30 to-black pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Swords className="w-4 h-4 text-amber-400" /> DOTA OF LEGENDS • МИДЛЕЙН
        </span>
        <div className="flex items-center gap-2">
          <span>СЕРИЯ УБИЙСТВ: <strong className="text-amber-400 text-sm font-black">x{streak}</strong></span>
        </div>
      </div>

      {/* Center Action */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        <div className="text-xs text-slate-400 mb-2 font-mono flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          Жми комбо скиллов клавишами на клавиатуре или кнопками:
        </div>

        {/* Current sequence display */}
        <div className="flex items-center gap-3">
          {comboSequence.map((key, idx) => {
            const isDone = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const spell = SPELL_NAMES[key];

            return (
              <div
                key={idx}
                className={`relative flex flex-col items-center transition-all ${
                  isCurrent ? 'scale-110 -translate-y-1' : isDone ? 'opacity-40 scale-90' : 'opacity-85'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center shadow-lg transition-colors ${
                    isCurrent
                      ? 'bg-amber-500/30 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] animate-pulse'
                      : isDone
                      ? 'bg-emerald-950 border-emerald-500'
                      : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <span className={`text-xl font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                    {key}
                  </span>
                </div>
                <span className="text-[10px] text-slate-300 font-bold mt-1 max-w-[65px] text-center truncate">
                  {spell.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feedback text */}
        {feedback && (
          <div className="mt-3 text-sm font-extrabold text-amber-300 animate-bounce">
            {feedback}
          </div>
        )}
      </div>

      {/* On-screen clickable buttons for mouse or touch */}
      <div className="relative z-10 grid grid-cols-4 gap-2 pt-2 border-t border-slate-800">
        {KEYS.map(k => (
          <button
            key={k}
            onClick={() => handleKeyPress(k)}
            className={`py-2 px-3 rounded-lg border font-mono font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
              SPELL_NAMES[k].color
            } hover:brightness-125 shadow-md`}
          >
            <span className="bg-black/30 px-2 py-0.5 rounded text-xs">[{k}]</span>
            <span className="hidden sm:inline text-xs">{SPELL_NAMES[k].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

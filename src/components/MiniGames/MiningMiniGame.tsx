import React, { useState, useEffect } from 'react';
import { Pickaxe, Gem, Box } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

interface Block {
  id: number;
  type: 'diamond' | 'gold' | 'iron' | 'stone' | 'creeper';
  clicksRemaining: number;
  maxClicks: number;
}

const BLOCK_TYPES = [
  { type: 'diamond' as const, clicks: 4, points: 50, color: 'bg-cyan-500 border-cyan-300', text: 'Алмазы!' },
  { type: 'gold' as const, clicks: 3, points: 30, color: 'bg-amber-400 border-amber-200', text: 'Золото' },
  { type: 'iron' as const, clicks: 2, points: 15, color: 'bg-slate-400 border-slate-200', text: 'Железо' },
  { type: 'creeper' as const, clicks: 1, points: -20, color: 'bg-emerald-600 border-emerald-400', text: 'КРИПЕР!' }
];

export const MiningMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const generateGrid = () => {
      const list: Block[] = [];
      for (let i = 0; i < 6; i++) {
        const rand = Math.random();
        let btype = BLOCK_TYPES[2]; // iron
        if (rand < 0.2) btype = BLOCK_TYPES[0]; // diamond
        else if (rand < 0.45) btype = BLOCK_TYPES[1]; // gold
        else if (rand > 0.85) btype = BLOCK_TYPES[3]; // creeper

        list.push({
          id: i,
          type: btype.type,
          clicksRemaining: btype.clicks,
          maxClicks: btype.clicks
        });
      }
      setBlocks(list);
    };

    generateGrid();
  }, [active]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const handleMineBlock = (block: Block) => {
    sound.playMiniGameHit();

    if (block.type === 'creeper') {
      sound.playMiniGameMiss();
      onMiss();
      setFeedback('💥 ПШШШ! БУМ! Крипер взорвался! Чат: АХАХАХ');
      setTimeout(() => setFeedback(null), 1000);
      setBlocks(prev => shuffleArray(prev.map(b => b.id === block.id ? { ...b, type: 'stone', clicksRemaining: 1, maxClicks: 1 } : b)));
      return;
    }

    if (block.clicksRemaining <= 1) {
      // Finished mining block!
      const meta = BLOCK_TYPES.find(b => b.type === block.type);
      const pts = meta ? meta.points : 20;
      onScore(pts);
      setFeedback(`⛏️ Добыто: ${meta?.text || 'Руда'}! +${pts} Hype`);
      setTimeout(() => setFeedback(null), 800);

      // Replace block with new random
      const rand = Math.random();
      let newType = BLOCK_TYPES[2];
      if (rand < 0.25) newType = BLOCK_TYPES[0];
      else if (rand < 0.5) newType = BLOCK_TYPES[1];
      else if (rand > 0.85) newType = BLOCK_TYPES[3];

      setBlocks(prev => {
        const updated = prev.map(b => b.id === block.id ? {
          id: b.id,
          type: newType.type,
          clicksRemaining: newType.clicks,
          maxClicks: newType.clicks
        } : b);
        // Shuffle positions after successful mine!
        return shuffleArray(updated);
      });
    } else {
      setBlocks(prev => {
        const updated = prev.map(b => b.id === block.id ? { ...b, clicksRemaining: b.clicksRemaining - 1 } : b);
        // Shuffle positions after click!
        return shuffleArray(updated);
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 p-3 border-2 border-emerald-500/30 rounded-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-300">
        <span className="flex items-center gap-1.5 font-bold">
          <Pickaxe className="w-4 h-4 text-emerald-400" /> CRAFTMINE 3D • ГЛУБОКАЯ ШАХТА
        </span>
        <span className="text-slate-400">Добывай алмазы, остерегайся криперов!</span>
      </div>

      {feedback && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 text-xs font-black text-amber-300 bg-slate-900/90 border border-amber-500 px-3 py-1 rounded-full animate-bounce">
          {feedback}
        </div>
      )}

      {/* Grid of Blocks */}
      <div className="relative z-10 grid grid-cols-3 gap-3 my-auto max-w-sm mx-auto w-full">
        {blocks.map(block => {
          const meta = BLOCK_TYPES.find(b => b.type === block.type) || BLOCK_TYPES[2];
          return (
            <button
              key={block.id}
              onClick={() => handleMineBlock(block)}
              className={`h-20 rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all active:scale-90 hover:brightness-110 shadow-lg ${meta.color} text-slate-900 font-black relative overflow-hidden`}
            >
              {block.type === 'diamond' && <Gem className="w-7 h-7 text-white drop-shadow" />}
              {block.type === 'creeper' && <span className="text-2xl">💣</span>}
              {(block.type === 'gold' || block.type === 'iron' || block.type === 'stone') && <Box className="w-7 h-7 text-slate-900 drop-shadow" />}
              
              <span className="text-[10px] mt-1 text-slate-900 uppercase font-black">
                {block.type === 'creeper' ? 'НЕ ТРОГАЙ!' : `КЛИК: ${block.clicksRemaining}`}
              </span>

              {/* Progress crack bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
                <div 
                  className="h-full bg-white transition-all"
                  style={{ width: `${((block.maxClicks - block.clicksRemaining + 1) / block.maxClicks) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 text-[11px] text-center text-slate-400 font-mono">
        Стример крафтит алмазную броню в прямом эфире!
      </div>
    </div>
  );
};

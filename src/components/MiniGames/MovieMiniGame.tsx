import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Film, Popcorn, Flame, Heart, MessageSquare, Volume2, Sparkles, Award } from 'lucide-react';
import { MOVIE_CATALOG } from '../../data/gameData';
import { MovieItem } from '../../types/game';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (pts: number) => void;
  onMiss: () => void;
  active: boolean;
}

export const MovieMiniGame: React.FC<Props> = ({ onScore, onMiss, active }) => {
  const [selectedMovieIndex, setSelectedMovieIndex] = useState(0);
  const [movieProgressSec, setMovieProgressSec] = useState(120);
  const [isPlaying, setIsPlaying] = useState(true);
  const [popcornCount, setPopcornCount] = useState(10);
  
  // Quick time event (QTE) for iconic scene reaction
  const [activeQte, setActiveQte] = useState<{
    prompt: string;
    action: string;
    timeLeft: number;
    points: number;
  } | null>(null);

  const [lastReactionText, setLastReactionText] = useState<string | null>(null);

  const movie = MOVIE_CATALOG[selectedMovieIndex] || MOVIE_CATALOG[0];

  // Movie playback loop
  useEffect(() => {
    if (!active || !isPlaying) return;

    const timer = setInterval(() => {
      setMovieProgressSec(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [active, isPlaying]);

  // QTE Scene Trigger loop
  useEffect(() => {
    if (!active || !isPlaying) return;

    const qteInterval = setInterval(() => {
      if (activeQte) return;

      const QTE_EVENTS = [
        { prompt: '🔥 КУЛЬТОВЫЙ МОМЕНТ!', action: 'ОТРЕАГИРОВАТЬ!', points: 35 },
        { prompt: '😭 ГРУСТНАЯ СЦЕНА С МУЗЫКОЙ!', action: 'ПУСТИТЬ СЛЕЗУ!', points: 40 },
        { prompt: '😂 РАЗРЫВНОЙ МЕМ В КАДРЕ!', action: 'ЗАРЖАТЬ В ГОЛОС!', points: 30 },
        { prompt: '😱 СКРИМЕР ИЛИ НЕОЖИДАННЫЙ ПОВОРОТ!', action: 'ИСПУГАТЬСЯ!', points: 45 }
      ];

      const pick = QTE_EVENTS[Math.floor(Math.random() * QTE_EVENTS.length)];
      setActiveQte({ ...pick, timeLeft: 4 });
      sound.playCoins();
    }, 9000);

    return () => clearInterval(qteInterval);
  }, [active, isPlaying, activeQte]);

  // QTE Countdown timer
  useEffect(() => {
    if (!activeQte) return;

    const countdown = setInterval(() => {
      setActiveQte(curr => {
        if (!curr) return null;
        if (curr.timeLeft <= 1) {
          sound.playMiniGameMiss();
          onMiss();
          setLastReactionText('⚠️ Пропустил культовую сцену! Чат недоволен!');
          setTimeout(() => setLastReactionText(null), 2500);
          return null;
        }
        return { ...curr, timeLeft: curr.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [activeQte, onMiss]);

  const handleQteClick = () => {
    if (!activeQte) return;
    sound.playLevelUp();
    onScore(activeQte.points);
    setLastReactionText(`✨ ИДЕАЛЬНАЯ РЕАКЦИЯ! Чат в восторге (+${activeQte.points} очков)!`);
    setActiveQte(null);
    setTimeout(() => setLastReactionText(null), 2500);
  };

  const handlePopcorn = () => {
    if (!active) return;
    sound.playClick();
    setPopcornCount(p => p + 1);
    onScore(12);
    setLastReactionText('🍿 Похрустел попкорном под хорошую сцену! (+12)');
    setTimeout(() => setLastReactionText(null), 2000);
  };

  const handleLaugh = () => {
    if (!active) return;
    sound.playClick();
    onScore(18);
    setLastReactionText('🤣 Посмеялся над шуткой с чатом! (+18)');
    setTimeout(() => setLastReactionText(null), 2000);
  };

  const handleCry = () => {
    if (!active) return;
    sound.playClick();
    onScore(22);
    setLastReactionText('🥺 Пустил скупую мужскую слезу! Чат спамит сердечки (+22)');
    setTimeout(() => setLastReactionText(null), 2000);
  };

  const formatSec = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full h-full bg-slate-950 flex flex-col justify-between p-4 overflow-hidden select-none">
      {/* Background cinematic lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/80 to-purple-950/30 pointer-events-none" />

      {/* Top Bar: Film Selector and Info */}
      <div className="relative z-10 flex items-center justify-between gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-purple-500/30">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{movie.posterEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{movie.title}</h4>
              <span className="text-[10px] bg-purple-950 text-purple-300 font-mono px-2 py-0.5 rounded-full border border-purple-500/30">
                {movie.genreName}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">«{movie.quote}»</p>
          </div>
        </div>

        {/* Change film selector */}
        <div className="flex items-center gap-1.5">
          {MOVIE_CATALOG.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                sound.playClick();
                setSelectedMovieIndex(idx);
                setMovieProgressSec(Math.floor(Math.random() * 600) + 60);
              }}
              title={m.title}
              className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all cursor-pointer ${
                selectedMovieIndex === idx
                  ? 'bg-purple-600 scale-110 shadow-[0_0_10px_rgba(168,85,247,0.8)] border border-white'
                  : 'bg-slate-800/80 hover:bg-slate-700 opacity-60'
              }`}
            >
              {m.posterEmoji}
            </button>
          ))}
        </div>
      </div>

      {/* Center Screen: Movie Screenplay Display with Subtitles */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-3 text-center px-4">
        {/* Active QTE Banner if available */}
        {activeQte ? (
          <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 p-4 rounded-2xl border-2 border-yellow-300 shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse flex flex-col items-center gap-2">
            <span className="text-xs font-black text-white font-mono uppercase tracking-wider">
              {activeQte.prompt}
            </span>
            <button
              onClick={handleQteClick}
              className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Flame className="w-5 h-5 fill-slate-950 animate-bounce" />
              {activeQte.action} ({activeQte.timeLeft}с)
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-purple-950/40 border-2 border-purple-500/40 flex items-center justify-center text-5xl shadow-[0_0_25px_rgba(168,85,247,0.3)]">
              {movie.posterEmoji}
            </div>
            <div className="max-w-md bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800">
              <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider block mb-1">
                СУБТИТРЫ ФИЛЬМА ДЛЯ ЧАТА
              </span>
              <p className="text-xs text-white font-semibold italic">
                «{movie.quote}»
              </p>
            </div>
            {lastReactionText && (
              <span className="text-xs font-bold text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-500/40 animate-bounce">
                {lastReactionText}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls: Film Progress Bar & Interactive Reaction Buttons */}
      <div className="relative z-10 flex flex-col gap-2.5 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-slate-800">
        {/* Progress time */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-white hover:text-purple-400 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span>{formatSec(movieProgressSec)}</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ width: `${Math.min(100, (movieProgressSec / (movie.durationMinutes * 60)) * 100)}%` }}
            />
          </div>
          <span>{movie.durationMinutes}:00</span>
        </div>

        {/* Reaction Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-xs">
          <button
            onClick={handlePopcorn}
            className="py-1.5 px-2 rounded-lg bg-amber-950/70 hover:bg-amber-900 border border-amber-500/40 text-amber-300 font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Popcorn className="w-3.5 h-3.5" />
            <span>Попкорн ({popcornCount})</span>
          </button>

          <button
            onClick={handleLaugh}
            className="py-1.5 px-2 rounded-lg bg-yellow-950/70 hover:bg-yellow-900 border border-yellow-500/40 text-yellow-300 font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🤣</span>
            <span>Посмеяться</span>
          </button>

          <button
            onClick={handleCry}
            className="py-1.5 px-2 rounded-lg bg-pink-950/70 hover:bg-pink-900 border border-pink-500/40 text-pink-300 font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5 fill-pink-500" />
            <span>Слеза</span>
          </button>

          <button
            onClick={() => {
              sound.playLevelUp();
              onScore(25);
              setLastReactionText('🍕 Пицца доставлена на стрим! Чат пускает слюнки (+25)!');
              setTimeout(() => setLastReactionText(null), 2000);
            }}
            className="hidden sm:flex py-1.5 px-2 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold transition-all active:scale-95 items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🍕</span>
            <span>Заказать пиццу</span>
          </button>
        </div>
      </div>
    </div>
  );
};

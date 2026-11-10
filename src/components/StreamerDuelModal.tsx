import React, { useState, useEffect, useRef } from 'react';
import { Swords, X, Trophy, AlertTriangle, Flame, Shield, Users, Sparkles, CheckCircle2 } from 'lucide-react';
import { FAMOUS_STREAMERS } from '../data/gameData';
import { StreamerDuelOpponent, PlayerStats } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  playerStats: PlayerStats;
  onWinDuel: (subsWon: number, opponentName: string, message: string) => void;
  onLoseDuel: (subsLost: number, opponentName: string, message: string) => void;
}

type DuelStage = 'select' | 'countdown' | 'action' | 'result';

export const StreamerDuelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  playerStats,
  onWinDuel,
  onLoseDuel
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState<StreamerDuelOpponent>(FAMOUS_STREAMERS[0]);
  const [selectedSubsBet, setSelectedSubsBet] = useState<number>(25);
  const [stage, setStage] = useState<DuelStage>('select');
  const [countdownNum, setCountdownNum] = useState(3);
  const [playerReactionMs, setPlayerReactionMs] = useState<number | null>(null);
  const [opponentReactionMs, setOpponentReactionMs] = useState<number | null>(null);
  const [duelWon, setDuelWon] = useState(false);
  const [resultQuote, setResultQuote] = useState('');
  const [earlyWarning, setEarlyWarning] = useState<string | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);

  const startTimeRef = useRef<number>(0);
  const falseStartRef = useRef<boolean>(false);
  const earlyClicksRef = useRef<number>(0);

  useEffect(() => {
    if (isOpen) {
      setStage('select');
      setSelectedOpponent(FAMOUS_STREAMERS[0]);
      setSelectedSubsBet(FAMOUS_STREAMERS[0].suggestedSubs[0] || 25);
      setPlayerReactionMs(null);
      setOpponentReactionMs(null);
      falseStartRef.current = false;
      earlyClicksRef.current = 0;
      setEarlyWarning(null);
      setIsPracticeMode(false);
    }
  }, [isOpen]);

  // Handle countdown
  useEffect(() => {
    if (stage !== 'countdown') return;

    setCountdownNum(3);
    setEarlyWarning(null);
    earlyClicksRef.current = 0;

    const interval = setInterval(() => {
      setCountdownNum(c => {
        if (c <= 1) {
          clearInterval(interval);
          // Random delay between 700ms and 1500ms before GO!
          const randomDelay = Math.floor(Math.random() * 800) + 700;
          setTimeout(() => {
            setStage('action');
            sound.playPop(); // Auditory GO cue significantly helps reaction!
            startTimeRef.current = Date.now();
          }, randomDelay);
          return 0;
        }
        sound.playClick();
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stage]);

  const handleStartDuel = (practice: boolean = false) => {
    setIsPracticeMode(practice);
    sound.playLevelUp();
    setStage('countdown');
  };

  const handleEarlyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stage !== 'countdown') return;

    sound.playClick();
    earlyClicksRef.current += 1;

    // First early click gives a warning without losing! Much more forgiving!
    if (earlyClicksRef.current < 2) {
      setEarlyWarning('⚠️ Рано! Дождись зеленого сигнала «ЖМИ СКОРЕЕ!»');
      setTimeout(() => setEarlyWarning(null), 1500);
      return;
    }

    // Only multiple premature clicks trigger a false start penalty
    falseStartRef.current = true;
    sound.playDuelLose();
    setDuelWon(false);
    setPlayerReactionMs(999);
    setOpponentReactionMs(selectedOpponent.reactionSpeedMs);
    setResultQuote('ФАЛЬСТАРТ! Ты кликнул слишком рано и проиграл дуэль!');
    setStage('result');
    if (!isPracticeMode) {
      onLoseDuel(selectedSubsBet, selectedOpponent.name, selectedOpponent.dialogueLose);
    }
  };

  const handleReactionClick = () => {
    if (stage !== 'action') return;

    const rawReaction = Date.now() - startTimeRef.current;
    // Fair human reaction measurement
    const reaction = Math.max(80, rawReaction);
    setPlayerReactionMs(reaction);

    // Opponent reaction is now much easier and forgiving:
    // Base speed ~480-560ms + delay buffer of 30-100ms
    const opponentReaction = selectedOpponent.reactionSpeedMs + Math.floor(Math.random() * 80) + 30;
    setOpponentReactionMs(opponentReaction);

    const won = reaction < opponentReaction;
    setDuelWon(won);
    setStage('result');

    if (won) {
      sound.playDuelWin();
      setResultQuote(selectedOpponent.dialogueWin);
      if (!isPracticeMode) {
        onWinDuel(selectedSubsBet, selectedOpponent.name, selectedOpponent.dialogueWin);
      }
    } else {
      sound.playDuelLose();
      setResultQuote(selectedOpponent.dialogueLose);
      if (!isPracticeMode) {
        onLoseDuel(selectedSubsBet, selectedOpponent.name, selectedOpponent.dialogueLose);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.4)] overflow-hidden p-6 text-white">
        {/* Close Button */}
        {stage !== 'countdown' && stage !== 'action' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg">
            ⚔️
          </div>
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>Забив со Стримером (Дуэль на Сабки)</span>
              <span className="text-xs bg-amber-950 text-amber-300 font-mono px-2.5 py-0.5 rounded-full border border-amber-500/40">
                1 на 1
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Брось вызов топовому стримеру! Победишь — заберешь его сабки и рейд. Проиграешь — отдашь свои!
            </p>
          </div>
        </div>

        {/* STAGE 1: Selection */}
        {stage === 'select' && (
          <div className="space-y-5">
            {/* Streamers Grid */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-2">
                Выбери оппонента для забива:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {FAMOUS_STREAMERS.map(opp => {
                  const isSelected = selectedOpponent.id === opp.id;
                  return (
                    <div
                      key={opp.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedOpponent(opp);
                        setSelectedSubsBet(opp.suggestedSubs[0] || 25);
                      }}
                      className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-[1.02]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-3xl">{opp.avatar}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{opp.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {opp.followersCount} фолловеров
                        </span>
                        <span className="text-[10px] text-amber-400 font-mono font-bold">
                          Реакция: ~{opp.reactionSpeedMs}мс
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Opponent Quote Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <span className="text-2xl">{selectedOpponent.avatar}</span>
              <div>
                <span className="text-xs font-black text-amber-400 font-mono block mb-1">
                  {selectedOpponent.name} говорит:
                </span>
                <p className="text-xs text-slate-300 italic">
                  {selectedOpponent.dialogueChallenge}
                </p>
              </div>
            </div>

            {/* Subs Stake / Bet Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-slate-400">
                  Ставка платных подписок (сабок) на кону:
                </label>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Приз победителю: +{selectedSubsBet} сабок (+{(selectedSubsBet * 350).toLocaleString()} ₽)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedOpponent.suggestedSubs.map(subs => {
                  const isBet = selectedSubsBet === subs;
                  return (
                    <button
                      key={subs}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSubsBet(subs);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                        isBet
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg scale-105'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {subs} САБОК
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Easy mode notice badge */}
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300 font-mono">
              <span className="text-base">🟢</span>
              <span><strong>РЕЖИМ ОБЛЕГЧЕН:</strong> Скорость реакции стримеров снижена (~500–560 мс), нажать на зеленый сигнал стало намного проще!</span>
            </div>

            {/* Duel Buttons: Real Bet vs Practice */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => handleStartDuel(false)}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white font-black text-sm shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Swords className="w-5 h-5" />
                НАЧАТЬ ЗАБИВ НА {selectedSubsBet} САБОК!
              </button>

              <button
                onClick={() => handleStartDuel(true)}
                className="py-4 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                title="Потренировать реакцию без риска потерять сабки"
              >
                <span>🎯</span>
                ТРЕНИРОВКА
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: Countdown */}
        {stage === 'countdown' && (
          <div 
            onClick={handleEarlyClick}
            className="flex flex-col items-center justify-center py-16 gap-4 text-center cursor-pointer select-none"
          >
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-black">
              ПРИГОТОВЬСЯ КЛИКАТЬ... (ЖДИ ЗЕЛЕНЫЙ СИГНАЛ!)
            </span>
            <div className="w-32 h-32 rounded-full bg-slate-900 border-4 border-amber-500 flex items-center justify-center text-7xl font-black text-amber-300 animate-ping">
              {countdownNum}
            </div>

            {earlyWarning ? (
              <div className="bg-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-lg animate-bounce">
                {earlyWarning}
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Как только загорится <strong className="text-emerald-400 font-mono">ЖМИ / КЛИК!</strong> — нажми моментально!
              </p>
            )}
          </div>
        )}

        {/* STAGE 3: Action Reaction */}
        {stage === 'action' && (
          <div
            onClick={handleReactionClick}
            className="flex flex-col items-center justify-center py-16 gap-6 text-center cursor-pointer select-none bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-6 shadow-[0_0_40px_rgba(16,185,129,0.9)] animate-pulse"
          >
            <span className="text-4xl">⚡⚡⚡</span>
            <h2 className="text-4xl font-black text-white uppercase tracking-wider drop-shadow-lg">
              ЖМИ СКОРЕЕ! КЛИКАЙ!
            </h2>
            <span className="text-xs font-mono text-emerald-100 font-bold bg-black/30 px-4 py-1.5 rounded-full">
              Кто быстрее нажмет — тот забирает сабки!
            </span>
          </div>
        )}

        {/* STAGE 4: Result */}
        {stage === 'result' && (
          <div className="flex flex-col items-center justify-center py-8 gap-5 text-center">
            <div className="text-6xl animate-bounce">
              {duelWon ? '🏆' : '💀'}
            </div>

            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <h3 className={`text-2xl font-black ${duelWon ? 'text-amber-400' : 'text-rose-400'}`}>
                  {duelWon ? 'ТЫ ПОБЕДИЛ В ДУЭЛИ!' : 'ТЫ ПРОИГРАЛ ЗАБИВ!'}
                </h3>
                {isPracticeMode && (
                  <span className="text-[10px] font-mono bg-cyan-950 border border-cyan-500 text-cyan-300 px-2 py-0.5 rounded-full font-bold">
                    ТРЕНИРОВКА
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isPracticeMode
                  ? duelWon 
                    ? `Отличная скорость! В реальном забиве ты бы забрал +${selectedSubsBet} сабок!`
                    : `Потренируйся еще разок, чтобы обогнать ${selectedOpponent.name}!`
                  : duelWon 
                    ? `Поздравляем! Ты перестрелял ${selectedOpponent.name} и забрал +${selectedSubsBet} сабок!`
                    : `Увы, ${selectedOpponent.name} оказался быстрее. Ты отдаешь ${selectedSubsBet} сабок его чату.`}
              </p>
            </div>

            {/* Reaction Timings */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Твоя скорость:</span>
                <strong className={`text-lg font-black ${duelWon ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {playerReactionMs ? `${playerReactionMs} мс` : 'Фальстарт'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block mb-1">Скорость {selectedOpponent.name}:</span>
                <strong className="text-lg font-black text-amber-400">
                  {opponentReactionMs} мс
                </strong>
              </div>
            </div>

            {/* Streamer Quote Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-md w-full">
              <div className="flex items-center gap-2 justify-center mb-1 text-xs font-black text-purple-400">
                <span>{selectedOpponent.avatar}</span>
                <span>{selectedOpponent.name}:</span>
              </div>
              <p className="text-xs text-slate-300 italic">
                {resultQuote}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono font-bold text-xs transition-all cursor-pointer"
            >
              Вернуться на стрим
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { MessageSquareText, Sparkles, Heart } from 'lucide-react';
import { sound } from '../../utils/sound';

interface Props {
  onScore: (points: number) => void;
  onMiss: () => void;
  active: boolean;
}

interface DialogCard {
  question: string;
  sender: string;
  options: {
    text: string;
    reaction: string;
    points: number;
    hype: string;
  }[];
}

const DIALOGS: DialogCard[] = [
  {
    question: 'Стример, почему ты начал стримить, а не пошел на нормальную работу?',
    sender: 'Любопытный_Зритель',
    options: [
      { text: '«Я хочу дарить людям радость и собрать лучшее комьюнити!»', reaction: 'Чат растроган! ❤️❤️❤️', points: 30, hype: '❤️ Искренность' },
      { text: '«На заводе не разрешают сидеть в пижаме и пить колу!»', reaction: 'Чат: АХАХАХА ЖИЗА 🤣', points: 35, hype: '😂 Юмор' },
      { text: '«Ради донатов на новую видеокарту, очевидно же!»', reaction: 'Чат: Честно, уважаю 💸', points: 25, hype: '🤑 База' }
    ]
  },
  {
    question: 'Какой твой любимый мем 2026 года?',
    sender: 'Memologist_Pro',
    options: [
      { text: '«Нейросеть, которая стримит вместо меня, пока я сплю!»', reaction: 'Чат: ОРУУУ ТАК ТЫ НЕЙРОСЕТЬ?! 🤖', points: 40, hype: '🔥 Разрыв' },
      { text: '«Мем про счета за электричество от майнинга игр!»', reaction: 'Чат: Боль стримера...', points: 25, hype: '⚡ Жиза' },
      { text: '«Все мемы с котиками вне конкуренции!»', reaction: 'Чат: МЯУУУ! +100 умиления 🐱', points: 35, hype: '🐾 Милота' }
    ]
  },
  {
    question: 'Чат спрашивает: сколько часов в день ты спишь?',
    sender: 'Доктор_Здоровье',
    options: [
      { text: '«Сон для слабаков, стример живёт на кофе!»', reaction: 'Чат: Береги себя, дурачок!', points: 20, hype: '☕ Хайп' },
      { text: '«Строго 8 часов и режим, иначе стримы будут кислыми!»', reaction: 'Чат: ЗОЖ стример, красавчик!', points: 35, hype: '💪 Уважение' },
      { text: '«Сплю во время загрузочных экранов в играх»', reaction: 'Чат: Легендарная тактика 😴', points: 30, hype: '✨ Тактика' }
    ]
  },
  {
    question: 'Стример, сделай сигну или покажи кота в камеру!',
    sender: 'SuperFan_Alena',
    options: [
      { text: '«(Беру воображаемого кота и мяукаю в микрофон)»', reaction: 'Чат: ААА КРИНЖ НО ОЧЕНЬ СМЕШНО 😹', points: 45, hype: '🚀 Вирусный клип' },
      { text: '«Показываю фирменное сердечко руками чату!»', reaction: 'Чат: Спам сердечками в чате! 🫶', points: 35, hype: '💖 Любовь' },
      { text: '«Сигна только за донат в 500 рублей, хе-хе»', reaction: 'Чат: Бизнесмен года!', points: 20, hype: '💰 Капитализм' }
    ]
  }
];

export const ChattingMiniGame: React.FC<Props> = ({ onScore, active }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (active) {
      setCurrentIdx(Math.floor(Math.random() * DIALOGS.length));
    }
  }, [active]);

  const handleChoose = (opt: DialogCard['options'][0]) => {
    sound.playMiniGameHit();
    onScore(opt.points);
    setFeedback(`${opt.reaction} (+${opt.points} Hype)`);

    setTimeout(() => {
      setFeedback(null);
      setCurrentIdx(prev => (prev + 1) % DIALOGS.length);
    }, 1200);
  };

  const current = DIALOGS[currentIdx];

  return (
    <div className="relative w-full h-full bg-slate-950 p-4 border-2 border-amber-500/40 rounded-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Background warm lights */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/40 via-purple-950/20 to-black pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between text-xs font-mono bg-slate-900/90 px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300">
        <span className="flex items-center gap-1.5 font-bold">
          <MessageSquareText className="w-4 h-4 text-amber-400" /> JUST CHATTING • РАЗГОВОРЫ ПО ДУШАМ
        </span>
        <span className="text-slate-400">Выбирай лучший ответ для чата!</span>
      </div>

      {/* Question Card */}
      <div className="relative z-10 bg-slate-900/90 border border-amber-500/30 p-3.5 rounded-xl shadow-lg my-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
            Вопрос от @{current.sender}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="text-sm font-semibold text-white pl-1">
          «{current.question}»
        </div>

        {feedback && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-950/80 border border-emerald-500 text-xs text-emerald-300 font-bold animate-pulse flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            {feedback}
          </div>
        )}
      </div>

      {/* Options */}
      <div className="relative z-10 grid grid-cols-1 gap-2 pt-2">
        {current.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoose(opt)}
            disabled={!!feedback}
            className="w-full text-left p-2.5 rounded-lg bg-slate-850 hover:bg-amber-950/50 border border-slate-700 hover:border-amber-400 text-xs text-slate-200 hover:text-white transition-all active:scale-[0.99] flex items-center justify-between gap-3 group"
          >
            <span>{opt.text}</span>
            <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/30 whitespace-nowrap">
              {opt.hype}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

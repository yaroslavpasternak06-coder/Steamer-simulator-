import React from 'react';
import { 
  Bed, Utensils, ShowerHead, Tv, Dumbbell, 
  Sparkles, Coffee, Pizza, Sun, Moon, Zap, Heart
} from 'lucide-react';
import { PlayerStats, HardwareItem } from '../types/game';
import { HARDWARE_CATALOG } from '../data/gameData';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  hardware: HardwareItem[];
  onSleep: () => void;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

export const ApartmentView: React.FC<Props> = ({
  stats,
  hardware,
  onSleep,
  onUpdateStats,
  onAddToast
}) => {
  // Eat meal
  const handleEat = (mealName: string, cost: number, hungerBonus: number, moodBonus: number) => {
    if (stats.money < cost) {
      onAddToast('Недостаточно денег!', `Нужно ${cost} ₽, чтобы заказать «${mealName}». Сходи на работу!`, 'warning');
      return;
    }
    sound.playCoins();
    onUpdateStats(p => ({
      ...p,
      money: p.money - cost,
      hunger: Math.min(100, p.hunger + hungerBonus),
      mood: Math.min(100, p.mood + moodBonus)
    }));
    onAddToast('Приятного аппетита!', `Вы съели «${mealName}» (+${hungerBonus}% сытости).`, 'success');
  };

  // Shower
  const handleShower = (type: 'quick' | 'bath') => {
    sound.playClick();
    if (type === 'quick') {
      onUpdateStats(p => ({
        ...p,
        hygiene: Math.min(100, p.hygiene + 50),
        mood: Math.min(100, p.mood + 10)
      }));
      onAddToast('Свежесть!', 'Быстрый душ освежил мысли и смыл усталость (+50% гигиены).', 'info');
    } else {
      if (stats.energy < 10) {
        onAddToast('Слишком устал!', 'Даже в ванне нет сил лежать, лучше поспать.', 'warning');
        return;
      }
      onUpdateStats(p => ({
        ...p,
        hygiene: 100,
        mood: Math.min(100, p.mood + 30),
        energy: Math.max(0, p.energy - 10)
      }));
      onAddToast('Полный релакс!', 'Горячая пена и отдых восстановили настроение (+100% гигиены).', 'success');
    }
  };

  // Leisure / Memes
  const handleWatchMemes = () => {
    if (stats.energy < 8) {
      onAddToast('Глаза слипаются!', 'Ты слишком устал, чтобы смотреть мемы. Пора спать!', 'warning');
      return;
    }
    sound.playClick();
    onUpdateStats(p => ({
      ...p,
      mood: Math.min(100, p.mood + 25),
      energy: Math.max(0, p.energy - 8),
      hour: (p.hour + 1) % 24
    }));
    onAddToast('Порция мемов!', 'Посмотрел нарезки стримов и посмеялся (+25% настроения).', 'info');
  };

  // Exercise
  const handleWorkout = () => {
    if (stats.energy < 20) {
      onAddToast('Нет сил на спорт!', 'Для разминки нужно хотя бы 20 энергии.', 'warning');
      return;
    }
    sound.playLevelUp();
    onUpdateStats(p => ({
      ...p,
      energy: Math.max(0, p.energy - 18),
      hygiene: Math.max(0, p.hygiene - 25),
      mood: Math.min(100, p.mood + 15),
      hunger: Math.max(0, p.hunger - 15)
    }));
    onAddToast('Бодрость духа!', 'Отжимания и турник прогнали сонливость и подняли тонус!', 'success');
  };

  const equippedPc = hardware.find(h => h.category === 'pc') || HARDWARE_CATALOG.find(h => h.id === 'pc_0');
  const equippedChair = hardware.find(h => h.category === 'chair') || HARDWARE_CATALOG.find(h => h.id === 'chair_0');

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Apartment Header Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Bed className="w-4 h-4" /> Уютная Съемная Квартира
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Личная жизнь и быт стримера
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Следи за здоровьем, вовремя спи, вкусно кушай и расслабляйся после длинных стримов и тяжелых рабочих смен!
            </p>
          </div>

          {/* Sleep / Next Day Button */}
          <button
            onClick={onSleep}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Moon className="w-5 h-5 text-amber-300" />
            ЛЕЧЬ СПАТЬ (СЛЕДУЮЩИЙ ДЕНЬ)
          </button>
        </div>
      </div>

      {/* Apartment Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Bedroom & Rest Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase mb-2">
              <Bed className="w-4 h-4 text-indigo-400" /> Спальня
            </div>
            <h3 className="text-lg font-bold text-white">Кровать и сон</h3>
            <p className="text-xs text-slate-400 mt-1">
              Полноценный сон восстанавливает 100% энергии, переводит стрелки часов на 08:00 утра и начисляет ежедневные бонусы с видеороликов!
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              onClick={onSleep}
              className="w-full py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <Moon className="w-4 h-4 text-amber-300" /> Спать до утра (Энергия 100%)
            </button>
          </div>
        </div>

        {/* Kitchen & Food Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-2">
              <Utensils className="w-4 h-4 text-amber-400" /> Кухня и Холодильник
            </div>
            <h3 className="text-lg font-bold text-white">Питание</h3>
            <p className="text-xs text-slate-400 mt-1">
              Голодный стример теряет концентрацию, а зрители замечают ворчание в микрофон.
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => handleEat('Доширак с сосиской', 60, 35, 5)}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs flex items-center justify-between text-slate-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🍜</span>
                <span>Доширак с сосиской</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">60 ₽ (+35% сытости)</span>
            </button>

            <button
              onClick={() => handleEat('Большая пицца «Пепперони»', 650, 75, 25)}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs flex items-center justify-between text-slate-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🍕</span>
                <span>Пицца «Пепперони»</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">650 ₽ (+75% сытости)</span>
            </button>

            <button
              onClick={() => handleEat('Стейк из лосося и салат', 1400, 100, 45)}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs flex items-center justify-between text-slate-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🥗</span>
                <span>Ресторанный ужин</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">1400 ₽ (+100%)</span>
            </button>
          </div>
        </div>

        {/* Bathroom & Hygiene */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase mb-2">
              <ShowerHead className="w-4 h-4 text-cyan-400" /> Ванная комната
            </div>
            <h3 className="text-lg font-bold text-white">Гигиена и чистота</h3>
            <p className="text-xs text-slate-400 mt-1">
              На веб-камере приятно видеть ухоженного и свежего ведущего трансляции!
            </p>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => handleShower('quick')}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs flex items-center justify-between text-slate-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShowerHead className="w-4 h-4 text-cyan-400" />
                <span>Быстрый бодрящий душ</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">Бесплатно (+50%)</span>
            </button>

            <button
              onClick={() => handleShower('bath')}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs flex items-center justify-between text-slate-200 transition-all cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>🛁</span>
                <span>Горячая ванна с пеной</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold">+100% гигиены</span>
            </button>
          </div>
        </div>

        {/* Leisure & Entertainment */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-pink-400 font-mono text-xs font-bold uppercase mb-2">
              <Tv className="w-4 h-4 text-pink-400" /> Зона отдыха
            </div>
            <h3 className="text-lg font-bold text-white">Развлечения и мемы</h3>
            <p className="text-xs text-slate-400 mt-1">
              Смотри смешные ролики конкурентов, изучай тренды соцсетей и поднимай настроение.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleWatchMemes}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono font-bold text-pink-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Tv className="w-4 h-4" /> Глянуть мемы 1 час (+25% настроения)
            </button>
          </div>
        </div>

        {/* Home Workout */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase mb-2">
              <Dumbbell className="w-4 h-4 text-emerald-400" /> Спортивный уголок
            </div>
            <h3 className="text-lg font-bold text-white">Зарядка и турник</h3>
            <p className="text-xs text-slate-400 mt-1">
              Сидячий образ жизни за ПК вредит спине. Размяться между стримами — отличное решение!
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={handleWorkout}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono font-bold text-emerald-300 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Dumbbell className="w-4 h-4" /> Размять спину и отжаться
            </button>
          </div>
        </div>

        {/* Current Stream Corner Overview */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" /> Рабочее место
            </div>
            <h3 className="text-lg font-bold text-white">Стримерский сетап</h3>
            <p className="text-xs text-slate-400 mt-1">
              Текущий ПК: <strong className="text-white">{equippedPc?.name || 'ПК'}</strong>. Кресло: <strong className="text-white">{equippedChair?.name || 'Кресло'}</strong>.
            </p>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200">
            💡 Улучшай микрофон, свет и видеокарту во вкладке «Магазин», чтобы привлекать тысячи новых зрителей!
          </div>
        </div>
      </div>
    </div>
  );
};

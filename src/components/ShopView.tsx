import React, { useState } from 'react';
import { 
  Monitor, Cpu, Mic, Video, Sparkles, Armchair, 
  Wifi, CheckCircle2, ShoppingCart, Zap, TrendingUp, ShieldCheck
} from 'lucide-react';
import { PlayerStats, HardwareItem, HardwareCategory } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  hardware: HardwareItem[];
  equippedIds: string[];
  onBuyHardware: (item: HardwareItem) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

const CATEGORY_TABS: { id: HardwareCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'pc', label: 'Компьютеры и Видеокарты', icon: Cpu },
  { id: 'mic', label: 'Микрофоны и Звук', icon: Mic },
  { id: 'camera', label: 'Веб-камеры и 4K', icon: Video },
  { id: 'light', label: 'Студийный свет и RGB', icon: Sparkles },
  { id: 'chair', label: 'Кресла и Комфорт', icon: Armchair },
  { id: 'internet', label: 'Интернет и Роутеры', icon: Wifi }
];

export const ShopView: React.FC<Props> = ({
  stats,
  hardware,
  equippedIds,
  onBuyHardware,
  onAddToast
}) => {
  const [activeCategory, setActiveCategory] = useState<HardwareCategory>('pc');

  const filteredItems = hardware.filter(h => h.category === activeCategory);

  const handlePurchase = (item: HardwareItem) => {
    if (stats.money < item.price) {
      onAddToast('Недостаточно денег!', `Нужно ${item.price.toLocaleString()} ₽ на «${item.name}». Сходи на работу или проведи стрим!`, 'warning');
      return;
    }

    sound.playCoins();
    onBuyHardware(item);
    onAddToast(
      'Покупка совершена!',
      `Вы приобрели «${item.name}»! Качество стрима выросло на +${item.qualityBonus}%. Зрители в восторге!`,
      'success'
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Shop Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShoppingCart className="w-4 h-4" /> CyberShop: Девайсы и Оборудование
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Прокачка стримерского сетапа
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Покупай мощные видеокарты, студийные микрофоны Shure, 4K камеры и неоновый свет, чтобы собирать стадионы зрителей!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">Баланс кошелька:</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {stats.money.toLocaleString()} ₽
            </span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORY_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(tab.id);
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map(item => {
          const isEquipped = equippedIds.includes(item.id);
          const canAfford = stats.money >= item.price;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isEquipped
                  ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700 uppercase">
                    Tier {item.tier}
                  </span>

                  {isEquipped ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" /> УСТАНОВЛЕНО
                    </span>
                  ) : (
                    <span className="text-base font-black text-amber-400 font-mono">
                      {item.price === 0 ? 'Бесплатно' : `${item.price.toLocaleString()} ₽`}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>

              {/* Stats Buffs */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Качество: +{item.qualityBonus}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Стабильность: +{item.stabilityBonus}%</span>
                  </div>
                </div>

                {!isEquipped && (
                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      canAfford
                        ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white shadow-lg'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {canAfford ? `Купить за ${item.price.toLocaleString()} ₽` : 'Недостаточно денег'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { 
  Radio, Home, Briefcase, ShoppingCart, Users, 
  CreditCard, Globe, Battery, Utensils, Smile, 
  ShowerHead, DollarSign, Heart, Volume2, VolumeX, Sparkles, RefreshCcw,
  Settings, Save
} from 'lucide-react';
import { TabType, PlayerStats, ProfileSettings } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  stats: PlayerStats;
  profile: ProfileSettings;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetGame: () => void;
  onSaveGame: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  stats,
  profile,
  soundEnabled,
  onToggleSound,
  onResetGame,
  onSaveGame
}) => {
  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'stream', label: 'Стрим', icon: Radio },
    { id: 'apartment', label: 'Квартира', icon: Home },
    { id: 'job', label: 'Работа', icon: Briefcase },
    { id: 'setup', label: 'Магазин ПК', icon: ShoppingCart },
    { id: 'team', label: 'Команда', icon: Users },
    { id: 'bills', label: 'Счета и Спонсоры', icon: CreditCard },
    { id: 'social', label: 'Соцсети', icon: Globe },
    { id: 'profile', label: 'Настройки', icon: Settings }
  ];

  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 border-b border-purple-500/20 backdrop-blur-md">
      {/* Top Vital Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 text-xs font-mono">
        {/* Left: Money & Calendar */}
        <div className="flex items-center gap-4">
          {/* Money */}
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg text-emerald-400 font-black text-sm shadow-sm">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>{stats.money.toLocaleString()} ₽</span>
          </div>

          {/* Time & Day */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-slate-300">
            <span className="font-bold text-purple-400">ДЕНЬ {stats.day}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-200">{formatHour(stats.hour)}</span>
          </div>

          {/* Followers & Subs */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1 rounded-lg">
            <div className="flex items-center gap-1 text-pink-400 font-bold">
              <Heart className="w-3.5 h-3.5 fill-pink-500" />
              <span>{stats.followers.toLocaleString()}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{stats.subscribers} сабов</span>
            </div>
          </div>

          {/* Streamer Profile Mini Badge */}
          <button
            onClick={() => {
              sound.playClick();
              onTabChange('profile');
            }}
            className="hidden lg:flex items-center gap-1.5 bg-purple-950/40 border border-purple-500/30 px-2.5 py-1 rounded-lg text-purple-200 hover:border-purple-400 transition-colors cursor-pointer"
            title="Перейти в настройки профиля"
          >
            <span className="text-sm">{profile.avatar}</span>
            <span className="font-bold text-white max-w-[110px] truncate">{profile.nickname}</span>
          </button>
        </div>

        {/* Center/Right: Needs Meters (Energy, Hunger, Mood, Hygiene) */}
        <div className="flex items-center gap-3">
          {/* Energy */}
          <div className="flex items-center gap-1.5" title={`Энергия: ${stats.energy}%`}>
            <Battery className={`w-3.5 h-3.5 ${stats.energy < 25 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`} />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${stats.energy < 25 ? 'bg-rose-500' : 'bg-amber-400'}`}
                style={{ width: `${stats.energy}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{stats.energy}%</span>
          </div>

          {/* Hunger */}
          <div className="flex items-center gap-1.5" title={`Сытость: ${stats.hunger}%`}>
            <Utensils className={`w-3.5 h-3.5 ${stats.hunger < 25 ? 'text-rose-500 animate-pulse' : 'text-orange-400'}`} />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${stats.hunger < 25 ? 'bg-rose-500' : 'bg-orange-400'}`}
                style={{ width: `${stats.hunger}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{stats.hunger}%</span>
          </div>

          {/* Mood */}
          <div className="flex items-center gap-1.5" title={`Настроение: ${stats.mood}%`}>
            <Smile className={`w-3.5 h-3.5 ${stats.mood < 25 ? 'text-rose-500 animate-pulse' : 'text-cyan-400'}`} />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${stats.mood < 25 ? 'bg-rose-500' : 'bg-cyan-400'}`}
                style={{ width: `${stats.mood}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{stats.mood}%</span>
          </div>

          {/* Hygiene */}
          <div className="flex items-center gap-1.5" title={`Гигиена: ${stats.hygiene}%`}>
            <ShowerHead className={`w-3.5 h-3.5 ${stats.hygiene < 25 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all ${stats.hygiene < 25 ? 'bg-rose-500' : 'bg-emerald-400'}`}
                style={{ width: `${stats.hygiene}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400">{stats.hygiene}%</span>
          </div>

          {/* Quick Save button */}
          <button
            onClick={() => {
              sound.playLevelUp();
              onSaveGame();
            }}
            title="Быстро сохранить прогресс"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Сохранить</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Выключить звук' : 'Включить звук'}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-purple-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          </button>

          {/* Reset Game button */}
          <button
            onClick={onResetGame}
            title="Начать игру заново"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer border border-slate-800"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onTabChange(tab.id);
              }}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { 
  User, Twitch, MessageCircle, Save, CheckCircle2, 
  Target, Sparkles, Sliders, Shield, Download, Upload, RefreshCw
} from 'lucide-react';
import { PlayerStats, ProfileSettings, DonationGoal } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  profile: ProfileSettings;
  donationGoal: DonationGoal;
  onUpdateProfile: (profile: ProfileSettings) => void;
  onUpdateDonationGoal: (goal: DonationGoal) => void;
  onSaveGame: () => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

const AVATAR_OPTIONS = ['😎', '🎮', '🚀', '👑', '🐱', '🦊', '⚡', '🎧', '👾', '🔥'];

export const ProfileSettingsView: React.FC<Props> = ({
  stats,
  profile,
  donationGoal,
  onUpdateProfile,
  onUpdateDonationGoal,
  onSaveGame,
  onAddToast
}) => {
  const [formData, setFormData] = useState<ProfileSettings>({ ...profile });
  const [goalData, setGoalData] = useState<DonationGoal>({ ...donationGoal });
  const [lastSavedTime, setLastSavedTime] = useState<string>('Только что');
  const [justSaved, setJustSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLevelUp();
    onUpdateProfile(formData);
    onUpdateDonationGoal(goalData);
    onSaveGame();
    setJustSaved(true);
    setLastSavedTime(new Date().toLocaleTimeString());
    onAddToast('Настройки сохранены!', 'Профиль и цель сбора донатов успешно обновлены!', 'success');
    setTimeout(() => setJustSaved(false), 2500);
  };

  const handleManualSave = () => {
    sound.playLevelUp();
    onSaveGame();
    setJustSaved(true);
    setLastSavedTime(new Date().toLocaleTimeString());
    onAddToast('Прогресс сохранен!', `Игра сохранена в памяти устройства в ${new Date().toLocaleTimeString()}`, 'success');
    setTimeout(() => setJustSaved(false), 2500);
  };

  // Export save JSON
  const handleExportSave = () => {
    try {
      const data = localStorage.getItem('streamer_sim_v1_save');
      if (!data) return;
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `streamer_save_${formData.nickname || 'save'}.json`;
      a.click();
      URL.revokeObjectURL(url);
      sound.playCoins();
      onAddToast('Экспорт сейва', 'Файл сохранения успешно скачан на устройство!', 'info');
    } catch (e) {
      console.error(e);
    }
  };

  const percentGoal = Math.min(100, Math.round((goalData.current / (goalData.target || 1)) * 100));

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/40 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" /> Настройки Профиля и Канала
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Брендинг Стримера и Цели Сборов
            </h2>
            <p className="text-sm text-slate-300 mt-1">
              Настрой имя канала, никнейм в соцсетях, аватарку и сбор на мечту прямо на стриме!
            </p>
          </div>

          {/* Quick Manual Save Button */}
          <button
            onClick={handleManualSave}
            className={`px-5 py-3 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 flex items-center gap-2 shadow-lg cursor-pointer ${
              justSaved
                ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
            }`}
          >
            {justSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {justSaved ? 'СОХРАНЕНО!' : 'СОХРАНИТЬ ПРОГРЕСС'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Identity Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 font-mono uppercase flex items-center gap-2">
            <User className="w-4 h-4 text-purple-400" /> Основные данные профиля:
          </h3>

          {/* Avatar Picker */}
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-2">Аватар стримера в кадре:</label>
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {AVATAR_OPTIONS.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => {
                    sound.playClick();
                    setFormData(prev => ({ ...prev, avatar: emoji }));
                  }}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
                    formData.avatar === emoji
                      ? 'bg-purple-600 border-2 border-white scale-110 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'bg-slate-800 hover:bg-slate-750 border border-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Никнейм стримера:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  placeholder="Например: CyberHero"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Название канала Твич / StreamHub:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.twitchChannelName}
                  onChange={(e) => setFormData({ ...formData, twitchChannelName: e.target.value })}
                  placeholder="twitch.tv/CyberHero_Live"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Профиль Твиттер / Vitter (@хэндл):</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                  placeholder="@cyber_hero"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Описание профиля / Био канала:</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Стримлю шутеры и хорроры каждый день!"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Donation Goal Settings Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-300 font-mono uppercase flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" /> Настройка сбора на донаты (Donation Goal):
            </h3>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {percentGoal}% собрано
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Этот сбор отображается прямо поверх стрима. Каждый донат от зрителей автоматически пополняет шкалу!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">На что копим (текст цели):</label>
              <input
                type="text"
                value={goalData.title}
                onChange={(e) => setGoalData({ ...goalData, title: e.target.value })}
                placeholder="Например: На видеокарту RTX 5090"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">Целевая сумма сбора (₽):</label>
              <input
                type="number"
                min="100"
                step="100"
                value={goalData.target}
                onChange={(e) => setGoalData({ ...goalData, target: Math.max(100, Number(e.target.value)) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>
          </div>

          {/* Goal Preview Widget */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="text-white font-bold flex items-center gap-1.5">
                <span>🎯</span> {goalData.title || 'Сбор средств'}
              </span>
              <span className="text-amber-400 font-black">
                {goalData.current.toLocaleString()} / {goalData.target.toLocaleString()} ₽ ({percentGoal}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all duration-300"
                style={{ width: `${percentGoal}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
            <span>Последнее сохранение: {lastSavedTime}</span>
            <button
              type="button"
              onClick={handleExportSave}
              className="text-purple-400 hover:text-purple-300 underline flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Скачать сейв (.json)
            </button>
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            СОХРАНИТЬ ВСЕ ИЗМЕНЕНИЯ
          </button>
        </div>
      </form>
    </div>
  );
};

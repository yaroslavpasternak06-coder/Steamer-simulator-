/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  TabType, PlayerStats, StreamGame, DayJob, HardwareItem, 
  TeamMember, SponsorContract, BillItem, NotificationToast,
  ProfileSettings, DonationGoal
} from './types/game';
import { 
  INITIAL_GAMES, INITIAL_JOBS, HARDWARE_CATALOG, 
  INITIAL_TEAM, INITIAL_SPONSORS, INITIAL_BILLS 
} from './data/gameData';
import { Navbar } from './components/Navbar';
import { StreamView } from './components/StreamView';
import { ApartmentView } from './components/ApartmentView';
import { JobView } from './components/JobView';
import { ShopView } from './components/ShopView';
import { TeamView } from './components/TeamView';
import { BillsView } from './components/BillsView';
import { SocialView } from './components/SocialView';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { sound } from './utils/sound';
import { 
  Trophy, Sparkles, CheckCircle2, AlertTriangle, 
  DollarSign, Users, ShieldAlert, X, Radio
} from 'lucide-react';

const STORAGE_KEY = 'streamer_sim_v1_save';

const DEFAULT_PLAYER_STATS: PlayerStats = {
  energy: 100,
  hunger: 80,
  mood: 75,
  hygiene: 90,
  money: 5500, // Starts with some cash for initial food/bills
  day: 1,
  hour: 10,
  followers: 24,
  subscribers: 0,
  hype: 50,
  reputation: 60,
  totalStreams: 0,
  totalDonationsEarned: 0,
  totalHoursStreamed: 0,
  currentJobId: 'courier',
  isFullTimeStreamer: false
};

const DEFAULT_PROFILE: ProfileSettings = {
  nickname: 'CyberHero',
  twitchChannelName: 'twitch.tv/CyberHero_Live',
  twitterHandle: '@cyber_hero',
  bio: 'Стримлю шутеры и хорроры каждый вечер в 18:00!',
  avatar: '🎮'
};

const DEFAULT_DONATION_GOAL: DonationGoal = {
  title: 'На видеокарту RTX 5090',
  target: 50000,
  current: 4500
};

interface StreamSummaryData {
  durationMinutes: number;
  earnedMoney: number;
  gainedFollowers: number;
  gainedSubs: number;
  peakViewers: number;
  bannedToxics: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('stream');
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.stats || DEFAULT_PLAYER_STATS;
      }
    } catch {
      // fallback
    }
    return DEFAULT_PLAYER_STATS;
  });

  const [games, setGames] = useState<StreamGame[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.games && Array.isArray(parsed.games)) {
          const savedMap = new Map<string, StreamGame>(parsed.games.map((g: StreamGame) => [g.id, g]));
          return INITIAL_GAMES.map(ig => (savedMap.get(ig.id) as StreamGame) || ig);
        }
      }
    } catch {}
    return INITIAL_GAMES;
  });

  const [equippedHardwareIds, setEquippedHardwareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.equippedHardwareIds) return parsed.equippedHardwareIds;
      }
    } catch {}
    return ['pc_0', 'mic_0', 'cam_0', 'light_0', 'chair_0', 'internet_0'];
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.team) return parsed.team;
      }
    } catch {}
    return INITIAL_TEAM;
  });

  const [bills, setBills] = useState<BillItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bills) return parsed.bills;
      }
    } catch {}
    return INITIAL_BILLS;
  });

  const [sponsors, setSponsors] = useState<SponsorContract[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sponsors) return parsed.sponsors;
      }
    } catch {}
    return INITIAL_SPONSORS;
  });

  const [profile, setProfile] = useState<ProfileSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) return parsed.profile;
      }
    } catch {}
    return DEFAULT_PROFILE;
  });

  const [donationGoal, setDonationGoal] = useState<DonationGoal>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.donationGoal) return parsed.donationGoal;
      }
    } catch {}
    return DEFAULT_DONATION_GOAL;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [streamSummary, setStreamSummary] = useState<StreamSummaryData | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      const payload = {
        stats,
        games,
        equippedHardwareIds,
        team,
        bills,
        sponsors,
        profile,
        donationGoal
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [stats, games, equippedHardwareIds, team, bills, sponsors, profile, donationGoal]);

  // Toast Helper
  const addToast = useCallback((title: string, message: string, type: NotificationToast['type']) => {
    const newToast: NotificationToast = {
      id: `toast_${Date.now()}_${Math.random()}`,
      title,
      message,
      type
    };
    setToasts(prev => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  }, []);

  // Sleep & Next Day Handler
  const handleSleep = () => {
    sound.playLevelUp();

    // 1. Calculate staff daily salaries
    const hired = team.filter(t => t.hired);
    const staffSalaries = hired.reduce((sum, t) => sum + t.salaryDaily, 0);

    // 2. Video Editor passive followers & revenue
    const editor = team.find(t => t.hired && t.role === 'editor');
    const editorFollowers = editor ? Math.floor(editor.passiveViewsDaily * (0.8 + Math.random() * 0.4)) : 0;
    const editorMoney = editor ? Math.floor(editorFollowers * 2.5) : 0;

    // 3. Update player stats
    setStats(prev => {
      const newDay = prev.day + 1;
      const netMoney = prev.money - staffSalaries + editorMoney;

      return {
        ...prev,
        day: newDay,
        hour: 8, // 8:00 AM morning
        energy: 100, // fully rested!
        hunger: Math.max(15, prev.hunger - 30),
        mood: Math.min(100, prev.mood + 15),
        hygiene: Math.max(20, prev.hygiene - 25),
        money: Math.max(0, netMoney),
        followers: prev.followers + editorFollowers
      };
    });

    let sleepSummary = `День ${stats.day + 1} наступил! Энергия 100%.`;
    if (staffSalaries > 0) {
      sleepSummary += ` Выплачено зарплат персоналу: -${staffSalaries} ₽.`;
    }
    if (editorFollowers > 0) {
      sleepSummary += ` Монтажёр Тимур принес +${editorFollowers} фолловеров и +${editorMoney} ₽ с шортсов!`;
    }

    addToast('Доброе утро, стример!', sleepSummary, 'info');
  };

  // Pay single bill
  const handlePayBill = (billId: string) => {
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    setStats(p => ({ ...p, money: p.money - bill.amount }));
    setBills(prev => prev.map(b => b.id === billId ? { ...b, isPaid: true } : b));
  };

  // Pay all bills
  const handlePayAllBills = () => {
    const unpaid = bills.filter(b => !b.isPaid);
    const total = unpaid.reduce((sum, b) => sum + b.amount, 0);
    setStats(p => ({ ...p, money: p.money - total }));
    setBills(prev => prev.map(b => ({ ...b, isPaid: true })));
  };

  // Toggle sponsor contract
  const handleToggleSponsor = (sponsorId: string) => {
    setSponsors(prev => prev.map(s => {
      if (s.id === sponsorId) {
        return { ...s, active: !s.active };
      }
      return { ...s, active: false }; // only 1 sponsor active at a time
    }));
  };

  // Claim sponsor reward
  const handleClaimSponsorReward = (sponsorId: string) => {
    const sp = sponsors.find(s => s.id === sponsorId);
    if (!sp) return;

    sound.playLevelUp();
    setStats(p => ({ ...p, money: p.money + sp.rewardMoney }));
    setSponsors(prev => prev.map(s => s.id === sponsorId ? { ...s, completed: true, active: false } : s));
    addToast('Гонорар получен!', `Бренд «${sp.brand}» перевел ${sp.rewardMoney.toLocaleString()} ₽ за рекламу!`, 'donation');
  };

  // Buy Hardware
  const handleBuyHardware = (item: HardwareItem) => {
    setStats(p => ({ ...p, money: p.money - item.price }));
    setEquippedHardwareIds(prev => {
      // replace previous item of same category
      const others = prev.filter(id => {
        const h = HARDWARE_CATALOG.find(x => x.id === id);
        return h && h.category !== item.category;
      });
      return [...others, item.id];
    });
  };

  // Toggle Hire staff
  const handleToggleHire = (memberId: string) => {
    setTeam(prev => prev.map(m => m.id === memberId ? { ...m, hired: !m.hired } : m));
  };

  // Upgrade Team member
  const handleUpgradeMember = (memberId: string) => {
    const mem = team.find(m => m.id === memberId);
    if (!mem) return;
    const cost = mem.salaryDaily * 4;

    setStats(p => ({ ...p, money: p.money - cost }));
    setTeam(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          level: m.level + 1,
          autoBanChance: Math.min(0.98, m.autoBanChance * 1.15),
          passiveViewsDaily: Math.round(m.passiveViewsDaily * 1.3),
          retentionBonus: Math.round(m.retentionBonus * 1.25),
          salaryDaily: Math.round(m.salaryDaily * 1.2)
        };
      }
      return m;
    }));
  };

  // End Stream Callback
  const handleEndStream = (summary: StreamSummaryData) => {
    setStreamSummary(summary);

    // Track sponsor minutes streamed
    const activeSponsor = sponsors.find(s => s.active && !s.completed);
    if (activeSponsor) {
      setSponsors(prev => prev.map(s => {
        if (s.id === activeSponsor.id) {
          const updatedMin = s.minutesStreamed + summary.durationMinutes;
          return {
            ...s,
            minutesStreamed: updatedMin
          };
        }
        return s;
      }));
    }
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Manual Save
  const handleManualSave = useCallback(() => {
    try {
      const payload = {
        stats,
        games,
        equippedHardwareIds,
        team,
        bills,
        sponsors,
        profile,
        donationGoal
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      addToast('Игра сохранена!', 'Весь игровой прогресс и настройки профиля сохранены!', 'success');
    } catch (e) {
      console.error(e);
    }
  }, [stats, games, equippedHardwareIds, team, bills, sponsors, profile, donationGoal, addToast]);

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('Вы уверены, что хотите сбросить прогресс и начать путь стримера с самого начала?')) {
      localStorage.removeItem(STORAGE_KEY);
      setStats(DEFAULT_PLAYER_STATS);
      setGames(INITIAL_GAMES);
      setEquippedHardwareIds(['pc_0', 'mic_0', 'cam_0', 'light_0', 'chair_0', 'internet_0']);
      setTeam(INITIAL_TEAM);
      setBills(INITIAL_BILLS);
      setSponsors(INITIAL_SPONSORS);
      setProfile(DEFAULT_PROFILE);
      setDonationGoal(DEFAULT_DONATION_GOAL);
      addToast('Игра сброшена', 'Добро пожаловать в начало карьеры стримера!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top HUD & Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        profile={profile}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onResetGame={handleResetGame}
        onSaveGame={handleManualSave}
      />

      {/* Main Game Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-20">
        {activeTab === 'stream' && (
          <StreamView
            stats={stats}
            profile={profile}
            donationGoal={donationGoal}
            onUpdateDonationGoal={setDonationGoal}
            games={games}
            hardware={HARDWARE_CATALOG.filter(h => equippedHardwareIds.includes(h.id))}
            team={team}
            sponsors={sponsors}
            onEndStream={handleEndStream}
            onUpdateStats={setStats}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'apartment' && (
          <ApartmentView
            stats={stats}
            hardware={HARDWARE_CATALOG.filter(h => equippedHardwareIds.includes(h.id))}
            onSleep={handleSleep}
            onUpdateStats={setStats}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'job' && (
          <JobView
            stats={stats}
            jobs={INITIAL_JOBS}
            onUpdateStats={setStats}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'setup' && (
          <ShopView
            stats={stats}
            hardware={HARDWARE_CATALOG}
            equippedIds={equippedHardwareIds}
            onBuyHardware={handleBuyHardware}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'team' && (
          <TeamView
            stats={stats}
            team={team}
            onToggleHire={handleToggleHire}
            onUpgradeMember={handleUpgradeMember}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'bills' && (
          <BillsView
            stats={stats}
            bills={bills}
            sponsors={sponsors}
            onPayBill={handlePayBill}
            onPayAllBills={handlePayAllBills}
            onToggleSponsor={handleToggleSponsor}
            onClaimSponsorReward={handleClaimSponsorReward}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'social' && (
          <SocialView
            stats={stats}
            onUpdateStats={setStats}
            onAddToast={addToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            stats={stats}
            profile={profile}
            donationGoal={donationGoal}
            onUpdateProfile={setProfile}
            onUpdateDonationGoal={setDonationGoal}
            onSaveGame={handleManualSave}
            onAddToast={addToast}
          />
        )}
      </main>

      {/* Stream End Summary Celebration Modal */}
      {streamSummary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border-2 border-purple-500 rounded-3xl p-6 shadow-[0_0_50px_rgba(168,85,247,0.5)] relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setStreamSummary(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 mx-auto flex items-center justify-center text-3xl shadow-lg mb-3">
                🎉
              </div>
              <h3 className="text-2xl font-black text-white">Стрим завершен!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Отличная трансляция! Зрители получили море ярких эмоций!
              </p>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between border border-slate-800">
                <span className="text-slate-400">Длительность:</span>
                <strong className="text-white text-sm">{streamSummary.durationMinutes} мин</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between border border-slate-800">
                <span className="text-slate-400">Пиковый онлайн:</span>
                <strong className="text-cyan-400 text-sm">{streamSummary.peakViewers} зрителей</strong>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                <span className="text-emerald-300">Заработано на донатах:</span>
                <strong className="text-emerald-400 text-base font-black">+{streamSummary.earnedMoney.toLocaleString()} ₽</strong>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 flex items-center justify-between border border-slate-800">
                <span className="text-slate-400">Новые фолловеры:</span>
                <strong className="text-pink-400 text-sm">+{streamSummary.gainedFollowers}</strong>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-center justify-between">
                <span className="text-rose-300">Забанено токсиков в чате:</span>
                <strong className="text-rose-400 text-sm">{streamSummary.bannedToxics} нарушителей 🔨</strong>
              </div>
            </div>

            <button
              onClick={() => setStreamSummary(null)}
              className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Отлично! Перейти к делам
            </button>
          </div>
        </div>
      )}

      {/* Floating Notification Toasts */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-xl border shadow-2xl backdrop-blur-md pointer-events-auto transition-all animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100'
                : toast.type === 'donation'
                ? 'bg-amber-950/95 border-amber-500 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : toast.type === 'warning'
                ? 'bg-amber-950/95 border-amber-500 text-amber-200'
                : toast.type === 'alert'
                ? 'bg-rose-950/95 border-rose-500 text-rose-100'
                : 'bg-slate-900/95 border-purple-500/50 text-slate-100'
            }`}
          >
            <div className="text-xs font-black uppercase font-mono tracking-wider flex items-center gap-1.5">
              {toast.type === 'donation' && '💸'}
              {toast.type === 'success' && '✅'}
              {toast.type === 'warning' && '⚠️'}
              {toast.type === 'alert' && '🚨'}
              {toast.type === 'info' && '💡'}
              {toast.title}
            </div>
            <div className="text-xs mt-1 text-slate-200/90 leading-tight">
              {toast.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

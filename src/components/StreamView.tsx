import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Radio, Users, DollarSign, Heart, ShieldAlert, 
  Sparkles, AlertTriangle, Hammer, Clock, Volume2, 
  VolumeX, CheckCircle2, Play, Square, Award, Swords,
  Film, Tag, Hash, Edit3, Flame, Zap, Calendar, Gift, PlusCircle
} from 'lucide-react';
import { StreamGame, ChatMessage, TeamMember, PlayerStats, ActiveStreamSession, HardwareItem, SponsorContract, ProfileSettings, DonationGoal } from '../types/game';
import { CHAT_POOLS, HARDWARE_CATALOG, STREAM_TAG_PRESETS } from '../data/gameData';
import { sound } from '../utils/sound';
import { ShooterMiniGame } from './MiniGames/ShooterMiniGame';
import { MobaMiniGame } from './MiniGames/MobaMiniGame';
import { ChattingMiniGame } from './MiniGames/ChattingMiniGame';
import { MiningMiniGame } from './MiniGames/MiningMiniGame';
import { HorrorMiniGame } from './MiniGames/HorrorMiniGame';
import { RacerMiniGame } from './MiniGames/RacerMiniGame';
import { MovieMiniGame } from './MiniGames/MovieMiniGame';
import { StreamerDuelModal } from './StreamerDuelModal';

interface Props {
  stats: PlayerStats;
  profile: ProfileSettings;
  donationGoal: DonationGoal;
  onUpdateDonationGoal: (updater: DonationGoal | ((prev: DonationGoal) => DonationGoal)) => void;
  games: StreamGame[];
  hardware: HardwareItem[];
  team: TeamMember[];
  sponsors: SponsorContract[];
  onEndStream: (summary: {
    durationMinutes: number;
    earnedMoney: number;
    gainedFollowers: number;
    gainedSubs: number;
    peakViewers: number;
    bannedToxics: number;
  }) => void;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

const AUTHOR_NAMES = [
  'Danila_Pro', 'Vika_Stream', 'Sasha_Gamer', 'ShadowRider', 'Mister_Cat',
  'PudgeLover', 'CyberNinja', 'NeonGlow', 'Toxa_Master', 'Pixel_Queen',
  'Speedy_Fox', 'Kekis_2026', 'Turbo_Sanya', 'Artyom_K', 'Lera_Play'
];

const TOXIC_AUTHORS = [
  'Hater_99', 'TrollFace_X', 'RageBoi', 'LowSkill_Hunter', 'Dislike_Master',
  'Clown_Alert', 'Salt_Miner', 'Trash_Talker'
];

const SPAM_AUTHORS = [
  'FreeSkins_Bot', 'Promo_Coins_XYZ', 'BestBoost_3000', 'CryptoGod_VIP'
];

export const StreamView: React.FC<Props> = ({
  stats,
  profile,
  donationGoal,
  onUpdateDonationGoal,
  games,
  hardware,
  team,
  sponsors,
  onEndStream,
  onUpdateStats,
  onAddToast
}) => {
  // Is stream live
  const [isLive, setIsLive] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>('just_chatting');

  // Stream Title & Hashtags customization
  const [streamTitle, setStreamTitle] = useState('Уютный стрим | Чилим с чатом и играем ☕');
  const [tempStreamTitle, setTempStreamTitle] = useState(streamTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#СпокойныйСтрим', '#Чилл']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Streamer 1v1 Duel modal state
  const [isDuelOpen, setIsDuelOpen] = useState(false);
  
  // Inline donation goal editor state (allows editing title, target, and ANY current amount!)
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoalTitle, setTempGoalTitle] = useState(donationGoal.title);
  const [tempGoalCurrent, setTempGoalCurrent] = useState(donationGoal.current);
  const [tempGoalTarget, setTempGoalTarget] = useState(donationGoal.target);
  const [quickAddAmount, setQuickAddAmount] = useState('');
  
  // Stream metrics
  const [streamDurationSec, setStreamDurationSec] = useState(0);
  const [viewers, setViewers] = useState(12);
  const [peakViewers, setPeakViewers] = useState(12);
  const [earnedMoney, setEarnedMoney] = useState(0);
  const [gainedFollowers, setGainedFollowers] = useState(0);
  const [gainedSubs, setGainedSubs] = useState(0);
  const [chatToxicity, setChatToxicity] = useState(0); // 0 - 100
  const [streamHype, setStreamHype] = useState(50); // 0 - 100
  const [bannedCount, setBannedCount] = useState(0);
  const [modCombo, setModCombo] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Active donation banner (popup animated notification)
  const [activeDonation, setActiveDonation] = useState<{ name: string; amount: number; text: string } | null>(null);
  // Persistent last donation for the on-screen widget (remains visible throughout stream)
  const [lastDonation, setLastDonation] = useState<{ name: string; amount: number; text: string } | null>(null);

  // Active sub gift banner (popup animated notification for gift/new subs)
  const [activeSubGift, setActiveSubGift] = useState<{ name: string; count: number; text: string } | null>(null);
  // Persistent last sub gift for on-screen status
  const [lastSubGift, setLastSubGift] = useState<{ name: string; count: number } | null>(null);

  // Streamer reaction on camera (synchronized shoutout)
  const [streamerReaction, setStreamerReaction] = useState<string | null>(null);
  const donationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const subGiftTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Active sponsor banner for stream
  const activeSponsor = sponsors.find(s => s.active && !s.completed);

  // Calculate setup quality bonus across all 6 equipment categories
  const pcItem = hardware.find(h => h.category === 'pc') || HARDWARE_CATALOG.find(h => h.id === 'pc_0');
  const micItem = hardware.find(h => h.category === 'mic') || HARDWARE_CATALOG.find(h => h.id === 'mic_0');
  const camItem = hardware.find(h => h.category === 'camera') || HARDWARE_CATALOG.find(h => h.id === 'cam_0');
  const lightItem = hardware.find(h => h.category === 'light') || HARDWARE_CATALOG.find(h => h.id === 'light_0');
  const chairItem = hardware.find(h => h.category === 'chair') || HARDWARE_CATALOG.find(h => h.id === 'chair_0');
  const netItem = hardware.find(h => h.category === 'internet') || HARDWARE_CATALOG.find(h => h.id === 'internet_0');

  const totalQualityBonus = (pcItem?.qualityBonus || 0) + (micItem?.qualityBonus || 0) + 
                            (camItem?.qualityBonus || 0) + (lightItem?.qualityBonus || 0) +
                            (chairItem?.qualityBonus || 0) + (netItem?.qualityBonus || 0);

  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];

  // Auto scroll chat ONLY within the chat box (never jumps or scrolls the webpage window!)
  useEffect(() => {
    if (chatContainerRef.current) {
      const el = chatContainerRef.current;
      const isScrolledUp = el.scrollHeight - el.scrollTop - el.clientHeight > 150;
      if (!isScrolledUp) {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Clean-up donation and sub gift timers on unmount
  useEffect(() => {
    return () => {
      if (donationTimerRef.current) clearTimeout(donationTimerRef.current);
      if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
      if (subGiftTimerRef.current) clearTimeout(subGiftTimerRef.current);
    };
  }, []);

  // High-fidelity instant synchronized donation trigger
  const triggerDonation = useCallback((custom?: { name: string; amount: number; text: string }) => {
    let donorName: string;
    let amount: number;
    let text: string;

    if (custom) {
      donorName = custom.name;
      amount = custom.amount;
      text = custom.text;
    } else {
      const d = CHAT_POOLS.donations[Math.floor(Math.random() * CHAT_POOLS.donations.length)];
      donorName = d.name;
      // Scale donation amount by game popularity! Higher hype multiplier = larger donations
      const popMultiplier = 1 + (selectedGame.hypeMultiplier - 1) * 0.45;
      amount = Math.round(d.amount * popMultiplier);
      text = d.text;
    }

    // 1. Instant Audio Chime
    sound.playDonation();

    // 2. Synchronized items for Alert Banner & Last Donation Bar
    const donItem = { name: donorName, amount, text };
    setActiveDonation(donItem);
    setLastDonation(donItem);

    // 3. Stream stats updates
    setEarnedMoney(m => m + amount);
    setStreamHype(h => Math.min(100, h + 15));

    // 4. Update donation goal immediately in real-time
    onUpdateDonationGoal(prev => ({
      ...prev,
      current: prev.current + amount
    }));

    // 5. Streamer webcam voice reaction bubble & happy emotion
    const shoutouts = [
      `🎉 @${donorName}: +${amount.toLocaleString()} ₽! СПАСИБО!`,
      `🤑 ОГО! +${amount.toLocaleString()} ₽ на сбор от @${donorName}!`,
      `❤️ От души за поддержку, @${donorName}!`,
      `🔥 @${donorName}, лучший! Донат зачислен!`,
      `🚀 @${donorName} задонатил ${amount.toLocaleString()} ₽!`
    ];
    setStreamerReaction(shoutouts[Math.floor(Math.random() * shoutouts.length)]);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setStreamerReaction(null), 4500);

    // 6. Toast Notification
    onAddToast(`Донат +${amount.toLocaleString()} ₽!`, `@${donorName}: «${text}»`, 'donation');

    // 7. Add dedicated, prominent donation message to chat immediately
    const donMsg: ChatMessage = {
      id: `don_${Date.now()}_${Math.random()}`,
      author: donorName,
      text: text,
      type: 'donation',
      timestamp: Date.now(),
      donorAmount: amount,
      badge: 'ДОНАТ'
    };
    setChatMessages(prev => [...prev.slice(-30), donMsg]);

    // Force chat to scroll directly to the new donation message
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 40);

    // Keep active alert banner visible on screen for 6.5s
    if (donationTimerRef.current) clearTimeout(donationTimerRef.current);
    donationTimerRef.current = setTimeout(() => {
      setActiveDonation(null);
    }, 6500);
  }, [selectedGame, onUpdateDonationGoal, onAddToast]);

  // Fully synchronized Subscriptions and Gift Subs trigger
  const triggerSubGift = useCallback((custom?: { name: string; count: number; text: string }) => {
    let gifterName: string;
    let count: number;
    let text: string;

    if (custom) {
      gifterName = custom.name;
      count = custom.count;
      text = custom.text;
    } else {
      const gifters = [
        'CyberNinja', 'PudgeLover', 'MegaWhale_2026', 'Toxa_Master', 
        'NeonGlow', 'Danila_Pro', 'Speedy_Fox', 'Kekis_2026', 'Artyom_K', 'Vika_Stream'
      ];
      gifterName = gifters[Math.floor(Math.random() * gifters.length)];
      const counts = [1, 1, 2, 5, 5, 10];
      count = counts[Math.floor(Math.random() * counts.length)];
      const phrases = [
        `Держи сабки для чата! Лучший контент сегодня!`,
        `Врубайте саб-смайлики, дарю подписки комьюнити!`,
        `Сабки летят в чат, стримеру на развитие!`,
        `За такой стрим грех не подарить сабочки!`
      ];
      text = phrases[Math.floor(Math.random() * phrases.length)];
    }

    const earnings = count * 350;

    // 1. Audio Fanfare
    sound.playLevelUp();

    // 2. Synchronized alert banner & last sub widget
    const subItem = { name: gifterName, count, text };
    setActiveSubGift(subItem);
    setLastSubGift({ name: gifterName, count });

    // 3. Stats update
    setGainedSubs(s => s + count);
    setEarnedMoney(m => m + earnings);
    setStreamHype(h => Math.min(100, h + count * 6));

    onUpdateStats(prev => ({
      ...prev,
      subscribers: prev.subscribers + count,
      money: prev.money + earnings,
      mood: Math.min(100, prev.mood + 6)
    }));

    // 4. Streamer camera shoutout & reaction
    const shoutouts = [
      `👑 @${gifterName}: +${count} САБОК ДЛЯ ЧАТА! СПАСИБО!`,
      `🎁 ОГО! +${count} ПОДАРОЧНЫХ САБОК ОТ @${gifterName}!`,
      `❤️ @${gifterName}, ЛЕГЕНДА! +${count} САБОК ВРУБИЛ!`,
      `🔥 ЧАТ, СПАМИМ СЕРДЕЧКИ @${gifterName} ЗА +${count} САБОК!`
    ];
    setStreamerReaction(shoutouts[Math.floor(Math.random() * shoutouts.length)]);
    if (reactionTimerRef.current) clearTimeout(reactionTimerRef.current);
    reactionTimerRef.current = setTimeout(() => setStreamerReaction(null), 4500);

    // 5. Toast notification
    onAddToast(
      `🎁 Подарочные сабки (+${count})!`,
      `@${gifterName} подарил ${count} платных подписок чату! (+${earnings.toLocaleString()} ₽)`,
      'donation'
    );

    // 6. Dedicated synchronized message in chat
    const subMsg: ChatMessage = {
      id: `sub_${Date.now()}_${Math.random()}`,
      author: gifterName,
      text: text,
      type: 'sub_gift',
      timestamp: Date.now(),
      subsCount: count,
      donorAmount: earnings,
      badge: `🎁 +${count} САБОК`
    };
    setChatMessages(prev => [...prev.slice(-30), subMsg]);

    // Force chat to scroll directly to the new sub gift
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 40);

    // Banner visibility for 6.5s
    if (subGiftTimerRef.current) clearTimeout(subGiftTimerRef.current);
    subGiftTimerRef.current = setTimeout(() => {
      setActiveSubGift(null);
    }, 6500);
  }, [onUpdateStats, onAddToast]);

  // Start Stream
  const handleStartStream = () => {
    if (stats.energy < 15) {
      onAddToast('Недостаточно сил!', 'Слишком мало энергии для стрима. Поспи или поешь!', 'warning');
      return;
    }
    // Check PC requirement
    const playerPcTier = pcItem ? pcItem.tier : 0;
    if (playerPcTier < selectedGame.minPcTier) {
      onAddToast('Слабый ПК!', `Для игры «${selectedGame.title}» нужен ПК уровня ${selectedGame.minPcTier}. Обнови ПК в магазине!`, 'alert');
      return;
    }

    sound.playStreamStart();
    setIsLive(true);
    setStreamDurationSec(0);
    const initialViewers = Math.max(8, Math.floor(selectedGame.baseViewers * (1 + stats.followers / 200) + totalQualityBonus / 2));
    setViewers(initialViewers);
    setPeakViewers(initialViewers);
    setEarnedMoney(0);
    setGainedFollowers(0);
    setGainedSubs(0);
    setChatToxicity(0);
    setStreamHype(60);
    setBannedCount(0);
    setModCombo(0);
    setActiveDonation(null);
    setActiveSubGift(null);
    setLastDonation(null);
    setStreamerReaction(null);

    const tagsText = selectedTags.length > 0 ? ` [${selectedTags.join(' ')}]` : '';
    setChatMessages([
      {
        id: 'msg_sys_start',
        author: 'Система',
        text: `🔴 Стрим запущен: «${streamTitle}»! Игра: ${selectedGame.title}.${tagsText} Сбор: «${donationGoal.title}» (${donationGoal.current.toLocaleString()} / ${donationGoal.target.toLocaleString()} ₽). Всем приятного просмотра!`,
        type: 'normal',
        timestamp: Date.now(),
        color: 'text-purple-400 font-bold'
      }
    ]);

    onAddToast('Прямой эфир!', `Стрим «${streamTitle}» начался! Игра: ${selectedGame.title}`, 'success');
  };

  // 1v1 Streamer Duel callbacks
  const handleWinDuel = (opponentName: string, subsWager: number) => {
    sound.playDuelWin();
    const subEarnings = subsWager * 350;

    setGainedSubs(s => s + subsWager);
    setEarnedMoney(m => m + subEarnings);
    setStreamHype(100);
    setViewers(v => v + subsWager * 15);

    onUpdateStats(prev => ({
      ...prev,
      subscribers: prev.subscribers + subsWager,
      money: prev.money + subEarnings,
      mood: 100
    }));

    const raidMsg: ChatMessage = {
      id: `duel_win_${Date.now()}`,
      author: `👑 РЕЙД ОТ @${opponentName}`,
      text: `🔥 СТРИМЕР ПРОИГРАЛ ЗАБИВ! Рейдит наш канал с ${subsWager * 25} зрителями и дарит +${subsWager} сабок (+${subEarnings.toLocaleString()} ₽)! ЧАТ, СПАМИМ GG!`,
      type: 'normal',
      timestamp: Date.now(),
      color: 'text-amber-300 font-black'
    };
    setChatMessages(prev => [...prev.slice(-30), raidMsg]);

    onAddToast(
      'ПОБЕДА В ЗАБИВЕ!',
      `Ты уделал @${opponentName}! Получено: +${subsWager} платных подписок (+${subEarnings.toLocaleString()} ₽)!`,
      'donation'
    );
  };

  const handleLoseDuel = (opponentName: string, subsWager: number) => {
    sound.playDuelLose();

    setGainedSubs(s => Math.max(0, s - subsWager));
    setStreamHype(h => Math.max(15, h - 25));

    onUpdateStats(prev => ({
      ...prev,
      subscribers: Math.max(0, prev.subscribers - subsWager),
      mood: Math.max(10, prev.mood - 15)
    }));

    const loseMsg: ChatMessage = {
      id: `duel_lose_${Date.now()}`,
      author: `💀 ЗАБИВ ПРОИГРАН`,
      text: `@${opponentName} среагировал быстрее! Ты отдал ${subsWager} сабок своему оппоненту... Чат в шоке и утешает стримера.`,
      type: 'normal',
      timestamp: Date.now(),
      color: 'text-rose-400 font-bold'
    };
    setChatMessages(prev => [...prev.slice(-30), loseMsg]);

    onAddToast(
      'ПОРАЖЕНИЕ В ЗАБИВЕ',
      `@${opponentName} выиграл дуэль. Ты передал ${subsWager} сабок. В следующий раз победишь!`,
      'warning'
    );
  };

  // Stop Stream
  const handleStopStream = () => {
    setIsLive(false);
    sound.playLevelUp();

    const durationMin = Math.max(1, Math.round(streamDurationSec / 60));
    // Upgraded chairs (Secretlab, Herman Miller, Predator Thronos, Cyber-King) reduce energy drain by up to 60%!
    const chairEnergyBonus = Math.min(60, (chairItem?.stabilityBonus || 0) * 0.4);
    const energyUsed = Math.max(1, Math.min(stats.energy, Math.round(durationMin * 4 * (1 - chairEnergyBonus / 100))));
    const hungerUsed = Math.min(stats.hunger, Math.round(durationMin * 2));

    // Update player stats
    onUpdateStats(prev => ({
      ...prev,
      money: prev.money + earnedMoney,
      followers: prev.followers + gainedFollowers,
      subscribers: prev.subscribers + gainedSubs,
      energy: Math.max(0, prev.energy - energyUsed),
      hunger: Math.max(0, prev.hunger - hungerUsed),
      mood: Math.min(100, prev.mood + 10),
      totalStreams: prev.totalStreams + 1,
      totalDonationsEarned: prev.totalDonationsEarned + earnedMoney,
      totalHoursStreamed: prev.totalHoursStreamed + Number((streamDurationSec / 3600).toFixed(1))
    }));

    onEndStream({
      durationMinutes: durationMin,
      earnedMoney,
      gainedFollowers,
      gainedSubs,
      peakViewers,
      bannedToxics: bannedCount
    });
  };

  // Mini-game score callback with instant bonus donation chance!
  const handleMiniGameScore = useCallback((pts: number) => {
    setStreamHype(h => Math.min(100, h + Math.round(pts / 5)));
    setViewers(v => Math.round(v + pts / 10 + 1));
    setGainedFollowers(f => f + Math.max(1, Math.round(pts / 15)));

    // 35% chance of an instant bonus donation on successful mini-game play!
    if (Math.random() < 0.35) {
      const hypeDonations = [
        { name: 'Клатч_Мастер', amount: 200, text: 'ВОТ ЭТО МУВ! Красава, держи на пиццу!' },
        { name: 'Fan_Number1', amount: 500, text: 'Хорош! Лучший момент стрима, забирай сотни!' },
        { name: 'Про_Геймер_2026', amount: 350, text: 'Такой аим достоин доната! Тащи дальше!' },
        { name: 'Zritel_Goda', amount: 150, text: 'Чат в шоке! Держи в копилку сбора!' },
        { name: 'MegaLover', amount: 1000, text: 'ЗА ТАКОЙ КЛАТЧ ТЫСЯЧА РУБЛЕЙ ЛЕТИТ!' },
        { name: 'Снайпер_Года', amount: 750, text: 'Фантастическая реакция, держи на сбор!' }
      ];
      const pick = hypeDonations[Math.floor(Math.random() * hypeDonations.length)];
      triggerDonation(pick);
    }

    // Occasional new subscriber on great play!
    if (Math.random() < 0.18) {
      triggerSubGift();
    }
  }, [triggerDonation, triggerSubGift, onAddToast]);

  const handleMiniGameMiss = useCallback(() => {
    setStreamHype(h => Math.max(10, h - 8));
    // Chat reacts to miss
    const failChatMsg: ChatMessage = {
      id: `fail_${Date.now()}`,
      author: AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)],
      text: 'АХАХАХ ОПЯТЬ ПРОМАХНУЛСЯ 😂',
      type: 'normal',
      timestamp: Date.now()
    };
    setChatMessages(prev => [...prev.slice(-25), failChatMsg]);
  }, []);

  // Ban toxic message handler
  const handleBanUser = (messageId: string, author: string) => {
    sound.playBanHammer();
    setBannedCount(b => b + 1);
    const newCombo = modCombo + 1;
    setModCombo(newCombo);

    // Reduce toxicity and increase hype
    setChatToxicity(t => Math.max(0, t - 18));
    setStreamHype(h => Math.min(100, h + 6));
    setGainedFollowers(f => f + 1);

    // Update message state
    setChatMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          isBanned: true,
          text: `[Пользователь @${author} навсегда забанен молотом правосудия 🔨]`
        };
      }
      return m;
    }));

    onAddToast('Банхаммер!', `Токсик @${author} успешно забанен! Комбо x${newCombo}!`, 'info');
  };

  // Timeout user handler
  const handleTimeoutUser = (messageId: string, author: string) => {
    sound.playClick();
    setBannedCount(b => b + 1);
    setChatToxicity(t => Math.max(0, t - 12));
    setStreamHype(h => Math.min(100, h + 3));

    setChatMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return {
          ...m,
          isBanned: true,
          text: `[Пользователь @${author} получил мут на 10 минут ⏳]`
        };
      }
      return m;
    }));
  };

  // Quick Ban All Toxics button
  const handleQuickBanAll = () => {
    const unbannedToxics = chatMessages.filter(m => (m.type === 'toxic' || m.type === 'spam') && !m.isBanned);
    if (unbannedToxics.length === 0) return;

    sound.playBanHammer();
    setBannedCount(b => b + unbannedToxics.length);
    setChatToxicity(0);
    setStreamHype(h => Math.min(100, h + unbannedToxics.length * 5));

    setChatMessages(prev => prev.map(m => {
      if ((m.type === 'toxic' || m.type === 'spam') && !m.isBanned) {
        return {
          ...m,
          isBanned: true,
          text: `[Забанен автоматической чисткой 🔨]`
        };
      }
      return m;
    }));

    onAddToast('Массовая зачистка!', `Забанено нарушителей: ${unbannedToxics.length}! Чат снова в безопасности.`, 'success');
  };

  // Streaming Loop & Events
  useEffect(() => {
    if (!isLive) return;

    // Stream timer: ticks smoothly every second (+1s per second)
    const timer = setInterval(() => {
      setStreamDurationSec(sec => {
        const next = sec + 1;

        // Tangible real-time energy drain: every 10 seconds of stream, consume 1 energy
        const chairBonus = chairItem?.stabilityBonus || 0;
        const energyIntervalSec = chairBonus > 30 ? 12 : 9;

        if (next % energyIntervalSec === 0) {
          onUpdateStats(p => {
            const nextEnergy = Math.max(0, p.energy - 1);
            if (nextEnergy === 15) {
              onAddToast('⚡ Энергия на исходе!', 'Сил почти не осталось! Пора заканчивать стрим.', 'warning');
            }
            return {
              ...p,
              energy: nextEnergy
            };
          });
        }

        // Hunger consumption: every 14 seconds of stream
        if (next % 14 === 0) {
          onUpdateStats(p => ({
            ...p,
            hunger: Math.max(0, p.hunger - 1)
          }));
        }

        // Clock hour & day progression: every 15 seconds of stream = 1 in-game hour!
        // When clock reaches 24 (rolls to 0), a new day begins!
        if (next % 15 === 0) {
          onUpdateStats(p => {
            const nextHour = (p.hour + 1) % 24;
            const nextDay = nextHour === 0 ? p.day + 1 : p.day;
            return {
              ...p,
              hour: nextHour,
              day: nextDay
            };
          });
        }

        return next;
      });
    }, 1000);

    // Chat generator interval
    const chatInterval = setInterval(() => {
      const rand = Math.random();
      let newMsg: ChatMessage;

      // Tag effect: #СпокойныйСтрим reduces toxicity impact by 60%
      const toxMult = selectedTags.includes('#СпокойныйСтрим') ? 0.4 : 1.0;

      if (rand < 0.28) {
        // TOXIC message (needs moderation!)
        newMsg = {
          id: `tox_${Date.now()}_${Math.random()}`,
          author: TOXIC_AUTHORS[Math.floor(Math.random() * TOXIC_AUTHORS.length)],
          text: CHAT_POOLS.toxic[Math.floor(Math.random() * CHAT_POOLS.toxic.length)],
          type: 'toxic',
          timestamp: Date.now(),
          color: 'text-rose-400 font-bold'
        };
        // Toxicity increases if toxic comments spawn
        setChatToxicity(t => Math.min(100, t + Math.round(12 * toxMult)));
      } else if (rand < 0.42) {
        // SPAM / ADS
        newMsg = {
          id: `spam_${Date.now()}_${Math.random()}`,
          author: SPAM_AUTHORS[Math.floor(Math.random() * SPAM_AUTHORS.length)],
          text: CHAT_POOLS.spam[Math.floor(Math.random() * CHAT_POOLS.spam.length)],
          type: 'spam',
          timestamp: Date.now(),
          color: 'text-amber-400 font-bold'
        };
        setChatToxicity(t => Math.min(100, t + Math.round(8 * toxMult)));
      } else if (rand < 0.48) {
        // SPOILER
        newMsg = {
          id: `spoil_${Date.now()}_${Math.random()}`,
          author: AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)],
          text: CHAT_POOLS.spoilers[Math.floor(Math.random() * CHAT_POOLS.spoilers.length)],
          type: 'spoiler',
          timestamp: Date.now(),
          color: 'text-orange-400'
        };
        setChatToxicity(t => Math.min(100, t + Math.round(5 * toxMult)));
      } else {
        // NORMAL / FRIENDLY
        newMsg = {
          id: `norm_${Date.now()}_${Math.random()}`,
          author: AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)],
          text: CHAT_POOLS.friendly[Math.floor(Math.random() * CHAT_POOLS.friendly.length)],
          type: 'normal',
          timestamp: Date.now()
        };
      }

      // Check if hired team members auto-ban this message!
      const activeMods = team.filter(t => t.hired && (t.role === 'mod_bot' || t.role === 'moderator'));
      let autoBannedByMod: string | null = null;

      if ((newMsg.type === 'toxic' || newMsg.type === 'spam') && activeMods.length > 0) {
        for (const mod of activeMods) {
          if (Math.random() < mod.autoBanChance) {
            autoBannedByMod = mod.name;
            break;
          }
        }
      }

      if (autoBannedByMod) {
        newMsg.isBanned = true;
        newMsg.text = `[Забанен модератором ${autoBannedByMod} 🛡️]`;
        setBannedCount(b => b + 1);
        setChatToxicity(t => Math.max(0, t - 10));
      }

      setChatMessages(prev => [...prev.slice(-30), newMsg]);
    }, 1700);

    // Donation generator interval:
    // Game popularity scaling: more popular game (higher hypeMultiplier) = faster donation intervals!
    const pop = selectedGame.hypeMultiplier || 1.0;
    const donationIntervalMs = Math.max(1600, Math.round(3600 / (1 + (pop - 1) * 0.45)));

    const donationInterval = setInterval(() => {
      // High donation chance scaled with viewers, game popularity, and #Чилл tag
      const chillBonus = selectedTags.includes('#Чилл') ? 0.08 : 0;
      const popBonus = Math.min(0.18, (pop - 1) * 0.05);
      const donationChance = 0.72 + Math.min(0.24, viewers / 150) + chillBonus + popBonus;
      if (Math.random() < donationChance) {
        triggerDonation();
      }
    }, donationIntervalMs);

    // Viewer fluctuations & toxicity penalty
    const viewerInterval = setInterval(() => {
      setViewers(v => {
        // Base fluctuation
        const delta = Math.floor(Math.random() * 7) - 3;
        let next = v + delta;

        // If toxicity is high, viewers drop dramatically!
        if (chatToxicity > 60) {
          next -= Math.floor(Math.random() * 5) + 3;
          // Spawn chat warning
          const angryMsg: ChatMessage = {
            id: `ang_${Date.now()}`,
            author: AUTHOR_NAMES[Math.floor(Math.random() * AUTHOR_NAMES.length)],
            text: 'Чат неуправляемый, модераторы спят! Я ухожу со стрима 🚪🏃',
            type: 'normal',
            timestamp: Date.now(),
            color: 'text-red-400 italic'
          };
          setChatMessages(prev => [...prev.slice(-30), angryMsg]);
        }

        const clamped = Math.max(5, next);
        setPeakViewers(p => Math.max(p, clamped));
        return clamped;
      });
    }, 3000);

    // Organic Sub Gift interval: viewers occasionally gift subs during stream!
    const subGiftInterval = setInterval(() => {
      // 30% chance every 20 seconds
      if (Math.random() < 0.30) {
        triggerSubGift();
      }
    }, 20000);

    return () => {
      clearInterval(timer);
      clearInterval(chatInterval);
      clearInterval(donationInterval);
      clearInterval(viewerInterval);
      clearInterval(subGiftInterval);
    };
  }, [isLive, viewers, chatToxicity, selectedGame, selectedTags, team, triggerDonation, triggerSubGift, onUpdateStats, onAddToast, chairItem]);

  // Format stream timer cleanly as standard stopwatch: mm:ss or hh:mm:ss
  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render active mini-game component
  const renderMiniGame = () => {
    switch (selectedGame.genre) {
      case 'movie':
        return <MovieMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'shooter':
        return <ShooterMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'moba':
        return <MobaMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'horror':
        return <HorrorMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'racer':
        return <RacerMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'sandbox':
        return <MiningMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
      case 'just_chatting':
      default:
        return <ChattingMiniGame onScore={handleMiniGameScore} onMiss={handleMiniGameMiss} active={isLive} />;
    }
  };

  // Active unmoderated toxic comments count
  const unmoderatedToxics = chatMessages.filter(m => (m.type === 'toxic' || m.type === 'spam') && !m.isBanned);

  // Tag helpers
  const toggleTag = (tag: string) => {
    sound.playClick();
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    let cleaned = customTagInput.trim();
    if (!cleaned) return;
    if (!cleaned.startsWith('#')) cleaned = '#' + cleaned;
    if (!selectedTags.includes(cleaned)) {
      sound.playClick();
      setSelectedTags(prev => [...prev, cleaned]);
    }
    setCustomTagInput('');
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto">
      {/* If NOT LIVE: Stream Pre-flight Launcher */}
      {!isLive ? (
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Radio className="w-4 h-4 text-purple-400" />
                {profile.twitchChannelName || 'StreamHub'} • Студия {profile.nickname || 'Стримера'}
              </div>
              <h2 className="text-2xl font-black text-white mt-1">
                Подготовка к прямому эфиру
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Настрой название стрима, хештеги, выбери игру и начинай трансляцию для комьюнити!
              </p>
            </div>

            {/* Start Stream Button */}
            <button
              onClick={handleStartStream}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-base shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-white" />
              НАЧАТЬ СТРИМ (ПОДРУБИТЬ)
            </button>
          </div>

          {/* Stream Title Customization */}
          <div className="mt-5 p-4 rounded-xl bg-slate-950/70 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-2">
                <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                Название стрима (отображается на Twitch):
              </label>
              <span className="text-[11px] text-slate-400">Быстрые шаблоны:</span>
            </div>
            
            <input
              type="text"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              placeholder="Введите название вашего стрима..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-lg px-3.5 py-2 text-white font-bold text-sm outline-none transition-colors"
            />

            {/* Title presets */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              {[
                '☕ Спокойный стрим | Играем под релакс и общаемся с чатом',
                '🍿 Киномарафон: Смотрим культовый фильм вместе с чатом!',
                '🏆 Потный гейминг | Дорога в топ-1 и киберспорт',
                '⚔️ Забивы со стримерами на сабки (Бустер, Дрейк, Шукаша)',
                '🎮 Ночной чилл с подписчиками | Читаем все донаты'
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setStreamTitle(preset);
                  }}
                  className="text-[11px] bg-slate-800/80 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 px-2.5 py-1 rounded-md border border-slate-700 hover:border-purple-500/50 transition-all cursor-pointer truncate max-w-[280px]"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Hashtag System Customization */}
          <div className="mt-4 p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <label className="text-xs font-mono font-bold uppercase text-cyan-300 flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                Хештеги стрима (влияют на чат, донаты и хайп):
              </label>

              {/* Add Custom Tag */}
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                  placeholder="#СвойХештег"
                  className="bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-md px-2.5 py-1 text-xs text-white font-mono outline-none w-32"
                />
                <button
                  onClick={addCustomTag}
                  className="px-2.5 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
                >
                  + Добавить
                </button>
              </div>
            </div>

            {/* Presets and active tags */}
            <div className="flex flex-wrap items-center gap-2">
              {STREAM_TAG_PRESETS.map((p) => {
                const isActive = selectedTags.includes(p.tag);
                return (
                  <button
                    key={p.tag}
                    onClick={() => toggleTag(p.tag)}
                    title={p.desc}
                    className={`text-xs px-3 py-1.5 rounded-lg font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] scale-105'
                        : 'bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-cyan-500/60 hover:text-white'
                    }`}
                  >
                    <span>{p.tag}</span>
                    {isActive ? <span>✓</span> : <span className="text-[10px] text-slate-400">+</span>}
                  </button>
                );
              })}

              {/* Display any additional custom tags */}
              {selectedTags
                .filter(t => !STREAM_TAG_PRESETS.some(p => p.tag === t))
                .map(customTag => (
                  <button
                    key={customTag}
                    onClick={() => toggleTag(customTag)}
                    className="text-xs px-3 py-1.5 rounded-lg font-mono font-semibold bg-purple-600 text-white border border-purple-400 shadow cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{customTag}</span>
                    <span>✕</span>
                  </button>
                ))}
            </div>

            {/* Tag explanations */}
            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap gap-x-4 gap-y-1">
              <span>💡 <strong className="text-cyan-300">#СпокойныйСтрим:</strong> -60% токсичности в чате</span>
              <span>💡 <strong className="text-cyan-300">#Чилл:</strong> донаты приходят чаще</span>
              <span>💡 <strong className="text-cyan-300">#ПотныйГейминг:</strong> +25% к хайпу каток</span>
            </div>
          </div>

          {/* Game Selection Grid */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Выбор игры для стрима:
              </h3>
              <span className="text-xs font-mono text-amber-400 font-semibold">
                🔥 Популярные игры приносят донаты заметно чаще и крупнее!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map(game => {
                const isSelected = selectedGameId === game.id;
                const playerPcTier = pcItem?.tier || 0;
                const canRun = playerPcTier >= game.minPcTier;

                return (
                  <div
                    key={game.id}
                    onClick={() => canRun && setSelectedGameId(game.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-[1.02]'
                        : canRun
                        ? 'bg-slate-800/60 border-slate-700/80 hover:border-slate-500 hover:bg-slate-800'
                        : 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase bg-gradient-to-r ${game.coverColor} text-white`}>
                          {game.genre === 'movie' ? '🎬 КИНОСЕАНС' : game.genre}
                        </span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" /> Выбрано
                          </span>
                        )}
                        {!canRun && (
                          <span className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> Нужен ПК Tier {game.minPcTier}
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                        {game.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{game.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Базовые зрители: <strong className="text-amber-400">~{game.baseViewers}</strong></span>
                        <span className="flex items-center gap-1 text-purple-300 font-bold">
                          <Flame className="w-3.5 h-3.5 text-orange-400" />
                          Хайп: <strong className="text-purple-300">x{game.hypeMultiplier}</strong>
                        </span>
                      </div>
                      
                      {/* Popularity donation boost indicator */}
                      <div className="bg-slate-950/80 rounded-md px-2 py-1 text-[11px] font-mono flex items-center justify-between text-emerald-300 border border-emerald-500/20">
                        <span>Частота донатов:</span>
                        <strong className="text-white">+{Math.round((game.hypeMultiplier - 1) * 35)}% быстрее</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Rig Status Summary */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-slate-400">ПК: <strong className="text-white">{pcItem?.name || 'Базовый ПК'}</strong></span>
              <span className="text-slate-400">Кресло: <strong className="text-white">{chairItem?.name || 'Табуретка'}</strong></span>
              <span className="text-slate-400">Микрофон: <strong className="text-white">{micItem?.name || 'Микрофон'}</strong></span>
              <span className="text-slate-400">Камера: <strong className="text-white">{camItem?.name || 'Вебкамера'}</strong></span>
              <span className="text-slate-400">Свет: <strong className="text-white">{lightItem?.name || 'Свет'}</strong></span>
              <span className="text-slate-400">Сеть: <strong className="text-white">{netItem?.name || 'Интернет'}</strong></span>
            </div>
            <div className="text-emerald-400 font-mono font-bold">
              Бонус качества оборудования: +{totalQualityBonus}% к зрителям
            </div>
          </div>
        </div>
      ) : (
        /* LIVE STREAM HUD & CHAT */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Left Section: Video feed + Webcam + HUD (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Top Broadcast Status Bar with Title & 1v1 Duel button */}
            <div className="bg-slate-900/90 border border-purple-500/40 rounded-xl px-4 py-3 flex flex-col gap-2.5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-mono font-black text-xs animate-pulse">
                    <Radio className="w-3.5 h-3.5" /> В ЭФИРЕ
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-200">
                    ⏱️ {formatTime(streamDurationSec)}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">|</span>
                  <span className="text-xs font-semibold text-purple-300 hidden sm:inline">
                    {profile.twitchChannelName || 'Канал'} • {selectedGame.title}
                  </span>
                </div>

                {/* 1v1 Streamer Duel Trigger Button + End Stream Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsDuelOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white text-xs font-black shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>ЗАБИВ СО СТРИМЕРОМ</span>
                  </button>

                  <button
                    onClick={handleStopStream}
                    className="px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    Завершить
                  </button>
                </div>
              </div>

              {/* Stream Title and Tags Banner */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                    <input
                      type="text"
                      value={tempStreamTitle}
                      onChange={(e) => setTempStreamTitle(e.target.value)}
                      className="flex-1 bg-slate-950 border border-purple-500 rounded px-2.5 py-1 text-white font-bold text-xs outline-none"
                    />
                    <button
                      onClick={() => {
                        sound.playClick();
                        setStreamTitle(tempStreamTitle || streamTitle);
                        setIsEditingTitle(false);
                        onAddToast('Название обновлено!', tempStreamTitle, 'success');
                      }}
                      className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={() => setIsEditingTitle(false)}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs cursor-pointer"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-bold text-white truncate text-xs flex items-center gap-1.5">
                      <span>📺</span> {streamTitle}
                    </span>
                    <button
                      onClick={() => {
                        setTempStreamTitle(streamTitle);
                        setIsEditingTitle(true);
                      }}
                      title="Редактировать название стрима прямо во время эфира"
                      className="text-slate-400 hover:text-purple-300 cursor-pointer p-0.5 rounded transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Active Hashtags Pills */}
                {selectedTags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {selectedTags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[11px] font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Live Ticker Stats */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shadow-sm">
                  <Users className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>ОНЛАЙН: <strong className="text-white text-sm font-black">{viewers.toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Донаты: <strong className="text-emerald-300 text-sm">{earnedMoney.toLocaleString()} ₽</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <span>Фолловеры: <strong className="text-pink-300">+{gainedFollowers}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Сабки: <strong className="text-amber-300">+{gainedSubs}</strong></span>
                </div>
              </div>

              {/* Streamer Live Vitals & In-Game World Clock (Actively updates in real time while streaming) */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/60 text-xs font-mono bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-amber-300 text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> ЭНЕРГИЯ:
                  </span>
                  <div className="w-24 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-amber-500/30">
                    <div 
                      className={`h-full transition-all duration-300 ${stats.energy < 20 ? 'bg-rose-500 animate-pulse' : stats.energy < 40 ? 'bg-amber-500' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.max(0, Math.min(100, stats.energy))}%` }}
                    />
                  </div>
                  <span className={`font-black ${stats.energy < 20 ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
                    {Math.round(stats.energy)}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 font-bold text-orange-300 text-xs">
                    🍕 СЫТОСТЬ:
                  </span>
                  <div className="w-20 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-orange-500/30">
                    <div 
                      className={`h-full transition-all duration-300 ${stats.hunger < 20 ? 'bg-rose-500 animate-pulse' : 'bg-orange-400'}`}
                      style={{ width: `${Math.max(0, Math.min(100, stats.hunger))}%` }}
                    />
                  </div>
                  <span className="text-white font-black">{Math.round(stats.hunger)}%</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-purple-950/80 border border-purple-500/40 text-purple-200">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>ВРЕМЯ: <strong className="text-white">{String(stats.hour).padStart(2, '0')}:00</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-200">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ДЕНЬ: <strong className="text-white">{stats.day}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Interactive Donation Goal Widget */}
            <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-3.5 shadow-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-amber-400 font-black flex items-center gap-1.5 text-sm">
                    <span>🎯</span> {donationGoal.title || 'Сбор на мечту'}
                  </span>
                  <button
                    onClick={() => triggerDonation()}
                    className="text-[10px] bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-2 py-0.5 rounded-md shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    title="Мгновенно отправить тестовый донат и проверить синхронизацию"
                  >
                    <span>💸</span> Тест доната
                  </button>
                  <button
                    onClick={() => triggerSubGift()}
                    className="text-[10px] bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-400 hover:to-fuchsia-400 text-white font-black px-2 py-0.5 rounded-md shadow cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    title="Мгновенно подарить сабки чату и проверить синхронизацию"
                  >
                    <Gift className="w-3 h-3" /> Тест сабки
                  </button>
                  <button 
                    onClick={() => {
                      setTempGoalTitle(donationGoal.title);
                      setTempGoalCurrent(donationGoal.current);
                      setTempGoalTarget(donationGoal.target);
                      setIsEditingGoal(!isEditingGoal);
                    }}
                    className="text-[10px] bg-amber-950/80 hover:bg-amber-900 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/30 cursor-pointer transition-colors"
                  >
                    {isEditingGoal ? 'Закрыть' : '✏️ Настроить сбор / сумму'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-black text-sm">
                    {donationGoal.current.toLocaleString()} / {donationGoal.target.toLocaleString()} ₽
                  </span>
                  <span className="text-amber-300 font-black px-2 py-0.5 rounded-md bg-amber-950 border border-amber-500/50 shadow-sm">
                    {Math.min(100, Math.round((donationGoal.current / (donationGoal.target || 1)) * 100))}%
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-amber-500/40 relative p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.9)]"
                  style={{ width: `${Math.min(100, Math.round((donationGoal.current / (donationGoal.target || 1)) * 100))}%` }}
                />
              </div>

              {/* Quick Deposit Back Input (Внести любое число обратно в сбор) */}
              <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-500/30 rounded-xl px-2.5 py-1.5 flex-wrap">
                <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1 shrink-0">
                  <PlusCircle className="w-3.5 h-3.5 text-amber-400" /> Внести в сбор:
                </span>
                <input
                  type="number"
                  value={quickAddAmount}
                  onChange={(e) => setQuickAddAmount(e.target.value)}
                  placeholder="Любая сумма (₽)"
                  className="w-28 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    const num = Number(quickAddAmount);
                    if (num > 0) {
                      sound.playDonation();
                      onUpdateDonationGoal(prev => ({
                        ...prev,
                        current: prev.current + num
                      }));
                      setQuickAddAmount('');
                      onAddToast('Внесено в сбор!', `+${num.toLocaleString()} ₽ зачислено в шкалу сбора!`, 'success');
                    }
                  }}
                  disabled={!quickAddAmount || Number(quickAddAmount) <= 0}
                  className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-slate-950 font-black font-mono text-xs rounded-md shadow cursor-pointer active:scale-95 transition-all"
                >
                  + Зачислить
                </button>
                <div className="flex items-center gap-1 ml-auto text-[10px] font-mono">
                  <button
                    onClick={() => {
                      onUpdateDonationGoal(prev => ({ ...prev, current: prev.current + 500 }));
                      sound.playDonation();
                    }}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 cursor-pointer"
                  >
                    +500 ₽
                  </button>
                  <button
                    onClick={() => {
                      onUpdateDonationGoal(prev => ({ ...prev, current: prev.current + 1000 }));
                      sound.playDonation();
                    }}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 cursor-pointer"
                  >
                    +1,000 ₽
                  </button>
                  <button
                    onClick={() => {
                      onUpdateDonationGoal(prev => ({ ...prev, current: prev.current + 5000 }));
                      sound.playDonation();
                    }}
                    className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded border border-slate-700 cursor-pointer"
                  >
                    +5,000 ₽
                  </button>
                </div>
              </div>

              {/* Persistent Recent Donation & Sub Gift Status Bar (Visible at all times on stream) */}
              <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl px-3 py-2 flex flex-col gap-1.5 text-xs font-mono">
                {/* Recent Donation Row */}
                {lastDonation ? (
                  <div className="flex items-center gap-2 text-slate-200 min-w-0 flex-wrap">
                    <span className="text-amber-400 font-black flex items-center gap-1 shrink-0 text-xs uppercase tracking-wide">
                      <span className="animate-pulse">🔥</span> ПОСЛЕДНИЙ ДОНАТ:
                    </span>
                    <span className="font-extrabold text-white shrink-0">@{lastDonation.name}</span>
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-2 py-0.5 rounded text-xs shrink-0 shadow-sm">
                      +{lastDonation.amount.toLocaleString()} ₽
                    </span>
                    <span className="text-amber-200/90 italic truncate font-sans text-xs">
                      «{lastDonation.text}»
                    </span>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs italic flex items-center gap-1.5">
                    <span>💤</span> Сбор обнулен для этого стрима (0 ₽) — ждем первый донат!
                  </div>
                )}

                {/* Recent Sub Gift Row (if present) */}
                {lastSubGift && (
                  <div className="flex items-center gap-2 text-pink-200 pt-1 border-t border-slate-800/80 min-w-0">
                    <span className="text-pink-400 font-black flex items-center gap-1 shrink-0 text-xs uppercase tracking-wide">
                      <Gift className="w-3.5 h-3.5 text-pink-400" /> ПОСЛЕДНИЕ САБКИ:
                    </span>
                    <span className="font-extrabold text-white shrink-0">@{lastSubGift.name}</span>
                    <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-black px-2 py-0.5 rounded text-xs shrink-0 shadow-sm">
                      +{lastSubGift.count} САБОК
                    </span>
                    <span className="text-pink-300/80 text-[11px] truncate">
                      синхронизировано со стримом!
                    </span>
                  </div>
                )}
              </div>

              {/* Inline Full Goal Editor (Allows editing title, target, and writing ANY custom collected amount) */}
              {isEditingGoal && (
                <div className="mt-1 pt-2.5 border-t border-amber-500/30 flex flex-col gap-2 text-xs bg-slate-950/60 p-2.5 rounded-xl">
                  <div className="text-[11px] font-mono text-amber-300 font-bold">
                    ⚙️ Настройка сбора: напиши любое название, любое число собрано и любую цель:
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={tempGoalTitle}
                      onChange={(e) => setTempGoalTitle(e.target.value)}
                      placeholder="На что копить (напиши все что угодно)"
                      className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                    />
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-mono text-[11px]">Собрано:</span>
                      <input
                        type="number"
                        value={tempGoalCurrent}
                        onChange={(e) => setTempGoalCurrent(Math.max(0, Number(e.target.value)))}
                        placeholder="Собрано (любое число)"
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 font-mono text-[11px]">Цель:</span>
                      <input
                        type="number"
                        value={tempGoalTarget}
                        onChange={(e) => setTempGoalTarget(Math.max(10, Number(e.target.value)))}
                        placeholder="Цель (₽)"
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={() => {
                        sound.playLevelUp();
                        onUpdateDonationGoal(prev => ({
                          ...prev,
                          title: tempGoalTitle || 'Сбор на мечту',
                          current: Number(tempGoalCurrent) || 0,
                          target: Number(tempGoalTarget) || 10000
                        }));
                        setIsEditingGoal(false);
                        onAddToast('Сбор обновлен!', 'Новая сумма и цель сбора установлены!', 'success');
                      }}
                      className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold font-mono text-xs transition-all cursor-pointer shadow-md"
                    >
                      💾 Сохранить
                    </button>
                  </div>

                  {/* Preset Buttons for Quick Setting */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono text-slate-300">
                    <span className="text-slate-400">Быстрые пресеты:</span>
                    <button
                      onClick={() => setTempGoalCurrent(0)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                    >
                      Обнулить (0 ₽)
                    </button>
                    <button
                      onClick={() => setTempGoalCurrent(prev => prev + 1000)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer"
                    >
                      +1,000 ₽
                    </button>
                    <button
                      onClick={() => setTempGoalCurrent(prev => prev + 5000)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer"
                    >
                      +5,000 ₽
                    </button>
                    <button
                      onClick={() => setTempGoalCurrent(Math.round(tempGoalTarget * 0.5))}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-300 cursor-pointer"
                    >
                      50% от цели
                    </button>
                    <button
                      onClick={() => setTempGoalCurrent(tempGoalTarget)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-yellow-300 cursor-pointer"
                    >
                      100% (Цель достигнута!)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Donation Alert Banner (Floats over the stream with donor name, full message & amount) */}
            {activeDonation && (
              <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 p-4 rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.95)] border-2 border-yellow-200 text-slate-950 animate-bounce flex items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-13 h-13 bg-slate-950/20 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner shrink-0">
                    💸
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2 flex-wrap">
                      <span className="text-slate-950 font-extrabold">@{activeDonation.name} задонатил:</span>
                      <span className="bg-slate-950 text-amber-300 px-3 py-0.5 rounded-xl text-sm font-mono font-black shadow-lg border border-amber-400/40">
                        +{activeDonation.amount.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="text-xs font-bold mt-1 bg-slate-950/15 px-3 py-1.5 rounded-xl border border-black/10 text-slate-950 font-sans shadow-sm">
                      «{activeDonation.text}»
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                  <span className="text-xs font-black font-mono bg-slate-950 text-white px-2.5 py-1 rounded-lg uppercase shadow">
                    СПАСИБО ЗА ДОНАТ!
                  </span>
                  <span className="text-[11px] font-black text-slate-900 mt-1">
                    +{activeDonation.amount.toLocaleString()} ₽ в сбор «{donationGoal.title}»
                  </span>
                </div>
              </div>
            )}

            {/* Sub Gift Alert Banner (Floats over the stream with gifter name, subs count & message) */}
            {activeSubGift && (
              <div className="bg-gradient-to-r from-fuchsia-600 via-pink-600 to-purple-600 p-4 rounded-2xl shadow-[0_0_35px_rgba(236,72,153,0.95)] border-2 border-pink-200 text-white animate-bounce flex items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-13 h-13 bg-black/30 rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner shrink-0 border border-white/20">
                    🎁
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-black uppercase tracking-wider flex items-center gap-2 flex-wrap">
                      <span className="text-white font-extrabold">@{activeSubGift.name} подарил:</span>
                      <span className="bg-slate-950 text-pink-300 px-3 py-0.5 rounded-xl text-sm font-mono font-black shadow-lg border border-pink-400/40">
                        +{activeSubGift.count} САБОК ДЛЯ ЧАТА!
                      </span>
                    </div>
                    <div className="text-xs font-bold mt-1 bg-black/25 px-3 py-1.5 rounded-xl border border-white/10 text-pink-100 font-sans shadow-sm">
                      «{activeSubGift.text}»
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-right shrink-0">
                  <span className="text-xs font-black font-mono bg-white text-purple-950 px-2.5 py-1 rounded-lg uppercase shadow">
                    ПОДАРОЧНЫЕ САБКИ!
                  </span>
                  <span className="text-[11px] font-black text-pink-200 mt-1">
                    +{activeSubGift.count * 350} ₽ в доход стримера
                  </span>
                </div>
              </div>
            )}

            {/* Game Screen with Overlay Webcam */}
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black">
              {/* Active Mini-game inside the stream */}
              {renderMiniGame()}

              {/* Overlaid Streamer Webcam frame */}
              <div className="absolute top-4 right-4 z-20 w-44 h-32 rounded-xl bg-slate-900/90 border-2 border-purple-500/60 shadow-[0_0_20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-2 pointer-events-none">
                <div className="flex items-center justify-between text-[10px] font-mono text-purple-300">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    CAM 1080p
                  </span>
                  <span className="text-slate-400">60 FPS</span>
                </div>

                {/* Animated Streamer Face with Synchronized Donation Reaction */}
                <div className="my-auto flex flex-col items-center justify-center relative">
                  {streamerReaction && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-xl border border-yellow-100 whitespace-nowrap animate-bounce z-30 max-w-[155px] truncate text-center">
                      {streamerReaction}
                    </div>
                  )}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-lg border-2 border-white/40">
                    {streamerReaction ? '🤑' : (profile.avatar || '🎮')}
                  </div>
                  <span className="text-[10px] font-bold text-white mt-1 drop-shadow max-w-[130px] truncate text-center">
                    {profile.nickname || 'Стример'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-400">
                  <span>MIC: ON</span>
                  <span>HYPE: {streamHype}%</span>
                </div>
              </div>

              {/* Sponsor banner overlay if active */}
              {activeSponsor && (
                <div className="absolute bottom-3 left-4 z-20 bg-slate-900/90 border border-amber-500/40 rounded-lg px-3 py-1 flex items-center gap-2 text-xs font-mono text-amber-300 shadow-lg pointer-events-none">
                  <span>{activeSponsor.logo}</span>
                  <span className="font-bold">{activeSponsor.brand}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300 text-[10px]">{activeSponsor.tagline}</span>
                </div>
              )}
            </div>

            {/* Bottom Stream Gauge Bar (Hype & Toxicity) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hype Meter */}
              <div className="bg-slate-900/80 border border-purple-500/30 p-3 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="flex items-center gap-1 text-purple-300 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Хайп-метр стрима
                  </span>
                  <span className="text-amber-300 font-black">{streamHype}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-300"
                    style={{ width: `${streamHype}%` }}
                  />
                </div>
              </div>

              {/* Chat Toxicity Meter */}
              <div className="bg-slate-900/80 border border-rose-500/30 p-3 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="flex items-center gap-1 text-rose-300 font-bold">
                    <ShieldAlert className="w-4 h-4 text-rose-500" /> Токсичность чата
                  </span>
                  <span className={`font-black ${chatToxicity > 50 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                    {chatToxicity}% {chatToxicity > 50 ? '(ОПАСНО!)' : ''}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      chatToxicity > 60
                        ? 'bg-gradient-to-r from-amber-500 to-rose-600'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${chatToxicity}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Live Chat & Moderation Controls (4 cols) */}
          <div className="lg:col-span-4 flex flex-col h-[520px] bg-slate-900/95 border-2 border-purple-500/40 rounded-2xl shadow-2xl overflow-hidden">
            {/* Chat Header */}
            <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>Чат трансляции</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 font-bold bg-cyan-950/90 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    <Users className="w-3 h-3 text-cyan-400 animate-pulse" /> {viewers.toLocaleString()}
                  </span>
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Забанено токсиков: {bannedCount}
                </span>
              </div>

              {/* Quick Ban All Button */}
              {unmoderatedToxics.length > 0 && (
                <button
                  onClick={handleQuickBanAll}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-md animate-pulse cursor-pointer"
                >
                  <Hammer className="w-3.5 h-3.5" />
                  БАН ВСЕХ ({unmoderatedToxics.length})
                </button>
              )}
            </div>

            {/* Chat Toxicity Warning Banner */}
            {chatToxicity > 50 && (
              <div className="bg-rose-950/90 border-b border-rose-500 px-3 py-1.5 flex items-center gap-2 text-rose-300 text-xs font-mono animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Чат горит! Зрители уходят! Баните хейтеров срочно!</span>
              </div>
            )}

            {/* Chat Message List */}
            <div ref={chatContainerRef} className="flex-1 p-3 overflow-y-auto space-y-2.5 font-sans text-xs scrollbar-thin">
              {chatMessages.map(msg => {
                const isToxic = msg.type === 'toxic' || msg.type === 'spam';

                // Dedicated high-contrast synchronized donation chat card
                if (msg.type === 'donation') {
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-gradient-to-r from-amber-950 via-yellow-950/90 to-amber-900 border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)] transition-all animate-pulse-once"
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1 border-b border-amber-500/40">
                        <div className="flex items-center gap-1.5 font-black text-amber-300 text-xs">
                          <span className="text-base animate-bounce">💸</span>
                          <span>@{msg.author.replace(/^💸\s*/, '')}</span>
                        </div>
                        <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-mono font-black text-xs px-2.5 py-0.5 rounded-md shadow-md">
                          +{msg.donorAmount?.toLocaleString() || 0} ₽
                        </span>
                      </div>
                      <div className="text-xs font-bold text-amber-100 italic leading-snug">
                        «{msg.text.replace(/\s\(\+[\d\s,]+₽ в сбор\)/, '')}»
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono text-amber-300/80 flex items-center justify-between pt-1 border-t border-amber-500/20">
                        <span className="truncate">🎯 Зачислено в сбор «{donationGoal.title}»</span>
                        <span className="text-emerald-400 font-bold shrink-0">СИНХРОНИЗИРОВАНО</span>
                      </div>
                    </div>
                  );
                }

                // Dedicated high-contrast synchronized sub gift chat card
                if (msg.type === 'sub_gift') {
                  return (
                    <div
                      key={msg.id}
                      className="p-3 rounded-xl bg-gradient-to-r from-purple-950 via-pink-950/90 to-fuchsia-950 border-2 border-pink-400 shadow-[0_0_18px_rgba(236,72,153,0.5)] transition-all animate-pulse-once"
                    >
                      <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1 border-b border-pink-500/40">
                        <div className="flex items-center gap-1.5 font-black text-pink-300 text-xs">
                          <span className="text-base animate-bounce">🎁</span>
                          <span>@{msg.author}</span>
                        </div>
                        <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded-md shadow-md">
                          +{msg.subsCount || 1} {((msg.subsCount || 1) === 1) ? 'САБКА' : ((msg.subsCount || 1) < 5) ? 'САБКИ' : 'САБОК'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-pink-100 italic leading-snug">
                        «{msg.text}»
                      </div>
                      <div className="mt-1.5 text-[10px] font-mono text-pink-300/80 flex items-center justify-between pt-1 border-t border-pink-500/20">
                        <span>🎉 Стример получил +{(msg.donorAmount || (msg.subsCount || 1) * 350).toLocaleString()} ₽</span>
                        <span className="text-pink-400 font-bold shrink-0">СИНХРОНИЗИРОВАНО</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.id}
                    className={`p-2 rounded-lg transition-all ${
                      msg.isBanned
                        ? 'bg-slate-950/50 opacity-40 line-through text-slate-500'
                        : isToxic
                        ? 'bg-rose-950/40 border-2 border-rose-500/70 shadow-sm'
                        : 'bg-slate-800/40 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        {isToxic && !msg.isBanned && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-600 text-white">
                            {msg.type === 'spam' ? 'СПАМ' : 'ТОКСИК'}
                          </span>
                        )}
                        <span className={`font-bold ${isToxic ? 'text-rose-300' : 'text-purple-300'}`}>
                          {msg.author}
                        </span>
                      </div>

                      {/* Moderation Action Buttons for player */}
                      {isToxic && !msg.isBanned && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleBanUser(msg.id, msg.author)}
                            title="Забанить навсегда"
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-mono font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                          >
                            <Hammer className="w-3 h-3" /> БАН
                          </button>
                          <button
                            onClick={() => handleTimeoutUser(msg.id, msg.author)}
                            title="Мут на 10 минут"
                            className="px-1.5 py-0.5 rounded bg-slate-700 hover:bg-slate-600 active:scale-95 text-slate-200 text-[10px] cursor-pointer"
                          >
                            <Clock className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className={msg.color || 'text-slate-200'}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Moderation Info Footer */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Автомодерация: <strong>{team.some(t => t.hired && t.autoBanChance > 0) ? 'ВКЛ' : 'ВЫКЛ'}</strong></span>
              <span className="text-amber-400">Кликай [БАН] на токсиках!</span>
            </div>
          </div>
        </div>
      )}

      {/* 1v1 Streamer Duel Modal */}
      <StreamerDuelModal
        isOpen={isDuelOpen}
        onClose={() => setIsDuelOpen(false)}
        playerStats={{
          ...stats,
          subscribers: stats.subscribers + gainedSubs
        }}
        onWinDuel={(subsWon, opponentName) => handleWinDuel(opponentName, subsWon)}
        onLoseDuel={(subsLost, opponentName) => handleLoseDuel(opponentName, subsLost)}
      />
    </div>
  );
};

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type TabType = 'stream' | 'apartment' | 'job' | 'setup' | 'team' | 'bills' | 'social' | 'profile';

export interface DonationGoal {
  title: string;
  target: number;
  current: number;
}

export interface ProfileSettings {
  nickname: string;
  twitchChannelName: string;
  twitterHandle: string;
  bio: string;
  avatar: string;
}

export type GameGenre = 'shooter' | 'moba' | 'sandbox' | 'horror' | 'racer' | 'just_chatting' | 'movie';

export interface MovieItem {
  id: string;
  title: string;
  genreName: string;
  durationMinutes: number;
  baseHype: number;
  synopsis: string;
  posterEmoji: string;
  quote: string;
  unlocked: boolean;
  price: number;
}

export interface StreamerDuelOpponent {
  id: string;
  name: string;
  channel: string;
  avatar: string;
  followersCount: string;
  reactionSpeedMs: number; // e.g. 280ms
  dialogueChallenge: string;
  dialogueWin: string;
  dialogueLose: string;
  suggestedSubs: number[];
}

export interface StreamGame {
  id: string;
  title: string;
  genre: GameGenre;
  icon: string;
  minPcTier: number; // 0, 1, 2, 3
  baseViewers: number;
  hypeMultiplier: number;
  description: string;
  unlocked: boolean;
  price: number;
  coverColor: string;
}

export type ChatCommentType = 'normal' | 'fan' | 'toxic' | 'spam' | 'spoiler' | 'question' | 'donation' | 'sub_gift';

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  type: ChatCommentType;
  timestamp: number;
  isBanned?: boolean;
  isModerated?: boolean;
  donorAmount?: number;
  subsCount?: number;
  color?: string;
  badge?: string;
}

export interface DayJob {
  id: string;
  title: string;
  company: string;
  hours: number;
  salary: number;
  energyCost: number;
  hungerCost: number;
  moodCost: number;
  minFollowersRequired: number;
  description: string;
  tier: number;
}

export interface BillItem {
  id: string;
  name: string;
  amount: number;
  category: 'rent' | 'internet' | 'electricity' | 'subscriptions';
  dueDay: number;
  isPaid: boolean;
  penaltyActive: boolean;
}

export type HardwareCategory = 'pc' | 'mic' | 'camera' | 'light' | 'chair' | 'internet';

export interface HardwareItem {
  id: string;
  category: HardwareCategory;
  name: string;
  tier: number;
  price: number;
  qualityBonus: number; // Increases stream quality / viewers
  stabilityBonus: number; // Reduces stream crashes/fps drops
  description: string;
  iconName: string;
}

export type TeamRole = 'mod_bot' | 'moderator' | 'editor' | 'designer' | 'manager';

export interface TeamMember {
  id: string;
  role: TeamRole;
  name: string;
  avatar: string;
  salaryDaily: number;
  hired: boolean;
  effectDescription: string;
  autoBanChance: number; // 0 to 1
  passiveViewsDaily: number;
  retentionBonus: number;
  sponsorBoost: number;
  level: number;
}

export interface SponsorContract {
  id: string;
  brand: string;
  logo: string;
  tagline: string;
  rewardMoney: number;
  minutesRequired: number;
  minutesStreamed: number;
  minFollowers: number;
  completed: boolean;
  active: boolean;
}

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  likes: number;
  retweets: number;
  timeAgo: string;
  isUserPost?: boolean;
}

export interface PlayerStats {
  energy: number;   // 0 - 100
  hunger: number;   // 0 - 100
  mood: number;     // 0 - 100
  hygiene: number;  // 0 - 100
  money: number;
  day: number;
  hour: number;     // 0 - 23
  followers: number;
  subscribers: number;
  hype: number;     // 0 - 100
  reputation: number; // 0 - 100
  totalStreams: number;
  totalDonationsEarned: number;
  totalHoursStreamed: number;
  currentJobId: string;
  isFullTimeStreamer: boolean;
}

export interface ActiveStreamSession {
  gameId: string;
  title: string;
  durationMinutes: number;
  currentViewers: number;
  peakViewers: number;
  sessionMoney: number;
  sessionFollowers: number;
  hypeMeter: number; // 0 - 100
  miniGameScore: number;
  toxicCommentsCount: number;
  bannedToxicCount: number;
  missedToxicCount: number;
  chatToxicityLevel: number; // 0 - 100 (high toxicity loses viewers!)
  activeSponsorId?: string;
  sponsorSecondsRemaining: number;
}

export interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'donation' | 'alert';
  amount?: number;
}

import React, { useState } from 'react';
import { 
  MessageCircle, Heart, Repeat, Send, Sparkles, 
  Trophy, CheckCircle2, TrendingUp, Flame
} from 'lucide-react';
import { PlayerStats, SocialPost } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'p1',
    author: 'Кибер_Нарезчик',
    handle: '@timur_clips',
    avatar: '🎬',
    content: 'Залил новый шортс со вчерашней катки! Тот хедшот на банане разлетается по алгоритмам! 🔥 Смотреть всем!',
    likes: 1240,
    retweets: 310,
    timeAgo: '15м'
  },
  {
    id: 'p2',
    author: 'Алёна_СуперФан',
    handle: '@alena_heart',
    avatar: '💖',
    content: 'Обожаю наши вечерние стримы! Чат самый ламповый, особенно когда модераторы банят душнил и спамеров 🥰',
    likes: 870,
    retweets: 95,
    timeAgo: '1ч'
  },
  {
    id: 'p3',
    author: 'Киберспортивный Вестник',
    handle: '@esports_news',
    avatar: '🏆',
    content: 'Молодой стример показывает невероятный рост онлайна на русскоязычной платформе! Следим за развитием таланта.',
    likes: 2450,
    retweets: 620,
    timeAgo: '3ч'
  },
  {
    id: 'p4',
    author: 'Banned_Hater',
    handle: '@salt_lord',
    avatar: '🤡',
    content: 'Меня забанили просто за то что я написал правду в чате! Модерация токсичная! Отписка!!',
    likes: 12,
    retweets: 2,
    timeAgo: '5ч'
  }
];

const MILESTONES = [
  { id: 'm_first_stream', title: 'Первый эфир', desc: 'Провести свой первый прямой эфир', check: (s: PlayerStats) => s.totalStreams >= 1 },
  { id: 'm_followers_100', title: 'Сотня фанатов', desc: 'Набрать 100 фолловеров', check: (s: PlayerStats) => s.followers >= 100 },
  { id: 'm_followers_1000', title: 'Восходящая звезда', desc: 'Набрать 1,000 фолловеров', check: (s: PlayerStats) => s.followers >= 1000 },
  { id: 'm_donations_10k', title: 'Первые донаты', desc: 'Заработать 10,000 ₽ на донатах', check: (s: PlayerStats) => s.totalDonationsEarned >= 10000 },
  { id: 'm_fulltime', title: 'Свободный художник', desc: 'Уволиться и стать Full-Time стримером', check: (s: PlayerStats) => s.isFullTimeStreamer }
];

export const SocialView: React.FC<Props> = ({
  stats,
  onUpdateStats,
  onAddToast
}) => {
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  const [tweetText, setTweetText] = useState('');

  const handlePostTweet = () => {
    if (!tweetText.trim()) return;

    sound.playLevelUp();
    const newPost: SocialPost = {
      id: `my_post_${Date.now()}`,
      author: 'Вы (Стример)',
      handle: '@streamer_hero',
      avatar: '👑',
      content: tweetText,
      likes: Math.max(15, Math.floor(stats.followers * 0.35 + 5)),
      retweets: Math.max(2, Math.floor(stats.followers * 0.1)),
      timeAgo: 'только что',
      isUserPost: true
    };

    setPosts([newPost, ...posts]);
    setTweetText('');

    // Boost player hype
    onUpdateStats(p => ({
      ...p,
      hype: Math.min(100, p.hype + 15),
      followers: p.followers + Math.floor(Math.random() * 5) + 2
    }));

    onAddToast('Твит опубликован!', 'Фанаты активно лайкают пост! Хайп перед стримом вырос на +15%!', 'success');
  };

  const handleLikePost = (postId: string) => {
    sound.playClick();
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
      {/* Feed Column (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        {/* Tweet Composer */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-sky-500/30 shadow-xl">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase mb-3">
            <MessageCircle className="w-4 h-4" /> Vitter • Социальная сеть геймеров
          </div>

          <textarea
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            placeholder="О чем думаешь? Анонсируй вечерний стрим или поделись хайлайтом..."
            rows={3}
            className="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors resize-none"
          />

          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] text-slate-400 font-mono">
              Твит повышает хайп канала и привлекает новых зрителей!
            </span>

            <button
              onClick={handlePostTweet}
              disabled={!tweetText.trim()}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 active:scale-95 text-white font-mono font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              ОПУБЛИКОВАТЬ
            </button>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-3">
          {posts.map(post => (
            <div
              key={post.id}
              className={`p-4 rounded-2xl border transition-all ${
                post.isUserPost
                  ? 'bg-sky-950/20 border-sky-500/50 shadow-md'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{post.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {post.author}
                      {post.isUserPost && <span className="text-[10px] bg-sky-500 text-slate-950 font-black px-1.5 py-0.2 rounded">АВТОР</span>}
                    </h4>
                    <span className="text-xs text-slate-400">{post.handle} • {post.timeAgo}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{post.content}</p>

              {/* Interactions */}
              <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 font-mono">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-400 transition-colors cursor-pointer group"
                >
                  <Heart className="w-4 h-4 group-hover:scale-110 group-hover:fill-rose-500 transition-transform" />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer">
                  <Repeat className="w-4 h-4" />
                  <span>{post.retweets}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Achievements & Channel Milestones (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase mb-4">
            <Trophy className="w-4 h-4" /> Достижения Стримера
          </div>

          <div className="space-y-3">
            {MILESTONES.map(m => {
              const completed = m.check(stats);

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-xl border transition-all ${
                    completed
                      ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                      : 'bg-slate-950/40 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      {completed ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Trophy className="w-3.5 h-3.5 text-slate-500" />}
                      {m.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400">
                      {completed ? 'ПОЛУЧЕНО' : 'В ПРОЦЕССЕ'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Channel Analytics Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
          <div className="text-purple-400 font-bold uppercase mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Статистика Карьеры:
          </div>

          <div className="space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Всего стримов:</span>
              <strong className="text-white">{stats.totalStreams}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Часов в эфире:</span>
              <strong className="text-white">{stats.totalHoursStreamed} ч</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Заработано на донатах:</span>
              <strong className="text-emerald-400">{stats.totalDonationsEarned.toLocaleString()} ₽</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Подписчики (Сабы):</span>
              <strong className="text-pink-400">{stats.subscribers} чел.</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

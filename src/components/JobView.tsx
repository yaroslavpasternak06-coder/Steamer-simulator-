import React from 'react';
import { 
  Briefcase, DollarSign, Clock, Battery, 
  Smile, ShieldAlert, Award, CheckCircle2, TrendingUp, AlertTriangle
} from 'lucide-react';
import { PlayerStats, DayJob } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  jobs: DayJob[];
  onUpdateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

export const JobView: React.FC<Props> = ({
  stats,
  jobs,
  onUpdateStats,
  onAddToast
}) => {
  const currentJob = jobs.find(j => j.id === stats.currentJobId) || jobs[0];

  // Work a shift
  const handleWorkShift = (job: DayJob) => {
    if (stats.energy < job.energyCost) {
      onAddToast('Слишком устал!', `Для работы нужно ${job.energyCost} энергии. Поспи или покушай!`, 'warning');
      return;
    }
    if (stats.hunger < job.hungerCost) {
      onAddToast('Голод!', `Желудок урчит так, что работать невозможно. Сначала поешь!`, 'warning');
      return;
    }

    sound.playCoins();
    onUpdateStats(p => {
      const nextHour = (p.hour + job.hours) % 24;
      const nextDay = p.hour + job.hours >= 24 ? p.day + 1 : p.day;

      return {
        ...p,
        money: p.money + job.salary,
        energy: Math.max(0, p.energy - job.energyCost),
        hunger: Math.max(0, p.hunger - job.hungerCost),
        mood: Math.max(0, p.mood - job.moodCost),
        hour: nextHour,
        day: nextDay
      };
    });

    onAddToast(
      'Смена завершена!',
      `Вы отработали ${job.hours} часов в «${job.company}» и заработали ${job.salary.toLocaleString()} ₽!`,
      'success'
    );
  };

  // Quick freelance gig for emergency cash
  const handleQuickGig = () => {
    if (stats.energy < 15) {
      onAddToast('Нет сил!', 'Даже на разовую подработку нужно минимум 15 энергии.', 'warning');
      return;
    }
    sound.playCoins();
    onUpdateStats(p => ({
      ...p,
      money: p.money + 900,
      energy: Math.max(0, p.energy - 15),
      hunger: Math.max(0, p.hunger - 10),
      hour: (p.hour + 2) % 24
    }));
    onAddToast('Разовая подработка!', 'Разгрузил коробки или настроил роутер соседу: +900 ₽ (2 часа).', 'info');
  };

  // Change job / promote
  const handleSelectJob = (job: DayJob) => {
    if (stats.followers < job.minFollowersRequired) {
      onAddToast('Недостаточно подписчиков!', `Для должности «${job.title}» нужно иметь портфолио и от ${job.minFollowersRequired} фолловеров!`, 'alert');
      return;
    }
    sound.playLevelUp();
    onUpdateStats(p => ({
      ...p,
      currentJobId: job.id,
      isFullTimeStreamer: false
    }));
    onAddToast('Новая работа!', `Вы успешно устроились на позицию «${job.title}» в «${job.company}»!`, 'success');
  };

  // Resign & Go Full-Time Streamer
  const handleQuitJob = () => {
    sound.playLevelUp();
    onUpdateStats(p => ({
      ...p,
      isFullTimeStreamer: !p.isFullTimeStreamer
    }));

    if (!stats.isFullTimeStreamer) {
      onAddToast(
        'СВОБОДА!',
        'Вы уволились с основной работы и стали Full-Time стримером! Теперь всё ваше время принадлежит стримам и фанатам!',
        'success'
      );
    } else {
      onAddToast('Возврат на работу', 'Вы снова числитесь сотрудником и можете брать смены.', 'info');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Career Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-4 h-4" /> Дневная Работа и Карьера
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {stats.isFullTimeStreamer ? 'Профессиональный Стример (Full-Time)' : `Текущая работа: ${currentJob.title}`}
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              {stats.isFullTimeStreamer
                ? 'Вы уволились и живете исключительно на донаты, подписки и рекламные контракты со стримов!'
                : 'Отрабатывай смены, чтобы вовремя платить за аренду квартиры, свет и интернет, а остатки вкладывать в покупку топового ПК!'}
            </p>
          </div>

          {/* Resign / Re-join Full-Time Button */}
          <button
            onClick={handleQuitJob}
            className={`px-5 py-3 rounded-xl font-bold text-xs font-mono transition-all active:scale-95 cursor-pointer shadow-lg border ${
              stats.isFullTimeStreamer
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                : 'bg-rose-600 hover:bg-rose-500 text-white border-rose-400/50 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
            }`}
          >
            {stats.isFullTimeStreamer ? '↩️ Вернуться к подработкам' : '🔥 Уволиться (Full-Time Стример)'}
          </button>
        </div>
      </div>

      {/* Main Shift Action Card (If not full-time or needs cash) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="text-xs text-blue-400 font-mono uppercase font-bold">
              {currentJob.company} • Смена {currentJob.hours} часов
            </div>
            <h3 className="text-xl font-bold text-white mt-1">{currentJob.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{currentJob.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Оплата за смену:</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                +{currentJob.salary.toLocaleString()} ₽
              </span>
            </div>

            <button
              onClick={() => handleWorkShift(currentJob)}
              className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              ОТРАБОТАТЬ СМЕНУ
            </button>
          </div>
        </div>

        {/* Shift Costs Details */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">ДЛИТЕЛЬНОСТЬ</span>
              <span className="text-white font-bold">{currentJob.hours} часа</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <Battery className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">РАСХОД ЭНЕРГИИ</span>
              <span className="text-amber-300 font-bold">-{currentJob.energyCost}%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">ЗАРПЛАТА</span>
              <span className="text-emerald-300 font-bold">+{currentJob.salary} ₽</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <Smile className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">УСТАЛОСТЬ / НАСТРОЕНИЕ</span>
              <span className="text-rose-300 font-bold">-{currentJob.moodCost}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Vacancies & Career Progression */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 font-mono uppercase mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" /> Вакансии и Карьерный рост:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => {
            const isCurrent = job.id === currentJob.id;
            const hasFollowers = stats.followers >= job.minFollowersRequired;

            return (
              <div
                key={job.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                      Уровень {job.tier}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Текущая должность
                      </span>
                    )}
                    {!hasFollowers && (
                      <span className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5" /> Нужно {job.minFollowersRequired} фолловеров
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white">{job.title}</h4>
                  <div className="text-xs text-slate-400">{job.company}</div>
                  <p className="text-xs text-slate-300 mt-2">{job.description}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-mono">
                    <span className="text-slate-400">З/П: </span>
                    <strong className="text-emerald-400 font-bold">{job.salary.toLocaleString()} ₽</strong>
                    <span className="text-slate-500 ml-1">({job.hours}ч)</span>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => handleSelectJob(job)}
                      disabled={!hasFollowers}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        hasFollowers
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      Устроиться
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Emergency Gig Card */}
      <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <span>⚡ Срочная подработка (Быстрые деньги на оплату счетов)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Если подходит срок оплаты аренды или интернета, возьми быструю 2-часовую халтуру (+900 ₽).
          </p>
        </div>

        <button
          onClick={handleQuickGig}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-slate-950 font-mono font-bold text-xs transition-all whitespace-nowrap cursor-pointer shadow-md"
        >
          Взять халтуру (+900 ₽ / 2ч)
        </button>
      </div>
    </div>
  );
};

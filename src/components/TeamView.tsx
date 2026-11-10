import React from 'react';
import { 
  Users, Shield, Scissors, Palette, Briefcase, 
  CheckCircle2, UserPlus, UserMinus, Sparkles, DollarSign, ArrowUpCircle
} from 'lucide-react';
import { PlayerStats, TeamMember } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  team: TeamMember[];
  onToggleHire: (memberId: string) => void;
  onUpgradeMember: (memberId: string) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

export const TeamView: React.FC<Props> = ({
  stats,
  team,
  onToggleHire,
  onUpgradeMember,
  onAddToast
}) => {
  const hiredMembers = team.filter(t => t.hired);
  const totalDailySalary = hiredMembers.reduce((sum, t) => sum + t.salaryDaily, 0);

  const handleHireClick = (member: TeamMember) => {
    sound.playLevelUp();
    onToggleHire(member.id);
    if (!member.hired) {
      onAddToast(
        'Сотрудник нанят!',
        `Вы наняли «${member.name}» в команду! Теперь стримы станут чище и продуктивнее.`,
        'success'
      );
    } else {
      onAddToast('Сотрудник уволен', `«${member.name}» больше не в вашей команде.`, 'info');
    }
  };

  const handleUpgrade = (member: TeamMember) => {
    const cost = member.salaryDaily * 4;
    if (stats.money < cost) {
      onAddToast('Недостаточно денег!', `Курсы повышения квалификации стоят ${cost} ₽.`, 'warning');
      return;
    }
    sound.playLevelUp();
    onUpgradeMember(member.id);
    onAddToast(
      'Повышение уровня!',
      `Сотрудник «${member.name}» прокачал навыки до Уровня ${member.level + 1}! Эффективность выросла!`,
      'success'
    );
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Team Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" /> Команда и Персонал Канала
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Модераторы, Монтажёры и Менеджеры
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Нанимай верных модераторов для мгновенного бана токсиков в чате, монтажёра для вирусных клипов на YouTube и PR-менеджера для спонсорских сделок!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">В команде:</span>
              <strong className="text-white text-base">{hiredMembers.length} чел.</strong>
            </div>
            <div className="border-l border-slate-700 pl-4">
              <span className="text-slate-400 block">Ежедневный оклад:</span>
              <strong className="text-amber-400 text-base font-black">-{totalDailySalary.toLocaleString()} ₽/день</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map(member => {
          const upgradeCost = member.salaryDaily * 4;

          return (
            <div
              key={member.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                member.hired
                  ? 'bg-purple-950/30 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl">{member.avatar}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">{member.name}</h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800 text-purple-300 uppercase">
                        {member.role === 'mod_bot' ? 'Бот-модератор' :
                         member.role === 'moderator' ? 'Модератор чата' :
                         member.role === 'editor' ? 'Видеомонтажер' :
                         member.role === 'designer' ? 'Стрим-дизайнер' : 'PR-Менеджер'}
                      </span>
                    </div>
                  </div>

                  {member.hired && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                      <CheckCircle2 className="w-4 h-4" /> В ШТАТЕ
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-2">{member.effectDescription}</p>

                {/* Efficiency metrics */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs font-mono">
                  {member.autoBanChance > 0 && (
                    <div className="flex items-center justify-between text-rose-300">
                      <span>Шанс бана токсиков:</span>
                      <strong>{Math.round(member.autoBanChance * 100)}%</strong>
                    </div>
                  )}
                  {member.passiveViewsDaily > 0 && (
                    <div className="flex items-center justify-between text-cyan-300">
                      <span>Фолловеры с клипов:</span>
                      <strong>+{member.passiveViewsDaily}/день</strong>
                    </div>
                  )}
                  {member.retentionBonus > 0 && (
                    <div className="flex items-center justify-between text-emerald-300">
                      <span>Удержание зрителей:</span>
                      <strong>+{member.retentionBonus}%</strong>
                    </div>
                  )}
                  {member.sponsorBoost > 0 && (
                    <div className="flex items-center justify-between text-amber-300">
                      <span>Бонус от брендов:</span>
                      <strong>+{member.sponsorBoost}%</strong>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
                    <span>Уровень навыка:</span>
                    <strong className="text-purple-300">Lvl {member.level}</strong>
                  </div>
                </div>
              </div>

              {/* Actions & Hire / Fire */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono mb-3">
                  <span className="text-slate-400">Оклад:</span>
                  <strong className="text-amber-400 font-bold">{member.salaryDaily.toLocaleString()} ₽ / день</strong>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleHireClick(member)}
                    className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                      member.hired
                        ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md'
                    }`}
                  >
                    {member.hired ? (
                      <>
                        <UserMinus className="w-3.5 h-3.5" /> Уволить
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" /> Нанять
                      </>
                    )}
                  </button>

                  {member.hired ? (
                    <button
                      onClick={() => handleUpgrade(member)}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-mono text-xs font-bold transition-all active:scale-95 cursor-pointer border border-purple-500/30 flex items-center justify-center gap-1"
                    >
                      <ArrowUpCircle className="w-3.5 h-3.5" /> Курсы ({upgradeCost} ₽)
                    </button>
                  ) : (
                    <div className="flex items-center justify-center text-[11px] text-slate-500 font-mono">
                      Доступен к найму
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

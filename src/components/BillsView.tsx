import React from 'react';
import { 
  CreditCard, AlertTriangle, CheckCircle2, Clock, 
  Home, Wifi, Zap, Music, DollarSign, Handshake, PlayCircle, Award
} from 'lucide-react';
import { PlayerStats, BillItem, SponsorContract } from '../types/game';
import { sound } from '../utils/sound';

interface Props {
  stats: PlayerStats;
  bills: BillItem[];
  sponsors: SponsorContract[];
  onPayBill: (billId: string) => void;
  onPayAllBills: () => void;
  onToggleSponsor: (sponsorId: string) => void;
  onClaimSponsorReward: (sponsorId: string) => void;
  onAddToast: (title: string, message: string, type: 'info' | 'success' | 'warning' | 'donation' | 'alert') => void;
}

export const BillsView: React.FC<Props> = ({
  stats,
  bills,
  sponsors,
  onPayBill,
  onPayAllBills,
  onToggleSponsor,
  onClaimSponsorReward,
  onAddToast
}) => {
  const unpaidBills = bills.filter(b => !b.isPaid);
  const totalUnpaid = unpaidBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePay = (bill: BillItem) => {
    if (stats.money < bill.amount) {
      onAddToast('Недостаточно денег!', `Нужно ${bill.amount.toLocaleString()} ₽ для оплаты «${bill.name}». Срочно заработай на смене!`, 'warning');
      return;
    }
    sound.playCoins();
    onPayBill(bill.id);
    onAddToast('Счет оплачен!', `Счет «${bill.name}» успешно оплачен на ${bill.amount.toLocaleString()} ₽!`, 'success');
  };

  const handlePayAll = () => {
    if (stats.money < totalUnpaid) {
      onAddToast('Недостаточно денег!', `Для оплаты всех счетов нужно ${totalUnpaid.toLocaleString()} ₽.`, 'warning');
      return;
    }
    sound.playCoins();
    onPayAllBills();
    onAddToast('Все счета закрыты!', `Вы закрыли все долги и счета на сумму ${totalUnpaid.toLocaleString()} ₽! Спите спокойно!`, 'success');
  };

  const getBillIcon = (cat: BillItem['category']) => {
    switch (cat) {
      case 'rent': return <Home className="w-5 h-5 text-indigo-400" />;
      case 'internet': return <Wifi className="w-5 h-5 text-cyan-400" />;
      case 'electricity': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'subscriptions': return <Music className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/30 shadow-2xl overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" /> Финансы, Счета и Контракты
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              Оплата квартиры, коммуналки и спонсоры
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Следи за датами счетов! Неоплаченный интернет заблокирует возможность стримить, а долг по аренде грозит выселением.
            </p>
          </div>

          {unpaidBills.length > 0 && (
            <button
              onClick={handlePayAll}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs shadow-lg active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              ОПЛАТИТЬ ВСЕ СЧЕТА ({totalUnpaid.toLocaleString()} ₽)
            </button>
          )}
        </div>
      </div>

      {/* Overdue Warning Alert */}
      {bills.some(b => !b.isPaid && stats.day >= b.dueDay) && (
        <div className="p-4 rounded-xl bg-rose-950/80 border-2 border-rose-500 flex items-center gap-3 text-rose-200 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
          <div className="text-xs">
            <strong className="text-white block text-sm">ВНИМАНИЕ! ИМЕЮТСЯ ПРОСРОЧЕННЫЕ СЧЕТА!</strong>
            Срок оплаты истек! Провайдер грозит отключить интернет, а арендодатель требует деньги. Оплатите немедленно!
          </div>
        </div>
      )}

      {/* Bills Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-300 font-mono uppercase mb-3 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-rose-400" /> Регулярные счета:
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bills.map(bill => {
            const isDueSoon = !bill.isPaid && stats.day >= bill.dueDay - 1;
            const isOverdue = !bill.isPaid && stats.day >= bill.dueDay;

            return (
              <div
                key={bill.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  bill.isPaid
                    ? 'bg-slate-900/60 border-slate-800 opacity-80'
                    : isOverdue
                    ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getBillIcon(bill.category)}
                      <span className="text-xs font-mono font-bold uppercase text-slate-400">
                        {bill.category === 'rent' ? 'Аренда жилья' :
                         bill.category === 'internet' ? 'Провайдер связи' :
                         bill.category === 'electricity' ? 'ЖКХ Энергия' : 'Сервисы'}
                      </span>
                    </div>

                    {bill.isPaid ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 font-mono">
                        <CheckCircle2 className="w-4 h-4" /> ОПЛАЧЕНО
                      </span>
                    ) : (
                      <span className={`text-xs font-mono font-bold flex items-center gap-1 ${
                        isOverdue ? 'text-rose-400 animate-pulse' : 'text-amber-400'
                      }`}>
                        <Clock className="w-3.5 h-3.5" />
                        Срок: День {bill.dueDay} (сейчас День {stats.day})
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mt-1">{bill.name}</h4>
                  <div className="text-xl font-black text-slate-100 font-mono mt-1">
                    {bill.amount.toLocaleString()} ₽
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {bill.isPaid ? 'До следующего цикла счетов' : isOverdue ? 'ПРОСРОЧЕНО!' : 'Ожидает оплаты'}
                  </span>

                  {!bill.isPaid && (
                    <button
                      onClick={() => handlePay(bill)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      Оплатить {bill.amount.toLocaleString()} ₽
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Brand Sponsorship Contracts */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 font-mono uppercase flex items-center gap-2">
            <Handshake className="w-4 h-4 text-amber-400" /> Рекламные контракты от брендов:
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Стримь с логотипом спонсора и получай выплаты!
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sponsors.map(sponsor => {
            const hasFollowers = stats.followers >= sponsor.minFollowers;
            const progress = Math.min(100, Math.round((sponsor.minutesStreamed / sponsor.minutesRequired) * 100));

            return (
              <div
                key={sponsor.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  sponsor.completed
                    ? 'bg-slate-900/60 border-slate-800'
                    : sponsor.active
                    ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/90 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{sponsor.logo}</span>
                      <h4 className="text-base font-bold text-white">{sponsor.brand}</h4>
                    </div>

                    <span className="text-base font-black text-amber-400 font-mono">
                      +{sponsor.rewardMoney.toLocaleString()} ₽
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">«{sponsor.tagline}»</p>

                  <div className="mt-3 text-xs font-mono text-slate-400">
                    Требуется: провести в эфире {sponsor.minutesRequired} минут.
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono mb-1 text-slate-400">
                      <span>Прогресс: {sponsor.minutesStreamed} / {sponsor.minutesRequired} мин</span>
                      <span className="text-amber-400 font-bold">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {!hasFollowers ? (
                    <span className="text-xs text-slate-500 font-mono">
                      Нужно от {sponsor.minFollowers} фолловеров
                    </span>
                  ) : sponsor.completed ? (
                    <span className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Контракт выполнен и выплачен
                    </span>
                  ) : sponsor.minutesStreamed >= sponsor.minutesRequired ? (
                    <button
                      onClick={() => onClaimSponsorReward(sponsor.id)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-mono font-black text-xs shadow-lg active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      ЗАБРАТЬ ГОНОРАР (+{sponsor.rewardMoney.toLocaleString()} ₽)
                    </button>
                  ) : (
                    <button
                      onClick={() => onToggleSponsor(sponsor.id)}
                      className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                        sponsor.active
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {sponsor.active ? 'Активен на стриме' : 'Выбрать спонсора'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

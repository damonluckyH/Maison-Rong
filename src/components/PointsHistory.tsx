'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { PointsLog } from '@/lib/loyalty';

type Filter = 'all' | 'earned' | 'spent';

interface PointsHistoryProps {
  logs: PointsLog[];
}

function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const REASON_KEYS = new Set([
  'register',
  'purchase',
  'birthday',
  'invite',
  'inviteOrder',
  'review',
  'share',
]);

export default function PointsHistory({ logs }: PointsHistoryProps) {
  const t = useTranslations('loyalty');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    if (filter === 'earned') return logs.filter((l) => l.amount > 0);
    if (filter === 'spent') return logs.filter((l) => l.amount < 0);
    return logs;
  }, [logs, filter]);

  const reasonLabel = (reason: string) => {
    const key = `reason${reason.charAt(0).toUpperCase()}${reason.slice(1)}` as
      | 'reasonRegister'
      | 'reasonPurchase'
      | 'reasonBirthday'
      | 'reasonInvite'
      | 'reasonInviteOrder'
      | 'reasonReview'
      | 'reasonShare';
    if (REASON_KEYS.has(reason)) return t(key);
    return reason;
  };

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: t('filterAll') },
    { id: 'earned', label: t('filterEarned') },
    { id: 'spent', label: t('filterSpent') },
  ];

  return (
    <div className="rounded-xl border border-brand-gold/20 bg-brand-black-light/40 p-6 backdrop-blur-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-serif text-xl text-brand-gold tracking-widest">{t('pointsHistory')}</h2>
        <div className="flex gap-2">
          {filters.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={`rounded border px-3 py-1 text-xs tracking-wider transition ${
                filter === id
                  ? 'border-brand-gold/60 bg-brand-gold/10 text-brand-gold'
                  : 'border-brand-gold/20 text-gray-500 hover:border-brand-gold/40'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-600">{t('noHistory')}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-gold/10 text-xs uppercase tracking-widest text-gray-500">
                <th className="pb-3 pr-4 font-normal">{t('colTime')}</th>
                <th className="pb-3 pr-4 font-normal">{t('colChange')}</th>
                <th className="pb-3 pr-4 font-normal">{t('colReason')}</th>
                <th className="pb-3 font-normal">{t('colBalance')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => (
                <tr key={log.id} className="border-b border-brand-gold/5 last:border-0">
                  <td className="py-3 pr-4 text-gray-400 whitespace-nowrap">
                    {formatDate(log.createdAt, 'vi-VN')}
                  </td>
                  <td
                    className={`py-3 pr-4 font-medium whitespace-nowrap ${
                      log.amount > 0 ? 'text-brand-jade' : log.amount < 0 ? 'text-brand-red' : 'text-gray-400'
                    }`}
                  >
                    {log.amount > 0 ? '+' : ''}
                    {log.amount.toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-gray-300">{reasonLabel(log.reason)}</td>
                  <td className="py-3 text-brand-gold-light whitespace-nowrap">
                    {log.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

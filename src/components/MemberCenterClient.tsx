'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import TierCard from '@/components/TierCard';
import PointsHistory from '@/components/PointsHistory';
import TierUpgradeModal from '@/components/TierUpgradeModal';
import type { PointsLog, Tier } from '@/lib/loyalty';

interface MemberCenterClientProps {
  locale: string;
  initialPoints: number;
  initialTier: Tier;
  initialLogs: PointsLog[];
}

export default function MemberCenterClient({
  locale,
  initialPoints,
  initialTier,
  initialLogs,
}: MemberCenterClientProps) {
  const t = useTranslations('loyalty');
  const [points, setPoints] = useState(initialPoints);
  const [tier, setTier] = useState(initialTier);
  const [logs, setLogs] = useState(initialLogs);
  const [upgradeTier, setUpgradeTier] = useState<Tier | null>(null);

  const handleUpgradeClose = useCallback(() => setUpgradeTier(null), []);

  const refreshFromApi = useCallback(async (amount?: number, reason?: string) => {
    const res = await fetch('/api/points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(amount !== undefined ? { amount, reason } : {}),
    });
    if (!res.ok) return;
    const data = await res.json();
    setPoints(data.points);
    setTier(data.tier);
    setLogs(data.logs);
    if (data.upgraded && data.newTier) {
      setUpgradeTier(data.newTier);
    }
  }, []);

  return (
    <>
      {upgradeTier && <TierUpgradeModal tier={upgradeTier} onClose={handleUpgradeClose} />}

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-gradient-gold tracking-widest">{t('memberCenter')}</h1>
        </div>

        <TierCard points={points} tier={tier} />

        <PointsHistory logs={logs} />

        <div className="flex flex-col items-center gap-4 rounded-xl border border-brand-gold/20 bg-brand-black-light/30 p-6 text-center">
          <Link
            href={`/${locale}/member/bazi-report`}
            className="inline-block rounded border border-brand-gold/40 px-8 py-3 text-sm text-brand-gold-light tracking-widest transition hover:border-brand-gold hover:bg-brand-gold/10"
          >
            {t('baziEntry')}
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refreshFromApi(900, 'purchase')}
              className="rounded border border-brand-gold/30 px-4 py-2 text-xs text-gray-500 hover:text-brand-gold"
            >
              +900 (dev)
            </button>
            <button
              type="button"
              onClick={() => refreshFromApi(4000, 'purchase')}
              className="rounded border border-brand-gold/30 px-4 py-2 text-xs text-gray-500 hover:text-brand-gold"
            >
              +4000 (dev)
            </button>
          </div>
        )}
      </div>
    </>
  );
}

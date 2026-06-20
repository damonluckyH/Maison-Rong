'use client';

import { useTranslations } from 'next-intl';
import {
  ALL_PRIVILEGES,
  calculateTier,
  getNextTier,
  getPointsToNext,
  getTierProgress,
  isPrivilegeUnlocked,
  type Tier,
} from '@/lib/loyalty';

interface TierCardProps {
  points: number;
  tier: Tier;
}

export default function TierCard({ points, tier }: TierCardProps) {
  const t = useTranslations('loyalty');
  const tierInfo = calculateTier(points);
  const nextTier = getNextTier(points);
  const progress = getTierProgress(points);
  const remaining = getPointsToNext(points);

  const tierNameKey = `tier${tierInfo.tier.charAt(0)}${tierInfo.tier.slice(1).toLowerCase()}` as
    | 'tierBronze'
    | 'tierSilver'
    | 'tierGold'
    | 'tierPlatinum'
    | 'tierDiamond';

  const nextTierNameKey = nextTier
    ? (`tier${nextTier.tier.charAt(0)}${nextTier.tier.slice(1).toLowerCase()}` as
        | 'tierBronze'
        | 'tierSilver'
        | 'tierGold'
        | 'tierPlatinum'
        | 'tierDiamond')
    : null;

  return (
    <div
      className="relative overflow-hidden rounded-xl border bg-brand-black-light/60 p-6 backdrop-blur-sm"
      style={{ borderColor: `${tierInfo.color}66` }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: tierInfo.color }}
      />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{
              backgroundColor: `${tierInfo.color}22`,
              boxShadow: `0 0 24px ${tierInfo.color}44`,
            }}
          >
            {tierInfo.icon}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">{t('currentTier')}</p>
            <h2 className="font-serif text-2xl tracking-widest" style={{ color: tierInfo.color }}>
              {t(tierNameKey)}
            </h2>
            <p className="mt-1 text-sm text-brand-gold-light">
              {t('pointsEarned', { points: points.toLocaleString() })}
            </p>
          </div>
        </div>
      </div>

      {nextTier && nextTierNameKey && (
        <div className="relative mt-6">
          <div className="mb-2 flex justify-between text-xs text-gray-500">
            <span>{points.toLocaleString()}</span>
            <span>{nextTier.minPoints.toLocaleString()}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-brand-black">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #C41E3A 0%, #D4A843 50%, #F0D68A 100%)',
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-400">
            {t('pointsToNext', {
              remaining: remaining.toLocaleString(),
              nextTier: t(nextTierNameKey),
            })}
          </p>
        </div>
      )}

      {!nextTier && (
        <p className="relative mt-6 text-sm text-brand-gold-light italic">{t('maxTierReached')}</p>
      )}

      <div className="relative mt-8">
        <h3 className="mb-4 text-xs uppercase tracking-[0.25em] text-brand-gold">{t('privilegesTitle')}</h3>
        <ul className="space-y-3">
          {ALL_PRIVILEGES.map(({ key, minTier }) => {
            const unlocked = isPrivilegeUnlocked(tier, minTier);
            return (
              <li key={key} className="flex items-start gap-3 text-sm">
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                    unlocked
                      ? 'bg-brand-gold/20 text-brand-gold'
                      : 'border border-gray-600 text-gray-600'
                  }`}
                >
                  {unlocked ? '✓' : '○'}
                </span>
                <span className={unlocked ? 'text-gray-200' : 'text-gray-600'}>{t(key)}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import type { CrestConfig } from '@/lib/familyCrest';
import { generateFamilyCrestSvg, svgToDataUrl } from '@/lib/familyCrest';

interface BeddingPreviewProps {
  config: CrestConfig;
}

export default function BeddingPreview({ config }: BeddingPreviewProps) {
  const t = useTranslations('customize');

  const crestSvg = useMemo(() => generateFamilyCrestSvg(config), [config]);
  const crestUrl = useMemo(() => svgToDataUrl(crestSvg), [crestSvg]);

  const isPillow = config.position === 'pillow';
  const isDuvet = config.position === 'duvet-edge';
  const isSheet = config.position === 'sheet-edge';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PreviewItem
        label={t('previewPillow')}
        active={isPillow}
        render={(active) => (
          <svg viewBox="0 0 200 160" className="h-full w-full">
            <rect width="200" height="160" fill="#2A2A2A" rx="4" />
            <rect x="20" y="30" width="160" height="100" fill="#1A1A1A" stroke="#333" strokeWidth="1" rx="2" />
            {active && (
              <image href={crestUrl} x="70" y="55" width="60" height="60" opacity="0.95" />
            )}
            {!active && (
              <image href={crestUrl} x="70" y="55" width="60" height="60" opacity="0.25" />
            )}
          </svg>
        )}
      />

      <PreviewItem
        label={t('previewDuvet')}
        active={isDuvet}
        render={(active) => (
          <svg viewBox="0 0 200 160" className="h-full w-full">
            <rect width="200" height="160" fill="#2A2A2A" rx="4" />
            <rect x="10" y="20" width="180" height="120" fill="#1A1A1A" stroke="#333" strokeWidth="1" rx="2" />
            <line x1="10" y1="80" x2="190" y2="80" stroke="#333" strokeWidth="0.5" strokeDasharray="4" />
            {active && (
              <image href={crestUrl} x="130" y="25" width="50" height="50" opacity="0.95" />
            )}
            {!active && (
              <image href={crestUrl} x="130" y="25" width="50" height="50" opacity="0.2" />
            )}
          </svg>
        )}
      />

      <PreviewItem
        label={t('previewSheet')}
        active={isSheet}
        render={(active) => (
          <svg viewBox="0 0 200 160" className="h-full w-full">
            <rect width="200" height="160" fill="#2A2A2A" rx="4" />
            <rect x="15" y="25" width="170" height="110" fill="#1A1A1A" stroke="#333" strokeWidth="1" rx="2" />
            {active && (
              <image href={crestUrl} x="15" y="85" width="45" height="45" opacity="0.95" />
            )}
            {!active && (
              <image href={crestUrl} x="15" y="85" width="45" height="45" opacity="0.2" />
            )}
          </svg>
        )}
      />
    </div>
  );
}

function PreviewItem({
  label,
  active,
  render,
}: {
  label: string;
  active: boolean;
  render: (active: boolean) => React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-lg border transition ${
        active ? 'border-brand-gold/60 glow-gold' : 'border-brand-gold/10'
      }`}
    >
      <div className="h-40 bg-brand-black-light">{render(active)}</div>
      <p className={`py-2 text-center text-xs tracking-widest uppercase ${
        active ? 'text-brand-gold' : 'text-gray-600'
      }`}>
        {label}
      </p>
    </div>
  );
}

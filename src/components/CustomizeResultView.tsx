'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { CrestConfig } from '@/lib/familyCrest';
import {
  generateFamilyCrestSvg,
  downloadSvgAsPng,
  crestConfigToQuery,
  HERITAGE_BEDDING_PRICE,
} from '@/lib/familyCrest';
import { formatVnd } from '@/lib/products';
import { notifyCartUpdated } from '@/components/CartIcon';

interface CustomizeResultViewProps {
  config: CrestConfig;
  locale: string;
}

export default function CustomizeResultView({ config, locale }: CustomizeResultViewProps) {
  const t = useTranslations('customize');
  const tp = useTranslations('products');
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const crestSvg = useMemo(() => generateFamilyCrestSvg(config), [config]);
  const editHref = `/${locale}/products/bedding/customize?${crestConfigToQuery(config)}`;

  const handleDownload = () => {
    const safeName = config.surname.replace(/\s+/g, '-');
    downloadSvgAsPng(crestSvg, `maison-lac-gia-huy-${safeName}.png`);
  };

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: 'heritage-family-bedding', quantity: 1 }),
    });
    setAdding(false);

    if (res.status === 401) {
      router.push(`/${locale}/login`);
      return;
    }

    if (res.ok) {
      notifyCartUpdated();
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-2 text-brand-gold text-xs tracking-[0.4em] uppercase">{t('resultTitle')}</p>
        <h1 className="font-serif text-4xl text-gradient-gold tracking-widest md:text-5xl">
          {t('familyLabel', { surname: config.surname })}
        </h1>
      </div>

      <div className="relative mb-10 rounded-xl border border-brand-gold/30 bg-brand-black-light p-8 glow-gold">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent" />
        <div
          className="mx-auto flex max-w-[320px] items-center justify-center"
          dangerouslySetInnerHTML={{ __html: crestSvg }}
        />
      </div>

      <div className="mb-8 space-y-3 rounded-lg border border-brand-gold/15 bg-brand-black-light/60 p-6">
        <h2 className="mb-4 text-center text-xs text-gray-500 uppercase tracking-widest">
          {t('configSummary')}
        </h2>
        <SummaryRow label={t('style')} value={t(`styles.${config.style}`)} />
        <SummaryRow label={t('colorScheme')} value={t(`colors.${config.colorScheme}`)} />
        <SummaryRow label={t('position')} value={t(`positions.${config.position}`)} />
      </div>

      <div className="mb-10 text-center">
        <p className="font-serif text-brand-gold-light text-lg tracking-wide">
          {t('productName', { surname: config.surname })}
        </p>
        <p className="mt-3 font-serif text-2xl text-brand-gold">{formatVnd(HERITAGE_BEDDING_PRICE)}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="btn-gold flex-1 rounded py-3.5 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-50"
        >
          {adding ? '...' : tp('addToCart')}
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="flex-1 rounded border border-brand-gold/40 py-3.5 text-sm text-brand-gold-light tracking-widest transition hover:border-brand-gold hover:bg-brand-gold/10"
        >
          {t('downloadCrest')}
        </button>
        <Link
          href={editHref}
          className="flex-1 rounded border border-brand-gold/20 py-3.5 text-center text-sm text-gray-400 tracking-widest transition hover:border-brand-gold/40 hover:text-brand-gold"
        >
          {t('editBack')}
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-brand-gold/10 pb-2 last:border-0">
      <span className="text-gray-500 text-xs uppercase tracking-widest">{label}</span>
      <span className="text-brand-gold-light text-sm">{value}</span>
    </div>
  );
}

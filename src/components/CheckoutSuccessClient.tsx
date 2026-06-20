'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useSearchParams } from 'next/navigation';
import { formatVnd } from '@/lib/products';

export default function CheckoutSuccessClient() {
  const t = useTranslations('checkout');
  const tc = useTranslations('cart');
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = params.locale as string;

  const orderId = searchParams.get('orderId') ?? '—';
  const total = Number(searchParams.get('total') ?? 0);
  const points = Number(searchParams.get('points') ?? 0);

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mb-6 text-5xl">✓</div>
      <h1 className="font-serif text-3xl text-gradient-gold tracking-widest">{t('success')}</h1>

      <div className="mt-8 space-y-3 rounded-lg border border-brand-gold/20 bg-brand-black-light/40 p-6 text-left">
        <p className="text-sm text-gray-400">
          {t('orderNumber')}: <span className="text-brand-gold">{orderId}</span>
        </p>
        <p className="text-sm text-gray-400">
          {tc('total')}: <span className="text-brand-gold-light">{formatVnd(total)}</span>
        </p>
        <p className="text-sm text-gray-400">
          {t('pointsEarned', { points: points.toLocaleString() })}
        </p>
      </div>

      <Link
        href={`/${locale}`}
        className="btn-gold mt-10 inline-block rounded px-8 py-3 text-sm font-medium tracking-widest text-brand-black uppercase"
      >
        {t('continueShopping')}
      </Link>
    </div>
  );
}

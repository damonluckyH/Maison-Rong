'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { formatVnd } from '@/lib/products';
import type { CartLineItem } from '@/lib/cart';

interface CartLine extends CartLineItem {}

export default function CartPageClient() {
  const t = useTranslations('cart');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [items, setItems] = useState<CartLine[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/cart?locale=${locale}`);
    if (res.status === 401) {
      router.push(`/${locale}/login`);
      return;
    }
    const data = await res.json();
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [locale, router]);

  useEffect(() => {
    load();
  }, [load]);

  const updateQty = async (productId: string, quantity: number) => {
    const res = await fetch('/api/cart', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
      window.dispatchEvent(new Event('cart-updated'));
    }
  };

  const removeItem = async (productId: string) => {
    await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' });
    load();
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return <p className="py-20 text-center text-gray-500">...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="font-serif text-2xl text-brand-gold tracking-widest">{t('empty')}</p>
        <p className="mt-3 text-sm text-gray-500">{t('emptyHint')}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-block rounded border border-brand-gold/40 px-6 py-2.5 text-sm text-brand-gold tracking-widest transition hover:bg-brand-gold/10"
        >
          {t('backHome')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl text-gradient-gold tracking-widest">{t('title')}</h1>

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex gap-4 rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-brand-black-light">
              {item.image ? (
                <Image src={item.image} alt={item.productName} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-2xl">✦</div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="font-serif text-brand-gold-light">{item.productName}</p>
                <p className="text-sm text-gray-500">{formatVnd(item.unitPrice)}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.quantity - 1)}
                    className="h-7 w-7 rounded border border-brand-gold/30 text-brand-gold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.productId, item.quantity + 1)}
                    className="h-7 w-7 rounded border border-brand-gold/30 text-brand-gold"
                  >
                    +
                  </button>
                </div>
                <p className="text-brand-gold">{formatVnd(item.lineTotal)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              className="self-start text-xs text-gray-500 hover:text-brand-red"
            >
              {t('remove')}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-brand-gold/10 pt-6">
        <p className="text-lg text-gray-300">
          {t('total')}: <span className="font-serif text-brand-gold">{formatVnd(total)}</span>
        </p>
        <Link
          href={`/${locale}/checkout`}
          className="btn-gold rounded px-8 py-3 text-sm font-medium tracking-widest text-brand-black uppercase"
        >
          {t('checkout')}
        </Link>
      </div>
    </div>
  );
}

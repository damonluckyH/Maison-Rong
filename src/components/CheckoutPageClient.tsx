'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { formatVnd } from '@/lib/products';
import type { PaymentMethod } from '@/lib/orders';

interface CartLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface CheckoutUser {
  fullName: string;
  phone?: string;
}

export default function CheckoutPageClient({ user }: { user: CheckoutUser }) {
  const t = useTranslations('checkout');
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  const [items, setItems] = useState<CartLine[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [recipientName, setRecipientName] = useState(user.fullName);
  const [recipientPhone, setRecipientPhone] = useState(user.phone ?? '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingNote, setShippingNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const load = useCallback(async () => {
    const res = await fetch(`/api/cart?locale=${locale}`);
    if (res.status === 401) {
      router.push(`/${locale}/login`);
      return;
    }
    const data = await res.json();
    if ((data.items ?? []).length === 0) {
      router.push(`/${locale}/cart`);
      return;
    }
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [locale, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientName,
        recipientPhone,
        shippingAddress,
        shippingNote,
        paymentMethod,
        locale,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setSubmitting(false);
      return;
    }

    window.dispatchEvent(new Event('cart-updated'));
    router.push(
      `/${locale}/checkout/success?orderId=${data.orderId}&total=${data.totalAmount}&points=${data.pointsEarned}`,
    );
  };

  const inputClass =
    'w-full rounded border border-brand-gold/20 bg-brand-black-light px-4 py-3 text-sm text-gray-200 outline-none focus:border-brand-gold/50';

  if (loading) {
    return <p className="py-20 text-center text-gray-500">...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 font-serif text-3xl text-gradient-gold tracking-widest">{t('title')}</h1>

      <div className="mb-8 rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-4">
        <p className="mb-3 text-xs uppercase tracking-widest text-gray-500">{t('shipping')}</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between text-sm text-gray-300">
              <span>
                {item.productName} × {item.quantity}
              </span>
              <span className="text-brand-gold-light">{formatVnd(item.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-brand-gold/10 pt-3 text-right font-serif text-brand-gold">
          {formatVnd(total)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-6">
          <h2 className="text-xs uppercase tracking-widest text-brand-gold">{t('shipping')}</h2>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t('name')}</label>
            <input className={inputClass} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t('phone')}</label>
            <input className={inputClass} value={recipientPhone} onChange={(e) => setRecipientPhone(e.target.value)} required />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t('address')}</label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder={t('addressPlaceholder')}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">{t('note')}</label>
            <input
              className={inputClass}
              value={shippingNote}
              onChange={(e) => setShippingNote(e.target.value)}
              placeholder={t('notePlaceholder')}
            />
          </div>
        </div>

        <div className="space-y-3 rounded-lg border border-brand-gold/10 bg-brand-black-light/40 p-6">
          <h2 className="text-xs uppercase tracking-widest text-brand-gold">{t('paymentMethod')}</h2>
          {(
            [
              { value: 'COD' as PaymentMethod, label: t('cod'), icon: '💰' },
              { value: 'BANK_TRANSFER' as PaymentMethod, label: t('bankTransfer'), icon: '🏦' },
              { value: 'CREDIT_CARD' as PaymentMethod, label: t('creditCard'), icon: '💳' },
            ] as const
          ).map(({ value, label, icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded border p-3 transition ${
                paymentMethod === value ? 'border-brand-gold/50 bg-brand-gold/5' : 'border-brand-gold/10'
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={value}
                checked={paymentMethod === value}
                onChange={() => setPaymentMethod(value)}
                className="accent-brand-gold"
              />
              <span>{icon}</span>
              <span className="text-sm text-gray-300">{label}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full rounded py-3.5 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-50"
        >
          {submitting ? t('processing') : t('submit')}
        </button>
      </form>

      <Link href={`/${locale}/cart`} className="mt-4 block text-center text-xs text-gray-500 hover:text-brand-gold">
        ← {t('title')}
      </Link>
    </div>
  );
}

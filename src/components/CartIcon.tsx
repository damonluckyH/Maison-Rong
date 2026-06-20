'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function CartIcon() {
  const params = useParams();
  const locale = params.locale as string;
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const res = await fetch('/api/cart');
    if (res.ok) {
      const data = await res.json();
      setCount(data.count ?? 0);
    } else {
      setCount(0);
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('cart-updated', handler);
    return () => window.removeEventListener('cart-updated', handler);
  }, [refresh]);

  return (
    <Link
      href={`/${locale}/cart`}
      className="relative text-gray-400 transition hover:text-brand-gold"
      aria-label="Giỏ hàng"
    >
      <span className="text-lg">🛒</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-medium text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}

export function notifyCartUpdated() {
  window.dispatchEvent(new Event('cart-updated'));
}

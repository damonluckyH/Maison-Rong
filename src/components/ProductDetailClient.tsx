'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import VirtualTryOn from '@/components/VirtualTryOn';
import { notifyCartUpdated } from '@/components/CartIcon';
import type { Product } from '@/lib/products';
import { supportsTryOn } from '@/lib/products';

interface ProductDetailClientProps {
  product: Product;
  productName: string;
  locale: string;
  tryOnProducts: Product[];
  showCustomize?: boolean;
  customizeTitle?: string;
}

export default function ProductDetailClient({
  product,
  productName,
  locale,
  tryOnProducts,
  showCustomize,
  customizeTitle,
}: ProductDetailClientProps) {
  const t = useTranslations('products');
  const router = useRouter();
  const [showTryOn, setShowTryOn] = useState(false);
  const [activeProduct, setActiveProduct] = useState(product);
  const [adding, setAdding] = useState(false);

  const canTryOn = supportsTryOn(product);

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: 1 }),
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
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={adding}
          className="btn-gold flex-1 rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-50"
        >
          {adding ? '...' : t('addToCart')}
        </button>
        {canTryOn && (
          <button
            type="button"
            onClick={() => {
              setActiveProduct(product);
              setShowTryOn(true);
            }}
            className="flex-1 rounded border border-brand-gold/40 py-3 text-sm text-brand-gold tracking-widest transition hover:border-brand-gold hover:bg-brand-gold/10"
          >
            {t('virtualTryOn')}
          </button>
        )}
      </div>

      {showCustomize && customizeTitle && (
        <Link
          href={`/${locale}/products/bedding/customize`}
          className="mt-4 block rounded border border-brand-jade/40 py-3 text-center text-sm text-brand-jade tracking-widest transition hover:border-brand-jade hover:bg-brand-jade/10"
        >
          {customizeTitle} →
        </Link>
      )}

      {showTryOn && activeProduct.tryOnCategory && (
        <VirtualTryOn
          productId={activeProduct.id}
          productName={activeProduct.name[locale] ?? activeProduct.name.vi}
          category={activeProduct.tryOnCategory}
          overlayScale={activeProduct.overlayScale ?? 1}
          tryOnProducts={tryOnProducts}
          locale={locale}
          onClose={() => setShowTryOn(false)}
          onProductChange={(p) => setActiveProduct(p)}
        />
      )}
    </>
  );
}

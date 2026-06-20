'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Product } from '@/lib/products';
import { formatVnd, PRODUCT_LINE_GRADIENTS } from '@/lib/products';

interface CuratedForYouProps {
  products: Product[];
  locale: string;
  titleKey?: 'curatedTitle' | 'exploreMore';
  showSubtitle?: boolean;
}

export default function CuratedForYou({
  products,
  locale,
  titleKey = 'curatedTitle',
  showSubtitle = true,
}: CuratedForYouProps) {
  const th = useTranslations('home');
  const tp = useTranslations('products');

  if (products.length === 0) return null;

  const title = titleKey === 'exploreMore' ? tp('exploreMore') : th('curatedTitle');

  return (
    <section className="relative z-10 border-t border-brand-gold/10 bg-brand-black/90 py-16 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-2xl text-brand-gold tracking-[0.2em] uppercase">
            {title}
          </h2>
          {showSubtitle && titleKey === 'curatedTitle' && (
            <p className="mt-2 text-sm text-gray-500">{th('curatedSubtitle')}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/${locale}/products/${product.id}`}
              className="group relative overflow-hidden rounded-lg border border-brand-gold/10 bg-brand-black-light/50 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50"
            >
              <div
                className={`flex h-36 items-center justify-center bg-gradient-to-br ${PRODUCT_LINE_GRADIENTS[product.productLine]}`}
              >
                <span className="font-serif text-brand-gold/60 text-xs tracking-[0.2em] uppercase">
                  {tp(lineKey(product.productLine))}
                </span>
              </div>

              <div className="p-3">
                <p className="truncate font-serif text-brand-gold-light text-sm">
                  {product.name[locale] ?? product.name.vi}
                </p>
                <p className="mt-1 text-brand-gold text-xs">{formatVnd(product.price)}</p>
                <span className="mt-1 inline-block rounded border border-brand-gold/20 px-2 py-0.5 text-[10px] text-gray-500 uppercase tracking-wider">
                  {tp(lineKey(product.productLine))}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-brand-black/90 py-2 text-center transition-transform duration-300 group-hover:translate-y-0">
                <span className="text-brand-gold-light/80 text-xs italic">
                  {tp('destinyMatch')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function lineKey(line: Product['productLine']): 'dragonSeal' | 'phoenixGrace' | 'turtleGuardian' | 'lotusDream' | 'dongSon' | 'heritage' {
  const map: Record<Product['productLine'], 'dragonSeal' | 'phoenixGrace' | 'turtleGuardian' | 'lotusDream' | 'dongSon' | 'heritage'> = {
    'dragon-seal': 'dragonSeal',
    'phoenix-grace': 'phoenixGrace',
    'turtle-guardian': 'turtleGuardian',
    'lotus-dream': 'lotusDream',
    'dong-son': 'dongSon',
    'heritage': 'heritage',
  };
  return map[line];
}

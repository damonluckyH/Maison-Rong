import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ProductDetailClient from '@/components/ProductDetailClient';
import StructuredData from '@/components/StructuredData';
import {
  getProductById,
  formatVnd,
  PRODUCT_LINE_GRADIENTS,
  getTryOnProducts,
  ALL_PRODUCTS,
} from '@/lib/products';
import { buildPageMetadata, getBreadcrumbSchema, getProductSchema } from '@/lib/seo';
import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return ALL_PRODUCTS.flatMap((product) =>
    locales.map((locale) => ({
      locale,
      id: product.id,
    })),
  );
}

export async function generateMetadata({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const product = getProductById(id);
  if (!product) return {};

  const name = product.name[locale] ?? product.name.vi;
  const description = product.description[locale] ?? product.description.vi;

  return buildPageMetadata({
    locale,
    path: `/products/${id}`,
    title: name,
    description,
  });
}

export default async function ProductDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const product = getProductById(id);
  if (!product) notFound();

  const t = await getTranslations('products');
  const ts = await getTranslations('seo');
  const tc = await getTranslations('customize');
  const tb = await getTranslations('bazi');

  const lineKey = {
    'dragon-seal': 'dragonSeal',
    'phoenix-grace': 'phoenixGrace',
    'turtle-guardian': 'turtleGuardian',
    'lotus-dream': 'lotusDream',
    'dong-son': 'dongSon',
    'heritage': 'heritage',
  }[product.productLine] as 'dragonSeal' | 'phoenixGrace' | 'turtleGuardian' | 'lotusDream' | 'dongSon' | 'heritage';

  const name = product.name[locale] ?? product.name.vi;
  const description = product.description[locale] ?? product.description.vi;
  const showCustomize = product.productLine === 'heritage' || product.productLine === 'lotus-dream';
  const lineName = t(lineKey);

  return (
    <div className="min-h-screen bg-brand-black px-4 py-12">
      <StructuredData
        data={[
          getProductSchema(product, locale),
          getBreadcrumbSchema(locale, [
            { name: ts('breadcrumbHome'), path: '' },
            { name: ts('breadcrumbProducts'), path: '' },
            { name: lineName, path: '' },
            { name, path: `/products/${product.id}` },
          ]),
        ]}
      />
      <div className="mx-auto max-w-3xl">
        <div
          className={`mb-8 flex h-64 items-center justify-center rounded-lg bg-gradient-to-br ${PRODUCT_LINE_GRADIENTS[product.productLine]}`}
        >
          <span className="font-serif text-brand-gold/50 text-lg tracking-[0.3em] uppercase">
            {lineName}
          </span>
        </div>

        <div className="space-y-4">
          <span className="inline-block rounded border border-brand-gold/20 px-3 py-1 text-xs text-brand-gold uppercase tracking-widest">
            {lineName}
          </span>
          <h1 className="font-serif text-3xl text-brand-gold-light tracking-wide">{name}</h1>
          <p className="font-serif text-brand-gold text-xl">{formatVnd(product.price)}</p>
          <p className="leading-relaxed text-gray-400 text-sm">{description}</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {product.elements.map((el) => (
              <span
                key={el}
                className="rounded border border-brand-gold/30 px-3 py-1 text-brand-gold-light text-xs"
              >
                {tb(`elements.${el}`)}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.zodiacs.map((z) => (
              <span
                key={z}
                className="rounded border border-brand-jade/30 px-3 py-1 text-brand-jade text-xs"
              >
                {z === 'all' ? '✦' : z}
              </span>
            ))}
          </div>

          <ProductDetailClient
            product={product}
            productName={name}
            locale={locale}
            tryOnProducts={getTryOnProducts()}
            showCustomize={showCustomize}
            customizeTitle={showCustomize ? tc('title') : undefined}
          />
        </div>
      </div>
    </div>
  );
}

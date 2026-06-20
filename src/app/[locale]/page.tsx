import { cookies } from 'next/headers';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ParticleBackground from '@/components/ParticleBackground';
import GuestPrompt from '@/components/GuestPrompt';
import BrandLogo from '@/components/BrandLogo';
import CuratedForYou from '@/components/CuratedForYou';
import { PRODUCT_LINES } from '@/lib/brand';
import { getUserBySession } from '@/lib/db';
import { ALL_PRODUCTS } from '@/lib/products';
import { recommendProducts, getVietZodiac } from '@/lib/recommendation';
import { buildPageMetadata } from '@/lib/seo';

const CUSTOMIZABLE_LINES = new Set(['lotus-dream', 'heritage']);

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '',
    title: t('homeTitle'),
    description: t('homeDescription'),
  });
}

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');
  const tp = await getTranslations('products');
  const tc = await getTranslations('customize');
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;

  const recommended = user
    ? recommendProducts(
        user.baziReport.deficits,
        user.baziReport.favorableElements,
        user.gender,
        getVietZodiac(user.birthDate),
        ALL_PRODUCTS,
      )
    : [];

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      {/* Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in mb-8">
          <BrandLogo size="lg" />
        </div>
        <h1 className="animate-fade-in font-serif text-4xl md:text-6xl text-gradient-gold tracking-widest" style={{ animationDelay: '0.3s' }}>
          {t('slogan')}
        </h1>
        <p className="animate-fade-in mt-4 font-serif text-lg md:text-xl text-brand-gold-light/80 italic tracking-wide" style={{ animationDelay: '0.6s' }}>
          {t('subtitle')}
        </p>

        {user ? (
          <div className="animate-fade-in mt-10 space-y-3" style={{ animationDelay: '0.9s' }}>
            <p className="font-serif text-brand-gold text-xl">
              {t('welcome', { name: user.givenName })}
            </p>
            <Link
              href={`/${locale}/member/bazi-report`}
              className="inline-block rounded border border-brand-gold/40 px-6 py-2.5 text-sm text-brand-gold-light tracking-widest transition hover:border-brand-gold hover:bg-brand-gold/10"
            >
              {t('baziEntry')}
            </Link>
          </div>
        ) : null}

        <a
          href="#products"
          className="animate-fade-in absolute bottom-10 flex flex-col items-center gap-2 text-brand-gold/60 transition hover:text-brand-gold"
          style={{ animationDelay: '1.2s' }}
        >
          <span className="text-xs tracking-[0.3em] uppercase">{t('scrollHint')}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-bounce">
            <path d="M10 14L4 8h12L10 14z" fill="currentColor" opacity="0.6" />
          </svg>
        </a>
      </section>

      {/* Product lines */}
      <section id="products" className="relative z-10 border-t border-brand-gold/10 bg-brand-black/80 py-20 px-4">
        <h2 className="mb-12 text-center font-serif text-2xl text-brand-gold tracking-[0.3em] uppercase">
          {t('productLines')}
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-3">
          {PRODUCT_LINES.map((line) => {
            const inner = (
              <>
                <span className="text-4xl transition group-hover:scale-110">{line.symbol}</span>
                <span className="font-serif text-brand-gold-light text-sm tracking-widest">
                  {tp(line.nameKey.replace('products.', ''))}
                </span>
                {CUSTOMIZABLE_LINES.has(line.id) && (
                  <span className="text-brand-jade text-[10px] tracking-wider uppercase">
                    {tc('title')}
                  </span>
                )}
              </>
            );
            const className =
              'group flex flex-col items-center gap-3 rounded-lg border border-brand-gold/10 bg-brand-black-light/50 p-6 transition hover:border-brand-gold/30 hover:bg-brand-black-light';

            return CUSTOMIZABLE_LINES.has(line.id) ? (
              <Link key={line.id} href={`/${locale}/products/bedding/customize`} className={className}>
                {inner}
              </Link>
            ) : (
              <div key={line.id} className={className}>
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {user && recommended.length > 0 && (
        <CuratedForYou products={recommended} locale={locale} />
      )}

      {!user && <GuestPrompt />}
    </div>
  );
}

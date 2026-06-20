import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import ParticleBackground from '@/components/ParticleBackground';
import BrandLogo from '@/components/BrandLogo';
import FranceVietnamMap from '@/components/FranceVietnamMap';
import StoryCraftCards from '@/components/StoryCraftCards';
import Timeline from '@/components/Timeline';
import StoryPhilosophy from '@/components/StoryPhilosophy';
import StructuredData from '@/components/StructuredData';
import { PRODUCT_LINES } from '@/lib/brand';
import {
  TIMELINE_YEARS,
  CRAFT_IDS,
  CRAFT_ICONS,
  PHILOSOPHY_KEYWORD_IDS,
} from '@/lib/story';
import { buildPageMetadata, getBreadcrumbSchema } from '@/lib/seo';

const CUSTOMIZABLE_LINES = new Set(['lotus-dream', 'heritage']);

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/story',
    title: t('storyTitle'),
    description: t('storyDescription'),
  });
}

export default async function StoryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('story');
  const ts = await getTranslations('seo');
  const tp = await getTranslations('products');
  const tc = await getTranslations('customize');

  const timelineEvents = TIMELINE_YEARS.map((year) => ({
    year,
    text: t(`timeline${year}`),
  }));

  const craftCards = CRAFT_IDS.map((id) => ({
    id,
    icon: CRAFT_ICONS[id],
    title: t(`craft${id.charAt(0).toUpperCase()}${id.slice(1)}Title`),
    description: t(`craft${id.charAt(0).toUpperCase()}${id.slice(1)}Desc`),
  }));

  const philosophyKeywords = PHILOSOPHY_KEYWORD_IDS.map((id) => ({
    id,
    label: t(`philosophyKeyword${id.charAt(0).toUpperCase()}${id.slice(1)}`),
  }));

  return (
    <div className="relative min-h-screen">
      <StructuredData
        data={getBreadcrumbSchema(locale, [
          { name: ts('breadcrumbHome'), path: '' },
          { name: ts('breadcrumbStory'), path: '/story' },
        ])}
      />
      <ParticleBackground />

      {/* Section 1 — Hero */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in mb-8">
          <BrandLogo size="lg" className="scale-110 transition-transform duration-1000 hover:scale-125" />
        </div>
        <h1
          className="animate-fade-in font-serif text-4xl text-gradient-gold tracking-widest md:text-6xl"
          style={{ animationDelay: '0.3s' }}
        >
          {t('heroTitle')}
        </h1>
        <p
          className="animate-fade-in mt-4 max-w-xl font-serif text-lg italic tracking-wide text-brand-gold-light/80 md:text-xl"
          style={{ animationDelay: '0.6s' }}
        >
          {t('heroSubtitle')}
        </p>
        <a
          href="#origin"
          className="animate-fade-in absolute bottom-10 flex flex-col items-center gap-2 text-brand-gold/60 transition hover:text-brand-gold"
          style={{ animationDelay: '1.2s' }}
        >
          <span className="text-xs uppercase tracking-[0.3em]">{t('scrollHint')}</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="animate-bounce">
            <path d="M10 14L4 8h12L10 14z" fill="currentColor" opacity="0.6" />
          </svg>
        </a>
      </section>

      {/* Section 2 — 1928 Origin */}
      <section
        id="origin"
        className="relative z-10 border-t border-brand-gold/10 bg-brand-black/80 py-20 px-4"
      >
        <div className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2">
          <FranceVietnamMap />
          <div>
            <p className="mb-2 font-serif text-sm uppercase tracking-[0.4em] text-brand-gold/60">
              {t('originYear')}
            </p>
            <h2 className="mb-6 font-serif text-2xl text-brand-gold tracking-widest md:text-3xl">
              {t('originTitle')}
            </h2>
            <p className="text-sm leading-relaxed text-gray-400 md:text-base">{t('originText')}</p>
          </div>
        </div>
      </section>

      {/* Section 3 — Crafts */}
      <section className="relative z-10 border-t border-brand-gold/10 py-20 px-4">
        <h2 className="mb-12 text-center font-serif text-2xl text-brand-gold tracking-[0.3em] uppercase">
          {t('craftsTitle')}
        </h2>
        <StoryCraftCards cards={craftCards} />
      </section>

      {/* Section 4 — Timeline */}
      <section className="relative z-10 border-t border-brand-gold/10 bg-brand-black/80 py-20 px-4">
        <h2 className="mb-16 text-center font-serif text-2xl text-brand-gold tracking-[0.3em] uppercase">
          {t('timelineTitle')}
        </h2>
        <Timeline events={timelineEvents} />
      </section>

      {/* Section 5 — Philosophy */}
      <section className="relative z-10 border-t border-brand-gold/10 py-20 px-4">
        <StoryPhilosophy quote={t('philosophyQuote')} keywords={philosophyKeywords} />
      </section>

      {/* Section 6 — Explore product lines */}
      <section className="relative z-10 border-t border-brand-gold/10 bg-brand-black/80 py-20 px-4">
        <h2 className="mb-12 text-center font-serif text-2xl text-brand-gold tracking-[0.3em] uppercase">
          {t('exploreTitle')}
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-3">
          {PRODUCT_LINES.map((line) => {
            const inner = (
              <>
                <span className="text-4xl transition group-hover:scale-110">{line.symbol}</span>
                <span className="font-serif text-sm tracking-widest text-brand-gold-light">
                  {tp(line.nameKey.replace('products.', ''))}
                </span>
                {CUSTOMIZABLE_LINES.has(line.id) && (
                  <span className="text-[10px] uppercase tracking-wider text-brand-jade">
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
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}#products`}
            className="inline-block rounded border border-brand-gold/40 px-8 py-3 text-sm uppercase tracking-[0.3em] text-brand-gold-light transition hover:border-brand-gold hover:bg-brand-gold/10"
          >
            {t('exploreCTA')}
          </Link>
        </div>
      </section>
    </div>
  );
}

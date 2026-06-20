'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function GuestPrompt() {
  const t = useTranslations('guest');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs animate-float">
      <div className="relative overflow-hidden rounded-lg border border-brand-gold/30 bg-brand-black-light/95 p-5 backdrop-blur-md glow-gold">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-brand-red/5" />
        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-brand-gold text-lg">✦</span>
            <h3 className="font-serif text-brand-gold-light text-sm font-semibold tracking-wide">
              {t('title')}
            </h3>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-gray-400">
            {t('description')}
          </p>
          <Link
            href={`/${locale}/register`}
            className="btn-gold block w-full rounded py-2.5 text-center text-xs font-medium tracking-widest text-brand-black uppercase transition-all hover:opacity-90"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </div>
  );
}

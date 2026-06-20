'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { locales, localeNames, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const params = useParams();
  const currentLocale = params.locale as Locale;

  return (
    <div className="flex gap-1">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`/${loc}`}
          className={`px-2 py-1 text-xs uppercase tracking-wider transition ${
            loc === currentLocale
              ? 'text-brand-gold border-b border-brand-gold'
              : 'text-gray-600 hover:text-brand-gold-light'
          }`}
        >
          {loc}
        </Link>
      ))}
    </div>
  );
}

export { localeNames };

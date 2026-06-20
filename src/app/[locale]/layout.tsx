import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import BrandLogo from '@/components/BrandLogo';
import NavLinks from '@/components/NavLinks';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <header className="fixed top-0 z-40 w-full border-b border-brand-gold/10 bg-brand-black/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <a href={`/${locale}`}>
            <BrandLogo size="sm" showText={false} />
          </a>
          <div className="flex items-center gap-6">
            <NavLinks locale={locale} />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
      <main className="pt-14">{children}</main>
    </NextIntlClientProvider>
  );
}

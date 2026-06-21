import Link from 'next/link';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { getUserBySession } from '@/lib/db';
import CartIcon from '@/components/CartIcon';

export default async function NavLinks({ locale }: { locale: string }) {
  const t = await getTranslations('nav');
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? await getUserBySession(sessionToken) : undefined;

  return (
    <nav className="flex items-center gap-4 text-xs tracking-widest uppercase">
      <Link href={`/${locale}`} className="text-gray-400 transition hover:text-brand-gold">
        {t('home')}
      </Link>
      <Link href={`/${locale}/story`} className="text-gray-400 transition hover:text-brand-gold">
        {t('story')}
      </Link>
      {user ? (
        <>
          <Link
            href={`/${locale}/member`}
            className="text-gray-400 transition hover:text-brand-gold"
          >
            {t('memberCenter')}
          </Link>
          <Link
            href={`/${locale}/member/bazi-report`}
            className="text-gray-400 transition hover:text-brand-gold"
          >
            {t('baziReport')}
          </Link>
          <CartIcon />
        </>
      ) : (
        <>
          <Link
            href={`/${locale}/login`}
            className="text-gray-400 transition hover:text-brand-gold"
          >
            {t('login')}
          </Link>
          <Link
            href={`/${locale}/register`}
            className="text-gray-400 transition hover:text-brand-gold"
          >
            {t('register')}
          </Link>
        </>
      )}
    </nav>
  );
}

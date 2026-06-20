import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import CheckoutPageClient from '@/components/CheckoutPageClient';
import { getUserBySession } from '@/lib/db';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/checkout',
    title: t('checkoutTitle'),
    description: t('checkoutDescription'),
  });
}

export default function CheckoutPage({ params: { locale } }: { params: { locale: string } }) {
  const token = cookies().get('session')?.value;
  const user = token ? getUserBySession(token) : undefined;

  if (!user) {
    redirect(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-brand-black">
      <CheckoutPageClient user={{ fullName: user.fullName, phone: user.phone }} />
    </div>
  );
}

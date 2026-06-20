import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import BaziReport from '@/components/BaziReport';
import CuratedForYou from '@/components/CuratedForYou';
import { getUserBySession } from '@/lib/db';
import { ALL_PRODUCTS } from '@/lib/products';
import { recommendProducts, getVietZodiac } from '@/lib/recommendation';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/member/bazi-report',
    title: t('baziReportTitle'),
    description: t('baziReportDescription'),
  });
}

export default function BaziReportPage({ params: { locale } }: { params: { locale: string } }) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;

  if (!user) {
    redirect(`/${locale}/register`);
  }

  const recommended = recommendProducts(
    user.baziReport.deficits,
    user.baziReport.favorableElements,
    user.gender,
    getVietZodiac(user.birthDate),
    ALL_PRODUCTS,
  );

  return (
    <div className="min-h-screen bg-brand-black py-8">
      <BaziReport report={user.baziReport} />
      {recommended.length > 0 && (
        <CuratedForYou
          products={recommended}
          locale={locale}
          titleKey="exploreMore"
          showSubtitle={false}
        />
      )}
    </div>
  );
}

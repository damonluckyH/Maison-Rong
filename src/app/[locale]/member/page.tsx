import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import MemberCenterClient from '@/components/MemberCenterClient';
import { getUserBySession, getPointsHistory } from '@/lib/db';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/member',
    title: t('memberTitle'),
    description: t('memberDescription'),
  });
}

export default function MemberPage({ params: { locale } }: { params: { locale: string } }) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;

  if (!user) {
    redirect(`/${locale}/register`);
  }

  const logs = getPointsHistory(user.id).map((log) => ({
    ...log,
    createdAt: log.createdAt,
  }));

  return (
    <div className="min-h-screen bg-brand-black">
      <MemberCenterClient
        locale={locale}
        initialPoints={user.points}
        initialTier={user.tier}
        initialLogs={logs}
      />
    </div>
  );
}

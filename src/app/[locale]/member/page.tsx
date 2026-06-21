import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import MemberCenterClient from '@/components/MemberCenterClient';
import { getUserBySession, getPointsHistory } from '@/lib/db';

export default async function MemberPage({ params: { locale } }: { params: { locale: string } }) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? await getUserBySession(sessionToken) : undefined;

  if (!user) {
    redirect(`/${locale}/register`);
  }

  const logs = (await getPointsHistory(user.id)).map((log) => ({
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

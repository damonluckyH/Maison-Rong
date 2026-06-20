import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import ParticleBackground from '@/components/ParticleBackground';
import FamilyCrestCustomizer from '@/components/FamilyCrestCustomizer';
import { getUserBySession } from '@/lib/db';
import { parseCrestConfig } from '@/lib/familyCrest';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/products/bedding/customize',
    title: t('customizeTitle'),
    description: t('customizeDescription'),
  });
}

export default async function BeddingCustomizePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const user = sessionToken ? getUserBySession(sessionToken) : undefined;
  const initialConfig = parseCrestConfig(searchParams);

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <FamilyCrestCustomizer
          locale={locale}
          defaultSurname={user?.surname ?? ''}
          initialConfig={initialConfig}
        />
      </div>
    </div>
  );
}

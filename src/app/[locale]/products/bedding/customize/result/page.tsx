import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import ParticleBackground from '@/components/ParticleBackground';
import CustomizeResultView from '@/components/CustomizeResultView';
import { parseCrestConfig } from '@/lib/familyCrest';

export default function CustomizeResultPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const config = parseCrestConfig(searchParams);

  if (!config) {
    redirect(`/${locale}/products/bedding/customize`);
  }

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <CustomizeResultView config={config} locale={locale} />
      </div>
    </div>
  );
}

export async function generateMetadata() {
  const t = await getTranslations('customize');
  return { title: `${t('resultTitle')} — MAISON RỒNG` };
}

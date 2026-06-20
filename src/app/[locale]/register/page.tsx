import { getTranslations } from 'next-intl/server';
import RegisterForm from '@/components/RegisterForm';
import ParticleBackground from '@/components/ParticleBackground';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/register',
    title: t('registerTitle'),
    description: t('registerDescription'),
  });
}

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </div>
  );
}

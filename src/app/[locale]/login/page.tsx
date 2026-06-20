import { getTranslations } from 'next-intl/server';
import LoginForm from '@/components/LoginForm';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('seo');
  return buildPageMetadata({
    locale,
    path: '/login',
    title: t('loginTitle'),
    description: t('loginDescription'),
  });
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-black">
      <LoginForm />
    </div>
  );
}

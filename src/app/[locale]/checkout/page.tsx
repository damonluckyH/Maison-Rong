import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutPageClient from '@/components/CheckoutPageClient';
import { getUserBySession } from '@/lib/db';

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

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

export default function LoginPageClient() {
  const t = useTranslations('login');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error === 'not_registered' ? t('notRegistered') : data.message || data.error);
      setLoading(false);
      return;
    }

    router.push(`/${locale}/member`);
    router.refresh();
  };

  const inputClass =
    'w-full rounded border border-brand-gold/20 bg-brand-black-light px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30';

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-brand-gold/20 bg-brand-black-light/60 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl text-gradient-gold tracking-widest">{t('title')}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-gray-500">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className={inputClass}
              required
            />
          </div>

          {error && <p className="text-sm text-brand-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-50"
          >
            {loading ? '...' : t('submit')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {t('notRegistered')}{' '}
          <Link href={`/${locale}/register`} className="text-brand-gold hover:underline">
            {t('goRegister')}
          </Link>
        </p>
      </div>
    </div>
  );
}

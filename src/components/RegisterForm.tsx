'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { BIRTH_HOURS, BLOOD_TYPES } from '@/lib/brand';

interface FormData {
  surname: string;
  givenName: string;
  gender: 'MALE' | 'FEMALE' | '';
  birthDate: string;
  birthHour: string;
  bloodType: string;
  email: string;
  password: string;
  phone: string;
  zalo: string;
  messenger: string;
  tiktok: string;
}

export default function RegisterForm() {
  const t = useTranslations('register');
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormData>({
    surname: '',
    givenName: '',
    gender: '',
    birthDate: '',
    birthHour: '',
    bloodType: '',
    email: '',
    password: '',
    phone: '',
    zalo: '',
    messenger: '',
    tiktok: '',
  });

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = form.surname && form.givenName && form.gender;
  const canProceedStep2 = form.birthDate && form.bloodType;
  const canSubmit =
    form.email && form.password.length >= 6 && form.zalo.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      router.push(`/${locale}/member/bazi-report`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded border border-brand-gold/20 bg-brand-black-light px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-brand-gold/60 focus:ring-1 focus:ring-brand-gold/30';

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl text-gradient-gold tracking-widest">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-0.5 rounded transition-all duration-500 ${
                s <= step ? 'bg-brand-gold' : 'bg-brand-black-light'
              }`}
            />
            <p className={`mt-1 text-xs ${s === step ? 'text-brand-gold' : 'text-gray-600'}`}>
              {s === 1 ? t('step1') : s === 2 ? t('step2') : t('step3')}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-brand-gold/20 bg-brand-black-light/50 p-6 backdrop-blur-sm">
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('surname')}</label>
              <input className={inputClass} value={form.surname} onChange={(e) => update('surname', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('givenName')}</label>
              <input className={inputClass} value={form.givenName} onChange={(e) => update('givenName', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('gender')}</label>
              <select className={inputClass} value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                <option value="">—</option>
                <option value="MALE">{t('male')}</option>
                <option value="FEMALE">{t('female')}</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('birthDate')}</label>
              <input
                type="date"
                className={inputClass}
                value={form.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-600">{t('birthDateHint')}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">
                {t('birthHour')} <span className="text-gray-600">({t('birthHourOptional')})</span>
              </label>
              <select className={inputClass} value={form.birthHour} onChange={(e) => update('birthHour', e.target.value)}>
                {BIRTH_HOURS.map((h) => (
                  <option key={h.value} value={h.value}>{h.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('bloodType')}</label>
              <select className={inputClass} value={form.bloodType} onChange={(e) => update('bloodType', e.target.value)}>
                <option value="">—</option>
                {BLOOD_TYPES.map((bt) => (
                  <option key={bt} value={bt}>{bt}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('email')}</label>
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">
                {t('phone')} <span className="text-gray-600">({t('optional')})</span>
              </label>
              <input type="tel" className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('zalo')}</label>
              <input
                className={inputClass}
                value={form.zalo}
                onChange={(e) => update('zalo', e.target.value)}
                placeholder={t('zaloPlaceholder')}
                required
              />
              <p className="mt-1 text-xs text-brand-jade/80">{t('zaloHint')}</p>
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">
                {t('messenger')} <span className="text-gray-600">({t('optional')})</span>
              </label>
              <input
                className={inputClass}
                value={form.messenger}
                onChange={(e) => update('messenger', e.target.value)}
                placeholder={t('messengerPlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">
                {t('tiktok')} <span className="text-gray-600">({t('optional')})</span>
              </label>
              <input
                className={inputClass}
                value={form.tiktok}
                onChange={(e) => update('tiktok', e.target.value)}
                placeholder={t('tiktokPlaceholder')}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-gray-500 uppercase tracking-widest">{t('password')}</label>
              <input
                type="password"
                className={inputClass}
                value={form.password}
                onChange={(e) => update('password', e.target.value)}
                placeholder={t('passwordPlaceholder')}
                minLength={6}
                required
              />
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-brand-red">{error}</p>}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded border border-brand-gold/30 py-3 text-sm text-brand-gold tracking-widest transition hover:border-brand-gold/60"
            >
              {t('back')}
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
              onClick={() => setStep((s) => s + 1)}
              className="btn-gold flex-1 rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-40"
            >
              {t('next')}
            </button>
          ) : (
            <button
              type="button"
              disabled={loading || !canSubmit}
              onClick={handleSubmit}
              className="btn-gold flex-1 rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-40"
            >
              {loading ? t('submitting') : t('submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

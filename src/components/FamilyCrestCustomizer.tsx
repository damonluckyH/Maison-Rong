'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BeddingPreview from '@/components/BeddingPreview';
import type { CrestColorScheme, CrestConfig, CrestStyle, EmbroideryPosition } from '@/lib/familyCrest';
import { generateFamilyCrestSvg, downloadSvgAsPng, crestConfigToQuery } from '@/lib/familyCrest';

const COMMON_SURNAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng'];

interface FamilyCrestCustomizerProps {
  locale: string;
  defaultSurname?: string;
  initialConfig?: CrestConfig | null;
}

export default function FamilyCrestCustomizer({
  locale,
  defaultSurname = '',
  initialConfig,
}: FamilyCrestCustomizerProps) {
  const t = useTranslations('customize');
  const router = useRouter();

  const [surname, setSurname] = useState(initialConfig?.surname ?? defaultSurname);
  const [style, setStyle] = useState<CrestStyle>(initialConfig?.style ?? 'dragon');
  const [colorScheme, setColorScheme] = useState<CrestColorScheme>(initialConfig?.colorScheme ?? 'red-gold');
  const [position, setPosition] = useState<EmbroideryPosition>(initialConfig?.position ?? 'pillow');

  const config = useMemo(
    () => ({ surname, style, colorScheme, position }),
    [surname, style, colorScheme, position],
  );

  const crestSvg = useMemo(() => generateFamilyCrestSvg(config), [config]);
  const canProceed = surname.trim().length > 0;

  const handleDownload = () => {
    const safeName = surname.trim().replace(/\s+/g, '-');
    downloadSvgAsPng(crestSvg, `maison-lac-crest-${safeName}.png`);
  };

  const handleViewResult = () => {
    router.push(`/${locale}/products/bedding/customize/result?${crestConfigToQuery(config)}`);
  };

  const inputClass =
    'w-full rounded border border-brand-gold/20 bg-brand-black-light px-4 py-3 text-sm text-gray-200 outline-none transition focus:border-brand-gold/60';

  const optionClass = (selected: boolean) =>
    `rounded border px-4 py-3 text-sm transition cursor-pointer ${
      selected
        ? 'border-brand-gold bg-brand-gold/10 text-brand-gold-light'
        : 'border-brand-gold/15 text-gray-400 hover:border-brand-gold/30'
    }`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl text-gradient-gold tracking-widest">{t('title')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('subtitle')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-xs text-gray-500 uppercase tracking-widest">
              {t('surname')}
            </label>
            <input
              className={inputClass}
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder={t('surnamePlaceholder')}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {COMMON_SURNAMES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSurname(s)}
                  className="rounded border border-brand-gold/15 px-2 py-1 text-xs text-gray-500 transition hover:border-brand-gold/40 hover:text-brand-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500 uppercase tracking-widest">
              {t('style')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['dragon', 'phoenix', 'lotus', 'dongson'] as CrestStyle[]).map((s) => (
                <button key={s} type="button" className={optionClass(style === s)} onClick={() => setStyle(s)}>
                  {t(`styles.${s}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500 uppercase tracking-widest">
              {t('colorScheme')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['red-gold', 'black-gold', 'jade'] as CrestColorScheme[]).map((c) => (
                <button key={c} type="button" className={optionClass(colorScheme === c)} onClick={() => setColorScheme(c)}>
                  {t(`colors.${c}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs text-gray-500 uppercase tracking-widest">
              {t('position')}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {(['pillow', 'duvet-edge', 'sheet-edge'] as EmbroideryPosition[]).map((p) => (
                <button key={p} type="button" className={optionClass(position === p)} onClick={() => setPosition(p)}>
                  {t(`positions.${p}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-brand-gold/20 bg-brand-black-light p-6">
            <p className="mb-4 text-center text-xs text-gray-500 uppercase tracking-widest">
              {t('crestPreview')}
            </p>
            <div
              className="mx-auto flex max-w-[240px] items-center justify-center"
              dangerouslySetInnerHTML={{ __html: crestSvg }}
            />
          </div>

          <button
            type="button"
            onClick={handleViewResult}
            disabled={!canProceed}
            className="btn-gold w-full rounded py-3 text-sm font-medium tracking-widest text-brand-black uppercase disabled:opacity-40"
          >
            {t('viewResult')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!canProceed}
            className="w-full rounded border border-brand-gold/30 py-3 text-sm text-brand-gold tracking-widest transition hover:border-brand-gold/60 disabled:opacity-40"
          >
            {t('download')}
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-center font-serif text-xl text-brand-gold tracking-widest">
          {t('beddingPreview')}
        </h2>
        <BeddingPreview config={config} />
      </div>
    </div>
  );
}

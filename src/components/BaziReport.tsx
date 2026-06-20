'use client';

import { useTranslations } from 'next-intl';
import type { BaziReport as BaziReportType, Element } from '@/lib/bazi';
import { useEffect, useState } from 'react';

interface BaziReportProps {
  report: BaziReportType;
}

const ELEMENT_ORDER: Element[] = ['METAL', 'WOOD', 'WATER', 'FIRE', 'EARTH'];
const ELEMENT_COLORS: Record<Element, string> = {
  METAL: '#D4A843',
  WOOD: '#2E8B57',
  WATER: '#4A90D9',
  FIRE: '#C41E3A',
  EARTH: '#8B6914',
};

export default function BaziReport({ report }: BaziReportProps) {
  const t = useTranslations('bazi');
  const [mounted, setMounted] = useState(false);
  const [radarProgress, setRadarProgress] = useState(0);
  const [showDeficits, setShowDeficits] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setShowDeficits(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setRadarProgress(step);
      if (step >= 5) clearInterval(interval);
    }, 200);
    return () => clearInterval(interval);
  }, [mounted]);

  const maxCount = Math.max(...Object.values(report.elementCount), 1);
  const center = 150;
  const radius = 100;
  const pillars = [
    { key: 'year', label: t('yearPillar'), pillar: report.eightCharacters.year, angle: -90 },
    { key: 'month', label: t('monthPillar'), pillar: report.eightCharacters.month, angle: 0 },
    { key: 'day', label: t('dayPillar'), pillar: report.eightCharacters.day, angle: 90 },
    ...(report.eightCharacters.hour
      ? [{ key: 'hour', label: t('hourPillar'), pillar: report.eightCharacters.hour, angle: 180 }]
      : []),
  ];

  const getRadarPoint = (index: number, value: number) => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    const r = (value / maxCount) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const radarPoints = ELEMENT_ORDER.map((el, i) =>
    getRadarPoint(i, report.elementCount[el]),
  );

  const radarPath = radarPoints
    .slice(0, radarProgress)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-center font-serif text-3xl text-gradient-gold tracking-widest">
        {t('title')}
      </h1>

      {/* Bagua disk */}
      <div className="relative mx-auto mb-12 flex items-center justify-center">
        <div
          className={`relative ${mounted ? 'animate-spin-slow' : 'opacity-0'}`}
          style={{ width: 320, height: 320 }}
        >
          <svg viewBox="0 0 320 320" className="h-full w-full">
            <circle cx="160" cy="160" r="150" fill="none" stroke="#D4A843" strokeWidth="1" opacity="0.3" />
            <circle cx="160" cy="160" r="120" fill="none" stroke="#D4A843" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 4" />
            <circle cx="160" cy="160" r="90" fill="none" stroke="#D4A843" strokeWidth="0.5" opacity="0.15" />

            {pillars.map(({ key, label, pillar, angle }) => {
              const rad = (angle * Math.PI) / 180;
              const x = 160 + 120 * Math.cos(rad);
              const y = 160 + 120 * Math.sin(rad);
              return (
                <g key={key}>
                  <circle cx={x} cy={y} r="36" fill="#2A2A2A" stroke="#D4A843" strokeWidth="1" opacity="0.9" />
                  <text x={x} y={y - 12} textAnchor="middle" fill="#D4A843" fontSize="9" opacity="0.7">
                    {label}
                  </text>
                  <text x={x} y={y + 2} textAnchor="middle" fill="#F0D68A" fontSize="13" fontWeight="600">
                    {pillar.heavenly}
                  </text>
                  <text x={x} y={y + 16} textAnchor="middle" fill="#D4A843" fontSize="11">
                    {pillar.earthly}
                  </text>
                  <text x={x} y={y + 28} textAnchor="middle" fill="#888" fontSize="8">
                    {t(`elements.${pillar.element}`)}
                  </text>
                </g>
              );
            })}

            <circle cx="160" cy="160" r="50" fill="#1A1A1A" stroke="#D4A843" strokeWidth="2" />
            <text x="160" y="152" textAnchor="middle" fill="#888" fontSize="9">
              {t('dayMaster')}
            </text>
            <text x="160" y="168" textAnchor="middle" fill="#F0D68A" fontSize="16" fontWeight="700">
              {report.dayMaster.stem}
            </text>
            <text x="160" y="183" textAnchor="middle" fill="#D4A843" fontSize="10">
              {t(`elements.${report.dayMaster.element}`)}
            </text>
          </svg>
        </div>
      </div>

      {/* Radar chart */}
      <div className="mb-8">
        <h2 className="mb-4 text-center font-serif text-brand-gold-light text-lg tracking-wide">
          {t('elementDistribution')}
        </h2>
        <svg viewBox="0 0 300 300" className="mx-auto h-64 w-64">
          {[0.25, 0.5, 0.75, 1].map((scale) => (
            <circle
              key={scale}
              cx={center}
              cy={center}
              r={radius * scale}
              fill="none"
              stroke="#333"
              strokeWidth="0.5"
            />
          ))}

          {ELEMENT_ORDER.map((el, i) => {
            const pt = getRadarPoint(i, maxCount);
            const labelPt = getRadarPoint(i, maxCount * 1.2);
            return (
              <g key={el}>
                <line x1={center} y1={center} x2={pt.x} y2={pt.y} stroke="#333" strokeWidth="0.5" />
                <text x={labelPt.x} y={labelPt.y} textAnchor="middle" fill="#888" fontSize="10">
                  {t(`elements.${el}`)}
                </text>
              </g>
            );
          })}

          {radarProgress > 0 && (
            <path
              d={`${radarPath} Z`}
              fill="rgba(212,168,67,0.15)"
              stroke="#D4A843"
              strokeWidth="1.5"
              style={{ transition: 'all 0.2s ease' }}
            />
          )}

          {ELEMENT_ORDER.slice(0, radarProgress).map((el, i) => {
            const pt = getRadarPoint(i, report.elementCount[el]);
            const isDeficit = report.deficits.includes(el);
            return (
              <circle
                key={el}
                cx={pt.x}
                cy={pt.y}
                r={isDeficit && showDeficits ? 6 : 4}
                fill={ELEMENT_COLORS[el]}
                className={isDeficit && showDeficits ? 'animate-pulse-gold' : ''}
              />
            );
          })}
        </svg>
      </div>

      {/* Summary */}
      <div className="space-y-4 rounded-lg border border-brand-gold/20 bg-brand-black-light p-6">
        <div className="flex items-start gap-3">
          <span className="text-brand-gold">◆</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{t('yourDestiny')}</p>
            <p className="font-serif text-brand-gold-light text-lg">
              {t(`elements.${report.dayMaster.element}`)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-brand-gold">◆</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{t('deficits')}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {report.deficits.length === 0 ? (
                <span className="text-gray-400 text-sm">{t('none')}</span>
              ) : (
                report.deficits.map((d) => (
                  <span
                    key={d}
                    className={`rounded border border-brand-gold/40 px-3 py-1 text-sm text-brand-gold-light ${
                      showDeficits ? 'animate-pulse-gold' : ''
                    }`}
                  >
                    {t(`elements.${d}`)}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-brand-gold">◆</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">{t('favorable')}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {report.favorableElements.map((f) => (
                <span key={f} className="rounded border border-brand-jade/40 px-3 py-1 text-sm text-brand-jade">
                  {t(`elements.${f}`)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="border-t border-brand-gold/10 pt-4 text-center font-serif text-brand-gold/80 text-sm italic">
          {report.summary}
        </p>
      </div>
    </div>
  );
}

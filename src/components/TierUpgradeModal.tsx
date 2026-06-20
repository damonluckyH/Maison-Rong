'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { TIER_DEFINITIONS, type Tier } from '@/lib/loyalty';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

interface TierUpgradeModalProps {
  tier: Tier;
  onClose: () => void;
}

export default function TierUpgradeModal({ tier, onClose }: TierUpgradeModalProps) {
  const t = useTranslations('loyalty');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [iconScale, setIconScale] = useState(0);

  const tierInfo = TIER_DEFINITIONS.find((d) => d.tier === tier) ?? TIER_DEFINITIONS[0];
  const tierNameKey = `tier${tier.charAt(0)}${tier.slice(1).toLowerCase()}` as
    | 'tierBronze'
    | 'tierSilver'
    | 'tierGold'
    | 'tierPlatinum'
    | 'tierDiamond';

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const iconTimer = setTimeout(() => setIconScale(1), 400);
    const closeTimer = setTimeout(onClose, 3000);
    return () => {
      clearTimeout(iconTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles: Particle[] = [];

    for (let i = 0; i < 120; i++) {
      const angle = (Math.PI * 2 * i) / 120 + Math.random() * 0.5;
      const speed = Math.random() * 6 + 2;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: Math.random() * 4 + 1,
      });
    }

    let frameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= 0.015;

        const alpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 67, ${alpha})`;
        ctx.fill();
      }

      if (alive) {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/85" />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />

      <div
        className={`relative z-10 flex flex-col items-center px-6 text-center transition-transform duration-700 ${
          visible ? 'scale-100' : 'scale-75'
        }`}
      >
        <p className="mb-6 font-serif text-2xl text-gradient-gold tracking-widest md:text-3xl">
          {t('upgradeTitle')}
        </p>

        <div
          className="flex h-28 w-28 items-center justify-center rounded-full text-6xl transition-transform duration-700 ease-out glow-gold"
          style={{
            transform: `scale(${iconScale})`,
            backgroundColor: `${tierInfo.color}33`,
            boxShadow: `0 0 40px ${tierInfo.color}88, 0 0 80px rgba(212,168,67,0.4)`,
          }}
        >
          {tierInfo.icon}
        </div>

        <p className="mt-8 font-serif text-xl tracking-wide text-gray-200 md:text-2xl">
          {t('upgradeMessage', { tier: t(tierNameKey) })}
        </p>
      </div>
    </div>
  );
}

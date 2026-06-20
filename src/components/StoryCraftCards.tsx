'use client';

import { useEffect, useRef, useState } from 'react';
import type { CraftId } from '@/lib/story';

export interface CraftCard {
  id: CraftId;
  icon: string;
  title: string;
  description: string;
}

interface StoryCraftCardsProps {
  cards: CraftCard[];
}

export default function StoryCraftCards({ cards }: StoryCraftCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={`group flex flex-col items-center gap-4 rounded-lg border border-brand-gold/10 bg-brand-black-light/50 p-8 text-center transition-all duration-700 hover:border-brand-gold/50 hover:shadow-[0_0_24px_rgba(212,168,67,0.15)] ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: visible ? `${index * 150}ms` : '0ms' }}
        >
          <span className="text-4xl transition group-hover:scale-110">{card.icon}</span>
          <h3 className="font-serif text-lg text-brand-gold tracking-widest">{card.title}</h3>
          <p className="text-sm leading-relaxed text-gray-400">{card.description}</p>
        </div>
      ))}
    </div>
  );
}

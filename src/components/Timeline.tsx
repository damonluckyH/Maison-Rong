'use client';

import { useEffect, useRef, useState } from 'react';

export interface TimelineEvent {
  year: string;
  text: string;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll('[data-timeline-item]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setVisibleCount((prev) => Math.max(prev, index + 1));
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [events.length]);

  return (
    <div ref={containerRef} className="relative mx-auto max-w-lg">
      {/* Gold vertical line */}
      <div
        className="absolute left-4 top-0 w-px bg-brand-gold/30 md:left-1/2 md:-translate-x-px"
        style={{ height: `${Math.max(visibleCount, 1) * (100 / events.length)}%` }}
        aria-hidden="true"
      />

      <div className="space-y-12">
        {events.map((event, index) => {
          const isVisible = index < visibleCount;
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.year}
              data-timeline-item
              data-index={index}
              className={`relative pl-12 transition-all duration-700 md:pl-0 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              } ${isEven ? 'md:pr-[calc(50%+2rem)] md:text-right' : 'md:pl-[calc(50%+2rem)] md:text-left'}`}
            >
              {/* Dot marker */}
              <div
                className={`absolute left-2.5 top-1 h-3 w-3 rounded-full border-2 border-brand-gold bg-brand-black transition-all duration-500 md:left-1/2 md:-translate-x-1/2 ${
                  isVisible ? 'scale-100 shadow-[0_0_12px_rgba(212,168,67,0.6)]' : 'scale-0'
                }`}
                aria-hidden="true"
              />

              <p className="font-serif text-3xl text-brand-gold tracking-widest">{event.year}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{event.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

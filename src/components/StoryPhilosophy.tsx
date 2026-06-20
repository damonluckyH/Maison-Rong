'use client';

interface StoryPhilosophyProps {
  quote: string;
  keywords: { id: string; label: string }[];
}

export default function StoryPhilosophy({ quote, keywords }: StoryPhilosophyProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <blockquote className="font-serif text-xl italic leading-relaxed text-brand-gold-light/90 md:text-2xl">
        &ldquo;{quote}&rdquo;
      </blockquote>

      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {keywords.map((kw, index) => (
          <div
            key={kw.id}
            className="animate-pulse-gold rounded-lg border border-brand-gold/20 px-4 py-6"
            style={{ animationDelay: `${index * 0.5}s` }}
          >
            <span className="font-serif text-xl text-brand-gold tracking-[0.2em] md:text-2xl">
              {kw.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

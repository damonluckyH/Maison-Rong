import { BRAND } from '@/lib/brand';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizes = { sm: 40, md: 60, lg: 80 };

export default function BrandLogo({ size = 'md', showText = true, className = '' }: BrandLogoProps) {
  const dim = sizes[size];

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <svg viewBox="0 0 120 120" width={dim} height={dim} xmlns="http://www.w3.org/2000/svg" fill="none">
        <circle cx="60" cy="60" r="55" stroke="#D4A843" strokeWidth="1.5" opacity="0.6" />
        <path d="M30 75 Q45 35 60 45 Q75 55 90 40" stroke="#D4A843" strokeWidth="2" fill="none" />
        <path d="M35 80 Q50 60 60 70 Q70 80 85 65" stroke="#C41E3A" strokeWidth="1.5" fill="none" opacity="0.8" />
        <ellipse cx="60" cy="55" rx="12" ry="8" stroke="#D4A843" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="60" cy="55" r="4" fill="#D4A843" opacity="0.4" />
      </svg>
      {showText && (
        <span className="font-serif text-brand-gold tracking-[0.3em] text-xs uppercase">
          {BRAND.name}
        </span>
      )}
    </div>
  );
}

'use client';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-brand-gold/20 bg-brand-black-light py-2.5 pl-10 pr-4 text-sm text-gray-200 placeholder-gray-600 outline-none transition focus:border-brand-gold/50 focus:ring-1 focus:ring-brand-gold/20"
      />
    </div>
  );
}

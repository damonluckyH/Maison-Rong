export const BRAND = {
  name: 'MAISON RỒNG',
  slogan: "L'héritage du Dragon",
  subtitle: 'Nơi Vận Mệnh Gặp Gỡ Nghệ Thuật',
  tagline: {
    vi: 'Nơi Vận Mệnh Gặp Gỡ Nghệ Thuật',
    fr: 'Où le Destin Rencontre l\'Art',
    en: 'Where Destiny Meets Art',
    ko: '운명과 예술이 만나는 곳',
    ja: '運命と芸術が出会う場所',
    zh: '命运与艺术相遇之处',
  },
  colors: {
    red: '#C41E3A',
    gold: '#D4A843',
    goldLight: '#F0D68A',
    black: '#1A1A1A',
    blackLight: '#2A2A2A',
    jade: '#2E8B57',
  },
  fonts: {
    heading: 'Cormorant Garamond, serif',
    body: 'Inter, sans-serif',
  },
} as const;

export const PRODUCT_LINES = [
  { id: 'dragon-seal', symbol: '🐉', nameKey: 'products.dragonSeal' },
  { id: 'phoenix-grace', symbol: '🦚', nameKey: 'products.phoenixGrace' },
  { id: 'turtle-guardian', symbol: '🐢', nameKey: 'products.turtleGuardian' },
  { id: 'lotus-dream', symbol: '🪷', nameKey: 'products.lotusDream' },
  { id: 'dong-son', symbol: '☀️', nameKey: 'products.dongSon' },
  { id: 'heritage', symbol: '👑', nameKey: 'products.heritage' },
] as const;

export const LOGO_SVG = `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" fill="none">
  <circle cx="60" cy="60" r="55" stroke="#D4A843" stroke-width="1.5" opacity="0.6"/>
  <path d="M30 75 Q45 35 60 45 Q75 55 90 40" stroke="#D4A843" stroke-width="2" fill="none"/>
  <path d="M35 80 Q50 60 60 70 Q70 80 85 65" stroke="#C41E3A" stroke-width="1.5" fill="none" opacity="0.8"/>
  <circle cx="60" cy="55" r="8" fill="#D4A843" opacity="0.3"/>
  <text x="60" y="105" text-anchor="middle" fill="#D4A843" font-family="Cormorant Garamond, serif" font-size="10" letter-spacing="3">MAISON RỒNG</text>
</svg>`;

export const BIRTH_HOURS = [
  { value: '', label: 'Không rõ' },
  { value: '0', label: 'Tý (23:00 – 01:00)' },
  { value: '1', label: 'Sửu (01:00 – 03:00)' },
  { value: '2', label: 'Dần (03:00 – 05:00)' },
  { value: '3', label: 'Mão (05:00 – 07:00)' },
  { value: '4', label: 'Thìn (07:00 – 09:00)' },
  { value: '5', label: 'Tỵ (09:00 – 11:00)' },
  { value: '6', label: 'Ngọ (11:00 – 13:00)' },
  { value: '7', label: 'Mùi (13:00 – 15:00)' },
  { value: '8', label: 'Thân (15:00 – 17:00)' },
  { value: '9', label: 'Dậu (17:00 – 19:00)' },
  { value: '10', label: 'Tuất (19:00 – 21:00)' },
  { value: '11', label: 'Hợi (21:00 – 23:00)' },
] as const;

export const BLOOD_TYPES = ['A', 'B', 'AB', 'O'] as const;

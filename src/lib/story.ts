export const TIMELINE_YEARS = ['1928', '1954', '1990', '2026'] as const;

export type TimelineYear = (typeof TIMELINE_YEARS)[number];

export const CRAFT_IDS = ['sonMai', 'chamKhac', 'theuTay'] as const;

export type CraftId = (typeof CRAFT_IDS)[number];

export const CRAFT_ICONS: Record<CraftId, string> = {
  sonMai: '🎨',
  chamKhac: '🔨',
  theuTay: '🧵',
};

export const PHILOSOPHY_KEYWORD_IDS = ['sacred', 'mysterious', 'noble', 'heritage'] as const;

export type PhilosophyKeywordId = (typeof PHILOSOPHY_KEYWORD_IDS)[number];

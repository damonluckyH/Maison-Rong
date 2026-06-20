export const locales = ['vi', 'fr', 'en', 'ko', 'ja', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'vi';

export const localeNames: Record<Locale, string> = {
  vi: 'Tiếng Việt',
  fr: 'Français',
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  zh: '中文',
};

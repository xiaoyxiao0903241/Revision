export const locales = [
  'en',
  'zh-hk',
  'ja',
  'ko',
  'vi',
  'es',
  'fr',
  'de',
  'pt',
  'th',
  'ru',
] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];

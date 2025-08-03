import { locales, defaultLocale, Locale } from './config';

export function getInitialLocale(): Locale {
  // 从url中获取
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const locale = urlParams.get('lang');
    if (locale && locales.includes(locale as Locale)) {
      return locale as Locale;
    }
  }
  // 从 localStorage 获取语言设置
  if (typeof window !== 'undefined') {
    const savedLocale = localStorage.getItem('oly_locale');
    if (savedLocale && locales.includes(savedLocale as Locale)) {
      return savedLocale as Locale;
    }
  }

  // 从浏览器语言获取
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if (locales.includes(browserLang as Locale)) {
      return browserLang as Locale;
    }
  }
  return defaultLocale;
}

export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('oly_locale', locale);
    // document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    // window.location.reload();
  }
}

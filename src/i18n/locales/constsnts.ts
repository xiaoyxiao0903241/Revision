// 语言配置
export interface Language {
  code: string;
  name: string;
  flag: string; // ISO 3166-1 alpha-2 国家码，用于 country-flag-icons
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "US" },
  { code: "de", name: "Deutsch", flag: "DE" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "th", name: "ไทย", flag: "TH" },
  { code: "ko", name: "한국어", flag: "KR" },
  { code: "ja", name: "日本語", flag: "JP" },
  { code: "vi", name: "Tiếng Việt", flag: "VN" },
  { code: "es", name: "Español", flag: "ES" },
  { code: "pt", name: "Português", flag: "PT" },
  { code: "zh-HK", name: "繁體中文", flag: "HK" },
  { code: "ru", name: "Русский", flag: "RU" },
];

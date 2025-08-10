import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 支持的语言列表
  locales: [
    "en",
    "zh",
    "de",
    "fr",
    "th",
    "ko",
    "ja",
    "vi",
    "es",
    "pt",
    "zh-HK",
    "ru",
  ],

  // 默认语言
  defaultLocale: "zh",
});

import { getRequestConfig } from "next-intl/server"
import { hasLocale } from "next-intl"
import { routing } from "./routing"

export default getRequestConfig(async ({ requestLocale }) => {
  // 通常对应于 `[locale]` 段
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  return {
    locale,
    messages: (await import(`./locales/${locale}.json`)).default,
  }
})
export type Messages = {
  [key: string]: string | Messages;
};

export async function loadMessages(locale: string): Promise<Messages> {
  try {
    return (await import(`./locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return (await import(`./locales/en.json`)).default;
  }
}

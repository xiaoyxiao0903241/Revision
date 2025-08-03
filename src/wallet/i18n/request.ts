export type Messages = {
  [key: string]: string | Messages;
};

export async function loadMessages(locale: string): Promise<Messages> {
  try {
    return (await import(`../../public/locales/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    return (await import(`../../public/locales/zh-hk.json`)).default;
  }
}

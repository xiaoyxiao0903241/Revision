'use client';
import {
  ReactNode,
  useState,
  createContext,
  useContext,
  useEffect,
} from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { loadMessages } from './request';
import { defaultLocale } from './config';

interface LanguageContextValue {
  locale: string;
  changeLanguage: (newLocale: string) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: defaultLocale,
  changeLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({
  children,
  messages: initialMessages,
}: {
  children: ReactNode;
  messages: Record<string, unknown>;
}) {
  const [locale, setLocale] = useState(defaultLocale);
  const [messages, setMessages] = useState(initialMessages);

  const changeLanguage = async (newLocale: string) => {
    const newMessages = await loadMessages(newLocale);
    setLocale(newLocale);
    setMessages(newMessages);
  };
  useEffect(() => {
    const savedLocale = localStorage.getItem('akas_locale');
    if (savedLocale && savedLocale !== locale) {
      changeLanguage(savedLocale);
    }
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage }}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone='Asia/Shanghai'
      >
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

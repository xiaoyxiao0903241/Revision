// import { NextIntlClientProvider } from "next-intl";
import { Sidebar } from '../widgets/sidebar';
import AppProviders from './components/AppProviders';
import './global.css';
// import { Header } from "../../widgets/header";
import { Suspense } from 'react';
import { LanguageProvider } from '~/i18n/LanguageProvider';
import { getInitialLocale } from '~/i18n/client';
import { loadMessages } from '~/i18n/request';
import { LocaleDetector } from '~/widgets/locale-detector';
import { MobileSidebarProvider } from '~/widgets/mobile-sidebar-provider';
import { locales } from '../i18n/config';
import CommonTokenProvider from './components/CommonTokenProvider';
export function generateStaticParams() {
  return locales.map((locale: string) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 确保传入的 `locale` 是有效的
  // const { locale = "zh" } = await params;
  const locale = getInitialLocale();
  // const locale = defaultLocale;
  const messages = await loadMessages(locale);
  // Loading component
  const Loading = () => (
    <div className='fixed inset-0 flex items-center justify-center bg-black'>
      <div className='flex flex-col items-center'>
        <div className='w-16 h-16 border-4 border-[#4BFE05] border-t-transparent rounded-full animate-spin'></div>
        <p className='mt-4 border-[#4BFE05] font-orbitron'>Loading...</p>
      </div>
    </div>
  );
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <title>OLY ONE</title>
      </head>
      {/* <NextIntlClientProvider> */}
      <LanguageProvider messages={messages}>
        <LocaleDetector />
        <body className='flex flex-col text-foreground/70'>
          <AppProviders>
            <Suspense fallback={<Loading />}>
              <MobileSidebarProvider>
                <CommonTokenProvider>
                  {/* 顶部导航栏 */}
                  {/* <Header /> */}
                  {/* 主内容区域 */}
                  <div className='flex flex-1 md:flex-row md:py-6 md:pr-9 p-4'>
                    {/* 左侧主导航栏 */}
                    <Sidebar />
                    {/* 右侧主内容区域 */}
                    <main className='md:flex-1 md:w-auto w-full'>
                      {children}
                    </main>
                  </div>
                </CommonTokenProvider>
              </MobileSidebarProvider>
            </Suspense>
          </AppProviders>
        </body>
      </LanguageProvider>
      {/* </NextIntlClientProvider> */}
    </html>
  );
}

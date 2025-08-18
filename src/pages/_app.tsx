import type { AppProps } from 'next/app';
import { Suspense, useEffect, useState } from 'react';
import { LanguageProvider } from '~/i18n/LanguageProvider';

import { loadMessages } from '~/i18n/request';
import { LocaleDetector } from '~/widgets/locale-detector';
import { MobileSidebarProvider } from '~/widgets/mobile-sidebar-provider';
import { Sidebar } from '../widgets/sidebar';
import AppProviders from './components/AppProviders';
import CommonTokenProvider from './components/CommonTokenProvider';
import './global.css';

// Loading component
const Loading = () => (
  <div className='fixed inset-0 flex items-center justify-center bg-black'>
    <div className='flex flex-col items-center'>
      <div className='w-16 h-16 border-4 border-[#B408D7] border-t-transparent rounded-full animate-spin'></div>
      <p className='mt-4 border-[#B408D7] font-orbitron'>Loading...</p>
    </div>
  </div>
);

export default function MyApp({ Component, pageProps }: AppProps) {
  const [messages, setMessages] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 使用默认语言初始化，具体语言切换由LanguageProvider处理
        const loadedMessages = await loadMessages('en');
        setMessages(loadedMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // 使用默认值
        setMessages({});
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading || !messages) {
    return <Loading />;
  }

  return (
    <LanguageProvider messages={messages}>
      <LocaleDetector />
      <div className='flex flex-col text-foreground/70 min-h-screen'>
        <AppProviders>
          <Suspense fallback={<Loading />}>
            <MobileSidebarProvider>
              <CommonTokenProvider>
                {/* 主内容区域 */}
                <div className='flex flex-1 md:flex-row md:py-6 md:pr-9 p-4'>
                  {/* 左侧主导航栏 */}
                  <Sidebar />
                  {/* 右侧主内容区域 */}
                  <main className='md:flex-1 md:w-auto w-full'>
                    <Component {...pageProps} />
                  </main>
                </div>
              </CommonTokenProvider>
            </MobileSidebarProvider>
          </Suspense>
        </AppProviders>
      </div>
    </LanguageProvider>
  );
}

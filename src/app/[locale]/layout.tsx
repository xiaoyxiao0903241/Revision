import { NextIntlClientProvider } from "next-intl";
import "../global.css";
import AppProviders from "./components/AppProviders";
import { Sidebar } from "../../widgets/sidebar";
// import { Header } from "../../widgets/header";
import { LocaleDetector } from "~/widgets/locale-detector";
import { locales } from "../../i18n/config";
import { MobileSidebarProvider } from "~/widgets/mobile-sidebar-provider";

export function generateStaticParams() {
  return locales.map((locale: string) => ({
    locale,
  }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 确保传入的 `locale` 是有效的
  const { locale = "zh" } = await params;
  return (
    <html lang={locale}>
      <NextIntlClientProvider>
        <LocaleDetector />
        <body className="flex flex-col text-foreground/70">
          <AppProviders>
            <MobileSidebarProvider>
              {/* 顶部导航栏 */}
              {/* <Header /> */}
              {/* 主内容区域 */}
              <div className="flex flex-1 md:flex-row md:py-6 md:pr-9 p-4">
                {/* 左侧主导航栏 */}
                <Sidebar />
                {/* 右侧主内容区域 */}
                <main className="md:flex-1 md:w-auto w-full">{children}</main>
              </div>
            </MobileSidebarProvider>
          </AppProviders>
        </body>
      </NextIntlClientProvider>
    </html>
  );
}

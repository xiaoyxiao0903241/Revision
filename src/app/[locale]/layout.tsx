import { NextIntlClientProvider } from "next-intl"
import "../global.css"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import AppProviders from "./components/AppProviders"
import { LocaleDetector } from "~/widgets/locale-detector"
import { locales } from '../../i18n/config'

export function generateStaticParams() {
  return locales.map((locale: string) => ({
    locale,
  }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  // 确保传入的 `locale` 是有效的
  const { locale = "zh" } = await params

  return (
    <html lang={locale}>
      <NextIntlClientProvider>
        <LocaleDetector />
        <body className="flex flex-col text-foreground/70">
          <AppProviders>
            {/* 顶部导航栏 */}
            <Header />
            {/* 主内容区域 */}
            <div className="flex flex-1 flex-row py-6 pr-9">
              {/* 左侧主导航栏 */}
              <Sidebar />
              {/* 右侧主内容区域 */}
              <main className="flex-1">{children}</main>
            </div>
          </AppProviders>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

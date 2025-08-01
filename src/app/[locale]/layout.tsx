import { NextIntlClientProvider } from "next-intl"
import "../globals.css"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"

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
    <html lang={locale} className="h-full">
      <body className="h-full">
        <NextIntlClientProvider>
          <div className="flex h-screen">
            {/* 左侧主导航栏 */}
            <Sidebar />

            {/* 右侧主内容区域 */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* 顶部导航栏 */}
              <Header />

              {/* 主内容区域 */}
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

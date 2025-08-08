import { NextIntlClientProvider } from "next-intl"
import { LocaleDetector } from "~/widgets/locale-detector"
import { MobileSidebarProvider } from "~/widgets/mobile-sidebar-provider"
import { Sidebar } from "../../widgets/sidebar"
import "../global.css"

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
      <head>
        {/* 移动端适配meta标签 */}
        <meta
          name="viewport"
          content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <NextIntlClientProvider>
        <LocaleDetector />
        <body className="flex flex-col text-foreground/70 w-full">
          <MobileSidebarProvider>
            {/* 主内容区域 */}
            <div className="flex flex-1 flex-row py-6 md:pr-9">
              {/* 左侧主导航栏 */}
              <Sidebar />
              {/* 右侧主内容区域 */}
              <main className="flex-1 w-full p-4 md:p-0">{children}</main>
            </div>
          </MobileSidebarProvider>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

import { MainLayout } from "~/components/layout/main-layout"
import { NextIntlClientProvider } from "next-intl"
import "../globals.css"

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
      <body>
        <NextIntlClientProvider>
          <MainLayout>{children}</MainLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

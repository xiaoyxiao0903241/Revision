"use client"

import { useTranslations } from "next-intl"
import { Navigator } from "~/widgets"

interface DaoLayoutProps {
  children: React.ReactNode
}

export default function DaoLayout({ children }: DaoLayoutProps) {
  const t = useTranslations("dao")
  const items = [
    { label: t("matrix_bonus"), href: "/dao" },
    { label: t("evangelist_bonus"), href: "/dao/evangelist-bonus" },
    { label: t("super_bonus"), href: "/dao/super-bonus" },
    { label: t("referral_bonus"), href: "/dao/referral-bonus" },
  ]

  return (
    <div className="space-y-6">
      {/* 次级导航栏 */}
      <Navigator items={items} />
      {/* 页面内容 */}
      {children}
    </div>
  )
}

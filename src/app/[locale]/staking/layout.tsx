"use client"

import { useTranslations } from "next-intl"
import { Navigator } from "~/widgets"

interface StakingLayoutProps {
  children: React.ReactNode
}

export default function StakingLayout({ children }: StakingLayoutProps) {
  const t = useTranslations("staking")
  const items = [
    { label: t("stake"), href: "/staking" },
    { label: t("unstake"), href: "/staking/unstake" },
    { label: t("claim"), href: "/staking/claim" },
    { label: t("records"), href: "/staking/records" },
    { label: t("calculator"), href: "/staking/calculator" },
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

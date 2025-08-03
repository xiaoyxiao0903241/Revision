"use client"

import { useTranslations } from "next-intl"
import { Navigator } from "~/widgets"

interface StakingLayoutProps {
  children: React.ReactNode
}

export default function StakingLayout({ children }: StakingLayoutProps) {
  const t = useTranslations("staking")
  const items = [
    { label: t("stake"), href: "/locked-staking" },
    { label: t("unstake"), href: "/locked-staking/unstake" },
    { label: t("claim"), href: "/locked-staking/claim" },
    { label: t("records"), href: "/locked-staking/records" },
    { label: t("calculator"), href: "/locked-staking/calculator" },
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

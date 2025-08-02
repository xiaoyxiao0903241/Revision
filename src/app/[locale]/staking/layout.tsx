"use client"

import { useTranslations } from "next-intl"
import { cn } from "~/lib/utils"
import { Coins, RotateCcw, BarChart3, FileText, TrendingUp } from "lucide-react"
import { Link, usePathname } from "~/i18n/navigation"
import { NavigationTabs, Tabs } from "~/components"

interface StakingLayoutProps {
  children: React.ReactNode
}

export default function StakingLayout({ children }: StakingLayoutProps) {
  const t = useTranslations("staking")
  const pathname = usePathname()

  const subNavItems = [
    { label: t("stake"), href: "/staking", icon: Coins },
    { label: t("unstake"), href: "/staking/unstake", icon: RotateCcw },
    { label: t("claim"), href: "/staking/claim", icon: BarChart3 },
    { label: t("records"), href: "/staking/records", icon: FileText },
    { label: t("calculator"), href: "/staking/calculator", icon: TrendingUp },
  ]

  console.log(pathname)
  return (
    <div className="space-y-6">
      {/* 次级导航栏 */}
      <div className="border-b border-gray-800 pb-4">
        <NavigationTabs
          data={subNavItems}
          activeIndex={subNavItems.findIndex(
            (item) =>
              pathname.endsWith(item.href) ||
              pathname.includes(`/${item.href}/`)
          )}
        />
      </div>

      {/* 页面内容 */}
      {children}
    </div>
  )
}

"use client"

import { useTranslations } from "next-intl"
import { cn } from "~/lib/utils"
import { Coins, RotateCcw, BarChart3, FileText, TrendingUp } from "lucide-react"
import { Link, usePathname } from "~/i18n/navigation"

interface StakingLayoutProps {
  children: React.ReactNode
}

export default function StakingLayout({ children }: StakingLayoutProps) {
  const t = useTranslations("staking")
  const pathname = usePathname()

  const subNavItems = [
    { label: t("stake"), href: "staking", icon: Coins },
    { label: t("unstake"), href: "staking/unstake", icon: RotateCcw },
    { label: t("claim"), href: "staking/claim", icon: BarChart3 },
    { label: t("records"), href: "staking/records", icon: FileText },
    { label: t("calculator"), href: "staking/calculator", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* 次级导航栏 */}
      <div className="border-b border-gray-800 pb-4">
        <nav className="flex space-x-8">
          {subNavItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname.endsWith(item.href) ||
              pathname.includes(`/${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-300 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* 页面内容 */}
      {children}
    </div>
  )
}

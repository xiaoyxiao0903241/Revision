"use client"

import { cn } from "~/lib/utils"
import { BarChart3, TrendingUp, Users, Coins } from "lucide-react"
import { Link, usePathname } from "~/i18n/navigation"

interface AnalyticsLayoutProps {
  children: React.ReactNode
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const pathname = usePathname()

  const subNavItems = [
    { label: "概览", href: "analytics/overview", icon: BarChart3 },
    { label: "交易分析", href: "analytics/trading", icon: TrendingUp },
    { label: "用户统计", href: "analytics/users", icon: Users },
    { label: "收益报告", href: "analytics/rewards", icon: Coins },
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

"use client"

import { cn } from "~/lib/utils"
import { Users, FileText, TrendingUp, BarChart3 } from "lucide-react"
import { Link, usePathname } from "~/i18n/navigation"

interface CommunityLayoutProps {
  children: React.ReactNode
}

export default function CommunityLayout({ children }: CommunityLayoutProps) {
  const pathname = usePathname()

  const subNavItems = [
    { label: "论坛", href: "community/forum", icon: Users },
    { label: "公告", href: "community/announcements", icon: FileText },
    { label: "活动", href: "community/events", icon: TrendingUp },
    { label: "投票", href: "community/voting", icon: BarChart3 },
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

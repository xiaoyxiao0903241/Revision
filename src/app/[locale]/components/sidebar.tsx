"use client"
import { useTranslations } from "next-intl"
import { Icon } from "~/components"
import { Link, usePathname } from "~/i18n/navigation"
import { cn } from "~/lib/utils"

interface NavigationItem {
  label: string
  href: string
  icon: string
  section?: string
}

const NavigationItem = ({ item }: { item: NavigationItem }) => {
  const pathname = usePathname()
  const isActive =
    pathname.endsWith(item.href) || pathname.includes(`/${item.href}/`)
  return (
    <Link
      href={item.href}
      className={cn(
        "flex w-full items-center space-x-3 rounded-lg px-5 py-4 text-sm font-medium",
        "text-primary/70 hover:bg-foreground/5"
      )}
    >
      <Icon
        name="analytics"
        className={cn("text-primary/70", { "gradient-text": isActive })}
      />
      <span className={cn("text-primary/70", { "gradient-text": isActive })}>
        {item.label}
      </span>
    </Link>
  )
}

export function Sidebar() {
  const t = useTranslations("navigation")

  const navigationItems: NavigationItem[] = [
    { label: t("dashboard"), href: "/dashboard", icon: "BarChart3" },
    { label: t("analytics"), href: "/analytics", icon: "TrendingUp" },
    { label: t("community"), href: "/community", icon: "Users" },
    {
      label: t("noLockStaking"),
      href: "/staking",
      icon: "PiggyBank",
      section: "staking",
    },
    {
      label: t("lockedStaking"),
      href: "/locked-staking",
      icon: "PiggyBank",
      section: "staking",
    },
    {
      label: t("lpBonds"),
      href: "/lp-bonds",
      icon: "BarChart3",
      section: "bonds",
    },
    {
      label: t("treasuryBonds"),
      href: "/treasury-bonds",
      icon: "FileText",
      section: "bonds",
    },
    { label: t("dao"), href: "/dao", icon: "Settings", section: "tools" },
    {
      label: t("coolingPool"),
      href: "/cooling-pool",
      icon: "Sword",
      section: "tools",
    },
    { label: t("turbine"), href: "/turbine", icon: "Wind", section: "tools" },
    { label: t("swap"), href: "/swap", icon: "RotateCcw", section: "tools" },
    { label: t("documents"), href: "/documents", icon: "FolderOpen" },
    { label: t("viewOnAve"), href: "/ave", icon: "Triangle" },
    {
      label: t("viewOnDexScreener"),
      href: "/dex-screener",
      icon: "Shield",
    },
  ]

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (item.section) {
      if (!acc[item.section]) {
        acc[item.section] = []
      }
      acc[item.section].push(item)
    } else {
      if (!acc.main) {
        acc.main = []
      }
      acc.main.push(item)
    }
    return acc
  }, {} as Record<string, NavigationItem[]>)

  return (
    <div className="flex px-9 flex-col">
      {/* Navigation */}
      <div className="sidebar">
        <nav className="flex-1 space-y-6 py-6">
          {/* Main Navigation */}
          {groupedItems.main && (
            <div className="space-y-2 border-t border-gray-800 ">
              {groupedItems.main.map((item) => {
                return <NavigationItem key={item.href} item={item} />
              })}
            </div>
          )}

          {/* Staking Section */}
          {groupedItems.staking && (
            <div className="space-y-2 border-t border-gray-800 ">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("staking")}
              </h3>
              {groupedItems.staking.map((item) => {
                return <NavigationItem key={item.href} item={item} />
              })}
            </div>
          )}

          {/* Bonds Section */}
          {groupedItems.bonds && (
            <div className="space-y-2 border-t border-gray-800 ">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("bonds")}
              </h3>
              {groupedItems.bonds.map((item) => {
                return <NavigationItem key={item.href} item={item} />
              })}
            </div>
          )}

          {/* Tools Section */}
          {groupedItems.tools && (
            <div className="space-y-2 border-t border-gray-800 ">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("tools")}
              </h3>
              {groupedItems.tools.map((item) => {
                return <NavigationItem key={item.href} item={item} />
              })}
            </div>
          )}
          {/* Social Links */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                x
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                y
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                z
              </a>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

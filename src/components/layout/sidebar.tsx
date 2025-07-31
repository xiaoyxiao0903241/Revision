import { useTranslations } from "next-intl"
import { Icons } from "~/components/icons"
import { cn } from "~/lib/utils"
import { Link, usePathname, useRouter } from "~/i18n/navigation"

interface NavigationItem {
  label: string
  href: string
  icon: keyof typeof Icons
  section?: string
}

export function Sidebar() {
  const t = useTranslations("navigation")
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems: NavigationItem[] = [
    { label: t("dashboard"), href: "dashboard", icon: "BarChart3" },
    { label: t("analytics"), href: "analytics", icon: "TrendingUp" },
    { label: t("community"), href: "community", icon: "Users" },
    {
      label: t("noLockStaking"),
      href: "staking",
      icon: "PiggyBank",
      section: "staking",
    },
    {
      label: t("lockedStaking"),
      href: "locked-staking",
      icon: "PiggyBank",
      section: "staking",
    },
    {
      label: t("lpBonds"),
      href: "lp-bonds",
      icon: "BarChart3",
      section: "bonds",
    },
    {
      label: t("treasuryBonds"),
      href: "treasury-bonds",
      icon: "FileText",
      section: "bonds",
    },
    { label: t("dao"), href: "dao", icon: "Settings", section: "tools" },
    {
      label: t("coolingPool"),
      href: "cooling-pool",
      icon: "Sword",
      section: "tools",
    },
    { label: t("turbine"), href: "turbine", icon: "Wind", section: "tools" },
    { label: t("swap"), href: "swap", icon: "RotateCcw", section: "tools" },
    { label: t("documents"), href: "documents", icon: "FolderOpen" },
    { label: t("viewOnAve"), href: "ave", icon: "Triangle" },
    { label: t("viewOnDexScreener"), href: "dex-screener", icon: "Shield" },
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
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-bold text-white">
          <span className="text-purple-400">ONE</span> OLYONE
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-4 py-6">
        {/* Main Navigation */}
        {groupedItems.main && (
          <div className="space-y-2">
            {groupedItems.main.map((item) => {
              const Icon = Icons[item.icon]
              // 检查当前路径是否匹配（考虑locale）
              const isActive =
                pathname.includes(`/${item.href}/`) ||
                pathname.endsWith(`/${item.href}`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Staking Section */}
        {groupedItems.staking && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("staking")}
            </h3>
            {groupedItems.staking.map((item) => {
              const Icon = Icons[item.icon]
              const isActive =
                pathname.endsWith(item.href) ||
                pathname.includes(`/${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "text-white" : "text-purple-400"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Bonds Section */}
        {groupedItems.bonds && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("bonds")}
            </h3>
            {groupedItems.bonds.map((item) => {
              const Icon = Icons[item.icon]
              const isActive =
                pathname.endsWith(item.href) ||
                pathname.includes(`/${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}

        {/* Tools Section */}
        {groupedItems.tools && (
          <div className="space-y-2">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              {t("tools")}
            </h3>
            {groupedItems.tools.map((item) => {
              const Icon = Icons[item.icon]
              const isActive =
                pathname.endsWith(item.href) ||
                pathname.includes(`/${item.href}/`)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {/* Social Links */}
      <div className="border-t border-gray-800 p-4">
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <Icons.Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Telegram"
          >
            <Icons.Send className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="YouTube"
          >
            <Icons.Play className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  )
}

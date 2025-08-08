"use client"
import Image from "next/image"
import { useEffect } from "react"
import { Icon, IconFontName } from "~/components"
import { Link, usePathname } from "~/i18n/navigation"
import { cn } from "~/lib/utils"
import { SidebarContent } from "./sidebar"

interface NavigationItem {
  label: string
  href: string
  icon: string
  section?: string
  uppercase?: boolean
}

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

const NavigationItem = ({
  item,
  onClose,
}: {
  item: NavigationItem
  onClose: () => void
}) => {
  const pathname = usePathname()
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`)

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex w-full items-center space-x-3 px-5 py-4 text-base font-medium transition-colors",
        "hover:bg-foreground/5",
        isActive && "text-gradient"
      )}
    >
      {item.icon.startsWith("/") ? (
        <Image src={item.icon} alt={item.label} width={24} height={24} />
      ) : (
        <Icon
          name={item.icon as IconFontName}
          size={24}
          className={cn("text-gray-400", isActive && "text-gradient")}
        />
      )}
      <span
        className={cn(
          "text-gray-300",
          isActive && "text-gradient",
          item.uppercase && "uppercase"
        )}
      >
        {item.label}
      </span>
    </Link>
  )
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  // 阻止背景滚动和键盘事件
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      document.addEventListener("keydown", handleKeyDown)

      return () => {
        document.body.style.overflow = "unset"
        document.removeEventListener("keydown", handleKeyDown)
      }
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/90 z-40 lg:hidden p-4 pt-20"
        onClick={onClose}
      >
        {/* 侧边栏 */}
        <div
          className={cn(
            "w-full z-50 transform sidebar h-[calc(100vh-96px)] flex-1 md:hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="space-y-6 h-full w-[calc(100vw-32px)] py-4">
            <div className="h-full w-full overflow-y-auto">
              <SidebarContent />
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

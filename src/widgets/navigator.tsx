"use client"

import { NavigationTabs } from "~/components"
import { usePathname } from "~/i18n/navigation"

export function Navigator({
  items,
}: {
  items: { label: string; href: string }[]
}) {
  const pathname = usePathname()
  return (
    <NavigationTabs
      data={items}
      activeIndex={items.findIndex(
        (item) =>
          pathname.endsWith(item.href) || pathname.includes(`/${item.href}/`)
      )}
    />
  )
}

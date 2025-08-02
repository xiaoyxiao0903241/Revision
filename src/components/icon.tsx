"use client"

import React from "react"
import { cn } from "~/lib/utils"

export type IconFontName = "analytics" | "community" | "Frame"

// 图标映射表
export const ICON_MAP: Record<IconFontName, string> = {
  analytics: "\ue726",
  community: "\ue727",
  Frame: "\ue725",
}

interface IconFontProps {
  name: IconFontName
  className?: string
  size?: number | string
  color?: string
  onClick?: () => void
}

export function Icon({ name, className, ...props }: IconFontProps) {
  const iconCode = ICON_MAP[name]

  if (!iconCode) {
    console.warn(`Icon "${name}" not found in icon resources`)
    return null
  }

  return (
    <i
      className={cn("iconfont text-2xl text-primary/70", className)}
      {...props}
    >
      {iconCode}
    </i>
  )
}

"use client"

import React from "react"
import { cn } from "~/lib/utils"

interface OptionListProps {
  children: React.ReactNode
  className?: string
}

export function OptionList({ children, className }: OptionListProps) {
  return <div className={cn("option-list", className)}>{children}</div>
}

interface OptionItemProps {
  children: React.ReactNode
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function OptionItem({
  children,
  isSelected = false,
  onClick,
  className,
}: OptionItemProps) {
  return (
    <div
      className={cn(
        "option-item",
        isSelected && "option-item-selected",
        className
      )}
      onClick={onClick}
    >
      <div className="option-item-content">{children}</div>
    </div>
  )
}

// 默认的 ONE 图标组件
export function OneIcon({ className }: { className?: string }) {
  return (
    <div className={cn("one-icon", className)}>
      <span>ONE</span>
    </div>
  )
}

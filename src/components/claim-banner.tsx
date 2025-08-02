"use client"

import React from "react"
import { cn } from "~/lib/utils"

interface ClaimBannerProps {
  className?: string
  title?: string
  description?: string
  icon?: React.ReactNode
  onClick?: () => void
}

export function ClaimBanner({
  className,
  title = "CLAIM",
  description = "You may claim rebase rewards and boost at any time.",
  icon = (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
    </svg>
  ),
  onClick,
}: ClaimBannerProps) {
  return (
    <div className="relative">
      {/* 主横幅容器 */}
      <div
        className={cn(
          "relative bg-blue-600 text-white p-4 cursor-pointer transition-all duration-300 hover:bg-blue-700 active:bg-blue-800",
          "border-2 border-white/10 shadow-lg",
          className
        )}
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
        }}
        onClick={onClick}
      >
        <div className="flex items-start space-x-3">
          {/* 图标容器 */}
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {icon}
          </div>

          {/* 文字内容 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white uppercase tracking-wide mb-1">
              {title}
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* 右下角的双三角形效果 - 在切割区域外 */}
      <div className="absolute bottom-0 right-0" style={{ zIndex: 10 }}>
        {/* 外层三角形 */}
        <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderLeft: "32px solid transparent",
            borderBottom: "32px solid red",
          }}
        />
        {/* 内层三角形 - 透明，形成空隙 */}
        <div
          className="absolute bottom-0 right-0 w-0 h-0"
          style={{
            borderLeft: "27px solid transparent",
            borderBottom: "27px solid transparent",
          }}
        />
      </div>
    </div>
  )
}

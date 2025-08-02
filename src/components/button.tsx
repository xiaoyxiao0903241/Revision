"use client"

import React from "react"
import { cn } from "~/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "gradient"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  // 斜切相关属性
  clipDirection?: "topLeft-bottomRight" | "topRight-bottomLeft" | "none"
  clipSize?: number // 斜切尺寸，单位像素
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  clipDirection = "none",
  clipSize = 8,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-bold text-white border-none cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 shadow-lg hover:shadow-xl",
    outlined:
      "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
    gradient:
      "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 shadow-lg hover:shadow-xl",
  }

  // 生成 clip-path 样式
  const getClipPath = () => {
    if (clipDirection === "none" || clipSize === 0) {
      return undefined
    }

    if (clipDirection === "topLeft-bottomRight") {
      return `polygon(${clipSize}px 0, 100% 0, 100% calc(100% - ${clipSize}px), calc(100% - ${clipSize}px) 100%, 0 100%, 0 ${clipSize}px)`
    }

    if (clipDirection === "topRight-bottomLeft") {
      return `polygon(0 0, calc(100% - ${clipSize}px) 0, 100% ${clipSize}px, 100% 100%, ${clipSize}px 100%, 0 calc(100% - ${clipSize}px))`
    }

    return undefined
  }

  const clipPath = getClipPath()

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      style={{
        clipPath,
        ...(clipPath && {
          fontFamily: "'Courier New', monospace",
          textTransform: "uppercase",
          letterSpacing: "1px",
          textShadow:
            "1px 1px 0px rgba(0, 0, 0, 0.5), 2px 2px 0px rgba(0, 0, 0, 0.3)",
          imageRendering: "pixelated",
        }),
      }}
      {...props}
    >
      {children}
    </button>
  )
}

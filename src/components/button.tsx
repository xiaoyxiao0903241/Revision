"use client"

import React from "react"
import { cn, getClipPath } from "~/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outlined" | "accent" | "disabled"
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
  clipSize = 12,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-bold text-white cursor-pointer transition-all duration-300 ease-in-out focus:outline-none hover:opacity-80 active:opacity-70"

  const sizeClasses = {
    sm: "px-2 h-6 text-sm font-normal",
    md: "px-6 h-12 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    primary: "gradient",
    secondary: "bg-secondary",
    accent: "bg-warning",
    disabled: "bg-gray-500 hover:opacity-100 active:opacity-100",
    outlined:
      "bg-transparent border-2 border-white/20 text-white hover:bg-white/10",
  }

  const clipPath = getClipPath(clipDirection, clipSize)

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
      }}
      {...props}
    >
      {children}
    </button>
  )
}

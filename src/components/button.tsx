"use client";

import React from "react";
import { cn, getClipPath } from "~/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outlined"
    | "accent"
    | "disabled"
    | "link";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  // 斜切相关属性
  clipDirection?: "topLeft-bottomRight" | "topRight-bottomLeft" | "none";
  clipSize?: number; // 斜切尺寸，单位像素
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  clipDirection = "none",
  clipSize = 12,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "relative inline-flex items-center justify-center font-bold text-white cursor-pointer transition-all duration-300 ease-in-out focus:outline-none hover:opacity-80 active:opacity-70";

  const sizeClasses = {
    sm: "px-2 h-6 text-sm font-normal",
    md: "px-6 h-12 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantClasses = {
    primary: "bg-gradient-to-r from-[#B408D7] to-[#576AF4]",
    secondary: "bg-secondary",
    accent: "bg-warning",
    disabled:
      "bg-gray-500 hover:opacity-100 active:opacity-100 cursor-not-allowed",
    outlined:
      "bg-transparent border-2 border-[#434c8c] text-white hover:bg-white/10  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)]",
    link: "bg-transparent text-white hover:bg-white/10",
  };

  const clipPath = getClipPath(clipDirection, clipSize);

  if (variant === "outlined") {
    return (
      <button
        className={cn(
          "relative px-4 bg-gradient-to-r from-primary to-secondary cursor-pointer flex items-center justify-center hover:opacity-80 active:opacity-70",
          className,
        )}
        style={{
          clipPath,
        }}
        disabled={disabled}
        {...props}
      >
        {/* 渐变边框背景 */}
        <div
          className="absolute top-[1px] left-[1px] right-[1px] bottom-[1px] bg-[#1a1d4a]"
          style={{
            clipPath,
          }}
        ></div>
        {children}
      </button>
    );
  }
  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        {
          "bg-gradient-to-r from-gray-500 to-gray-500 hover:opacity-100 active:opacity-100 text-white/50":
            disabled,
        },
        className,
      )}
      style={{
        clipPath,
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

"use client";

import React from "react";
import { cn, getClipPath } from "~/lib/utils";

interface ViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  // 斜切相关属性
  clipDirection?: "topLeft-bottomRight" | "topRight-bottomLeft" | "none";
  clipSize?: number; // 斜切尺寸，单位像素
  // 边框相关属性
  border?: boolean;
  borderColor?: string;
  borderWidth?: number;
}

export function View({
  className,
  children,
  clipDirection = "topRight-bottomLeft",
  clipSize = 12,
  border = false,
  borderColor = "rgba(255, 255, 255, 0.2)",
  borderWidth = 2,
  ...props
}: ViewProps) {
  const clipPath = getClipPath(clipDirection, clipSize);

  if (border && clipDirection !== "none") {
    return (
      <div className="relative">
        {/* 边框层 */}
        <div
          className="absolute inset-0 pointer-events-none backdrop-blur-sm"
          style={{
            top: `-${borderWidth}px`,
            left: `-${borderWidth}px`,
            right: `-${borderWidth}px`,
            bottom: `-${borderWidth}px`,
            backgroundColor: borderColor,
            clipPath,
            zIndex: 0,
          }}
        />
        {/* 主内容层 */}
        <div
          className={cn("relative", className)}
          style={{
            clipPath,
            zIndex: 1,
          }}
          {...props}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("relative", className)}
      style={{
        clipPath,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

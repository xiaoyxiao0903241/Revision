import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 构建相对路径（推荐使用）
 * 在 next-intl 中间件环境下，相对路径会自动包含当前 locale
 */
export function buildRelativePath(path: string): string {
  // 确保path不以/开头
  return path.startsWith("/") ? path.slice(1) : path
}

/**
 * 从当前路径中提取locale（仅在需要时使用）
 */
export function getLocaleFromPath(pathname: string): string {
  const pathSegments = pathname.split("/")
  return pathSegments[1] || "zh"
}

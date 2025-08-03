import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getClipPath(clipDirection: string, clipSize: number) {
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

export const formatCurrency = (value: number, symbolShown = true) => {
  if (symbolShown) {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
    .format(value)
    .replace("$", "")
}

export const formatDecimal = (value: number, decimals = 2) => {
  return Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

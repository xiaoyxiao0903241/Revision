"use client"
import { useLocale } from "next-intl"
import { dayjs } from "~/lib/utils"

export const LocaleDetector = () => {
  const locale = useLocale()
  dayjs.locale(locale)
  return null
}

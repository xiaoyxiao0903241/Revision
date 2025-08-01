"use client"

import { useTranslations } from "next-intl"
import { Button } from "~/components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu"
import { useLanguageStore } from "~/store/language-store"

export function Header() {
  const t = useTranslations("header")
  const { currentLanguage, setLanguage } = useLanguageStore()

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ]

  return (
    <header className="flex h-20 items-center justify-between px-9">
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              {languages.find((lang) => lang.code === currentLanguage)?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => setLanguage(language.code as "en" | "zh")}
                className={
                  currentLanguage === language.code ? "bg-purple-100" : ""
                }
              >
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Network Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <div className="mr-2 h-4 w-4 rounded-full bg-yellow-400" />
              {t("network")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem>
              <div className="mr-2 h-4 w-4 rounded-full bg-yellow-400" />
              BNB Smart Chain
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="mr-2 h-4 w-4 rounded-full bg-blue-400" />
              Ethereum
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center space-x-4">
        {/* Wallet Connection */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              0xg2a9...12b8
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>{t("wallet")}</DropdownMenuItem>
            <DropdownMenuItem>View on Explorer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

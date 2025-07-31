"use client"

import { useTranslations } from "next-intl"
import { Icons } from "~/components/icons"
import { Button } from "~/components/button"
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
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6 text-white">
      <div className="flex items-center space-x-4">
        {/* Language Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white"
            >
              <Icons.Globe className="mr-2 h-4 w-4" />
              {languages.find((lang) => lang.code === currentLanguage)?.name}
              <Icons.ChevronDown className="ml-2 h-4 w-4" />
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
              <Icons.ChevronDown className="ml-2 h-4 w-4" />
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
              <Icons.Wallet className="mr-2 h-4 w-4 text-purple-400" />
              0xg2a9...12b8
              <Icons.ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Icons.Wallet className="mr-2 h-4 w-4" />
              {t("wallet")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icons.ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

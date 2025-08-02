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
import Logo from "~/assets/logo.svg"
import AppName from "~/assets/app-name.svg"
export function Header() {
  const t = useTranslations("header")
  const { currentLanguage, setLanguage } = useLanguageStore()

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ]

  return (
    <header className="flex h-20 items-center justify-between px-9">
      <div className="flex flex-col items-center justify-center">
        <Logo className="w-24" />
        <AppName className="w-24" />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outlined">
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
      </div>
    </header>
  )
}

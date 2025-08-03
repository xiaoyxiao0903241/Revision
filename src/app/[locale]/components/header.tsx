"use client"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import AppName from "~/assets/app-name.svg"
import Logo from "~/assets/logo.svg"
import { Button } from "~/components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu"

export function Header() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ]

  const handleLanguageChange = (newLocale: string) => {
    // 构造新的路径来切换语言
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.replace(newPath)
  }

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
              {languages.find((lang) => lang.code === locale)?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={locale === language.code ? "bg-purple-100" : ""}
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

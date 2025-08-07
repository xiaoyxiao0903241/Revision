"use client"
import { useLocale } from "next-intl"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "~/components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu"
import NetWork from "~/components/common/netWork"
import ConnectWalletButton from "~/components/web3/ConnectWalletButton"

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
        <Image
          src="/images/widgets/site-logo.png"
          alt="logo"
          width={106}
          height={60}
        />
      </div>
      <div className="flex items-center">
        
      <NetWork />
      <ConnectWalletButton />

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

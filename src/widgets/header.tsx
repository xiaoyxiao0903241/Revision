"use client"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button, Icon, View } from "~/components"
import { WalletDropdown } from "~/widgets"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu"
import { useMock } from "~/hooks/useMock"

export function Header() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("common")
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
  ]
  const { walletConnected, setWalletConnected } = useMock()
  const handleLanguageChange = (newLocale: string) => {
    // 构造新的路径来切换语言
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`)
    router.replace(newPath)
  }
  console.log(walletConnected)

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
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Icon
                name="sphere"
                size={32}
                className="text-foreground pointer-events-none"
              />
              <Icon
                name="arrow"
                size={20}
                className="text-foreground/50 pointer-events-none"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={locale === language.code ? "text-foreground" : ""}
              >
                {language.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {walletConnected ? (
          <>
            <View
              clipDirection="topRight-bottomLeft"
              className="flex items-center gap-2 h-12 px-6 bg-[#1b1f48] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer"
              border
              borderColor="#434c8c"
              borderWidth={1}
            >
              <Image
                src="/images/icon/chain.png"
                alt="chain"
                width={32}
                height={32}
              />
              <span>{t("chain")}</span>
            </View>
            <WalletDropdown>
              <Button clipDirection="topRight-bottomLeft" className="gap-2">
                <Image
                  src="/images/icon/wallet.png"
                  alt="wallet"
                  width={32}
                  height={32}
                />
                <span>0x1222...eFdcx</span>
                <Icon name="arrow" size={16} className="text-foreground/" />
              </Button>
            </WalletDropdown>
          </>
        ) : (
          <Button
            clipDirection="topRight-bottomLeft"
            onClick={() => {
              setWalletConnected(true)
            }}
          >
            {t("connectWallet")}
          </Button>
        )}
      </div>
    </header>
  )
}

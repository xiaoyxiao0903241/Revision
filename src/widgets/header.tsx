"use client"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Button, Icon, View } from "~/components"
import { useMock } from "~/hooks/useMock"
import { WalletDropdown } from "~/widgets"
import { LanguageSwitcher } from "./language-switcher"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const t = useTranslations("common")

  const { walletConnected, setWalletConnected } = useMock()

  return (
    <header className="flex h-20 items-center justify-between px-4 md:px-9 w-full">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/images/widgets/site-logo.png"
            alt="logo"
            width={106}
            height={60}
          />
        </div>
      </div>
      {/* 移动端菜单按钮 */}
      <div className="md:flex items-center gap-4 hidden">
        <LanguageSwitcher />
        {walletConnected ? (
          <>
            <View
              clipDirection="topRight-bottomLeft"
              className="hidden lg:flex items-center gap-2 h-12 px-6 bg-[#1b1f48] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer"
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
                <span className="hidden sm:inline">0x1222...eFdcx</span>
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
            <span className="hidden sm:inline">{t("connectWallet")}</span>
            <span className="sm:hidden">连接</span>
          </Button>
        )}
      </div>
      <div className="md:hidden items-center gap-4 flex">
        <LanguageSwitcher />
        {walletConnected ? (
          <>
            <div className="items-center gap-2 h-8 w-8 border border-[#434c8c] rounded-full cursor-pointer">
              <Image
                src="/images/icon/chain.png"
                alt="chain"
                width={32}
                height={32}
              />
            </div>
            <WalletDropdown>
              <div>
                <Image
                  src="/images/icon/wallet.png"
                  alt="wallet"
                  width={32}
                  height={32}
                />
              </div>
            </WalletDropdown>
          </>
        ) : (
          <div
            onClick={() => {
              setWalletConnected(true)
            }}
          >
            <Image
              src="/images/icon/wallet.png"
              alt="wallet"
              width={32}
              height={32}
            />
          </div>
        )}
        <button
          onClick={onMenuClick}
          className="md:hidden w-[34px] h-[34px] border-[#434c8c] shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] border rounded-full rotate-90 flex items-center justify-center"
        >
          <Icon name="arrow" size={20} />
        </button>
      </div>
    </header>
  )
}

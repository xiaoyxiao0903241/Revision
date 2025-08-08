"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import { Button, Icon, IconFontName, Segments } from "~/components"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/dropdown-menu"
import { cn } from "~/lib/utils"
import { useMockStore } from "~/store/mock"

interface WalletAsset {
  symbol: string
  name: string
  balance: string
  value: string
  icon: string
  chain: string
}

interface PositionItem {
  type: string
  name: string
  amount: string
  value: string
  icon: IconFontName
  className: string
}

interface WalletDropdownProps {
  children: React.ReactNode
}

export function WalletDropdown({ children }: WalletDropdownProps) {
  const t = useTranslations("common")
  const [activeTab, setActiveTab] = useState("wallet")

  // 模拟钱包资产数据
  const walletAssets: WalletAsset[] = [
    {
      symbol: "USDT",
      name: "Tether USD",
      balance: "5.00",
      value: "$5.00",
      icon: "/images/icon/usdt.png",
      chain: "BNB CHAIN",
    },
    {
      symbol: "BNB",
      name: "BNB",
      balance: "5.00",
      value: "$5.00",
      icon: "/images/icon/bnb.png",
      chain: "BNB CHAIN",
    },
    {
      symbol: "OLY",
      name: "OLYONE TOKEN",
      balance: "5.00",
      value: "$5.00",
      icon: "/images/icon/one.png",
      chain: "BNB CHAIN",
    },
  ]

  // 模拟持仓数据
  const positionItems: PositionItem[] = [
    {
      type: "staking",
      name: t("staking"),
      amount: "5.00",
      value: "$5.00",
      icon: "staking",
      className: "bg-warning",
    },
    {
      type: "bonds",
      name: t("bonds"),
      amount: "5.00",
      value: "$5.00",
      icon: "diamond",
      className: "bg-secondary",
    },
  ]

  // 模拟奖励数据
  const rewardItems: PositionItem[] = [
    {
      type: "rebaseReward",
      name: t("rebaseReward"),
      amount: "5.00",
      value: "$5.00",
      icon: "medal",
      className: "gradient",
    },
    {
      type: "totalBonus",
      name: t("totalBonus"),
      amount: "5.00",
      value: "$5.00",
      icon: "bag",
      className: "bg-success",
    },
  ]

  const totalBalance = "$2,359.22"
  const walletAddress = "0x92a9...12b8"

  const handleBuy = () => {
    console.log("Buy clicked")
  }

  const handleSell = () => {
    console.log("Sell clicked")
  }

  const handleReceive = () => {
    console.log("Receive clicked")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[412px] p-0 bg-gradient-to-b from-[#1a1d4a] to-[#0f1235] border-[#434c8c] text-white"
      >
        {/* Header */}
        <div className="flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-foreground/50">
              <Image
                src="/images/icon/fox.png"
                alt="wallet"
                width={24}
                height={24}
              />
              <span className="text-lg text-foreground font-mono">
                {walletAddress}
              </span>
              <div className="cursor-pointer hover:text-white/70 ">
                <Icon name="copy" size={16} className="pointer-events-none" />
              </div>
              <div className="cursor-pointer hover:text-white/70">
                <Icon name="share" size={16} className="pointer-events-none" />
              </div>
            </div>
            <Button
              clipDirection="topLeft-bottomRight"
              clipSize={8}
              variant="outlined"
              className="h-8"
              onClick={() => {
                useMockStore.setState({
                  walletConnected: false,
                })
              }}
            >
              <span className="text-gradient text-sm px-2 z-10">
                {t("disconnect")}
              </span>
            </Button>
          </div>

          {/* Balance */}
          <div className="flex flex-col gap-2">
            <div className="text-3xl font-bold">{totalBalance}</div>
            <div className="text-foreground/50 text-xs">
              {activeTab === "wallet" ? t("myWallet") : t("myAccount")}
            </div>
          </div>

          <Segments
            options={[
              { value: "wallet", label: t("wallet") },
              { value: "account", label: t("account") },
            ]}
            value={activeTab}
            onChange={(value) => setActiveTab(value as "wallet" | "account")}
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {activeTab === "wallet" && (
            <div className="space-y-3">
              {/* Assets Header */}
              <span className="text-foreground/50 text-xs px-0">
                {t("assets")}
              </span>

              {/* Assets List */}
              <div className="">
                {walletAssets.map((asset, index) => (
                  <DropdownMenuItem
                    key={index}
                    className="flex items-center justify-between px-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={asset.icon}
                          alt={asset.symbol}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <Image
                          src="/images/icon/bnb.png"
                          alt="bnb"
                          width={16}
                          height={16}
                          className="absolute -bottom-1 -right-1 w-4 h-4"
                        />
                      </div>
                      <div>
                        <div className="font-medium space-x-2">
                          <span>{asset.symbol}</span>
                          <span className="text-white/50 text-xs">
                            {asset.name}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          {asset.chain}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium font-mono text-lg">
                        {asset.balance}
                      </div>
                      <div className="text-xs text-white/50">{asset.value}</div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              {/* Action Buttons */}
              <div className="flex gap-5 w-full text-sm font-mono">
                <Button
                  onClick={handleBuy}
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  {t("buy")}
                </Button>
                <Button
                  onClick={handleSell}
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  {t("sell")}
                </Button>
                <Button
                  onClick={handleReceive}
                  variant="outlined"
                  clipDirection="topLeft-bottomRight"
                  clipSize={8}
                  className="h-8 flex-1 text-sm font-mono"
                >
                  <span className="text-gradient text-sm px-2 z-10">
                    {t("receive")}
                  </span>
                </Button>
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              {/* Position Section */}
              <div className="space-y-3">
                <span className="text-white/50 text-xs px-0">
                  {t("position")}
                </span>
                <div className="space-y-2">
                  {positionItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            `w-8 h-8 rounded-full flex items-center justify-center`,
                            item.className
                          )}
                        >
                          <Icon name={item.icon} size={24} />
                        </div>
                        <div className="font-medium text-lg font-mono text-white">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg font-mono text-white">
                          {item.amount}
                        </div>
                        <div className="text-xs text-white/50">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reward Section */}
              <div className="space-y-3">
                <span className="text-white/50 text-xs px-0">
                  {t("reward")}
                </span>
                <div className="space-y-2">
                  {rewardItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            `w-8 h-8 rounded-full flex items-center justify-center`,
                            item.className
                          )}
                        >
                          <Icon name={item.icon} size={24} />
                        </div>
                        <div className="font-medium text-lg text-white">
                          {item.name}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg text-white">
                          {item.amount}
                        </div>
                        <div className="text-xs text-white/50">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

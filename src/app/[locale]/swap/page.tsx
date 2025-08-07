"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import * as React from "react"
import { Alert, RoundedLogo, View } from "~/components"
import { Button } from "~/components/button"
import { Card } from "~/components/card"
import { useMock } from "~/hooks/useMock"
import { formatDecimal, formatHash } from "~/lib/utils"
import { useMockStore } from "~/store/mock"
import { BalanceCard } from "~/widgets/balance-card"
import { CandlestickChart } from "~/widgets/charts"
import { RateCard } from "~/widgets/rate-card"
import { Slippage } from "~/widgets/slippage"
import { Balance, SwapCard } from "~/widgets/swap-card"
import { SwapSummary } from "~/widgets/swap-summary"
export default function SwapPage() {
  const t = useTranslations("swap")
  const { decimal, setDecimal, walletConnected: isLoading } = useMock()
  const [source, setSource] = React.useState<"USDT" | "OLY">("USDT")

  const onToggle = async () => {
    useMockStore.setState({
      walletConnected: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    useMockStore.setState({
      walletConnected: false,
    })
  }

  const options: Balance[] = [
    {
      symbol: "USDT",
      icon: (
        <Image src="/images/icon/usdt.png" alt="usdt" width={32} height={32} />
      ),
      balance: 1000,
      profit: -10,
      description: t("usdtDescription"),
      address: "0x9F9744239xxx3q34247234",
    },
    {
      symbol: "OLY",
      icon: <RoundedLogo className="w-8 h-8" />,
      balance: 1000,
      profit: -6,
      description: t("olyDescription"),
      address: "0x9F9744239xxx3q34247234",
    },
  ]

  const sourceOption = options.find((item) => item.symbol === source)
  const destinationOption = options.find((item) => item.symbol !== source)

  return (
    <div className="space-y-6">
      {/* 页面标题和描述 */}
      <Alert
        icon="swap"
        title={t("title")}
        description={t("searchBestPrice")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：交换界面 */}
        <div>
          <Card className="flex flex-col gap-5">
            {/* 交换输入区域 */}
            <View className="relative -space-y-3">
              {/* USDT 输入 */}
              <SwapCard
                data={{
                  type: "source",
                  ...sourceOption!,
                  value: decimal,
                  profit: undefined,
                }}
                onChange={setDecimal}
              >
                <BalanceCard
                  balance={sourceOption!.balance}
                  value={decimal}
                  symbol={sourceOption!.symbol}
                  onChange={setDecimal}
                />
              </SwapCard>

              {/* 交换图标 - 浮动在两个卡片之间 */}
              <div
                className="py-1 z-20 cursor-pointer w-full flex items-center justify-center"
                onClick={() => {
                  setSource((source) =>
                    source === sourceOption?.symbol
                      ? destinationOption!.symbol
                      : sourceOption!.symbol
                  )
                }}
              >
                <Image
                  src="/images/icon/swap.png"
                  alt="swap"
                  className="z-20"
                  width={48}
                  height={48}
                />
              </div>

              {/* OLY 输入 */}
              <SwapCard
                data={{
                  type: "destination",
                  value: decimal,
                  ...destinationOption!,
                }}
                onChange={setDecimal}
              >
                <BalanceCard
                  balance={destinationOption!.balance}
                  value={decimal}
                  symbol={destinationOption!.symbol}
                />
              </SwapCard>
            </View>

            <RateCard
              description="1 USDT= 0.025548 OLY"
              isLoading={isLoading}
              onRefresh={onToggle}
            >
              <div className="w-40">1 USDT= 0.025548 OLY</div>
            </RateCard>

            {/* 滑点设置 */}
            <Slippage
              options={[
                { value: "1", label: "1%" },
                { value: "3", label: "3%" },
                { value: "5", label: "5%" },
                { value: "1.2", label: "1.2%" },
              ]}
              value={decimal}
              onChange={setDecimal}
            />

            {/* 交换按钮 */}
            <Button clipDirection="topRight-bottomLeft">
              {t("swapButton")}
            </Button>
            {/* 交换信息 */}

            <SwapSummary
              data={{
                amountToSend: (
                  <span className="uppercase">
                    {`${formatDecimal(Number(decimal))}  ${
                      sourceOption?.symbol
                    }`}
                    <span className="text-foreground/50 pl-2">
                      ($106,793.93)
                    </span>
                  </span>
                ),
                minToReceive: (
                  <span className="uppercase">
                    {`${formatDecimal(Number(decimal))}  ${
                      destinationOption?.symbol
                    }`}
                    <span className="text-foreground/50 pl-2">
                      ($106,793.93)
                    </span>
                  </span>
                ),
                yakSwapFee: `${formatDecimal(Number(decimal))} ${
                  sourceOption?.symbol
                }`,
                contractSpender: formatHash(sourceOption!.address),
                recipient: formatHash(destinationOption!.address),
                tokenIn: destinationOption!.description,
                tokenOut: sourceOption!.description,
              }}
            />
          </Card>
        </div>
        <div>
          {/* 右侧：价格图表 */}
          <Card className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold">{t("priceChart")}</h3>
            <CandlestickChart />
          </Card>
        </div>
      </div>
    </div>
  )
}

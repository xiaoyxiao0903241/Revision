"use client"

import { useTranslations } from "next-intl"
import * as React from "react"
import Swap from "~/assets/swap.svg"
import Usdt from "~/assets/usdt.svg"
import { Alert, RoundedLogo, View } from "~/components"
import { Button } from "~/components/button"
import { Card } from "~/components/card"
import { useMock } from "~/hooks/useMock"
import { formatDecimal, formatHash } from "~/lib/utils"
import { BalanceCard } from "~/widgets/balance-card"
import { CandlestickChart } from "~/widgets/charts"
import { RateCard } from "~/widgets/rate-card"
import { Slippage } from "~/widgets/slippage"
import { Balance, SwapCard } from "~/widgets/swap-card"
import { SwapSummary } from "~/widgets/swap-summary"
export default function SwapPage() {
  const t = useTranslations("swap")
  const { decimal, setDecimal } = useMock()
  const [source, setSource] = React.useState<"USDT" | "OLY">("USDT")

  const options: Balance[] = [
    {
      symbol: "USDT",
      icon: <Usdt className="w-8 h-8" />,
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
            <View className="relative space-y-6">
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
                className="absolute left-1/2 top-[41%] transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                onClick={() => {
                  setSource((source) =>
                    source === sourceOption?.symbol
                      ? destinationOption!.symbol
                      : sourceOption!.symbol
                  )
                }}
              >
                <Swap className="w-12 h-12 text-gray-300" />
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

            <RateCard />

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

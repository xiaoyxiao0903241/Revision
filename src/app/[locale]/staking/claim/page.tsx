"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import {
  Alert,
  Button,
  Card,
  CardContent,
  List,
  Notification,
  Segments,
} from "~/components"
import { amountOptions, durationOptions, useMock } from "~/hooks/useMock"
import { formatCurrency, formatDecimal } from "~/lib/utils"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { AmountSelect, DurationSelect } from "~/widgets/select"

export default function ClaimPage() {
  const t = useTranslations("staking")
  const { amount, setAmount, duration, setDuration } = useMock()
  const [selectedClaimType, setSelectedClaimType] =
    useState<string>("rebaseReward")

  // 定义领取类型选项
  const claimOptions = [
    { value: "rebaseReward", label: t("rebaseReward") },
    { value: "rebaseBoost", label: t("rebaseBoost") },
  ]

  return (
    <div className="space-y-6">
      <Alert
        icon="claim"
        title={t("claimTitle")}
        description={t("claimDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 分段控制器 */}
          <Card>
            <CardContent className="space-y-6">
              <Segments
                options={claimOptions}
                value={selectedClaimType}
                onChange={setSelectedClaimType}
              />
              <AmountSelect
                options={amountOptions}
                value={amount}
                onChange={setAmount}
              />
              <AmountCard
                data={{
                  value: 123,
                  desc: 456,
                  balance: 789,
                }}
              />
              <Notification>{t("claimInfo")}</Notification>
              <DurationSelect
                options={durationOptions}
                value={duration}
                onChange={setDuration}
              />
              <List>
                <List.Item>
                  <List.Label className="flex items-center gap-1">
                    {t("youWillReceive")}
                  </List.Label>
                  <List.Value className="text-xl font-mono">
                    {formatCurrency(85, false)} OLY
                  </List.Value>
                </List.Item>
                <List.Item>
                  <List.Label>{t("taxRate")}</List.Label>
                  <List.Value className="text-secondary font-mono">
                    {formatCurrency(0.38, false)}%
                  </List.Value>
                </List.Item>
                <List.Item>
                  <List.Label>{t("incomeTax")}</List.Label>
                  <List.Value className="font-mono">
                    {formatDecimal(0.07994899, 6)} OLY
                  </List.Value>
                </List.Item>
              </List>

              {/* 领取按钮 */}
              <Button clipDirection="topRight-bottomLeft" className="w-full">
                {t("claimButton")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧钱包摘要 */}
        <div>
          <WalletSummary
            data={{
              availableToStake: 100,
              stakedAmount: 100,
              stakedAmountDesc: 12345,
              apr: 100,
              rebaseRewards: 12345678,
              rebaseRewardsDesc: 12345678,
              totalStaked: 100,
              stakers: 100,
              olyMarketCap: 100,
            }}
          />
        </div>
      </div>
    </div>
  )
}

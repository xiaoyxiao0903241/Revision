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
import {
  amountOptions,
  durationOptions,
  infoItems,
  useMock,
} from "~/hooks/useMock"
import { formatCurrency, formatDecimal } from "~/lib/utils"
import { WalletSummary, InfoPopover } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { ClaimSummary } from "~/widgets/claim-summary"
import { AmountSelect, DurationSelect } from "~/widgets/select"

export default function ClaimPage() {
  const t = useTranslations("staking")
  const tLockedStaking = useTranslations("lockedStaking")
  const { amount, setAmount, duration, setDuration, decimal, setDecimal } =
    useMock()
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
                  value: decimal,
                  desc: 456,
                  balance: 789,
                }}
                onChange={setDecimal}
              />
              <Notification>{tLockedStaking("claimInfo")}</Notification>
              <DurationSelect
                options={durationOptions}
                value={duration}
                onChange={setDuration}
              />
              <ClaimSummary
                data={{
                  amount: 85,
                  taxRate: 0.38,
                  incomeTax: 0.07994899,
                }}
              />

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

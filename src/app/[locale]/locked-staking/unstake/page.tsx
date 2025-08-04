"use client"

import { useTranslations } from "next-intl"
import { Alert, Card, Notification } from "~/components"
import { amountOptions, useMock } from "~/hooks/useMock"
import { WalletSummary } from "~/widgets"
import { AmountTicker } from "~/widgets/amount-ticker"
import { AmountSelect } from "~/widgets/select"

export default function UnstakePage() {
  const t = useTranslations("staking")
  const tLockedStaking = useTranslations("lockedStaking")
  const { amount, setAmount, decimal, setDecimal } = useMock()
  return (
    <div className="space-y-6">
      <Alert
        icon="unstake"
        title={t("unstakeTitle")}
        description={tLockedStaking("unstakeDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <AmountSelect
              options={amountOptions}
              value={amount}
              onChange={setAmount}
            />
            <AmountTicker
              data={{
                title: t("amount"),
                value: decimal,
                desc: 100,
                endAt: new Date(Date.now() + 10000),
              }}
              disabled
            />
            <AmountTicker
              data={{
                title: t("amount"),
                value: decimal,
                desc: 100,
              }}
              onChange={setDecimal}
            />
            {/* 信息提示 */}
            <Notification>{tLockedStaking("unstakeInfo")}</Notification>
          </Card>
        </div>
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

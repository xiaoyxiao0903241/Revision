"use client"

import { useTranslations } from "next-intl"
import { Alert, Button, Card } from "~/components"
import { useMock } from "~/hooks/useMock"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { StakingSummary } from "~/widgets/staking-summary"
export default function StakingPage() {
  const t = useTranslations("staking")
  const tNoLockedStaking = useTranslations("noLockedStaking")
  const { decimal, setDecimal } = useMock()
  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={t("stake")}
        description={tNoLockedStaking("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <AmountCard
              data={{
                value: decimal,
                desc: 456,
                balance: 789,
              }}
              description={t("balance")}
              onChange={setDecimal}
            />
            <StakingSummary
              data={{
                rebaseRewardRate: "0.3%-1%",
                nextRebaseRewardRate: "0.38%",
                endAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
              }}
            />
            <Button
              clipDirection="topRight-bottomLeft"
              className="w-full font-mono"
            >
              {t("stake")}
            </Button>
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

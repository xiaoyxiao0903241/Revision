"use client"

import { useTranslations } from "next-intl"
import { Alert, Button, Card, Countdown, List } from "~/components"
import { durationOptions, useMock } from "~/hooks/useMock"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { DurationSelect } from "~/widgets/select"
export default function StakingPage() {
  const t = useTranslations("staking")
  const tLockedStaking = useTranslations("lockedStaking")
  const { duration, setDuration, decimal, setDecimal } = useMock()
  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={tLockedStaking("alertTitle")}
        description={tLockedStaking("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <DurationSelect
              options={durationOptions}
              value={duration}
              onChange={setDuration}
            />
            <AmountCard
              data={{
                value: decimal,
                desc: 456,
                balance: 789,
              }}
              onChange={setDecimal}
            />
            <List>
              <List.Item>
                <List.Label>{t("rebaseRewardRate")}</List.Label>
                <List.Value>0.3%-1%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("rebaseBoost")}</List.Label>
                <List.Value>0.3%-1%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("nextRebaseRewardRate")}</List.Label>
                <List.Value className="text-secondary">0.38%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("countdownToNextRebase")}</List.Label>
                <List.Value>
                  <Countdown
                    endAt={new Date(Date.now() + 1000 * 60 * 60 * 24)}
                  />
                </List.Value>
              </List.Item>
            </List>
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

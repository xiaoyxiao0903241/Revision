"use client"

import { useCountDown } from "ahooks"
import { useTranslations } from "next-intl"
import { useState } from "react"
import {
  Alert,
  Button,
  Card,
  Countdown,
  List,
  Notification,
  Segments,
} from "~/components"
import { useMock } from "~/hooks/useMock"
import { formatDecimal } from "~/lib/utils"
import { AmountCard, WalletSummary } from "~/widgets"
import { AmountTicker } from "~/widgets/amount-ticker"

export default function UnstakePage() {
  const t = useTranslations("staking")
  const { decimal, setDecimal } = useMock()
  const tNoLockedStaking = useTranslations("noLockedStaking")
  const [disabled] = useState(true)
  const [selectedStakeType, setSelectedStakeType] = useState<
    "release" | "unstake"
  >("release")
  const stakeOptions = [
    { value: "release", label: tNoLockedStaking("release") },
    { value: "unstake", label: t("unstake") },
  ]
  const targetDate = new Date(Date.now() + 10000)
  const [countDown] = useCountDown({
    targetDate: targetDate,
  })
  return (
    <div className="space-y-6">
      <Alert
        icon="unstake"
        title={t("unstakeTitle")}
        description={tNoLockedStaking("unstakeDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Segments
              options={stakeOptions}
              value={selectedStakeType}
              onChange={(value) =>
                setSelectedStakeType(value as "release" | "unstake")
              }
            />
            {selectedStakeType === "release" ? (
              <>
                <AmountTicker
                  data={{
                    title: t("amount"),
                    value: decimal,
                    desc: 100,
                    endAt: countDown ? targetDate : undefined,
                  }}
                  onChange={setDecimal}
                />
                {/* 信息提示 */}
                <Notification>
                  {tNoLockedStaking(
                    disabled ? "unstakeDisabledInfo" : "unstakeInfo"
                  )}
                </Notification>
              </>
            ) : (
              <>
                <AmountCard
                  data={{
                    value: "100",
                    desc: 100,
                    balance: 100,
                  }}
                  description={t("balance")}
                />
                <List>
                  <List.Item>
                    <List.Label>{t("youWillReceive")}</List.Label>
                    <List.Value className="text-xl font-mono">{`${formatDecimal(
                      100,
                      2
                    )} OLY`}</List.Value>
                  </List.Item>
                  <List.Item>
                    <List.Label>{t("nextRebaseRewardRate")}</List.Label>
                    <List.Value className="text-success">0.38</List.Value>
                  </List.Item>
                  <List.Item>
                    <List.Label>{t("nextRebaseReward")}</List.Label>
                    <List.Value className="font-mono">{`${formatDecimal(
                      100,
                      6
                    )} OLY`}</List.Value>
                  </List.Item>
                  <List.Item>
                    <List.Label>{t("countdownToNextRebase")}</List.Label>
                    <List.Value className="font-mono">
                      <Countdown endAt={new Date(Date.now() + 10000)} />
                    </List.Value>
                  </List.Item>
                </List>
                <Button clipDirection="topRight-bottomLeft">
                  {t("unstake")}
                </Button>
              </>
            )}
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

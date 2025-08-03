"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import {
  Alert,
  Button,
  List,
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Statistics,
  View,
  Card,
  CardHeader,
  Notification,
} from "~/components"
import Logo from "~/assets/logo.svg"
import { WalletSummary } from "~/widgets"
import { AmountTicker } from "~/widgets/amount-ticker"
import { formatCurrency } from "~/lib/utils"

export default function UnstakePage() {
  const t = useTranslations("staking")
  const [selectedValue, setSelectedValue] = useState<string>("")

  // 定义质押选项数据
  const stakingOptions = [
    { value: 100, desc: "7 Days" },
    { value: 200, desc: "14 Days" },
    { value: 300, desc: "30 Days" },
  ]

  // 根据选中的值获取对应的选项数据
  const selectedOption = stakingOptions.find(
    (option) => option.value.toString() === selectedValue
  )

  return (
    <div className="space-y-6">
      <Alert
        icon="unstake"
        title={t("unstakeTitle")}
        description={t("unstakeDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectStakingAmount")}>
                  {selectedOption && (
                    <div className="flex flex-row gap-2 w-full">
                      <RoundedLogo className="w-5 h-5" />
                      <span className="flex-1">
                        {formatCurrency(selectedOption.value)}
                      </span>
                      <span>{selectedOption.desc}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {stakingOptions.map((item) => (
                  <SelectItem key={item.value} value={item.value.toString()}>
                    <div className="flex flex-row gap-2 w-full">
                      <RoundedLogo className="w-5 h-5" />
                      <span className="flex-1">
                        {formatCurrency(item.value)}
                      </span>
                      <span>{item.desc}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AmountTicker
              data={{
                value: selectedOption?.value ?? 100,
                desc: 100,
                endAt: new Date(Date.now() + 10000),
              }}
            />
            {/* 信息提示 */}
            <Notification>{t("unstakeInfo")}</Notification>
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

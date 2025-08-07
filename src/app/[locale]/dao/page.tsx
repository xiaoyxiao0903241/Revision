"use client"

import { useTranslations } from "next-intl"
import { Alert, Button, Card, Notification, Statistics } from "~/components"
import { Countdown } from "~/components/count-down"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"
import { AmountCard } from "~/widgets"
import { ClaimSummary } from "~/widgets/claim-summary"
import { MatrixBonusRecords } from "~/widgets/dao-records"
import { useQuery } from "@tanstack/react-query"
import { getClaimPeriod } from "~/wallet/lib/web3/claim"
import { useUserAddress } from '~/contexts/UserAddressContext'
import { Input, RoundedLogo, View } from "~/components"
import {
  rewardList,
  rewardHistoryList,
  rewardMatrix,
  claimReward,
  rewardClaimed,
} from "~/services/auth/dao";
import { formatNumbedecimalScale, formatte2Num } from "~/lib/utils"
import { usePeriods } from "~/hooks/userPeriod"
import { useEffect, useState } from "react"
import { useNolockStore } from "~/store/noLock"
import _ from "lodash"

interface PeriodInfo {
  day: number
  feeRate: number
  feeRecipient: string
  rate: string
  releasedBlocks: string
}

const defaultPeriodInfo = {
  day: 0,
  feeRate: 0,
  feeRecipient: '',
  rate: '0%',
  releasedBlocks: ''
}
export default function DaoPage() {
  const t = useTranslations("dao")
  const tStaking = useTranslations("staking")
  const { userAddress } = useUserAddress()
  const periodListData = usePeriods()
  const {olyPrice } = useNolockStore();
  const [currentPeriodInfo, setCurrentPeriodInfo] = useState<PeriodInfo>(defaultPeriodInfo)
  const [currentRate, setCurrentRate] = useState<number>(0)
    // 奖励信息
  const { data: rewardMatrixData, refetch: refetchLeadReward } = useQuery({
    queryKey: ["leadReward", userAddress],
    queryFn: () => rewardMatrix(userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
  })

  console.log(periodListData, 'periodList')
  console.log(rewardMatrixData, 'rewardMatrixData')

  useEffect(() => {
    console.log(Number(currentPeriodInfo?.rate?.split("%")[0]), 'aaa');
    setCurrentRate(Number(currentPeriodInfo?.rate?.split("%")[0]));
  }, [currentPeriodInfo])


  return (
    <div className="space-y-6">
      {/* 顶部Alert */}
      <Alert
        icon="blocks"
        title={t("matrix_bonus")}
        iconSize={24}
        description={t("matrix_bonus_description")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* 左侧：领取区域 */}
        <div className="space-y-6">
          <Card>
            {/* 倒计时 */}
            <div className="flex items-center text-sm gap-2">
              <p className="text-foreground/50">{t("next_payout_in")}:</p>
              <Countdown
                endAt={
                  new Date(
                    Date.now() +
                      11 * 60 * 60 * 1000 +
                      32 * 60 * 1000 +
                      29 * 1000
                  )
                }
                className="font-chakrapetch"
              />
            </div>
            <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
              <div className="flex items-center justify-between  py-4">
                <div>
                  <label className="text-sm font-medium text-white">
                    {t("amount")}
                  </label>
                  <div className="flex gap-2 text-white font-mono text-3xl">
                    {formatte2Num.format(rewardMatrixData?.unclaimedAmount || 0)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <RoundedLogo />
                  <span className="text-white font-mono">OLY</span>
                </div>
              </div>
            </View>
            {/* 信息提示 */}
            <Notification>
              {t.rich("max_bonus_info", {
                rate: `x${rewardMatrixData?.ratio || 0}`,
                highlight: (chunks) => (
                  <span className="text-white">{chunks}</span>
                ),
              })}
            </Notification>

            {/* 释放期限选择 */}
            <Select onValueChange={(value) => {
              const periodItem = _.find(periodListData?.periodList || [], { day: Number(value) }) as any
              setCurrentPeriodInfo(periodItem ?? defaultPeriodInfo)
            }}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("select_release_period")} />
              </SelectTrigger>
              <SelectContent>
                { periodListData?.periodList?.map((item) => (
                  <SelectItem value={String(item.day)}>{`${item.day} ${tStaking("days")}`}</SelectItem>
                )) }
              </SelectContent>
            </Select>

            <ClaimSummary
              data={{
                amount: Number(rewardMatrixData?.unclaimedAmount || 0) * ((100 - currentRate) / 100),
                taxRate: currentRate,
                incomeTax: Number(rewardMatrixData?.unclaimedAmount) *( currentRate / 100 ),
              }}
            />
            {/* 领取按钮 */}
            <Button clipDirection="topRight-bottomLeft" disabled={Number(rewardMatrixData?.unclaimedAmount || 0) === 0 || currentPeriodInfo?.day < 5}>{t("claim")}</Button>
          </Card>
        </div>
        {/* 右侧：账户摘要 */}
        <div className="space-y-4">
          <Card containerClassName="flat-body">
            <div className="grid grid-cols-2 gap-4">
              <Statistics
                title={t("net_holding")}
                value={`${formatte2Num.format(rewardMatrixData?.totalDepositAmount || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((rewardMatrixData?.totalDepositAmount || 0) * olyPrice, 2)}`}
              />
              <Statistics title={t("direct_referral_count")} value={`${formatte2Num.format(rewardMatrixData?.referralCount || 0)} OLY`} />
            </div>
            <div className="border-t border-foreground/20 w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <Statistics title={t("unlock_layers")} value={`${formatte2Num.format(rewardMatrixData?.validReferralCount || 0)} OLY`} />
              <Statistics
                title={t("total_bonus_amount")}
                value={`${formatte2Num.format(rewardMatrixData?.totalBonus || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((rewardMatrixData?.totalBonus || 0) * olyPrice, 2)}`}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 底部：记录表格 */}
      <MatrixBonusRecords />
    </div>
  )
}

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
import { EvangelistBonusRecords } from "~/widgets"

export default function EvangelistBonusPage() {
  const t = useTranslations("dao")
  const tStaking = useTranslations("staking")

  return (
    <div className="space-y-6">
      {/* 顶部Alert */}
      <Alert
        icon="blocks"
        iconSize={24}
        title={t("evangelist_bonus")}
        description={t("evangelist_bonus_description")}
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
                      12 * 60 * 60 * 1000 +
                      32 * 60 * 1000 +
                      29 * 1000
                  )
                }
                className="font-chakrapetch"
              />
            </div>
            <AmountCard
              data={{
                value: "0.0",
                desc: 0.0,
                balance: 0.0,
              }}
              description={t("claimable")}
              onChange={() => {}}
            />
            {/* 信息提示 */}
            <Notification>
              {t.rich("max_bonus_info", {
                rate: "x2.3",
                highlight: (chunks) => (
                  <span className="text-white">{chunks}</span>
                ),
              })}
            </Notification>

            {/* 释放期限选择 */}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t("select_release_period")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">{`30 ${tStaking("days")}`}</SelectItem>
                <SelectItem value="60">{`60 ${tStaking("days")}`}</SelectItem>
                <SelectItem value="90">{`90 ${tStaking("days")}`}</SelectItem>
              </SelectContent>
            </Select>

            <ClaimSummary
              data={{
                amount: 85.0,
                taxRate: 0.38,
                incomeTax: 0.079948,
              }}
            />
            {/* 领取按钮 */}
            <Button clipDirection="topRight-bottomLeft">{t("claim")}</Button>
          </Card>
        </div>
        {/* 右侧：账户摘要 */}
        <div className="space-y-4">
          <Card containerClassName="flat-body">
            <div className="grid grid-cols-2 gap-4">
              <Statistics
                title={t("net_holding")}
                value="0.00 OLY"
                desc="$0.00"
              />
              <Statistics title={t("direct_referral_count")} value="4" />
            </div>
            <div className="border-t border-foreground/20 w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <Statistics title={t("evangelist_level")} value="V4" />
              <Statistics
                title={t("small_team_performance")}
                value="0.00 OLY"
                desc="$0.00"
              />
            </div>
            <div className="border-t border-foreground/20 w-full mt-4"></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Statistics
                title={t("total_performance")}
                value="0.00 OLY"
                desc="$0.00"
              />
              <Statistics
                title={t("total_bonus_amount")}
                value="0.00 OLY"
                desc="$0.00"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 底部：记录表格 */}
      <EvangelistBonusRecords />
    </div>
  )
}

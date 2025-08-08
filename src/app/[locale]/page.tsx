"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"
import GrayLogo from "~/assets/gray-logo.svg"
import { Alert, Button, Card, Statistics, View } from "~/components"
import { cn } from "~/lib/utils"
import { PerformanceChart } from "~/widgets"
import { PositionDetails } from "~/widgets/position-details"
export default function DashboardPage() {
  const t = useTranslations("dashboard")
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("all")

  const timeFilters = [
    { key: "all", label: t("timeFilters.all") },
    { key: "1m", label: t("timeFilters.1m") },
    { key: "3m", label: t("timeFilters.3m") },
    { key: "6m", label: t("timeFilters.6m") },
    { key: "1y", label: t("timeFilters.1y") },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题和描述 */}
      <Alert
        icon="dashboard"
        title={t("title")}
        description={t("description")}
      />

      {/* 质押和债券仓位区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* 质押仓位 */}
        <Card className="flex flex-col gap-4 relative">
          <div className="grid grid-cols-2 gap-14">
            <div className="flex flex-col gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center">
                <Image
                  src="/images/widgets/logo.png"
                  alt="oly"
                  width={16}
                  height={6}
                />
              </div>
              <span className="text-white">{t("stakingPosition")}</span>
              <Button
                clipDirection="topLeft-bottomRight"
                clipSize={8}
                className="font-mono h-6 text-xs"
              >
                {t("getOlyToken")}
              </Button>
            </div>
            <View
              clipDirection="topRight-bottomLeft"
              className="p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30"
            >
              <Statistics
                title={t("pendingRewardsBalance")}
                value="999.05 OLY"
                desc="$0.00"
                size="md"
              />
            </View>
          </div>
          <div className="border-t border-foreground/10 w-full"></div>
          <PositionDetails
            data={{
              myStakedAmount: "0.00 OLY",
              lifetimeRewards: "0.00 OLY",
              timeInPool: "195 d",
            }}
          />
          <GrayLogo className="w-[76px] absolute right-6 bottom-2" />
        </Card>
        {/* 债券仓位 */}
        <Card className="flex flex-col gap-4 relative">
          <div className="grid grid-cols-2 gap-14">
            <div className="flex flex-col gap-2 items-start">
              <div className="flex items-center">
                <span className="bg-[url('/images/icon/usdt.png')] bg-cover bg-center w-6 h-6"></span>
                <span className="bg-[url('/images/widgets/one.png')] bg-cover bg-center w-6 h-6 -translate-x-2"></span>
              </div>
              <span className="text-white">{t("bondsPosition")}</span>
              <View
                clipDirection="topLeft-bottomRight"
                border={true}
                clipSize={8}
                borderWidth={2}
                borderColor="#434c8c"
                className="px-6 h-5 flex bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer"
              >
                <span className="text-xs text-white">{t("getBonds")}</span>
              </View>
            </div>
            <View
              clipDirection="topRight-bottomLeft"
              className="p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30"
            >
              <Statistics
                title={t("pendingRewardsBalance")}
                value="999.05 OLY"
                desc="$0.00"
                size="md"
              />
            </View>
          </div>
          <div className="border-t border-foreground/10 w-full"></div>

          <PositionDetails
            data={{
              myStakedAmount: "0.00 OLY",
              lifetimeRewards: "0.00 OLY",
              timeInPool: "195 d",
            }}
          />
        </Card>
      </div>

      {/* 社区和众筹计划区域 */}
      <div className="nine-patch-frame alert relative w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 社区 */}
        <div className="p-6 flex flex-col gap-6 lg:border-r lg:border-secondary/20 lg:border-dashed">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/community.png"
              alt="community"
              width={24}
              height={24}
            />
            <span className="text-white text-xl font-semibold">
              {t("community")}
            </span>
          </div>
          <div className="flex justify-between">
            <Statistics
              title={t("directReferral")}
              info="说明"
              value="5/8"
              size="sm"
            />
            <Statistics
              title={t("communityAddressCount")}
              value="123"
              size="sm"
            />
          </div>
        </div>
        <div className="p-6 flex flex-col gap-6 lg:border-r lg:border-secondary/20 lg:border-dashed">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/rocket.png"
              alt="rocket"
              width={24}
              height={24}
            />
            <span className="text-white text-xl font-semibold">
              {t("crowdfundingProgram")}
            </span>
          </div>
          <div className="flex justify-between">
            <Statistics
              title={t("genesisSize")}
              info="说明"
              value="0.00 USDT"
              size="sm"
            />
            <Statistics
              title={t("currentTotalValue")}
              value="0.00 USDT"
              size="sm"
              info="说明"
            />
          </div>
        </div>
      </div>
      {/* 业绩区域 */}
      <Card className="flex flex-col md:flex-row gap-6">
        <div className="w-full h-full xl:w-2/5 space-y-6">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/rocket.png"
              alt="rocket"
              width={24}
              height={24}
            />
            <span className="text-white text-xl font-semibold">
              {t("performance")}
            </span>
          </div>
          {/* 业绩统计 */}
          <div className="space-y-6">
            <div className="flex">
              <div className="flex items-center gap-2 flex-1">
                <View
                  clipDirection="topLeft-bottomRight"
                  clipSize={4}
                  className="bg-gradient-to-b from-primary to-secondary w-2 h-5/6"
                >
                  <span />
                </View>
                <Statistics
                  title={t("totalPerformance")}
                  value="123,999 OLY"
                  desc="$2,636,541.12"
                  size="sm"
                />
              </div>
              <div className="flex items-center gap-2 flex-1">
                <View
                  clipDirection="topLeft-bottomRight"
                  clipSize={4}
                  className="bg-warning w-2 h-5/6"
                >
                  <span />
                </View>
                <Statistics
                  title={t("smallTeamPerformance")}
                  value="133,456 OLY"
                  desc="$1,636,541.12"
                  size="sm"
                />
              </div>
            </div>
            <Statistics title={t("communityLevel")} value="V6" size="sm" />
          </div>
        </div>
        <div className="w-full h-full xl:w-3/5">
          {/* 时间筛选器 */}
          <div className="flex gap-2 justify-end">
            {timeFilters.map((filter) => (
              <View
                clipDirection="topLeft-bottomRight"
                clipSize={8}
                key={filter.key}
                onClick={() => setSelectedTimeFilter(filter.key)}
                border={true}
                borderWidth={1}
                borderColor={
                  selectedTimeFilter === filter.key ? "#434c8c" : "#333333"
                }
                className={cn(
                  "px-3 py-1 text-xs text-foreground/50  cursor-pointer bg-[#1b1f48]",
                  {
                    "shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] text-foreground":
                      selectedTimeFilter === filter.key,
                  }
                )}
              >
                {filter.label}
              </View>
            ))}
          </div>

          {/* 业绩图表 */}
          <PerformanceChart className="h-[160px]" />
        </div>
      </Card>
      {/* 奖金区域 */}
      <Card className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/icon/medal.png"
            alt="medal"
            width={24}
            height={24}
          />
          <span className="text-white text-xl font-semibold">
            {t("rewards")}
          </span>
        </div>
        {/* 顶部统计 */}
        <div className="grid grid-cols-2 gap-6 w-full xl:w-1/2">
          <Statistics
            title={t("totalRewardsAmount")}
            value="123.45 OLY"
            size="md"
          />
          <Statistics
            title={t("maxRewardsAmount")}
            value="123.45 OLY"
            size="md"
          />
        </div>

        {/* 奖金卡片网格 */}
        <div className="hidden lg:grid grid-cols-4">
          {/* 奖金池 - 占据左侧整个高度 */}
          <div className="row-span-3 nine-patch-frame grid-body relative w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div>{t("rewardPool")}</div>
              <div className="font-mono text-2xl font-bold text-gradient">
                600.00 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
          </div>

          {/* 可领取的奖金数量 */}
          <div className="row-span-3 relative gap-2 bg-[#1E204C] flex flex-col items-start justify-center px-6 py-7">
            <Statistics
              title={t("claimableRewardsAmount")}
              value="133,456 OLY"
              desc="$1,636,541.12"
              size="sm"
            />
            <Button
              variant="primary"
              clipSize={8}
              clipDirection="topLeft-bottomRight"
              className="h-6 px-3"
            >
              {t("claim")}
            </Button>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>

          {/* 释放中的奖金数量 */}
          <div className="col-span-2 relative">
            <div className="px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center w-1/2">
              <div className="text-foreground/50 text-xs">
                {t("rewardsInRelease")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
            <div className="absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50"></div>
          </div>

          {/* 已经释放的奖金数量 */}
          <div className="row-span-2 relative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <Statistics
                title={t("releasedRewardsAmount")}
                value="133,456 OLY"
                desc="$1,636,541.12"
                size="sm"
              />
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>

          {/* 涡轮中的奖金数量 */}

          <div className="relative">
            <div className="px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center">
              <div className="text-foreground/50 text-xs">
                {t("turbineRewardsAmount")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
            <div className="absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50"></div>
          </div>

          {/* 已解锁的奖金数量 */}
          <div className="relative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <div>
                <div className="text-foreground/50 text-xs">
                  {t("turbineRewardsAmount")}
                </div>
                <div className="text-foreground/50 font-mono text-xl">
                  133,456 OLY
                </div>
                <div className="text-foreground/50 text-xs">$1,636,541.12</div>
              </div>
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:hidden gap-4">
          {/* 奖金池 - 占据左侧整个高度 */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div>{t("rewardPool")}</div>
              <div className="font-mono text-2xl font-bold text-gradient">
                600.00 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
          </div>

          {/* 可领取的奖金数量 */}
          <div className="relative gap-2 bg-[#1E204C] flex flex-col items-start justify-center px-6 py-7">
            <Statistics
              title={t("claimableRewardsAmount")}
              value="133,456 OLY"
              desc="$1,636,541.12"
              size="sm"
            />
            <Button
              variant="primary"
              clipSize={8}
              clipDirection="topLeft-bottomRight"
              className="h-6 px-3"
            >
              {t("claim")}
            </Button>
          </div>

          {/* 释放中的奖金数量 */}
          <div className="relative">
            <div className="px-6 py-7 bg-[#1E204C] flex flex-col items-start justify-center w-full">
              <div className="text-foreground/50 text-xs">
                {t("rewardsInRelease")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
          </div>

          {/* 已经释放的奖金数量 */}
          <div className="elative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <Statistics
                title={t("releasedRewardsAmount")}
                value="133,456 OLY"
                desc="$1,636,541.12"
                size="sm"
              />
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
          </div>

          {/* 涡轮中的奖金数量 */}

          <div className="relative">
            <div className="px-6 py-7 bg-[#1E204C] flex flex-col items-start justify-center">
              <div className="text-foreground/50 text-xs">
                {t("turbineRewardsAmount")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
          </div>

          {/* 已解锁的奖金数量 */}
          <div className="relative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <div>
                <div className="text-foreground/50 text-xs">
                  {t("turbineRewardsAmount")}
                </div>
                <div className="text-foreground/50 font-mono text-xl">
                  133,456 OLY
                </div>
                <div className="text-foreground/50 text-xs">$1,636,541.12</div>
              </div>
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

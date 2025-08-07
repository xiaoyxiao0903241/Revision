"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"
import { Alert, Card, InfoPopover, View } from "~/components"
import { TVLChart, SmallChart, TVLStats } from "~/widgets"
export default function AnalyticsPage() {
  const t = useTranslations("analytics")

  return (
    <div className="space-y-6">
      {/* 顶部Alert */}
      <Alert
        icon="blocks"
        iconSize={24}
        title={t("title")}
        description={t("analytics_description")}
      />

      {/* 主要内容区域 */}
      <div className="space-y-6">
        {/* Overview区域 */}
        <Card className="flex flex-col">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/overview.png"
              alt="overview"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-bold text-white">{t("overview")}</h3>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-7/12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-400">
                  {t("total_value_locked")}
                </span>
                <InfoPopover>
                  <p className="text-white font-mono text-sm break-all whitespace-normal">
                    预览图表说明
                  </p>
                </InfoPopover>
              </div>
              <TVLChart height={300} />
            </div>

            <div className="w-full lg:w-5/12">
              {/* 右侧：TVL统计 */}
              <View
                clipDirection="topLeft-bottomRight"
                className="w-full py-5 px-6 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30"
              >
                <TVLStats />
              </View>
            </div>
          </div>
        </Card>

        {/* 底部4个小图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* OLY流通市值 */}
          <Card>
            <div className="flex items-center gap-2 ">
              <h4 className="text-xl font-semibold text-white">
                {t("oly_market_cap")}
              </h4>
              <InfoPopover>
                <p className="text-white font-mono text-sm break-all whitespace-normal">
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart className="h-[272px]" title={t("oly_market_cap")} />
          </Card>

          {/* OLY流通量 */}
          <Card>
            <div className="flex items-center gap-2 ">
              <h4 className="text-xl font-semibold text-white">
                {t("oly_circulation")}
              </h4>
              <InfoPopover>
                <p className="text-white font-mono text-sm break-all whitespace-normal">
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart className="h-[272px]" title={t("oly_circulation")} />
          </Card>

          {/* 国库无风险价值 */}
          <Card>
            <div className="flex items-center gap-2 ">
              <h4 className="text-xl font-semibold text-white">
                {t("treasury_risk_free_value")}
              </h4>
              <InfoPopover>
                <p className="text-white font-mono text-sm break-all whitespace-normal">
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className="h-[272px]"
              title={t("treasury_risk_free_value")}
            />
          </Card>

          {/* 国库??? ① */}
          <Card>
            <div className="flex items-center gap-2 ">
              <h4 className="text-xl font-semibold text-white">
                {t("treasury_unknown")}
              </h4>
              <InfoPopover>
                <p className="text-white font-mono text-sm break-all whitespace-normal">
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart className="h-[272px]" title={t("treasury_unknown")} />
          </Card>
        </div>
      </div>
    </div>
  )
}

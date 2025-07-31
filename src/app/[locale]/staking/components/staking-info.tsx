"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Button } from "~/components/button"
import { Badge } from "~/components/badge"
import { Coins, TrendingUp, ExternalLink } from "lucide-react"

export function StakingInfo() {
  const t = useTranslations("staking")

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <TrendingUp className="h-5 w-5 text-green-400" />
          <span>{t("statistics")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 可质押数量 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{t("availableToStake")}</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium">1,000 OLY</span>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {t("addToMetaMask")}
            </Button>
          </div>
        </div>

        {/* 年化收益率 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{t("apr")}</span>
          <Badge variant="secondary" className="bg-green-900 text-green-400">
            15.5%
          </Badge>
        </div>

        {/* 已质押数量 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{t("stakedAmount")}</span>
          <span className="text-white font-medium">500 OLY</span>
        </div>

        {/* 重基奖励 */}
        <div className="flex items-center justify-between">
          <span className="text-gray-300">{t("rebaseRewards")}</span>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-medium">25.5 OLY</span>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {t("claim")}
            </Button>
          </div>
        </div>

        {/* 在BscScan上查看 */}
        <div className="pt-4 border-t border-gray-800">
          <Button
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            {t("viewOnBscScan")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
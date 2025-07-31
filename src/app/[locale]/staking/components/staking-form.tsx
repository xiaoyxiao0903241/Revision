"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "~/components/button"
import { Input } from "~/components/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/card"
import { Badge } from "~/components/badge"
import { Clock, Coins, TrendingUp } from "lucide-react"

export function StakingForm() {
  const t = useTranslations("staking")
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("")

  const durations = [
    { value: "7", label: "7天", boost: "1.2x" },
    { value: "30", label: "30天", boost: "1.5x" },
    { value: "90", label: "90天", boost: "2.0x" },
    { value: "180", label: "180天", boost: "2.5x" },
    { value: "365", label: "365天", boost: "3.0x" },
  ]

  const handleStake = () => {
    // 处理质押逻辑
    console.log("Staking:", { amount, duration })
  }

  const handleUseMax = () => {
    setAmount("1000") // 示例余额
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Coins className="h-5 w-5 text-purple-400" />
          <span>{t("stake")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 质押期限选择 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            {t("selectDuration")}
          </label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="选择质押期限" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {durations.map((dur) => (
                <SelectItem key={dur.value} value={dur.value}>
                  <div className="flex items-center justify-between w-full">
                    <span className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{dur.label}</span>
                    </span>
                    <Badge variant="secondary" className="ml-2">
                      {dur.boost}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 质押金额 */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            {t("amount")}
          </label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <Button
              variant="outline"
              onClick={handleUseMax}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              {t("useMax")}
            </Button>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{t("balance")}: 1000 OLY</span>
          </div>
        </div>

        {/* 重基信息 */}
        <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <span className="text-sm font-medium text-gray-300">
              {t("rebaseRewardRate")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">{t("rebaseBoost")}:</span>
              <span className="ml-2 text-green-400">1.5x</span>
            </div>
            <div>
              <span className="text-gray-400">
                {t("nextRebaseRewardRate")}:
              </span>
              <span className="ml-2 text-green-400">0.05%</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {t("countdownToNextRebase")}: 2:34:15
          </div>
        </div>

        {/* 质押按钮 */}
        <Button
          onClick={handleStake}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          disabled={!amount || !duration}
        >
          {t("stake")}
        </Button>
      </CardContent>
    </Card>
  )
}

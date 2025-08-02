"use client"

import { useTranslations } from "next-intl"
import {
  Alert,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Statistics,
  View,
} from "~/components"
import { Card } from "~/components/card"

export default function StakingPage() {
  const t = useTranslations("staking")

  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={t("alertTitle")}
        description={t("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t("selectDurationPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {[7, 30, 90, 180, 360].map((it) => (
                <SelectItem key={it} value={it.toString()}>
                  {it} {t("days")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <View
            className="bg-[#22285E] p-4"
            clipDirection="topRight-bottomLeft"
          >
            <Statistics
              title={t("amount")}
              value={"0.0"}
              desc={t("totalStakedDesc")}
            />
          </View>
        </Card>
        <Card></Card>
      </div>
    </div>
  )
}

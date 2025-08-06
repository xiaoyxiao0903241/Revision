import { useTranslations } from "next-intl"
import { FC } from "react"
import { View } from "~/components"
import { cn, formatCurrency } from "~/lib/utils"

export const CoolingPoolStats: FC = () => {
  const t = useTranslations("coolingPool")

  const statsData = [
    {
      title: t("rewardsInPool"),
      value: 4000.0,
      unit: "OLY",
      usdValue: 0.0,
    },
    {
      title: t("releasedRewards"),
      value: 2000.0,
      unit: "OLY",
      usdValue: 0.0,
    },
    {
      title: t("totalClaimedRewards"),
      value: 2000.0,
      unit: "OLY",
      usdValue: 0.0,
    },
  ]

  return (
    <View
      clipDirection="topRight-bottomLeft"
      clipSize={16}
      className="flex items-center justify-between  gap-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30"
    >
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={cn("px-6 py-4 font-mono", index === 2 && "text-right")}
        >
          <div className="text-xs text-foreground/50">{stat.title}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">
              {stat.value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {stat.unit}
            </span>
            <span className={"text-sm text-foreground/50"}>
              {formatCurrency(stat.usdValue)}
            </span>
          </div>
        </div>
      ))}
    </View>
  )
}

import { useTranslations } from "next-intl"
import { FC } from "react"
import { Statistics } from "~/components"

export const PositionDetails: FC<{
  data: {
    myStakedAmount: string
    lifetimeRewards: string
    timeInPool: string
  }
}> = ({ data }) => {
  const t = useTranslations("dashboard")
  return (
    <div className="space-y-3">
      <div className="text-foreground/50 font-medium">
        {t("positionDetails")}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-36 gap-y-6">
        <Statistics
          title={t("myStakedAmount")}
          value={data.myStakedAmount}
          desc="$0.00"
          size="sm"
          info={<span>说明</span>}
        />
        <Statistics
          title={t("lifetimeRewards")}
          value={data.lifetimeRewards}
          desc="$0.00"
          size="sm"
        />
        <Statistics
          title={t("timeInPool")}
          value={data.timeInPool}
          size="sm"
          info={<span>说明</span>}
        />
      </div>
    </div>
  )
}

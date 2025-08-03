import { useCountDown } from "ahooks"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { Button, Countdown, Icon, RoundedLogo, View } from "~/components"
import { formatCurrency } from "~/lib/utils"

const CountdownCard: FC<{
  endAt: Date
}> = ({ endAt }) => {
  const [countDown] = useCountDown({
    targetDate: dayjs(endAt).format("YYYY-MM-DD HH:mm:ss"),
  })
  return countDown ? (
    <View
      clipDirection="topRight-bottomLeft"
      border
      borderColor="rgba(87,106,244,0.2)"
      borderWidth={1}
      className="bg-[#22285E] px-3 py-1 flex flex-row items-center gap-2"
    >
      <Icon name="clock" size={16} />
      <Countdown
        endAt={endAt}
        className="text-base font-chakrapetch tabular-nums"
        daysShown
      />
    </View>
  ) : (
    <Button
      className="h-10"
      clipDirection="topRight-bottomLeft"
      variant="primary"
    >
      Release
    </Button>
  )
}

export const AmountTicker: FC<{
  data: {
    value: number
    desc: number
    endAt: Date
  }
}> = ({ data }) => {
  const t = useTranslations("staking")
  return (
    <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-2">
          <span className="text-foreground/70 text-sm">{t("amount")}</span>
          <div className="flex items-center gap-2">
            <RoundedLogo className="w-6 h-6" />
            <span className="text-foreground text-3xl font-mono">
              {formatCurrency(data.value, false)}
            </span>
          </div>
          <span className="text-foreground/70 text-sm">
            {formatCurrency(data.desc)}
          </span>
        </div>
        <CountdownCard endAt={data.endAt} />
      </div>
    </View>
  )
}

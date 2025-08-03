import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { FC, useMemo } from "react"
import { Button, Countdown, Icon, View } from "~/components"

const CountdownCard: FC<{
  endAt: Date
}> = ({ endAt }) => {
  return (
    <View
      clipDirection="topRight-bottomLeft"
      border
      borderColor="border/20"
      className="bg-[#22285E] px-4"
    >
      <Icon name="clock" />
      <Countdown endAt={endAt} />
    </View>
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
  const available = useMemo(() => {
    return dayjs().isAfter(dayjs(data.endAt))
  }, [data.endAt])
  return (
    <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
      <div className="flex items-center justify-between border-b border-border/20 py-4">
        <div className="flex flex-col gap-2">
          <span className="text-foreground/70 text-sm">{t("amount")}</span>
          <div className="flex items-center gap-2">
            <span className="text-white text-sm">
              {Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              })
                .format(data.value)
                .replace("$", "")}
            </span>
          </div>
          <span className="text-white text-sm">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(data.desc)}
          </span>
        </div>
      </div>
      {available ? (
        <Button clipDirection="topRight-bottomLeft" variant="primary">
          Release
        </Button>
      ) : (
        <CountdownCard endAt={data.endAt} />
      )}
    </View>
  )
}

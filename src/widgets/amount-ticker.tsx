import { useTranslations } from "next-intl"
import { FC } from "react"
import { Button, Countdown, Icon, Input, RoundedLogo, View } from "~/components"
import { formatCurrency } from "~/lib/utils"

const CountdownCard: FC<{
  endAt: Date
}> = ({ endAt }) => {
  return (
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
  )
}

export const AmountTicker: FC<{
  data: {
    title: string
    value?: string
    desc: number
    endAt?: Date
  }
  disabled?: boolean
  onChange?: (value: string) => void
}> = ({ data, disabled, onChange }) => {
  const t = useTranslations("noLockedStaking")
  return (
    <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
      <div className="flex items-center justify-between py-4">
        <div className="flex flex-col gap-2">
          <span className="text-foreground/70 text-sm">{data.title}</span>
          <div className="flex items-center gap-2">
            <RoundedLogo className="w-6 h-6" />
            <Input.Number
              value={data.value}
              placeholder="0.0"
              className="text-3xl font-mono"
              disabled={disabled}
              onChange={onChange}
            />
          </div>
          <span className="text-foreground/70 text-sm">
            {formatCurrency(data.desc)}
          </span>
        </div>
        {data.endAt ? (
          <CountdownCard endAt={data.endAt} />
        ) : (
          <Button
            className="h-10"
            disabled={disabled}
            clipDirection="topRight-bottomLeft"
            variant="primary"
          >
            {t("release")}
          </Button>
        )}
      </div>
    </View>
  )
}

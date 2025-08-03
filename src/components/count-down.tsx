import { useCountDown } from "ahooks"
import dayjs from "dayjs"
import { FC } from "react"
import { cn } from "~/lib/utils"

const formatTimeUnit = (value: number) => value.toString().padStart(2, "0")

export const Countdown: FC<{
  endAt: Date
  className?: string
  daysShown?: boolean
}> = ({ endAt, className, daysShown = false }) => {
  const [, formattedRes] = useCountDown({
    targetDate: dayjs(endAt).format("YYYY-MM-DD HH:mm:ss"),
  })
  const { days, hours, minutes, seconds } = formattedRes

  return (
    <span
      className={cn(
        "text-foreground text-sm font-mono tabular-nums",
        className
      )}
    >
      {`${daysShown ? `${formatTimeUnit(days)}d ` : ""}${formatTimeUnit(
        hours
      )}h ${formatTimeUnit(minutes)}m ${formatTimeUnit(seconds)}s`}
    </span>
  )
}

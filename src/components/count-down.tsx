import { useCountDown } from "ahooks"
import dayjs from "dayjs"
import { FC } from "react"
import { cn } from "~/lib/utils"

export const Countdown: FC<{
  endAt: Date
  className?: string
}> = ({ endAt, className }) => {
  const [, formattedRes] = useCountDown({
    targetDate: dayjs(endAt).format("YYYY-MM-DD HH:mm:ss"),
  })
  const { hours, minutes, seconds } = formattedRes
  return (
    <span className={cn("text-foreground text-sm font-mono", className)}>
      {`${hours}h ${minutes}m ${seconds}s`}
    </span>
  )
}

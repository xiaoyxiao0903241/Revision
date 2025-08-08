import { useTranslations } from "next-intl"
import { FC } from "react"
import { Button, View } from "~/components"
import { cn, formatDecimal } from "~/lib/utils"

interface CoolingPoolCardProps {
  data: {
    released: number
    waiting: number
    waitingPercent: number
    period: number
    className: string
    bgClassName: string
    disabled?: boolean
    active?: boolean
  }
  children: React.ReactNode
  onClick?: () => void
}

export const CoolingPoolCard: FC<CoolingPoolCardProps> = ({
  data,
  onClick,
  children,
}) => {
  const t = useTranslations("coolingPool")
  const tStaking = useTranslations("staking")
  return (
    <View
      className="bg-[#22285E] px-4 py-6"
      clipDirection="topLeft-bottomRight"
      clipSize={16}
    >
      <div className={cn("flex flex-col items-center", data.className)}>
        {/* 动画齿轮图标 */}
        <div
          className={cn(
            "w-2/3 aspect-square flex items-center justify-center",
            { "animate-spin [animation-duration:5s]": data.active }
          )}
        >
          {children}
        </div>

        {/* 已释放数量 */}
        <div
          className={cn("text-2xl font-bold font-mono", data.className, {
            "text-gradient": data.active,
          })}
        >
          {formatDecimal(data.released, 2)}
        </div>
        <div className="text-xs text-foreground/50">{t("released")}</div>

        {/* 等待释放数量 */}
        <div className="flex w-full items-center justify-between my-2">
          <div className="text-xs text-foreground/50">
            {t("waitingToBeReleased")}
          </div>
          <div className="text-xs font-mono text-white">
            {formatDecimal(data.waiting, 2)} ({data.waitingPercent.toFixed(2)}%)
          </div>
        </div>
        {/* 进度条 */}
        <div className="bg-foreground/20 w-full h-2 rounded-full overflow-hidden">
          <div
            className={cn("h-full relative overflow-hidden", data.bgClassName)}
            style={{
              width: `${data.waitingPercent}%`,
            }}
          >
            {/* 斜纹效果 */}
            <div
              className={cn(
                "absolute inset-0",
                data.active && "animate-stripes"
              )}
              style={{
                width: "calc(100% + 8px)",
                backgroundImage: `
                   repeating-linear-gradient(
                     45deg,
                     rgba(255, 255, 255, 0.1) 0px,
                     rgba(255, 255, 255, 0.1) 1px,
                     transparent 1px,
                     transparent 2px
                   )
                 `,
              }}
            />
          </div>
        </div>
        {/* 周期 */}
        <div className="flex w-full items-center justify-between my-4">
          <div className="text-xs text-foreground/50">{t("period")}</div>
          <div className="text-xs font-mono text-white">
            {data.period}
            {tStaking("days")}
          </div>
        </div>

        {/* 领取按钮 */}
        <Button
          className="w-full"
          disabled={data.disabled}
          onClick={onClick}
          clipDirection="topLeft-bottomRight"
        >
          {t("claim")}
        </Button>
      </div>
    </View>
  )
}

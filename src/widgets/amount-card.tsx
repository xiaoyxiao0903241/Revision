import { useTranslations } from "next-intl"
import { FC } from "react"
import { Input, RoundedLogo, View } from "~/components"
import { formatCurrency } from "~/lib/utils"

export const AmountCard: FC<{
  data: {
    value: number|string
    desc: number|string
    balance: number
  }
  description: string
  onChange?: (value: string) => void
}> = ({ data, description, onChange }) => {
  const t = useTranslations("staking")
  return (
    <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
      <div className="flex items-center justify-between border-b border-border/20 py-4">
        <div>
          <label className="text-sm font-medium text-white">
            {t("amount")}
          </label>
          <div className="flex gap-2">
            <Input.Number
              value={data.value}
              onChange={onChange}
              placeholder="0.0"
              step={0.000001}
              maxDecimals={2}
              className="flex-1 text-white text-3xl font-bold font-mono"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <RoundedLogo />
          <span className="text-white font-mono">OLY</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-foreground/70 py-4">
        <span className="font-mono">{formatCurrency(Number(data.desc))}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono">{description}</span>
          <span className="font-mono text-white">
            {`${formatCurrency(data.balance, false)} OLY`}
          </span>
          <span className="font-mono gradient-text cursor-pointer" onClick={()=>{onChange?.(data.balance+'')}}>{t("useMax")}</span>
        </div>
      </div>
    </View>
  )
}

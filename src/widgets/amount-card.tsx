import { useTranslations } from "next-intl"
import { FC } from "react"
import { RoundedLogo, Statistics, View } from "~/components"
import { formatCurrency } from "~/lib/utils"

export const AmountCard: FC<{
  data: {
    value: number
    desc: number
    balance: number
  }
}> = ({ data }) => {
  const t = useTranslations("staking")
  return (
    <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
      <div className="flex items-center justify-between border-b border-border/20 py-4">
        <Statistics
          title={t("amount")}
          value={formatCurrency(data.value, false)}
        />
        <div className="flex items-center gap-1">
          <RoundedLogo />
          <span className="text-white font-mono">OLY</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-foreground/70 py-4">
        <span className="font-mono">{formatCurrency(data.desc)}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono">{t("balance")}</span>
          <span className="font-mono text-white">
            {`${formatCurrency(data.balance, false)} OLY`}
          </span>
          <span className="font-mono gradient-text">{t("useMax")}</span>
        </div>
      </div>
    </View>
  )
}

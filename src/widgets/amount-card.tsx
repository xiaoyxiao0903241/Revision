import { useTranslations } from "next-intl"
import { FC } from "react"
import { RoundedLogo, Statistics, View } from "~/components"

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
          value={Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          })
            .format(data.value)
            .replace("$", "")}
        />
        <div className="flex items-center gap-1">
          <RoundedLogo />
          <span className="text-white font-mono">OLY</span>
        </div>
      </div>
      <div className="flex items-center justify-between text-xs text-foreground/70 py-4">
        <span className="font-mono">
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.desc)}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono">{t("balance")}</span>
          <span className="font-mono text-white">
            {`${Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            })
              .format(data.balance)
              .replace("$", "")} OLY`}
          </span>
          <span className="font-mono gradient-text">{t("useMax")}</span>
        </div>
      </div>
    </View>
  )
}

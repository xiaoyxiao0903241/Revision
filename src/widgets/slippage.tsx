import { useTranslations } from "next-intl"
import { FC } from "react"
import { RadioGroup, View } from "~/components"

export const Slippage: FC<{
  options: {
    value: string
    label: string
  }[]
  value?: string
  onChange: (value: string) => void
}> = ({ options, value, onChange }) => {
  const t = useTranslations("swap")
  return (
    <View className="bg-[#22285E] font-mono flex justify-between items-center p-4">
      <h3 className="text-sm font-semibold">{t("allowableSlippage")}</h3>
      <div className="flex space-x-2">
        <RadioGroup value={value} onChange={onChange} options={options} />
      </div>
    </View>
  )
}

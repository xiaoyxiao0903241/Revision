import { useTranslations } from "next-intl"
import { FC } from "react"
import {
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components"
import { formatCurrency } from "~/lib/utils"

export const DurationSelect: FC<{
  options: number[]
  value?: number
  onChange: (value: number) => void
  placeholder?: string
}> = ({ options, value, onChange, placeholder }) => {
  const t = useTranslations("staking")
  const selectedOption = options.find((it) => it === value)
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={placeholder || t("selectDurationPlaceholder")}
        >
          {selectedOption
            ? `${selectedOption} ${t("days")}`
            : placeholder || t("selectDurationPlaceholder")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((it) => (
          <SelectItem key={it} value={it.toString()}>
            {it} {t("days")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const AmountSelect: FC<{
  options: { value: number; desc: string }[]
  value: number | undefined
  onChange: (value: number | undefined) => void
  placeholder?: string
}> = ({ options, value, onChange, placeholder }) => {
  const t = useTranslations("staking")
  const selectedOption = options.find((it) => it.value === value)
  return (
    <Select
      value={value?.toString()}
      onValueChange={(value) => onChange(Number(value))}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder || t("selectStakingAmount")}>
          {selectedOption && (
            <div className="flex flex-row gap-2 w-full">
              <RoundedLogo className="w-5 h-5" />
              <span className="flex-1 font-semibold text-sm">
                {formatCurrency(selectedOption.value)}
              </span>
              <span>{selectedOption.desc}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value.toString()}>
            <div className="flex flex-row gap-2 w-full">
              <RoundedLogo className="w-5 h-5" />
              <span className="flex-1 font-semibold text-sm">
                {formatCurrency(item.value, false)}
              </span>
              <span>{item.desc}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

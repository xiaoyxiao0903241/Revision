import { useTranslations } from "next-intl"
import { FC } from "react"
import { RadioGroup } from "~/components"
import Refresh from "~/assets/refresh.svg"
import { useMock } from "~/hooks/useMock"
import { useMockStore } from "~/store/mock"
import { cn } from "~/lib/utils"

const toggle = async () => {
  useMockStore.setState({
    walletConnected: true,
  })
  await new Promise((resolve) => setTimeout(resolve, 1000))
  useMockStore.setState({
    walletConnected: false,
  })
}

export const BalanceCard: FC<{
  balance: number
  value?: string
  symbol: string
  onChange?: (value: string) => void
}> = ({ balance, value, onChange, symbol }) => {
  const t = useTranslations("swap")
  const { walletConnected: isLoading } = useMock()
  return (
    <div className="flex items-center justify-between p-4">
      <div className="text-sm text-gray-400 flex items-center gap-2">
        <span>{t("myWallet")}</span>{" "}
        <span className="text-foreground">
          {balance} {symbol}
        </span>
        <div className="cursor-pointer" onClick={toggle}>
          <Refresh className={cn("w-3 h-3", { "animate-spin": isLoading })} />
        </div>
      </div>
      {onChange && (
        <div className="flex space-x-2">
          <RadioGroup
            options={[10, 25, 50, 100].map((item) => ({
              label: `${item}%`,
              value: `${item}`,
            }))}
            value={`${(Number(value) / balance) * 100}`}
            onChange={(value) => onChange(`${(Number(value) / 100) * balance}`)}
          />
        </div>
      )}
    </div>
  )
}

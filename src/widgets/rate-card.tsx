import { useTranslations } from "next-intl"
import { Icon, InfoPopover } from "~/components"
import { cn } from "~/lib/utils"
import { useMockStore } from "~/store/mock"

export const RateCard = () => {
  const t = useTranslations("swap")
  const { walletConnected: isLoading } = useMockStore()
  const toggle = async () => {
    useMockStore.setState({
      walletConnected: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    useMockStore.setState({
      walletConnected: false,
    })
  }
  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">1 USDT= 0.025548 OLY</span>
        <div className="flex gap-6 items-center">
          <InfoPopover triggerClassName="w-4 h-4 text-warning">
            <div className="w-40">1 USDT= 0.025548 OLY</div>
          </InfoPopover>
          <div
            className={cn("cursor-pointer", { "animate-spin": isLoading })}
            onClick={toggle}
          >
            <Icon name="refresh" className={"w-5 h-5 pointer-events-none"} />
          </div>
          <div>
            <Icon name="setting" className="w-5 h-5 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  )
}

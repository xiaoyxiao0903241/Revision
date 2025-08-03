import { useTranslations } from "next-intl"
import { Button, Card, CardHeader, List, Statistics } from "~/components"
import Logo from "~/assets/logo.svg"
import { FC } from "react"
import { formatCurrency } from "~/lib/utils"
import { infoItems } from "~/hooks/useMock"
export const WalletSummary: FC<{
  data: {
    availableToStake: number
    stakedAmount: number
    stakedAmountDesc: number
    apr: number
    rebaseRewards: number
    rebaseRewardsDesc: number
    totalStaked: number
    stakers: number
    olyMarketCap: number
  }
}> = ({ data }) => {
  const t = useTranslations("staking")
  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2 flex-1">
            <Statistics
              title={t("availableToStake")}
              value={`${formatCurrency(data.availableToStake, false)} OLY`}
            />
            <div className="h-px bg-border/20 w-full"></div>
            <Statistics
              title={t("stakedAmount")}
              value={`${formatCurrency(data.stakedAmount, false)} OLY`}
              desc={formatCurrency(data.stakedAmountDesc)}
              info={
                <div className="flex flex-col space-y-2">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-foreground/50">{item.label}</span>
                      <span className="text-secondary">{item.value}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
          <div className="flex flex-col gap-2">
            <Statistics title={t("apr")} value={`${data.apr.toFixed(2)}%`} />
            <div className="h-px bg-border/20 w-full"></div>
            <Statistics
              title={t("rebaseRewards")}
              value={`${formatCurrency(data.rebaseRewards, false)} OLY`}
              desc={formatCurrency(data.rebaseRewardsDesc)}
              info={
                <div className="flex flex-col space-y-2">
                  {infoItems.map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-foreground/50">{item.label}</span>
                      <span className="text-secondary">{item.value}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        <Button
          variant="accent"
          size="sm"
          clipSize={8}
          className="gap-2"
          clipDirection="topLeft-bottomRight"
        >
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <Logo className="w-4" />
          </div>
          <span className="text-black">{t("addToMetaMask")}</span>
        </Button>
      </CardHeader>
      <List className="py-4">
        <List.Item className="font-semibold">
          <List.Label className="font-chakrapetch text-white text-base">
            {t("statistics")}
          </List.Label>
          <List.Label className="gradient-text text-base">
            {t("viewOnBscScan")}
          </List.Label>
        </List.Item>
        <List.Item>
          <List.Label>{t("annualPercentageRate")}</List.Label>
          <List.Value className="text-success">{data.apr}%</List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t("totalStaked")}</List.Label>
          <List.Value className="text-secondary">
            {`${formatCurrency(data.totalStaked, false)} OLY`}
          </List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t("stakers")}</List.Label>
          <List.Value>{data.stakers}</List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t("olyMarketCap")}</List.Label>
          <List.Value>{formatCurrency(data.olyMarketCap)}</List.Value>
        </List.Item>
      </List>
    </Card>
  )
}

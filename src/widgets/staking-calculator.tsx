import { useTranslations } from "next-intl"
import { FC, useState } from "react"
import { Button, Card, Input, List, Slider, View } from "~/components"
import { formatCurrency, formatDecimal } from "~/lib/utils"

export const StakingCalculator: FC<{
  rateEnabled?: boolean
}> = ({ rateEnabled = false }) => {
  const t = useTranslations("staking")
  // 计算器状态
  const [amount, setAmount] = useState("1000")
  const [stakingDuration, setStakingDuration] = useState(0.06)
  const [rebaseApy, setRebaseApy] = useState(0.7)
  const [olyPrice, setOlyPrice] = useState(60)

  // 计算模拟收益
  const calculateRewards = () => {
    const durationInMonths = stakingDuration
    const monthlyApy = rebaseApy / 100
    const totalApy = monthlyApy * 12
    const reward = Number(amount) * (totalApy / 100) * (durationInMonths / 12)
    const roi = (reward / Number(amount)) * 100
    const apr = totalApy * 100

    return {
      duration: `${durationInMonths} ${t("months")}`,
      rebaseApy: `${formatDecimal(rebaseApy)}%`,
      rebaseBoost: `${formatDecimal(rebaseApy)}%`,
      yourStake: formatCurrency(Number(amount)),
      yourReward: formatCurrency(reward),
      roi: `${formatDecimal(roi)}%`,
      apr: `${formatDecimal(apr)}%`,
    }
  }

  const results = calculateRewards()
  return (
    <Card className="p-6">
      {/* 金额输入 */}
      <View className="space-y-2 bg-secondary/20 p-4">
        <label className="text-sm font-medium text-white">{t("amount")}</label>
        <div className="flex gap-2">
          <Input.Number
            value={amount}
            onChange={(value) => setAmount(value)}
            placeholder="0.0"
            step={0.000001}
            className="flex-1 text-white text-3xl font-bold font-mono"
          />
          <Button clipDirection="topRight-bottomLeft" className="font-mono">
            {t("calculate")}
          </Button>
        </div>
        <p className="text-sm text-foreground/50 text-right">
          {t("latestOlyPrice", { amount: formatDecimal(olyPrice) })}
        </p>
      </View>
      <View className="flex flex-col space-y-9 bg-secondary/20 p-4">
        {/* 质押期限滑块 */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-white">
              {t("stakingDuration")}
            </label>
            {rateEnabled && (
              <div className="flex items-center gap-2">
                <Button
                  variant="link"
                  size="sm"
                  onClick={() =>
                    setStakingDuration(Math.max(0.01, stakingDuration - 0.01))
                  }
                  className="w-8 h-8 p-0"
                >
                  -
                </Button>
                <span className="text-sm border-2 border-[#576AF4]/50 px-2 text-white min-w-[40px] text-center shadow-[inset_0_0_10px_rgba(87,106,244,0.4)]">
                  x{stakingDuration.toFixed(2)}
                </span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setStakingDuration(stakingDuration + 0.01)}
                  className="w-8 h-8 p-0"
                >
                  +
                </Button>
              </div>
            )}
          </div>
          <Slider
            value={[stakingDuration]}
            onValueChange={(value) => setStakingDuration(value[0])}
            max={12}
            step={1}
            indicators={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => ({
              value: item,
              label: `${item}`,
            }))}
          />
        </div>

        {/* 重基APY滑块 */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            {t("rebaseApy", { value: rebaseApy })}
            <span className="text-xs text-foreground/50 mx-1">
              {t("current")}
            </span>
          </label>
          <Slider
            value={[rebaseApy]}
            onValueChange={(value) => setRebaseApy(value[0])}
            min={0.3}
            max={1.0}
            step={0.1}
            indicators={[0.3, 0.5, 0.7, 0.9, 1.0].map((item) => ({
              value: item,
              label: `${item}%`,
            }))}
          />
        </div>

        {/* OLY价格滑块 */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-white">
            {t("olyPrice", { value: olyPrice })}
            <span className="text-xs text-foreground/50 mx-1">
              {t("current")}
            </span>
          </label>
          <Slider
            value={[olyPrice]}
            onValueChange={(value) => setOlyPrice(value[0])}
            max={100}
            step={10}
            indicators={[1, 30, 60, 90, 100].map((item) => ({
              value: item,
              label: `$${formatDecimal(item, 0)}`,
            }))}
          />
        </div>

        {/* 计算结果 */}
        <div className="space-y-3 pt-6">
          <List>
            <List.Item>
              <List.Label>{t("duration")}</List.Label>
              <List.Value>{results.duration}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("rebaseApyLabel")}</List.Label>
              <List.Value className="text-success">
                {results.rebaseApy}
              </List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("rebaseBoost")}</List.Label>
              <List.Value className="text-success">
                {results.rebaseBoost}
              </List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("yourStake")}</List.Label>
              <List.Value>{results.yourStake}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("yourReward")}</List.Label>
              <List.Value>{results.yourReward}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("roi")}</List.Label>
              <List.Value>{results.roi}</List.Value>
            </List.Item>
            <List.Item>
              <List.Label>{t("apr")}</List.Label>
              <List.Value>{results.apr}</List.Value>
            </List.Item>
          </List>
        </div>
      </View>
    </Card>
  )
}

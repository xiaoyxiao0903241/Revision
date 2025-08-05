"use client"

import { useTranslations } from "next-intl"
import { Alert, Button, Card, CardAction, CardContent } from "~/components"
import { useMock } from "~/hooks/useMock"
import { cn, formatDecimal } from "~/lib/utils"
import { useMockStore } from "~/store/mock"
import {
  AmountCard,
  ClaimTicker,
  TurbineRecords,
  TurbineSummary,
} from "~/widgets"
import { RateCard } from "~/widgets/rate-card"
import { Slippage } from "~/widgets/slippage"
import Refresh from "~/assets/refresh.svg"
import { TurbineCard } from "~/widgets/turbine-card"
export default function TurbinePage() {
  const t = useTranslations("turbine")
  const { decimal, setDecimal, walletConnected: isLoading } = useMock()

  // 模拟数据
  const countdown = "38m 50s"

  const onToggle = async () => {
    useMockStore.setState({
      walletConnected: true,
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))
    useMockStore.setState({
      walletConnected: false,
    })
  }
  return (
    <div className="space-y-6">
      {/* 页面标题和描述 */}
      <Alert
        icon="turbine"
        title={t("title")}
        description={t("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧界面 */}
        <div>
          <Card className="p-6 flex flex-col gap-3 pt-10">
            {/* 钱包余额 */}
            <div className="text-sm text-foreground/50 flex items-center gap-1">
              <span>{t("myWallet")}</span>
              <span className="text-white">{formatDecimal(1233, 2)} USDT</span>
              <span className="cursor-pointer" onClick={onToggle}>
                <Refresh
                  className={cn("w-3 h-3", isLoading && "animate-spin")}
                />
              </span>
            </div>

            {/* 金额输入 */}
            <AmountCard
              data={{
                value: decimal,
                desc: 456,
                balance: 789,
              }}
              description={t("unlockableAmount")}
              onChange={setDecimal}
            />
            <RateCard
              description="1 USDT= 0.025548 OLY"
              isLoading={isLoading}
              onRefresh={onToggle}
            />
            <Slippage
              options={[
                { value: "0.1", label: "0.1%" },
                { value: "0.5", label: "0.5%" },
                { value: "1", label: "1%" },
              ]}
              value={decimal}
              onChange={setDecimal}
            />
            {/* 按钮组 */}
            <div className="flex gap-10 py-4">
              <Button
                disabled
                clipDirection="topRight-bottomLeft"
                className="flex-1"
              >
                {t("approve")}
              </Button>
              <Button clipDirection="topRight-bottomLeft" className="flex-1">
                {t("swap")}
              </Button>
            </div>

            {/* 涡轮信息 */}
            <TurbineSummary
              data={{
                amountToSend: (
                  <span className="uppercase">
                    {`${formatDecimal(Number(decimal))}  ${"USDT"}`}
                    <span className="text-foreground/50 pl-2">
                      ($106,793.93)
                    </span>
                  </span>
                ),
                minToReceive: (
                  <span className="uppercase">
                    {`${formatDecimal(Number(decimal))}  ${"OLY"}`}
                    <span className="text-foreground/50 pl-2">
                      ($106,793.93)
                    </span>
                  </span>
                ),
                yakSwapFee: "0 USDT",
                contractSpender: "0x9F97...7234",
                recipient: "0x9F97...72b3",
                tokenIn: "OLY Token",
                tokenOut: "BSC USDT",
              }}
            />
          </Card>
        </div>

        {/* 右侧：锁定金额和接收信息 */}
        <div>
          <Card
            className="flex flex-col gap-4 pb-6 pt-10 px-[2px]"
            containerClassName="flat-body"
          >
            <ClaimTicker
              lockedAmount={0.0}
              endAt={new Date(Date.now() + 20 * 1000)}
              usdValue={1000.0}
              onClaim={() => {}}
            />
            <div className="border-t mx-4 border-foreground/20"></div>
            <ClaimTicker
              lockedAmount={0.0}
              endAt={new Date(Date.now() + 20 * 1000)}
              usdValue={1000.0}
              onClaim={() => {}}
            />
            <div className="h-2 bg-[#131420] w-full"></div>
            <TurbineCard
              lockedAmount={0.0}
              title={t("lockedAmount")}
              usdValue={1000.0}
              onClick={() => {}}
            />
            <div className="border-t mx-4 border-foreground/20"></div>
            <TurbineCard
              lockedAmount={0.0}
              title={t("lockedAmount")}
              usdValue={1000.0}
            />
          </Card>
          {/* 锁定金额卡片 */}
          {/* <TurbineInfoCard
            title={t("lockedAmount")}
            amount={0.0}
            usdValue={0.0}
            buttonText={t("claim")}
            buttonVariant="primary"
            countdown={countdown}
          /> */}

          {/* 第二个锁定金额卡片 */}
          {/* <TurbineInfoCard
            title={t("lockedAmount")}
            amount={0.0}
            usdValue={0.0}
            buttonText={t("claim")}
            buttonVariant="primary"
            countdown={countdown}
          /> */}

          {/* 涡轮接收数量 */}
          {/* <TurbineInfoCard
            title={t("turbineReceivedAmount")}
            amount={0.0}
            usdValue={0.0}
            showMetaMaskButton={true}
          /> */}

          {/* 从涡轮领取的数量 */}
          {/* <TurbineInfoCard
            title={t("amountClaimedFromTurbine")}
            amount={0.0}
            usdValue={0.0}
          /> */}
        </div>
      </div>

      {/* 底部：交易历史 */}
      <div>
        <TurbineRecords />
      </div>
    </div>
  )
}

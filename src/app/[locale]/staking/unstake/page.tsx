"use client"

import { useTranslations } from "next-intl"
import {
  Alert,
  Button,
  List,
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Statistics,
  View,
  Card,
  CardHeader,
} from "~/components"
import Logo from "~/assets/logo.svg"

export default function UnstakePage() {
  const t = useTranslations("staking")

  return (
    <div className="space-y-6">
      <Alert
        icon="unstake"
        title={t("unstakeTitle")}
        description={t("unstakeDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t("selectStakingAmount")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部质押数量</SelectItem>
                <SelectItem value="partial">部分质押数量</SelectItem>
              </SelectContent>
            </Select>
            <View
              className="bg-[#22285E] px-4"
              clipDirection="topRight-bottomLeft"
            >
              <div className="flex items-center justify-between border-b border-border/20 py-4">
                <Statistics title={t("amount")} value={"0.0"} />
                <div className="flex items-center gap-1">
                  <RoundedLogo />
                  <span className="text-white font-mono">ONE</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/70 py-4">
                <span className="font-mono">$0.00</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">06d 17h 59m 52s</span>
                </div>
              </div>
            </View>

            {/* 信息提示 */}
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">{t("unstakeInfo")}</p>
            </div>

            <Button
              variant="secondary"
              clipDirection="topRight-bottomLeft"
              className="w-full font-mono mt-4"
              clipSize={12}
            >
              {t("unstakeButton")}
            </Button>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="space-y-3">
              {/* 可用质押数量和已质押数量 */}
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 flex-1">
                  <Statistics title={t("availableToStake")} value="0.00" />
                  <div className="h-px bg-border/20 w-full"></div>
                  <Statistics
                    title={t("stakedAmount")}
                    value="0.00 OLY"
                    desc="0.00"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Statistics title={t("apr")} value="3139.23%" />
                  <div className="h-px bg-border/20 w-full"></div>
                  <Statistics
                    title={t("rebaseRewards")}
                    value="0.00 OLY"
                    desc="0.00"
                  />
                </div>
              </div>

              <Button
                variant="accent"
                size="sm"
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
                <List.Value className="text-success">3139.23%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("totalStaked")}</List.Label>
                <List.Value className="text-secondary">
                  3,069,552.45 OLY
                </List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("stakers")}</List.Label>
                <List.Value>356</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("olyMarketCap")}</List.Label>
                <List.Value>$1,263,715</List.Value>
              </List.Item>
            </List>
          </Card>
        </div>
      </div>
    </div>
  )
}

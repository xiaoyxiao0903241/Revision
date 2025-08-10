"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { Alert, Button, Card, Statistics } from "~/components";
import Stake from "./components/stake";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { useSafeState } from "ahooks";
import { useQuery } from "@tanstack/react-query";
import { myMess } from "~/services/auth/dashboard";
import Market from "./components/market";

export type myMessDataType = {
  bondRewardAmount: string;
  claimableBonus: string;
  communityLevel: string;
  market: string;
  marketList: unknown;
  referralCount: number;
  salesAmount: string;
  smallMarket: string;
  stakedRewardAmount: string;
  teamCount: string;
  totalBonus: string;
  validReferralCount: number;
};

const defaultMyMessData: myMessDataType = {
  bondRewardAmount: "0",
  claimableBonus: "0",
  communityLevel: "0",
  market: "0",
  marketList: "0",
  referralCount: 0,
  salesAmount: "0",
  smallMarket: "0",
  stakedRewardAmount: "0",
  teamCount: "0",
  totalBonus: "0",
  validReferralCount: 0,
};
export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [myMessInfo, setMyMessInfo] = useSafeState();
  const { userAddress } = useUserAddress();

  const { data: myMessData } = useQuery({
    queryKey: ["myMess", userAddress],
    queryFn: () => myMess("", "", userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
    refetchInterval: 20000,
  });
  console.log(myMessData, "mymyMessData");

  useEffect(() => {
    setMyMessInfo(myMessData);
  }, [myMessData]);

  return (
    <div className="space-y-6">
      {/* 页面标题和描述 */}
      <Alert
        icon="dashboard"
        title={t("title")}
        description={t("description")}
      />
      {/* 质押和债券仓位区域 */}
      <Stake myMessInfo={myMessInfo || defaultMyMessData} />

      {/* 社区和众筹计划区域 */}
      <div className="nine-patch-frame alert relative w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 社区 */}
        <div className="p-6 flex flex-col gap-6 lg:border-r lg:border-secondary/20 lg:border-dashed">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/community.png"
              alt="community"
              width={24}
              height={24}
            />
            <span className="text-white text-xl font-semibold">
              {t("community")}
            </span>
          </div>
          <div className="flex justify-between">
            <Statistics
              title={t("directReferral")}
              info="说明"
              value={`${myMessInfo?.referralCount || 0}/10`}
              size="sm"
            />
            <Statistics
              title={t("communityAddressCount")}
              value={myMessInfo?.teamCount || 0}
              size="sm"
            />
          </div>
        </div>
        <div className="p-6 flex flex-col gap-6 lg:border-r lg:border-secondary/20 lg:border-dashed">
          <div className="flex items-center gap-2">
            <Image
              src="/images/icon/rocket.png"
              alt="rocket"
              width={24}
              height={24}
            />
            <span className="text-white text-xl font-semibold">
              {t("crowdfundingProgram")}
            </span>
          </div>
          <div className="flex justify-between">
            <Statistics
              title={t("genesisSize")}
              info="说明"
              value="0.00 USDT"
              size="sm"
            />
            <Statistics
              title={t("currentTotalValue")}
              value="0.00 USDT"
              size="sm"
              info="说明"
            />
          </div>
        </div>
      </div>
      {/* 业绩区域 */}
      <Market myMessInfo={myMessInfo} />

      {/* 奖金区域 */}
      <Card className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Image
            src="/images/icon/medal.png"
            alt="medal"
            width={24}
            height={24}
          />
          <span className="text-white text-xl font-semibold">
            {t("rewards")}
          </span>
        </div>
        {/* 顶部统计 */}
        <div className="grid grid-cols-2 gap-6 w-full xl:w-1/2">
          <Statistics
            title={t("totalRewardsAmount")}
            value="123.45 OLY"
            size="md"
          />
          <Statistics
            title={t("maxRewardsAmount")}
            value="123.45 OLY"
            size="md"
          />
        </div>

        {/* 奖金卡片网格 */}
        <div className="grid grid-cols-1 lg:grid-cols-4">
          {/* 奖金池 - 占据左侧整个高度 */}
          <div className="lg:row-span-3 nine-patch-frame grid-body relative w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center">
              <div>{t("rewardPool")}</div>
              <div className="font-mono text-2xl font-bold text-gradient">
                600.00 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
          </div>

          {/* 可领取的奖金数量 */}
          <div className="lg:row-span-3 relative gap-2 bg-[#1E204C] flex flex-col items-start justify-center px-6">
            <Statistics
              title={t("claimableRewardsAmount")}
              value="133,456 OLY"
              desc="$1,636,541.12"
              size="sm"
            />
            <Button
              variant="primary"
              clipSize={8}
              clipDirection="topLeft-bottomRight"
              className="h-6 px-3"
            >
              {t("claim")}
            </Button>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>

          {/* 释放中的奖金数量 */}
          <div className="col-span-2 relative">
            <div className="px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center w-1/2">
              <div className="text-foreground/50 text-xs">
                {t("rewardsInRelease")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
            <div className="absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50"></div>
          </div>

          {/* 已经释放的奖金数量 */}
          <div className="lg:row-span-2 relative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <Statistics
                title={t("releasedRewardsAmount")}
                value="133,456 OLY"
                desc="$1,636,541.12"
                size="sm"
              />
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>

          {/* 涡轮中的奖金数量 */}

          <div className="relative">
            <div className="px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center">
              <div className="text-foreground/50 text-xs">
                {t("turbineRewardsAmount")}
              </div>
              <div className="text-foreground/50 font-mono text-xl">
                133,456 OLY
              </div>
              <div className="text-foreground/50 text-xs">$1,636,541.12</div>
            </div>
            <div className="absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50"></div>
          </div>

          {/* 已解锁的奖金数量 */}
          <div className="relative">
            <div className="px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between">
              <div>
                <div className="text-foreground/50 text-xs">
                  {t("turbineRewardsAmount")}
                </div>
                <div className="text-foreground/50 font-mono text-xl">
                  133,456 OLY
                </div>
                <div className="text-foreground/50 text-xs">$1,636,541.12</div>
              </div>
              <Button
                variant="primary"
                size="sm"
                clipDirection="topRight-bottomLeft"
              >
                {t("claim")}
              </Button>
            </div>
            <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}

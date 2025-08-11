"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Alert, Card } from "~/components";
import {
  CoolingPoolStats,
  CoolingPoolCard,
  CoolingPoolRecords,
} from "~/widgets";
import { newRewardList } from "~/wallet/lib/web3/claim";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { useQuery } from "@tanstack/react-query";
import { formatNumbedecimalScale } from "~/lib/utils";
import { getTokenPrice } from "~/wallet/lib/web3/bond";
import { coolAllCLaimAmount } from "~/services/auth/claim";

interface CoolingPoolCardData {
  claimable: string;
  remainingRewards: string;
  waitingPercent: number;
  className: string;
  bgClassName: string;
  disabled?: boolean;
  waiting: number;
  period: number;
  active: number;
  periodIndex: number;
}
interface coolMessItem {
  title: string;
  value: string;
  unit: string;
  usdValue: string;
}
export default function CoolingPoolPage() {
  const t = useTranslations("coolingPool");
  const { userAddress } = useUserAddress();
  const [myRewardList, setMyRewardList] = useState<CoolingPoolCardData[]>([]);
  const [coolMessList, setCoolMessList] = useState<coolMessItem[]>([]);

  const { data: myReward } = useQuery({
    queryKey: ["getRewardList", userAddress],
    queryFn: () => newRewardList({ address: userAddress as string }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  // oly单价
  const { data: olyPrice } = useQuery({
    queryKey: ["olyPrice"],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 100000,
  });

  //获取总领取的
  // 获取记录
  const { data: coolAllCLaimAmountData } = useQuery({
    queryKey: ["getCoolAllCLaimAmount", userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error("Missing address");
      }
      const response = await coolAllCLaimAmount(userAddress);
      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 42000,
  });

  useEffect(() => {
    if (myReward && myReward.rewardArr.length && olyPrice) {
      const rewardList = myReward.rewardArr.map((it, index) => ({
        claimable: it.claimable || "0",
        remainingRewards: it.remainingRewards || "0",
        waitingPercent:
          Number((Number(it.claimable || 0) / (it.all || 1)).toFixed(2)) * 100,
        className:
          index === 0
            ? "text-gradient"
            : index === 1
              ? "text-warning"
              : index === 2
                ? "text-success"
                : "text-secondary",
        bgClassName:
          index === 0
            ? "gradient"
            : index === 1
              ? "bg-warning"
              : index === 2
                ? "bg-success"
                : "bg-secondary",
        disabled: Number(it.claimable) < 0.0001,
        waiting: Number(it.remainingRewards || 0),
        period: Number(it.day || 0),
        active: 1,
        periodIndex: it.periodIndex,
      }));
      setMyRewardList(rewardList);
      const list = [
        {
          title: t("rewardsInPool"),
          value: myReward?.allPending
            ? formatNumbedecimalScale(myReward?.allPending, 4)
            : "0",
          unit: "OLY",
          usdValue: myReward?.allPending
            ? formatNumbedecimalScale(
                myReward?.allPending * Number(olyPrice),
                2,
              )
            : "0",
        },
        {
          title: t("releasedRewards"),
          value: myReward?.allClaimable
            ? formatNumbedecimalScale(myReward?.allClaimable, 4)
            : "0",
          unit: "OLY",
          usdValue: myReward?.allClaimable
            ? formatNumbedecimalScale(
                myReward?.allClaimable * Number(olyPrice),
                2,
              )
            : "0",
        },
        {
          title: t("totalClaimedRewards"),
          value: Number(coolAllCLaimAmountData)
            ? formatNumbedecimalScale(coolAllCLaimAmountData, 4)
            : "0",
          unit: "OLY",
          usdValue: Number(coolAllCLaimAmountData)
            ? formatNumbedecimalScale(
                Number(coolAllCLaimAmountData) * Number(olyPrice),
                2,
              )
            : "0",
        },
      ];
      setCoolMessList(list);
    }
  }, [myReward, t, olyPrice, coolAllCLaimAmountData]);

  return (
    <div className="space-y-6">
      {/* 描述区域 */}
      <Alert
        icon="cooling-pool"
        title={t("title")}
        description={t("description")}
      />

      <div className="grid grid-cols-1">
        <Card>
          {/* 统计卡片 */}
          {userAddress && coolMessList.length ? (
            <CoolingPoolStats coolMessList={coolMessList} />
          ) : null}
          {/* 冷却池卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {myRewardList.map((item, index) => (
              <CoolingPoolCard key={index} data={item}>
                <Image
                  src={`/images/widgets/pool-${index + 1}.png`}
                  alt="gear"
                  width={140}
                  height={140}
                  className={`${Number(item.claimable) > 0.0001 && "animate-spin-slow"}`}
                />
              </CoolingPoolCard>
            ))}
          </div>
        </Card>
      </div>

      {/* 事件记录 */}
      <CoolingPoolRecords />
    </div>
  );
}

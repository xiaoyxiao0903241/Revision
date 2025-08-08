"use client";

import React, { useEffect } from "react";
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
// import YielodLockAbi from "~/wallet/constants/YielodLockAbi.json";
// import { toast } from "sonner";
// import { usePublicClient } from "wagmi";
// import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { useQuery } from "@tanstack/react-query";
// import { formatNumbedecimalScale } from "~/lib/utils";

// interface ExtendedRewardItem extends rewardItem, Record<string, unknown> {
//   operate?: string;
// }
export default function CoolingPoolPage() {
  const t = useTranslations("coolingPool");
  // const queryClient = useQueryClient();
  // const [isDisabled,setIsDisabled] = useState<boolean>(false);
  const { userAddress } = useUserAddress();
  // const [myRewardList, setMyRewardList] = useState<ExtendedRewardItem[]>([]);
  // const [allClaimNum, setAllClaimNum] = useState<string>("0");
  // const [allPending,setAllPending] = useState<string>("0");
  // 冷却池卡片数据
  const coolingPoolCards = [
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 85.65,
      period: 5,
      className: "text-white",
      bgClassName: "gradient",
      disabled: false,
      active: true,
    },
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 15.65,
      period: 10,
      className: "text-warning",
      bgClassName: "bg-warning",
      disabled: false,
      active: false,
    },
    {
      released: 112.78,
      waiting: 999.86,
      waitingPercent: 85.65,
      period: 15,
      className: "text-success",
      bgClassName: "bg-success",
      disabled: false,
      active: false,
    },
    {
      released: 0.0,
      waiting: 0.0,
      waitingPercent: 0.0,
      period: 20,
      className: "text-secondary",
      bgClassName: "bg-secondary",
      disabled: true,
      active: false,
    },
  ];
  const { data: myReward } = useQuery({
    queryKey: ["getRewardList", userAddress],
    queryFn: () => newRewardList({ address: userAddress as string }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  useEffect(() => {
    // if (myReward && myReward.rewardArr.length) {
    //   setMyRewardList(myReward.rewardArr as ExtendedRewardItem[]);
    //   setAllClaimNum(myReward?.allClaimable?formatNumbedecimalScale(myReward?.allClaimable):'0');
    //   setAllPending(myReward?.allPending?formatNumbedecimalScale(myReward?.allPending,4):'0');
    // }
  }, [myReward, t]);

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
          <CoolingPoolStats />
          {/* 冷却池卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coolingPoolCards.map((card, index) => (
              <CoolingPoolCard key={index} data={card} onClick={() => {}}>
                <Image
                  src={`/images/widgets/pool-${index + 1}.png`}
                  alt="gear"
                  width={140}
                  height={140}
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

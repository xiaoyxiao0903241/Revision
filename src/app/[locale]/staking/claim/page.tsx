"use client"
import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Alert, Button, Card, CardContent, Notification } from "~/components"
import { durationOptions, useMock } from "~/hooks/useMock"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { ClaimSummary } from "~/widgets/claim-summary"
import { DurationSelect } from "~/widgets/select"
import { useNolockStore } from "~/store/noLock"
import { formatNumbedecimalScale } from "~/lib/utils";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { usePublicClient } from "wagmi";
import { toast } from "sonner";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import DemandStakingAbi from "~/wallet/constants/DemandStakingAbi.json";
import { demandStaking } from "~/wallet/constants/tokens";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Abi } from "viem";
import { getClaimPeriod } from "~/wallet/lib/web3/claim";
import type { periodItem } from "~/wallet/lib/web3/claim";


interface StakInfo {
  stakNum: number;
}
export default function ClaimPage() {
  const t = useTranslations("staking")
  const { demandProfitInfo, olyPrice, hotDataStakeNum } = useNolockStore()
  const { duration, setDuration, decimal, setDecimal } = useMock()
  const tNoLockedStaking = useTranslations("noLockedStaking")
  const [claimAmount, setClaimAmount] = useState("")
  const [allProfit, setAllProfitAmount] = useState<number>(0);
  const [normalProfit, setNormalProfit] = useState<number>(0);
  const [rebalseProfit, setRebalseProfit] = useState<number>(0);
  const [hotDataInfo, setStakeInfo] = useState<StakInfo>({ stakNum: 0 });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [lockIndex, setLockIndex] = useState<number>(0)
  const { userAddress } = useUserAddress();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();
  const [periodList, setPeriodList] = useState<periodItem[]>([]);



  const { data: list } = useQuery({
    queryKey: ["claimPeriod"],
    queryFn: () => getClaimPeriod(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  //领取静态收益方法
  const claimInterest = async () => {
    if (!publicClient || !userAddress) return;
    const toastId = toast.loading("请在钱包中确认交易...");
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: "claimInterest",
        args: [lockIndex, claimAmount],
      });
      toast.loading(t("toast.confirming_transaction"), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        toast.success(t("toast.claim_success"), {
          id: toastId,
        });
        setClaimAmount("");
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["UserDemandProfit", userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ["demandStakHisData", 1, userAddress],
          }),
        ]);
      } else {
        toast.error("领取失败", {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("error", {
        id: toastId,
      });
    } finally {
      // toast.dismiss(toastId)
      setIsDisabled(false);
    }
  };
  useEffect(() => {
    if (list?.length) {
      console.log(list,'list111')
      setPeriodList(list);
    }
  }, [list]);
  useEffect(() => {
    if (demandProfitInfo) {
      setAllProfitAmount(demandProfitInfo.allProfit)
      setNormalProfit(demandProfitInfo.normalProfit)
      setRebalseProfit(demandProfitInfo.rebalseProfit)
    }
  }, [demandProfitInfo]);
  useEffect(() => {
    if (hotDataStakeNum) {
      setStakeInfo({ stakNum: hotDataStakeNum });
    }
  }, [hotDataStakeNum]);
  return (
    <div className="space-y-6">
      <Alert
        icon="claim"
        title={t("claimTitle")}
        description={t("claimDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* 分段控制器 */}
          <Card>
            <CardContent className="space-y-6">
              <AmountCard
                data={{
                  value: claimAmount,
                  desc: Number(claimAmount) * olyPrice,
                  balance: allProfit ? Number(formatNumbedecimalScale(allProfit, 4)) : 0,
                }}
                onChange={(value) => {
                  setClaimAmount(value)
                }}
              />
              <Notification>{tNoLockedStaking("claimInfo")}</Notification>
              <DurationSelect
                options={periodList}
                value={lockIndex}
                placeholder={tNoLockedStaking("selectReleasePeriod")}
                onChange={(value)=>{
                  console.log(value,'1111111')
                  setLockIndex(value)
                }}
              />
              <ClaimSummary
                data={{
                  amount: 85,
                  taxRate: 0.38,
                  incomeTax: 0.07994899,
                }}
              />

              {/* 领取按钮 */}
              <Button
                clipDirection="topRight-bottomLeft"
                className="w-full"
                variant={(  normalProfit < 0.0001 || isDisabled || (rebalseProfit > 0 && hotDataInfo.stakNum > 0)) ? "disabled" : "primary"}
                disabled={ normalProfit < 0.0001 || isDisabled || (rebalseProfit > 0 && hotDataInfo.stakNum > 0)}
                onClick={claimInterest}
              >
                {t("claimButton")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧钱包摘要 */}
        <div>
          <WalletSummary
            data={{
              availableToStake: 100,
              stakedAmount: 100,
              stakedAmountDesc: 12345,
              apr: 100,
              rebaseRewards: 12345678,
              rebaseRewardsDesc: 12345678,
              totalStaked: 100,
              stakers: 100,
              olyMarketCap: 100,
            }}
          />
        </div>
      </div>
    </div>
  )
}

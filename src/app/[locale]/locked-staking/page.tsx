"use client"
import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Alert, Button, Card } from "~/components"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { DurationSelect } from "~/widgets/select"
import { StakingSummary } from "~/widgets/staking-summary"
import { useQuery,useQueryClient } from "@tanstack/react-query";
import { useUserAddress } from "~/contexts/UserAddressContext";
import {
  longStakList,
  longStakStatus,
  longAllowance,
  roi,
  depositDayList
} from "~/wallet/lib/web3/stake";
import type { periodlongItem } from "~/wallet/lib/web3/stake"
import { formatNumbedecimalScale } from "~/lib/utils";
import { useLockStore } from "~/store/lock"
import ConnectWalletButton from "~/components/web3/ConnectWalletButton";
import { usePublicClient } from "wagmi";
import { toast } from "sonner";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { Abi, erc20Abi, parseUnits } from "viem";
import { OLY } from "~/wallet/constants/tokens";
import { getInviteInfo } from "~/wallet/lib/web3/invite";
import longStakingAbi from "~/wallet/constants/LongStakingAbi.json";



export default function StakingPage() {
  const t = useTranslations("staking")
  const tLockedStaking = useTranslations("lockedStaking")
  const [lockIndex, setLockIndex] = useState<number>(0)
  const { userAddress } = useUserAddress();
  const [periodLongList, setPeriodLongList] = useState<periodlongItem[]>([])
  const [curPeriod, setCurPeriod] = useState<periodlongItem | null>(null);
  const { olyBalance, olyPrice } = useLockStore()
  const [stakeAmount, setStakeAmount] = useState("");
  const [myolybalance, seMyolybalance] = useState<string>('0');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();



  //获取长期质押状态列表
  const { data: stakingStatusList } = useQuery({
    queryKey: ["getLongStakStatus", userAddress],
    queryFn: () => longStakStatus(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 33000,
  });

  //获取长期质押授权OLY数量列表
  const { data: longAllowanceList } = useQuery({
    queryKey: ["getLongAllowanceList", userAddress],
    queryFn: () => longAllowance({ address: userAddress as string }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 31000,
  });

  //长期质押列表
  const { data: longStakListData } = useQuery({
    queryKey: ["getLongStakListData", userAddress],
    queryFn: async () => {
      const response = longStakList();
      return response || [];
    },
    enabled: true,
    retry: 1,
    retryDelay: 1000,
  });

  //是否有邀请
  const { data: inviteInfo, refetch: refetchInviteInfo } = useQuery({
    queryKey: ["inviteInfo", userAddress],
    queryFn: () => getInviteInfo({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 40000,
  });

  // 授权
  const handApprove = async (index: number) => {
    if (!publicClient || !userAddress) return;
    const stakToken = depositDayList[index].token;
    const priceInWei = Number(stakeAmount.toString());
    if (!myolybalance || Number(myolybalance.toString()) < priceInWei) {
      toast.error("数量不足");
      return;
    }
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: OLY as `0x${string}`,
        functionName: "approve",
        args: [
          stakToken as `0x${string}`,
          parseUnits(Number.MAX_SAFE_INTEGER.toString(), 9),
        ],
      });
      
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        toast.success("授权成功");
        await queryClient.invalidateQueries({
          queryKey: ["getLongAllowanceList", userAddress],
        });
        // changeApproveData(index);
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("error");
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  //质押
  const staking = async (index: number) => {
    if (!publicClient || !userAddress) return;
    await refetchInviteInfo();
    if (!inviteInfo?.isActive) {
      toast.warning("您的账户需要绑定推荐人地址");
      return;
    }
    const stakToken = depositDayList[index].token;
    if (Number(stakeAmount) <= 0) {
      toast.error("数量不足");
      return;
    }
    if (Number(myolybalance) < Number(setStakeAmount)) {
      toast.error("数量不足");
      return;
    }
    const toastId = toast.loading("请在钱包中确认交易...");
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: longStakingAbi as Abi,
        address: stakToken as `0x${string}`,
        functionName: "stake",
        args: [parseUnits(stakeAmount, 9)]
      });
      toast.loading("交易确认中...", {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        
        toast.success("质押成功", {
          id: toastId,
        });
        await queryClient.invalidateQueries({
          queryKey: ["olyBalance", userAddress],
        });
        setStakeAmount("");
      } else {
        toast.error(t("stake_failed"), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("error", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    if (
      longStakListData &&
      longStakListData.length &&
      stakingStatusList?.length &&
      longAllowanceList?.length
    ) {
      const updatedList = longStakListData.map((it, index: number) => ({
        ...it,
        period: it.day,
        addition: roi()[index].addition,
        rate:roi()[index].rate,
        balance: "0",
        isApprove: false,
        tvl: formatNumbedecimalScale(it.amount, 2),
        status: stakingStatusList[index].status,
        allowanceNum: longAllowanceList[index].allowanceNum,
      })) as periodlongItem[];
      setPeriodLongList(updatedList);
      setCurPeriod(updatedList[lockIndex])
      console.log(updatedList,'updatedList11111')
    }
  }, [longStakListData, stakingStatusList, longAllowanceList,lockIndex]);

  //余额
  useEffect(() => {
    const myBalance = formatNumbedecimalScale(olyBalance, 2)
    seMyolybalance(myBalance)
  }, [olyBalance])
  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={tLockedStaking("alertTitle")}
        description={tLockedStaking("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <DurationSelect
              options={periodLongList || []}
              value={lockIndex}
              onChange={(value)=>{
                setLockIndex(value)
                setCurPeriod(periodLongList[value])
              }}
            />
            <AmountCard
              data={{
                value: stakeAmount,
                desc: (Number(stakeAmount) * olyPrice),
                balance: (myolybalance && Number(myolybalance)) || 0,
              }}
              onChange={(value) => {
                setStakeAmount(value)
              }}
              description={t("balance")}
            />
            <StakingSummary
              data={{
                rebaseRewardRate: curPeriod && curPeriod?.rate||"0.3%-1%",
                rebaseBoost: curPeriod && curPeriod?.addition||"0.02-0.04"
              }}
            />
            {
              !userAddress ? <ConnectWalletButton className="bg-[#FF8908] text-xl py-3 cursor-pointer px-6 !text-white text-5   hover:bg-[#FF8908]/80 h-[48px] min-w-[160px]   mx-auto" /> :
                (
                  <div className="flex items-center justify-center w-full gap-x-4">

                    {
                    curPeriod &&  !curPeriod.isApprove && (curPeriod.allowanceNum === 0 || Number(curPeriod.allowanceNum)  < Number(stakeAmount)) &&
                      <Button
                        clipDirection="topRight-bottomLeft"
                        className="font-mono w-[50%]"
                        variant={(isDisabled || Number(stakeAmount) === 0 || Number(myolybalance) === 0 || !curPeriod.status ) ? "disabled" : "primary"}
                        disabled={isDisabled || Number(stakeAmount) === 0 || Number(myolybalance) === 0 || !curPeriod.status}
                        onClick={()=>{handApprove(lockIndex)}}
                      >
                        {isLoading ? '授权中...' : '授权'}
                      </Button>
                    }
                    {
                     curPeriod && <Button
                       clipDirection="topRight-bottomLeft"
                        className="font-mono flex-1"
                        variant={(isDisabled ||Number(curPeriod.allowanceNum)=== 0 ||Number(curPeriod.allowanceNum) < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(myolybalance) === 0) ? "disabled" : "primary"}
                        disabled={isDisabled || Number(curPeriod.allowanceNum)=== 0 || Number(curPeriod.allowanceNum) < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(myolybalance) === 0}
                        onClick={()=>{staking(lockIndex)}}
                      >
                        {
                          isLoading && Number(curPeriod.allowanceNum) > 0 && Number(curPeriod.allowanceNum) > Number(stakeAmount) ? '质押中...' : '质押'
                        }
                      </Button>
                    }
                  </div>
                )
            }
          </Card>
        </div>
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

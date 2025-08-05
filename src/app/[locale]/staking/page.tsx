"use client"
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Button,
  List,
  RoundedLogo,
  Statistics,
  View,
  Card,
  Countdown,
  CountdownDisplay
} from "~/components";
import { demandStaking } from "~/wallet/constants/tokens";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllowance
} from "~/wallet/lib/web3/stake";
import { OLY,} from "~/wallet/constants/tokens";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { usePublicClient } from "wagmi";
import { Abi, erc20Abi, parseUnits } from "viem";
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { DurationSelect } from "~/widgets/select"
import { formatNumbedecimalScale } from "~/lib/utils";
import ConnectWalletButton from "~/components/web3/ConnectWalletButton";
import DemandStakingAbi from "~/wallet/constants/DemandStakingAbi.json";
import { getInviteInfo } from "~/wallet/lib/web3/invite";
import { useNolockStore, listItem } from "~/store/noLock"




export default function StakingPage() {
  const t = useTranslations("staking")
  const { userAddress } = useUserAddress();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState("");
 
  const [apy, setApy] = useState<string>("0");
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const [allowanceNum, setAllowanceNum] = useState<number>(0);
  const [myolybalance, seMyolybalance] = useState<string>('0');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [olyToUsdt,setolyToUsdt] = useState('0')

  const { olyBalance,olyPrice,allnetReabalseNum,AllolyStakeNum,currentBlock,nextBlock } = useNolockStore()
  const { data: inviteInfo, refetch: refetchInviteInfo } = useQuery({
    queryKey: ["inviteInfo", userAddress],
    queryFn: () => getInviteInfo({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
  });


 

  // 获取授权长度
  const { data: allowanceLynkLength, refetch: refetchAllowanceOly } = useQuery({
    queryKey: ["allowanceOly"],
    queryFn: () =>
      getAllowance({
        address: userAddress as `0x${string}`,
        fromAddress: OLY,
        toAddress: demandStaking,
        decimal: 9
      }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  //授权
  const handApprove = async () => {
    if (!publicClient || !userAddress) return;
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: OLY as `0x${string}`,
        functionName: "approve",
        args: [
          demandStaking,
          parseUnits(Number.MAX_SAFE_INTEGER.toString(), 9),
        ],
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        toast.success("授权成功");
        await refetchAllowanceOly();
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("error");
    } finally {
      setIsLoading(false);
    }
  };

 


  // 质押
  const toStaking = async () => {
    if (!publicClient || !userAddress) return;
    await refetchInviteInfo();
    if (!inviteInfo?.isActive) {
      toast.warning("您的账户需要绑定推荐人地址");
      return;
    }
    if (!myolybalance || Number(myolybalance) === 0) {
      toast.error("数量不足");
      return;
    }
    if (Number(stakeAmount) === 0) {
      toast.error("请输入质押数量");
      return;
    }
    if (allowanceNum === undefined) return;
    if (!allowanceNum || allowanceNum < Number(stakeAmount)) {
      handApprove();
      return;
    }
    const toastId = toast.loading("请在钱包中确认交易...");
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: "stake",
        args: [parseUnits(stakeAmount, 9)],
      });
      toast.loading("交易确认中...", {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        toast.success("质押成功", {
          id: toastId,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["depositTokenBalance", userAddress],
          })
        ]);
        setStakeAmount("");
      } else {
        toast.error("质押失败", {
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

  //计算rebase倒计时
  useEffect(()=>{
    if(nextBlock && currentBlock){
     const time = nextBlock - currentBlock < 0 ? 0 : nextBlock - currentBlock;
     setCutDownTime(time);
    }
  },[currentBlock,nextBlock])

 

  //计算下一次爆块收益率
  useEffect(() => {
    if (allnetReabalseNum && AllolyStakeNum) {
      const rate = formatNumbedecimalScale(
        (allnetReabalseNum /AllolyStakeNum) * 100,
        4
      );
      setApy(rate);
    }
  }, [allnetReabalseNum,AllolyStakeNum]);

  

  useEffect(() => {
    if (allowanceLynkLength) {
      setAllowanceNum(Number(allowanceLynkLength));
    }
  }, [allowanceLynkLength]);

  //计算质押的价值
  useEffect(()=>{
    const amount = Number(stakeAmount)
    if(amount && olyPrice){
      const all = formatNumbedecimalScale(amount*olyPrice,2)
      setolyToUsdt(all)
    }

  },[olyPrice,stakeAmount])

  //余额
  useEffect(()=>{
    const myBalance = formatNumbedecimalScale(olyBalance,2)
    seMyolybalance(myBalance)
  },[olyBalance])

  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={"STAKE"}
        description={"I您可以随时存入或解除质押,无锁定期限,每12小时发放爆块奖励"}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <AmountCard
              data={{
                value: stakeAmount,
                desc: olyToUsdt,
                balance: (myolybalance && Number(myolybalance)) || 0,
              }}
              onChange={(value) => {
                setStakeAmount(value)
              }}
            />
            <List>
              <List.Item>
                <List.Label>{t("rebaseRewardRate")}</List.Label>
                <List.Value>0.3%-1%</List.Value>
              </List.Item>

              <List.Item>
                <List.Label>{t("nextRebaseRewardRate")}</List.Label>
                <List.Value className="text-secondary">{Number(apy) > 0 ? apy : 0}%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("countdownToNextRebase")}</List.Label>
                <List.Value>
                  <CountdownDisplay
                    blocks={BigInt(cutDownTime)} isShowDay={false}
                  />
                </List.Value>
              </List.Item>
            </List>
            {
              !userAddress ? <ConnectWalletButton className="bg-[#FF8908] text-xl py-3 cursor-pointer px-6 !text-white text-5   hover:bg-[#FF8908]/80 h-[48px] min-w-[160px]   mx-auto" /> :
                (
                  <div className="flex items-center justify-center w-full gap-x-4">

                    {
                      (allowanceNum === 0 || allowanceNum < Number(stakeAmount)) &&
                      <Button
                        clipDirection="topRight-bottomLeft"
                        className="font-mono w-[50%]"
                        variant={(isDisabled || Number(stakeAmount) === 0 || Number(myolybalance) === 0) ? "disabled" : "primary"}
                        disabled={isDisabled || Number(stakeAmount) === 0 || Number(myolybalance) === 0}
                        onClick={toStaking}
                      >
                        {isLoading ? '授权中...' : '授权'}
                      </Button>
                    }
                    {
                      <Button
                       clipDirection="topRight-bottomLeft"
                        className="font-mono flex-1"
                        variant={(isDisabled || allowanceNum === 0 || allowanceNum < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(myolybalance) === 0) ? "disabled" : "primary"}
                        disabled={isDisabled || allowanceNum === 0 || allowanceNum < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(myolybalance) === 0}
                        onClick={toStaking}
                      >
                        {
                          isLoading && allowanceNum > 0 && allowanceNum > Number(stakeAmount)
                            ? '质押中...' : '质押'
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






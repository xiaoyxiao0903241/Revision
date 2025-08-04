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
  demandInfo,
  demandProfit,
  demandAfterHot,
  getAllnetReabalseNum,
  getAllowance,
  getEnchBlock,
  getBalanceToken
} from "~/wallet/lib/web3/stake";
import { OLY, staking,matrixNetwork } from "~/wallet/constants/tokens";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { usePublicClient } from "wagmi";
import { Abi, erc20Abi, parseUnits } from "viem";
import { getTokenBalance, getTokenPrice } from "~/wallet/lib/web3/bond";
import { getCurrentBlock } from "~/lib/multicall";
import { durationOptions, useMock } from "~/hooks/useMock"
import { WalletSummary } from "~/widgets"
import { AmountCard } from "~/widgets/amount-card"
import { DurationSelect } from "~/widgets/select"
import { formatNumbedecimalScale } from "~/lib/utils";
import ConnectWalletButton from "~/components/web3/ConnectWalletButton";
import DemandStakingAbi from "~/wallet/constants/DemandStakingAbi.json";
import { getInviteInfo } from "~/wallet/lib/web3/invite";



interface StakInfo {
  stakNum: number;
}
export default function StakingPage() {
  const t = useTranslations("staking")
  const { userAddress } = useUserAddress();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const [hotDataInfo, setStakeInfo] = useState<StakInfo>({ stakNum: 0 }); //热身期数据
  const [olyPrice, setTokenPrice] = useState(0)
  const [apy, setApy] = useState<string>("0");
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const [allowanceNum, setAllowanceNum] = useState<number>(0);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data: inviteInfo, refetch: refetchInviteInfo } = useQuery({
    queryKey: ["inviteInfo", userAddress],
    queryFn: () => getInviteInfo({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
  });
  // oly单价
  const { data: TokenPrice } = useQuery({
    queryKey: ["getTokenPrice"],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 10000,
  });
  console.log(TokenPrice, 'TokenPrice')


 

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

  //oly余额
  const { data: balance } = useQuery({
    queryKey: ["depositTokenBalance", userAddress],
    queryFn: () => getTokenBalance({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    refetchInterval: 25000,
  });



  //获取全网质押的的oly数量
  const { data: allAsStakeNum } = useQuery({
    queryKey: ["getAllAsStakeNum", userAddress],
    queryFn: () =>
      getBalanceToken({
        address: staking as `0x${string}`,
        TOKEN_ADDRESSES: OLY,
        decimal: 9,
      }),
    enabled: Boolean(userAddress),
  });

  // 获取全网oly的rebase数量
  const { data: allnetReabalseNum } = useQuery({
    queryKey: ["AllnetReabalseNum"],
    queryFn: () => getAllnetReabalseNum(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 60000,
  });

  // 获取当前块高度
  const { data: getCureentBlock } = useQuery({
    queryKey: ["currentBlock"],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  // 获取下个块高度
  const { data: nextBlock } = useQuery({
    queryKey: ["enchBlock"],
    queryFn: () => getEnchBlock(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 10000,
  });

  // 质押
  const toStaking = async () => {
    if (!publicClient || !userAddress) return;
    await refetchInviteInfo();
    if (!inviteInfo?.isActive) {
      toast.warning("您的账户需要绑定推荐人地址");
      return;
    }
    if (!balance || Number(balance) === 0) {
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
  useEffect(() => {
    if (TokenPrice) {
      console.log()
      setTokenPrice(Number(TokenPrice))
    }

  }, [TokenPrice])

  useEffect(() => {
    if (allnetReabalseNum) {
      const rate = formatNumbedecimalScale(
        (Number(allnetReabalseNum) / Number(allAsStakeNum)) * 100,
        4
      );
      setApy(rate);
    }
  }, [apy, allnetReabalseNum, allAsStakeNum]);

  //下次爆块时间计算
  useEffect(() => {
    const getCutDownTime = async () => {
      if (nextBlock) {
        const curBlock = Number(await getCurrentBlock());
        console.log(curBlock, 'curBlock')
        console.log(nextBlock, 'nextBlock')
        const time = nextBlock - curBlock < 0 ? 0 : nextBlock - curBlock;
        console.log(time, 'time')
        setCutDownTime(time);
      }
    };
    getCutDownTime();
  }, [getCureentBlock, nextBlock]);

  useEffect(() => {
    if (allowanceLynkLength) {
      setAllowanceNum(Number(allowanceLynkLength));
    }
  }, [allowanceLynkLength]);


  return (
    <div className="space-y-6">
      <Alert
        icon="stake"
        title={t("alertTitle")}
        description={t("alertDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <AmountCard
              data={{
                value: stakeAmount,
                desc: (olyPrice * Number(stakeAmount)).toFixed(2),
                balance: (balance && Number(balance)) || 0,
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
                        variant={(isDisabled || Number(stakeAmount) === 0 || Number(balance) === 0) ? "disabled" : "primary"}
                        disabled={isDisabled || Number(stakeAmount) === 0 || Number(balance) === 0}
                        onClick={toStaking}
                      >
                        {isLoading ? '授权中...' : '授权'}
                      </Button>
                    }
                    {
                      <Button
                       clipDirection="topRight-bottomLeft"
                        className="font-mono flex-1"
                        variant={(isDisabled || allowanceNum === 0 || allowanceNum < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(balance) === 0) ? "disabled" : "primary"}
                        disabled={isDisabled || allowanceNum === 0 || allowanceNum < Number(stakeAmount) || Number(stakeAmount) === 0 || Number(balance) === 0}
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






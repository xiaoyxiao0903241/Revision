"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import {
  Alert,
  Button,
  Card,
  Countdown,
  List,
  Notification,
  Segments,
  RoundedLogo,
  View,
  CountdownDisplay
} from "~/components"
import { formatDecimal } from "~/lib/utils"
import { AmountCard, WalletSummary } from "~/widgets"
import { useNolockStore } from "~/store/noLock"
import CountDownTimer from "./component/countDownTimer"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { formatNumbedecimalScale } from "~/lib/utils";
import { usePublicClient } from "wagmi";
import { toast } from "sonner";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import DemandStakingAbi from "~/wallet/constants/DemandStakingAbi.json";
import { demandStaking } from "~/wallet/constants/tokens";
import { Abi, parseUnits } from "viem";



interface StakInfo {
  stakNum: number;
}

export default function UnstakePage() {
  const t = useTranslations("staking")
  const {olyPrice, time, lastStakeTimestamp,nextBlock,currentBlock,AllolyStakeNum,allnetReabalseNum,hotDataStakeNum,demandProfitInfo,afterHotData} = useNolockStore();
  const tNoLockedStaking = useTranslations("noLockedStaking")
 
  const { userAddress } = useUserAddress();
  const [disabled] = useState(true)
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const [selectedStakeType, setSelectedStakeType] = useState<
    "release" | "unstake"
  >("release")
  const stakeOptions = [
    { value: "release", label: tNoLockedStaking("release") },
    { value: "unstake", label: t("unstake") },
  ]
  const [hotDataInfo, setStakeInfo] = useState<StakInfo>({ stakNum: 0 });
  const [isClaim, setisClaim] = useState<boolean>(false);
  const [apy, setApy] = useState<string>("0");
  const [myAllStakeNum, setMyAllStakeNum] = useState(0);
  const [nextEarnAmount, setNextEarnAmount] = useState<number>(0);
  const [allProfit, setAllProfitAmount] = useState<number>(0);
  const [principal, setPrincipal] = useState<number>(0);
  const [UnstakeAmount, setUnstakeAmount] = useState("")
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();


  //领取本金
  const claimPrincipal = async () => {
    if (!publicClient || !userAddress) return;
    if (Number(principal) === 0) {
      toast.success("您暂未有可解除的OLY");
      return;
    }
    if (Number(principal) < Number(UnstakeAmount)) {
      toast.success("超过了最大可解除的数量");
      return;
    }
    if (Number(UnstakeAmount) === 0) {
      toast.success("请输入解除质押的数量");
      return;
    }
    const toastId = toast.loading(t("toast.confirm_in_wallet"));
    setIsDisabled(true);
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: "unstakePrincipal",
        args: [parseUnits(UnstakeAmount, 9)],
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      toast.loading(t("toast.confirming_transaction"), {
        id: toastId,
      });
      if (result.status === "success") {
        toast.success(("解除质押成功"), {
          id: toastId,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["UserDemandInfo", userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ["DemandAfterHot", userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ["UserDemandProfit", userAddress],
          })
        ]);
        setUnstakeAmount("");
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error("error", {
        id: toastId,
      });
    } finally {
      // toast.dismiss(toastId)
      setIsDisabled(false);
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const myAsNum = Number(afterHotData?.principal || 0) + Number(hotDataInfo.stakNum || 0);
    setMyAllStakeNum(myAsNum);
    const NextEarnAmount = formatNumbedecimalScale(
      ((myAsNum + allProfit) * Number(apy)) / 100,
      6
    );
    setNextEarnAmount(Number(NextEarnAmount));
    if (afterHotData?.principal) {
      setPrincipal(afterHotData?.principal);
      return;
    }
    setPrincipal(0);
  }, [afterHotData, apy, hotDataInfo.stakNum, allProfit]);



  useEffect(() => {
    if (demandProfitInfo) {
      setAllProfitAmount(demandProfitInfo.allProfit);
      setisClaim(demandProfitInfo.isClaim);
    }
  }, [demandProfitInfo]);

  useEffect(() => {
    if (hotDataStakeNum ) {
      setStakeInfo({ stakNum: hotDataStakeNum });
    }
  }, [hotDataStakeNum]);

  //计算下一次爆块收益率
  useEffect(() => {
    if (allnetReabalseNum && AllolyStakeNum) {
      const rate = formatNumbedecimalScale(
        (allnetReabalseNum / AllolyStakeNum) * 100,
        4
      );
      setApy(rate);
    }
  }, [allnetReabalseNum, AllolyStakeNum]);

  //计算rebase倒计时
  useEffect(() => {
    if (nextBlock && currentBlock) {
      const time = nextBlock - currentBlock < 0 ? 0 : nextBlock - currentBlock;
      setCutDownTime(time);
    }
  }, [currentBlock, nextBlock])

  return (
    <div className="space-y-6">
      <Alert
        icon="unstake"
        title={t("unstakeTitle")}
        description={tNoLockedStaking("unstakeDescription")}
      />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <Segments
              options={stakeOptions}
              value={selectedStakeType}
              onChange={(value) =>
                setSelectedStakeType(value as "release" | "unstake")
              }
            />
            {selectedStakeType === "release" ? (
              <>
                <View className="bg-[#22285E] px-4" clipDirection="topRight-bottomLeft">
                  <div className="flex items-center justify-between py-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-foreground/70 text-sm">{t("amount")}</span>
                      <div className="flex items-center gap-2">
                        <RoundedLogo className="w-6 h-6" />
                        <span className="text-foreground text-3xl font-mono">
                          {hotDataInfo.stakNum ? formatNumbedecimalScale(hotDataInfo.stakNum, 6) : 0}
                        </span>
                      </div>
                      <span className="text-foreground/70 text-sm">
                      ${ formatNumbedecimalScale(hotDataInfo.stakNum*olyPrice,2)}
                      </span>
                    </div>
                    {
                      lastStakeTimestamp && lastStakeTimestamp > 0 && hotDataInfo.stakNum > 0 && !isClaim ?
                        <span className="text-white">
                          <CountDownTimer time={time}></CountDownTimer>
                        </span> : <Button
                          className="h-10"
                          disabled={hotDataInfo.stakNum === 0 || !isClaim || isDisabled}
                          clipDirection="topRight-bottomLeft"
                          variant="primary"
                        >
                          Release
                        </Button>
                    }
                  </div>
                </View>
                {/* 信息提示 */}
                <Notification>
                  {tNoLockedStaking(
                    disabled ? "unstakeDisabledInfo" : "unstakeInfo"
                  )}
                </Notification>
              </>
            ) : (
              <>
                <AmountCard
                  data={{
                    value: UnstakeAmount,
                    desc: Number(UnstakeAmount)*olyPrice,
                    balance: principal,
                  }}
                  onChange={(value) => {
                    Number(value)>principal? setUnstakeAmount(principal.toString()):setUnstakeAmount(value)
                  }}
                />
                <List>
                  <List.Item>
                    <List.Label>{t("youWillReceive")}</List.Label>
                    <List.Value className="text-xl font-mono">{`${formatDecimal(
                      Number(UnstakeAmount),
                      4
                    )} OLY`}</List.Value>
                  </List.Item>
                  <List.Item>
                    <List.Label>下一次爆块收益率</List.Label>
                    <List.Value className="font-mono">{Number(apy) > 0 ? apy : 0}%</List.Value>
                  </List.Item>
                  <List.Item>
                    <List.Label>下一次爆块奖励</List.Label>
                    <List.Value className="text-success">{nextEarnAmount > 0 ? formatNumbedecimalScale(nextEarnAmount, 4) : 0} OLY</List.Value>
                  </List.Item>

                  <List.Item>
                    <List.Label>{t("countdownToNextRebase")}</List.Label>
                    <List.Value className="font-mono">
                      <CountdownDisplay
                        blocks={BigInt(cutDownTime)} isShowDay={false}
                      />
                    </List.Value>
                  </List.Item>
                </List>
                <Button 
                  clipDirection="topRight-bottomLeft"
                  variant={(principal == 0 || isDisabled || Number(UnstakeAmount) === 0)?"disabled":"primary"}
                  disabled={principal == 0 || isDisabled || Number(UnstakeAmount) === 0}
                  >
                 {isLoading ? "解除中..." : "解除质押"}
                </Button>
              </>
            )}
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

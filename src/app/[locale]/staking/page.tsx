"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Alert,
  Button,
  List,
  RoundedLogo,
  Statistics,
  View,
  Card,
  CardHeader,
} from "~/components";
import Logo from "~/assets/logo.svg";
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
import { OLY, staking } from "~/wallet/constants/tokens";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { usePublicClient } from "wagmi";
import { Abi, erc20Abi, parseUnits } from "viem";
import { getTokenBalance } from "~/wallet/lib/web3/bond";
import { getCurrentBlock } from "~/lib/multicall";



export default function StakingPage() {
  const t = useTranslations("staking")
  const { userAddress } = useUserAddress();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);


// 获取授权长度
const { data: allowanceLynkLength, refetch: refetchAllowanceLynk } = useQuery({
  queryKey: ["allowanceAS"],
  queryFn: () =>
    getAllowance({
      address: userAddress as `0x${string}`,
      fromAddress: OLY,
      toAddress: demandStaking,
      decimal:9
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
      toast.success(t("toast.approve_success"));
      await refetchAllowanceLynk();
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
            <View
              className="bg-[#22285E] px-4"
              clipDirection="topRight-bottomLeft"
            >
              <div className="flex items-center justify-between border-b border-border/20 py-4">
                <Statistics title={t("amount")} value={"0.0"} />
                <div className="flex items-center gap-1">
                  <RoundedLogo />
                  <span className="text-white mono">OLY</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/70 py-4">
                <span className="mono">$0.00</span>
                <div className="flex items-center gap-2">
                  <span className="mono">{t("balance")}</span>
                  <span className="mono text-white">0.00 OLY</span>
                  <span className="mono gradient-text">{t("useMax")}</span>
                </div>
              </div>
            </View>
            <List>
              <List.Item>
                <List.Label>{t("rebaseRewardRate")}</List.Label>
                <List.Value>0.3%-1%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("rebaseBoost")}</List.Label>
                <List.Value>0.3%-1%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("nextRebaseRewardRate")}</List.Label>
                <List.Value className="text-secondary">0.38%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("countdownToNextRebase")}</List.Label>
                <List.Value>3h 59m 46s</List.Value>
              </List.Item>
            </List>
            <Button
              variant="secondary"
              clipDirection="topRight-bottomLeft"
              className="w-full font-mono"
            >
              {t("stake")}
            </Button>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader className="space-y-3">
              {/* 可用质押数量 */}
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
                    value="$1,2634,715"
                    desc="0.00"
                  />
                </div>
              </div>

              {/* 已质押数量 */}

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
                <List.Value className="text-secondary">0.38%</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("stakers")}</List.Label>
                <List.Value>3h 59m 46s</List.Value>
              </List.Item>
              <List.Item>
                <List.Label>{t("olyMarketCap")}</List.Label>
                <List.Value>$1,2634,715</List.Value>
              </List.Item>
            </List>
          </Card>
        </div>
      </div>
    </div>
  )
}

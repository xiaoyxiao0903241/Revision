import { useState } from "react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Button, View } from "~/components";
import { cn } from "~/lib/utils";
import { usePublicClient } from "wagmi";
import { useUserAddress } from "~/contexts/UserAddressContext";
import { toast } from "sonner";
import YielodLockAbi from "~/wallet/constants/YielodLockAbi.json";
import { useQueryClient } from "@tanstack/react-query";
import { useWriteContractWithGasBuffer } from "~/hooks/useWriteContractWithGasBuffer";
import { yieldLocker } from "~/wallet/constants/tokens";
import { Abi } from "viem";

interface CoolingPoolCardProps {
  data: {
    claimable: string;
    remainingRewards: string;
    waitingPercent: number;
    period: number;
    className: string;
    bgClassName: string;
    disabled?: boolean;
    waiting: number;
    active: number;
    periodIndex: number;
  };
  children: React.ReactNode;
  onClick?: () => void;
}

export const CoolingPoolCard: FC<CoolingPoolCardProps> = ({
  data,
  children,
}) => {
  const t = useTranslations("coolingPool");
  const tStaking = useTranslations("staking");
  const publicClient = usePublicClient();
  const { userAddress } = useUserAddress();
  const [current, setCurrent] = useState<number>(10000);
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const pageSize = 10;
  const [isDisabled, setIsDisabled] = useState(false);

  const claimReward = async () => {
    if (!publicClient || !userAddress) return;
    const toastId = toast.loading("请在钱包中确认交易...");
    setIsDisabled(true);
    setCurrent(data.period);
    try {
      const hash = await writeContractAsync({
        abi: YielodLockAbi as Abi,
        address: yieldLocker as `0x${string}`,
        functionName: "claimForIndex",
        args: [data.periodIndex],
      });
      toast.loading("交易确认中...", {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === "success") {
        toast.success("领取成功", {
          id: toastId,
        });
        await queryClient.invalidateQueries({
          queryKey: ["getRewardList", userAddress],
        });
        await queryClient.invalidateQueries({
          queryKey: ["getRewardRecord", userAddress, 1, pageSize],
        });
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
      setIsDisabled(false);
      setCurrent(10000);
    }
  };
  return (
    <View
      className="bg-[#22285E] px-4 py-6"
      clipDirection="topLeft-bottomRight"
      clipSize={16}
    >
      <div className={cn("flex flex-col items-center")}>
        {/* 动画齿轮图标 */}
        <div
          className={cn("w-2/3 aspect-square flex items-center justify-center")}
        >
          {children}
        </div>

        {/* 已释放数量 */}
        <div className={cn("text-2xl font-bold font-mono", data.className)}>
          {data.claimable}
        </div>
        <div className="text-xs text-foreground/50">{t("released")}</div>

        {/* 等待释放数量 */}
        <div className="flex w-full items-center justify-between my-2">
          <div className="text-xs text-foreground/50">
            {t("waitingToBeReleased")}
          </div>
          <div className="text-xs font-mono text-white">
            {data.waiting} ({data.waitingPercent.toFixed(2)}%)
          </div>
        </div>
        {/* 进度条 */}
        <div className="bg-foreground/20 w-full h-2 rounded-full overflow-hidden">
          <div
            className={cn("h-full relative overflow-hidden", data.bgClassName)}
            style={{
              width: `${data.waitingPercent}%`,
            }}
          >
            {/* 斜纹效果 */}
            <div
              className={cn(
                "absolute inset-0",
                data.active && "animate-stripes",
              )}
              style={{
                width: "calc(100% + 8px)",
                backgroundImage: `
                   repeating-linear-gradient(
                     45deg,
                     rgba(255, 255, 255, 0.1) 0px,
                     rgba(255, 255, 255, 0.1) 1px,
                     transparent 1px,
                     transparent 2px
                   )
                 `,
              }}
            />
          </div>
        </div>
        {/* 周期 */}
        <div className="flex w-full items-center justify-between my-4">
          <div className="text-xs text-foreground/50">{t("period")}</div>
          <div className="text-xs font-mono text-white">
            {data.period}
            {tStaking("days")}
          </div>
        </div>

        {/* 领取按钮 */}
        <Button
          className="w-full"
          disabled={data.disabled || isDisabled}
          onClick={claimReward}
          clipDirection="topLeft-bottomRight"
        >
          {current === data.period ? "领取中..." : "领取"}
        </Button>
      </div>
    </View>
  );
};

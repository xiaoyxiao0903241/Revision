import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi } from 'viem';
import { usePublicClient } from 'wagmi';
import {
  Button,
  Card,
  CountdownDisplay,
  Notification,
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  View,
} from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { usePeriods } from '~/hooks/userPeriod';
import { formatNumbedecimalScale } from '~/lib/utils';
import { getClaimReward, rewardClaimed } from '~/services/auth/dao';
import { useNolockStore } from '~/store/noLock';
import RewardPoolV7Abi from '~/wallet/constants/RewardPoolV7.json';
import {
  LeadRewardPool,
  ReferralRewardPool,
  ServiceRewardPool,
  TitleRewardPool,
} from '~/wallet/constants/tokens';
import { verifySignature } from '~/wallet/lib/web3/dao';
import { ClaimSummary } from '~/widgets/claim-summary';
const typeAddressMap = {
  matrix: ReferralRewardPool as `0x${string}`,
  promotion: TitleRewardPool as `0x${string}`,
  lead: LeadRewardPool as `0x${string}`,
  service: ServiceRewardPool as `0x${string}`,
};
interface PeriodInfo {
  index: number;
  day: number;
  feeRate: number;
  feeRecipient: string;
  rate: string;
  releasedBlocks: string;
}

interface ClaimSectionProps {
  refetch: () => void;
  rewardData:
    | {
        unclaimedAmount?: number;
        ratio?: number;
        totalDepositAmount?: number;
        referralCount?: number;
        validReferralCount?: number;
        totalBonus?: number;
      }
    | undefined;
  type: string;
  onSuccess: () => void;
}

const defaultPeriodInfo = {
  index: 0,
  day: 0,
  feeRate: 0,
  feeRecipient: '',
  rate: '0%',
  releasedBlocks: '',
};

export const ClaimSection = ({
  refetch,
  rewardData,
  type,
  onSuccess,
}: ClaimSectionProps) => {
  const t = useTranslations('dao');
  const commonT = useTranslations('common');
  const tStaking = useTranslations('staking');
  const { userAddress } = useUserAddress();
  const periodListData = usePeriods();
  const [currentPeriodInfo, setCurrentPeriodInfo] =
    useState<PeriodInfo>(defaultPeriodInfo);
  const [currentRate, setCurrentRate] = useState<number>(0);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const publicClient = usePublicClient();
  const { handleContractError, isContractError } = useContractError();
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const { currentBlock, nextBlock } = useNolockStore();
  useEffect(() => {
    setCurrentRate(Number(currentPeriodInfo?.rate?.split('%')[0]));
  }, [currentPeriodInfo]);

  // 计算rebase倒计时
  useEffect(() => {
    if (nextBlock && currentBlock) {
      const time = nextBlock - currentBlock < 0 ? 0 : nextBlock - currentBlock;
      setCutDownTime(time);
    }
  }, [currentBlock, nextBlock]);

  let toastId: string | number | undefined;
  const claimRewardMutation = useMutation({
    mutationFn: async () => {
      toastId = toast.loading(t('currentlyReceiving'));
      // 调用claimReward获取数据
      const claimData = await getClaimReward(
        type,
        userAddress as `0x${string}`
      );
      if (claimData) {
        const signatureInfo = await verifySignature({
          signature: claimData.salt,
          address: typeAddressMap[type as keyof typeof typeAddressMap],
        });

        if (signatureInfo.isUsed) {
          try {
            await rewardClaimed(
              type,
              claimData.salt,
              userAddress as `0x${string}`
            );
          } catch {
            throw new Error(commonT('toast.claim_failed'));
          }
        }

        if (signatureInfo.isSignatureUsed) {
          throw new Error(commonT('toast.claim_failed'));
        }

        if (!publicClient) {
          throw new Error(commonT('toast.claim_failed'));
        }
        // 先模拟合约调用
        const { request } = await publicClient.simulateContract({
          abi: RewardPoolV7Abi as Abi,
          address: typeAddressMap[type as keyof typeof typeAddressMap],
          functionName: 'claimReward',
          args: [
            currentPeriodInfo.index,
            claimData.salt,
            claimData.account as `0x${string}`,
            claimData.amount,
            claimData.expireTime,
            claimData.signature,
          ],
          account: claimData.account as `0x${string}`,
        });

        // 模拟成功后再执行实际交易
        const hash = await writeContractAsync(request);
        const result = await publicClient.waitForTransactionReceipt({
          hash,
        });
        if (result.status === 'success') {
          await rewardClaimed(
            type,
            claimData.salt,
            userAddress as `0x${string}`
          );
          toast.success(commonT('toast.claim_success'), { id: toastId });
          return { success: true, data: result };
        } else {
          throw new Error(commonT('toast.claim_failed'));
        }
      }
    },
    onSuccess: () => {
      refetch();
      onSuccess();
      toast.dismiss(toastId);
      console.log('奖励领取成功');
    },
    onError: error => {
      toast.dismiss(toastId);
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage, { id: toastId });
      } else {
        toast.error(commonT('toast.claim_failed'), { id: toastId });
      }
      console.error('奖励领取失败:', error);
    },
  });

  const handleClaimReward = async () => {
    claimRewardMutation.mutate();
  };

  return (
    <Card>
      {/* 倒计时 */}

      {type !== 'service' && (
        <div className='flex items-center text-sm gap-2'>
          <p className='text-foreground/50'>{t('next_payout_in')}:</p>
          <CountdownDisplay blocks={BigInt(cutDownTime)} isShowDay={false} />
        </div>
      )}
      <View className='bg-[#22285E] px-4' clipDirection='topRight-bottomLeft'>
        <div className='flex items-center justify-between  py-4'>
          <div>
            <label className='text-sm font-medium text-white'>
              {t('amount')}
            </label>
            <div className='flex gap-2 text-white font-mono text-3xl'>
              {formatNumbedecimalScale(rewardData?.unclaimedAmount || 0, 6)}
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <RoundedLogo />
            <span className='text-white font-mono'>OLY</span>
          </div>
        </div>
      </View>
      {/* 信息提示 */}
      {Number(rewardData?.ratio || 0) > 0 ? (
        Number(rewardData?.ratio || 0) < 6 ? (
          <Notification>
            {t.rich('max_bonus_info', {
              rate: `x${rewardData?.ratio || 0}`,
              highlight: chunks => <span className='text-white'>{chunks}</span>,
            })}
          </Notification>
        ) : (
          <Notification>{t('max_bonus_info_max')}</Notification>
        )
      ) : (
        <></>
      )}

      {/* 释放期限选择 */}
      <Select
        onValueChange={value => {
          const periodItem = _.find(periodListData?.periodList || [], {
            day: Number(value),
          });
          const index = (periodListData?.periodList || []).findIndex(
            it => Number(it.day) === Number(value)
          );
          if (periodItem) {
            setCurrentPeriodInfo({
              index,
              day: periodItem.day ?? 0,
              feeRate: Number(periodItem.feeRate || 0),
              feeRecipient: periodItem.feeRecipient ?? '',
              rate: periodItem.rate ?? '0%',
              releasedBlocks: String(periodItem.releasedBlocks) ?? '',
            });
          } else {
            setCurrentPeriodInfo(defaultPeriodInfo);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t('select_release_period')} />
        </SelectTrigger>
        <SelectContent>
          {periodListData?.periodList?.map(item => (
            <SelectItem
              key={item.day}
              value={String(item.day)}
            >{`${item.day} ${tStaking('days')}`}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ClaimSummary
        data={{
          amount:
            Number(rewardData?.unclaimedAmount || 0) *
            ((100 - currentRate) / 100),
          taxRate: currentRate,
          incomeTax: Number(rewardData?.unclaimedAmount) * (currentRate / 100),
        }}
      />
      {/* 领取按钮 */}
      <Button
        clipDirection='topRight-bottomLeft'
        disabled={
          Number(rewardData?.unclaimedAmount || 0) === 0 ||
          currentPeriodInfo?.day < 5 ||
          claimRewardMutation.isPending
        }
        onClick={handleClaimReward}
      >
        {claimRewardMutation.isPending ? commonT('claiming') : t('claim')}
      </Button>
    </Card>
  );
};

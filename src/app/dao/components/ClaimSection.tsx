import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import _ from 'lodash';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { usePeriods } from '~/hooks/userPeriod';
import { claimReward, rewardClaimed } from '~/services/auth/dao';
import { dayjs, formatte2Num } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import {
  Card,
  Button,
  Notification,
  View,
  RoundedLogo,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components';
import { ClaimSummary } from '~/widgets/claim-summary';
import CountdownTimer from '~/app/staking/unstake/component/countDownTimer';

interface PeriodInfo {
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
}

const defaultPeriodInfo = {
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
}: ClaimSectionProps) => {
  const t = useTranslations('dao');
  const commonT = useTranslations('common');
  const tStaking = useTranslations('staking');
  const { userAddress } = useUserAddress();
  const periodListData = usePeriods();
  const [currentPeriodInfo, setCurrentPeriodInfo] =
    useState<PeriodInfo>(defaultPeriodInfo);
  const [currentRate, setCurrentRate] = useState<number>(0);
  // const [cutDownTime, setCutDownTime] = useState<number>(0);
  const {
    time,
    lastStakeTimestamp,
    // nextBlock,
    // currentBlock,
  } = useNolockStore();

  useEffect(() => {
    setCurrentRate(Number(currentPeriodInfo?.rate?.split('%')[0]));
  }, [currentPeriodInfo]);

  //计算rebase倒计时
  // useEffect(() => {
  //   if (nextBlock && currentBlock) {
  //     const time = nextBlock - currentBlock < 0 ? 0 : nextBlock - currentBlock + 600
  //     setCutDownTime(time);
  //   }
  // }, [currentBlock, nextBlock]);

  let toastId: string | number | undefined;
  const claimRewardMutation = useMutation({
    mutationFn: async () => {
      toastId = toast.loading(t('currentlyReceiving'));
      // 调用claimReward获取数据
      const claimData = await claimReward(type, userAddress as `0x${string}`);
      // 在claimReward成功后，将结果传递给rewardClaimed
      const claimedData = await rewardClaimed(
        claimData,
        type,
        userAddress as string
      );
      return { claimData, claimedData };
    },
    onSuccess: data => {
      toast.dismiss(toastId);
      toast.success(t('toast.claim_success'), { id: toastId });
      console.log('奖励领取成功:', data);
      refetch();
    },
    onError: error => {
      toast.dismiss(toastId);
      toast.error(error.message || t('toast.claim_failed'), { id: toastId });
      console.error('奖励领取失败:', error);
    },
  });

  const handleClaimReward = () => {
    claimRewardMutation.mutate();
  };

  return (
    <Card>
      {/* 倒计时 */}
      <div className='flex items-center text-sm gap-2'>
        <p className='text-foreground/50'>{t('next_payout_in')}:</p>
        {lastStakeTimestamp > 0 ? (
          <CountdownTimer
            time={dayjs(time).add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')}
          />
        ) : (
          <CountdownTimer time={String(0)} />
        )}
      </div>
      <View className='bg-[#22285E] px-4' clipDirection='topRight-bottomLeft'>
        <div className='flex items-center justify-between  py-4'>
          <div>
            <label className='text-sm font-medium text-white'>
              {t('amount')}
            </label>
            <div className='flex gap-2 text-white font-mono text-3xl'>
              {formatte2Num.format(rewardData?.unclaimedAmount || 0)}
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <RoundedLogo />
            <span className='text-white font-mono'>OLY</span>
          </div>
        </div>
      </View>
      {/* 信息提示 */}
      <Notification>
        {t.rich('max_bonus_info', {
          rate: `x${rewardData?.ratio || 0}`,
          highlight: chunks => <span className='text-white'>{chunks}</span>,
        })}
      </Notification>

      {/* 释放期限选择 */}
      <Select
        onValueChange={value => {
          const periodItem = _.find(periodListData?.periodList || [], {
            day: Number(value),
          });
          if (periodItem) {
            setCurrentPeriodInfo({
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

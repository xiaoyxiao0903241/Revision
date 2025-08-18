import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { Abi } from 'viem';
import { usePublicClient } from 'wagmi';
import { Button, View } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { cn } from '~/lib/utils';
import { yieldLocker } from '~/wallet/constants/tokens';
import YielodLockAbi from '~/wallet/constants/YielodLockAbi.json';

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
  const t = useTranslations('coolingPool');
  const t2 = useTranslations('common');
  const tStaking = useTranslations('staking');
  const publicClient = usePublicClient();
  const { userAddress } = useUserAddress();
  const [current, setCurrent] = useState<number>(10000);
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const pageSize = 10;
  const [isDisabled, setIsDisabled] = useState(false);

  const claimReward = async () => {
    if (!publicClient || !userAddress) return;
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    setCurrent(data.period);
    try {
      const hash = await writeContractAsync({
        abi: YielodLockAbi as Abi,
        address: yieldLocker as `0x${string}`,
        functionName: 'claimForIndex',
        args: [data.periodIndex],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t2('toast.claim_success'), {
          id: toastId,
        });
        await queryClient.invalidateQueries({
          queryKey: ['getRewardList', userAddress],
        });
        await queryClient.invalidateQueries({
          queryKey: ['getRewardRecord', userAddress, 1, pageSize],
        });
      } else {
        toast.error(t2('toast.claim_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error('error', {
        id: toastId,
      });
    } finally {
      setIsDisabled(false);
      setCurrent(10000);
    }
  };
  return (
    <View
      className='bg-[#22285E] px-4 py-6'
      clipDirection='topLeft-bottomRight'
      clipSize={16}
    >
      <div className={cn('flex gap-2 md:flex-col items-center')}>
        {/* 动画齿轮图标 */}
        <div className='flex flex-col  items-center'>
          <div
            className={cn(
              'w-full  aspect-square flex items-center justify-center p-4'
            )}
          >
            {children}
          </div>

          {/* 已释放数量 */}
          <div
            className={cn(
              'text-base md:text-2xl font-bold font-mono',
              data.className
            )}
          >
            {data.claimable}
          </div>
          <div className='text-sm text-foreground/50'>{t('released')}</div>
        </div>
        <div className='w-full'>
          {/* 等待释放数量 */}
          <div className='flex w-full items-center justify-between my-2'>
            <div className='text-sm text-foreground/50'>
              {t('waitingToBeReleased')}
            </div>
            <div className='text-sm font-mono text-white'>{data.waiting}</div>
          </div>
          {/* 进度条 */}
          <div className='bg-foreground/20 w-full h-2 rounded-full overflow-hidden'>
            <div
              className={cn(
                'h-full relative overflow-hidden',
                data.bgClassName
              )}
              style={{
                width: `${data.waitingPercent}%`,
              }}
            >
              {/* 斜纹效果 */}
              <div
                className={cn(
                  'absolute inset-0',
                  data.active && 'animate-stripes'
                )}
                style={{
                  width: 'calc(100% + 8px)',
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
          <div className='text-sm font-mono text-white text-center mt-2'>
            {data.waitingPercent.toFixed(2)}%
          </div>
          {/* 周期 */}
          <div className='flex w-full items-center justify-between my-2'>
            <div className='text-sm text-foreground/50'>{t('period')}</div>
            <div className='text-sm font-mono text-white'>
              {data.period}
              {tStaking('days')}
            </div>
          </div>

          {/* 领取按钮 */}
          <Button
            className='w-full h-8 md:h-12'
            disabled={
              data.disabled || isDisabled || Number(data.claimable) < 0.0001
            }
            onClick={claimReward}
            clipDirection='topLeft-bottomRight'
          >
            {current === data.period ? t2('claiming') : t2('claim')}
          </Button>
        </div>
      </div>
    </View>
  );
};

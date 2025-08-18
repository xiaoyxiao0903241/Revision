import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi, erc20Abi, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import { Alert, Button, Card } from '~/components';
import ConnectWalletButton from '~/components/web3/ConnectWalletButton';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { formatNumbedecimalScale } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import longStakingAbi from '~/wallet/constants/LongStakingAbi.json';
import { OLY } from '~/wallet/constants/tokens';
import { getInviteInfo } from '~/wallet/lib/web3/invite';
import type { periodlongItem } from '~/wallet/lib/web3/stake';
import {
  depositDayList,
  longAllowance,
  longStakList,
  longStakStatus,
  roi,
} from '~/wallet/lib/web3/stake';
import { WalletSummaryLock } from '~/widgets';
import { AmountCard } from '~/widgets/amount-card';
import { DurationSelect } from '~/widgets/select';
import { StakingSummary } from '~/widgets/staking-summary';
import LockStakingLayout from './layout';

export default function StakingPage() {
  const t = useTranslations('staking');
  const t2 = useTranslations('common');
  const tLockedStaking = useTranslations('lockedStaking');
  const [lockIndex, setLockIndex] = useState<number>(100);
  const { userAddress } = useUserAddress();
  const [periodLongList, setPeriodLongList] = useState<periodlongItem[]>([]);
  const [curPeriod, setCurPeriod] = useState<periodlongItem | null>(null);
  const {
    olyBalance,
    olyPrice,
    allnetReabalseNum,
    AllolyStakeNum,
    nextBlock,
    currentBlock,
  } = useNolockStore();
  const [stakeAmount, setStakeAmount] = useState('');
  const [myolybalance, seMyolybalance] = useState<string>('0');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();
  const [apy, setApy] = useState<string>('0');
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const { handleContractError, isContractError } = useContractError();

  //获取长期质押状态列表
  const { data: stakingStatusList } = useQuery({
    queryKey: ['getLongStakStatus', userAddress],
    queryFn: () => longStakStatus(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 33000,
  });

  //获取长期质押授权OLY数量列表
  const { data: longAllowanceList } = useQuery({
    queryKey: ['getLongAllowanceList', userAddress],
    queryFn: () => longAllowance({ address: userAddress as string }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 31000,
  });

  //长期质押列表
  const { data: longStakListData } = useQuery({
    queryKey: ['getLongStakListData', userAddress],
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
    queryKey: ['inviteInfo', userAddress],
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
      toast.error(t('insufficient_amount'));
      return;
    }
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: OLY as `0x${string}`,
        functionName: 'approve',
        args: [
          stakToken as `0x${string}`,
          parseUnits(Number.MAX_SAFE_INTEGER.toString(), 9),
        ],
      });

      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t('approve_success'));
        await queryClient.invalidateQueries({
          queryKey: ['getLongAllowanceList', userAddress],
        });
        // changeApproveData(index);
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        toast.error('error');
        console.log(error);
      }
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
      toast.warning(t('invite_not_active'));
      return;
    }
    const stakToken = depositDayList[index].token;
    if (Number(stakeAmount) <= 0) {
      toast.error(t('insufficient_amount'));
      return;
    }
    if (Number(myolybalance) < Number(setStakeAmount)) {
      toast.error(t('insufficient_amount'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const hash = await writeContractAsync({
        abi: longStakingAbi as Abi,
        address: stakToken as `0x${string}`,
        functionName: 'stake',
        args: [parseUnits(stakeAmount, 9)],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t('stake_success'), {
          id: toastId,
        });
        await queryClient.invalidateQueries({
          queryKey: ['UserStakes', userAddress],
        });
        await queryClient.invalidateQueries({
          queryKey: ['olyBalance', userAddress],
        });
        setStakeAmount('');
      } else {
        toast.error(t('stake_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage, {
          id: toastId,
        });
      } else {
        toast.error('error', {
          id: toastId,
        });
        console.log(error);
      }
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
        rate: roi()[index].rate,
        balance: '0',
        isApprove: false,
        tvl: formatNumbedecimalScale(it.amount, 2),
        status: stakingStatusList[index].status,
        allowanceNum: longAllowanceList[index].allowanceNum,
      })) as periodlongItem[];
      setPeriodLongList(updatedList);
      console.log(updatedList, 'updatedList');
      if (lockIndex !== 100) {
        setCurPeriod(updatedList[lockIndex]);
      }
    }
  }, [longStakListData, stakingStatusList, longAllowanceList, lockIndex]);

  //余额
  useEffect(() => {
    const myBalance = formatNumbedecimalScale(olyBalance, 2);
    seMyolybalance(myBalance);
  }, [olyBalance]);

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
  }, [currentBlock, nextBlock]);
  return (
    <LockStakingLayout>
      <div className='space-y-6'>
        <Alert
          icon='stake'
          title={tLockedStaking('alertTitle')}
          description={tLockedStaking('alertDescription')}
        />

        {/* 主要内容区域 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <Card>
              <DurationSelect
                options={periodLongList || []}
                value={lockIndex}
                placeholder={t('selectDurationPlaceholder')}
                onChange={value => {
                  setLockIndex(value);
                  setCurPeriod(periodLongList[value]);
                }}
              />
              <AmountCard
                data={{
                  value: stakeAmount,
                  desc: Number(stakeAmount) * olyPrice,
                  balance: (myolybalance && Number(myolybalance)) || 0,
                }}
                onChange={value => {
                  setStakeAmount(value);
                }}
                description={t('balance')}
              />
              <StakingSummary
                data={{
                  rebaseRewardRate: (curPeriod && curPeriod?.rate) || '0.3%-1%',
                  rebaseBoost:
                    (curPeriod && curPeriod?.addition) || '0.02-0.04',
                  nextRebaseRewardRate: apy + '%',
                  cutDownTime: cutDownTime,
                }}
              />
              {!userAddress ? (
                <ConnectWalletButton className='text-xl py-3 cursor-pointer px-6 !text-white text-5  h-[48px] min-w-[160px]   mx-auto' />
              ) : (
                <div className='flex items-center justify-center w-full gap-x-4'>
                  {curPeriod &&
                    !curPeriod.isApprove &&
                    (curPeriod.allowanceNum === 0 ||
                      Number(curPeriod.allowanceNum) < Number(stakeAmount)) && (
                      <Button
                        clipDirection='topRight-bottomLeft'
                        className='font-mono w-[50%]'
                        variant={
                          isDisabled ||
                          Number(stakeAmount) === 0 ||
                          Number(myolybalance) === 0 ||
                          !curPeriod.status
                            ? 'disabled'
                            : 'primary'
                        }
                        disabled={
                          isDisabled ||
                          Number(stakeAmount) === 0 ||
                          Number(myolybalance) === 0 ||
                          !curPeriod.status
                        }
                        onClick={() => {
                          handApprove(lockIndex);
                        }}
                      >
                        {isLoading ? t('approving') : t('approve')}
                      </Button>
                    )}
                  {
                    <Button
                      clipDirection='topRight-bottomLeft'
                      className='font-mono flex-1'
                      variant={
                        isDisabled ||
                        Number(curPeriod?.allowanceNum) === 0 ||
                        Number(curPeriod?.allowanceNum) < Number(stakeAmount) ||
                        Number(stakeAmount) === 0 ||
                        Number(myolybalance) === 0
                          ? 'disabled'
                          : 'primary'
                      }
                      disabled={
                        isDisabled ||
                        Number(curPeriod?.allowanceNum) === 0 ||
                        Number(curPeriod?.allowanceNum) < Number(stakeAmount) ||
                        Number(stakeAmount) === 0 ||
                        Number(myolybalance) === 0
                      }
                      onClick={() => {
                        staking(lockIndex);
                      }}
                    >
                      {isLoading &&
                      Number(curPeriod?.allowanceNum) > 0 &&
                      Number(curPeriod?.allowanceNum) > Number(stakeAmount)
                        ? t('staking')
                        : t('stake')}
                    </Button>
                  }
                </div>
              )}
            </Card>
          </div>
          <div>
            <WalletSummaryLock />
          </div>
        </div>
      </div>
    </LockStakingLayout>
  );
}

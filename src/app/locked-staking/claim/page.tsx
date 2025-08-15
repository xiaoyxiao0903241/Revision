'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import { Alert, Button, Card, Notification, Segments } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { usePeriods } from '~/hooks/userPeriod';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { getCurrentBlock } from '~/lib/multicall';
import { formatNumbedecimalScale } from '~/lib/utils';
import { useLockStore } from '~/store/lock';
import longStaking from '~/wallet/constants/LongStakingAbi.json';
import NodeStakingAbi from '~/wallet/constants/NodeStaking.json';
import { blocks as blocksNum, nodeStaking } from '~/wallet/constants/tokens';
import type { StakingItem } from '~/wallet/lib/web3/stake';
import {
  depositDayList,
  getNodeStakes,
  getUserStakes,
} from '~/wallet/lib/web3/stake';
import { WalletSummary } from '~/widgets';
import { AmountCard } from '~/widgets/amount-card';
import { ClaimSummary } from '~/widgets/claim-summary';
import { ClaimSelect, DurationSelect } from '~/widgets/select-lockMyList';
import { useContractError } from '~/hooks/useContractError';

export default function ClaimPage() {
  const t = useTranslations('staking');
  const tLockedStaking = useTranslations('lockedStaking');
  const t2 = useTranslations('common');
  const { periodList } = usePeriods();
  const [selectedClaimType, setSelectedClaimType] =
    useState<string>('rebaseReward');
  const { olyPrice } = useLockStore();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const { userAddress } = useUserAddress();
  const [stakList, setstakList] = useState<StakingItem[]>([]);
  const [curStakeItem, setCurStakeItem] = useState<StakingItem>();
  const [lockIndex, setLockIndex] = useState<'' | number>('');
  const [lockClaimIndex, setLockClaimIndex] = useState<number>(0);
  const [rate, setRate] = useState(0);
  const [rewardAmount, setRewardAmount] = useState('');
  const [boostAmount, setBoostAmount] = useState('');
  const [reciveAmount, setReciveAmount] = useState(0);
  const [rateAmount, setRateAmount] = useState(0);
  const publicClient = usePublicClient();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { handleContractError, isContractError } = useContractError();

  // 定义领取类型选项
  const claimOptions = [
    { value: 'rebaseReward', label: t('rebaseReward') },
    { value: 'rebaseBoost', label: t('rebaseBoost') },
  ];

  //质押列表
  const { data: myStakingList } = useQuery({
    queryKey: ['UserStakes', userAddress],
    queryFn: () => getUserStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 42000,
  });
  //当前块
  const { data: currentBlock } = useQuery({
    queryKey: ['currentBlock'],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
  });
  //节点质押
  const { data: myNodeStakingList } = useQuery({
    queryKey: ['UserNodeStakes', userAddress],
    queryFn: () => getNodeStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });

  //领取长期质押奖励
  const claimReward = async (index: number, type: string) => {
    if (!publicClient || !userAddress) return;
    const stakTokenInfo = depositDayList.find(item => item.day === type);
    if (!stakTokenInfo) {
      toast.error(t('noType'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: longStaking as Abi,
        address: stakTokenInfo?.token as `0x${string}`,
        functionName: 'claimInterest',
        args: [index, parseUnits(rewardAmount, 9).toString(), lockClaimIndex],
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
          queryKey: ['UserStakes', userAddress],
        });
        await queryClient.invalidateQueries({
          queryKey: ['longStakHisData', 1, userAddress],
        });
      } else {
        toast.error(t2('toast.claim_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        console.log(error);
        toast.error('error', {
          id: toastId,
        });
      }
    } finally {
      setIsDisabled(false);
    }
  };

  //node 爆块奖励
  const claimNodeReward = async () => {
    if (!publicClient || !userAddress) return;
    if (curStakeItem && curStakeItem.blockReward === 0) {
      toast.warning(t('noRward'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: NodeStakingAbi as Abi,
        address: nodeStaking as `0x${string}`,
        functionName: 'claimInterest',
        args: [parseUnits(rewardAmount, 9).toString(), lockClaimIndex],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t2('toast.claim_success'), {
          id: toastId,
        });

        queryClient.invalidateQueries({
          queryKey: ['UserNodeStakes', userAddress],
        });
      } else {
        toast.error(t2('toast.claim_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        console.log(error);
        toast.error('error', {
          id: toastId,
        });
      }
    } finally {
      setIsDisabled(false);
    }
  };

  //加成收益
  const claimInerest = async (index: number, type: string) => {
    if (!publicClient || !userAddress) return;

    const stakTokenInfo = depositDayList.find(item => item.day === type);
    if (!stakTokenInfo) {
      toast.error(t('noType'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: longStaking as Abi,
        address: stakTokenInfo?.token as `0x${string}`,
        functionName: 'claimExtraInterest',
        args: [index, parseUnits(boostAmount, 9).toString(), lockClaimIndex],
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
          queryKey: ['UserStakes', userAddress],
        });
      } else {
        toast.error(t2('toast.claim_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        console.log(error);
        toast.error('error', {
          id: toastId,
        });
      }
    } finally {
      setIsDisabled(false);
    }
  };

  // 当前长期质押的数据
  useEffect(() => {
    const updateList = async () => {
      if (
        (myStakingList?.myStakingList || myNodeStakingList?.length) &&
        currentBlock &&
        blocksNum
      ) {
        const list =
          (myStakingList?.myStakingList.length &&
            (myStakingList?.myStakingList as StakingItem[])) ||
          [];
        const nodeList = myNodeStakingList?.length
          ? (myNodeStakingList as StakingItem[])
          : [];
        const curBlock = Number(currentBlock);
        const allList = [...nodeList, ...list];
        const updatedList = allList.map(it => ({
          ...it,
          time: String(
            Number(it.expiry) - curBlock < 0
              ? '0'
              : Number(it.expiry) - curBlock
          ),
          isShow: false,
        }));
        console.log(updatedList, 'updatedList99999');
        setstakList(updatedList);
        if (lockIndex != '') {
          setCurStakeItem(updatedList[lockIndex]);
        }
      }
    };
    updateList();
  }, [
    myStakingList?.myStakingList,
    currentBlock,
    myNodeStakingList,
    lockIndex,
  ]);
  useEffect(() => {
    if (periodList?.length) {
      setRate(Number(periodList[lockClaimIndex].rate.split('%')[0]));
    }
  }, [periodList, lockClaimIndex]);

  useEffect(() => {
    if (selectedClaimType === 'rebaseReward') {
      if (Number(rewardAmount) > 0) {
        const reciveNum = (Number(rewardAmount) * (100 - rate)) / 100;
        const rateNum = Number(rewardAmount) * (rate / 100);
        setReciveAmount(reciveNum);
        setRateAmount(rateNum);
      }
    } else {
      if (Number(boostAmount) > 0) {
        const reciveNum = (Number(boostAmount) * (100 - rate)) / 100;
        const rateNum = Number(boostAmount) * (rate / 100);
        setReciveAmount(reciveNum);
        setRateAmount(rateNum);
      }
    }
  }, [selectedClaimType, rewardAmount, boostAmount, rate]);

  return (
    <div className='space-y-6'>
      <Alert
        icon='claim'
        title={t('claimTitle')}
        description={t('claimDescription')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='space-y-6'>
          {/* 分段控制器 */}
          <Card>
            <Segments
              options={claimOptions}
              value={selectedClaimType}
              onChange={setSelectedClaimType}
            />
            <DurationSelect
              options={stakList}
              value={lockIndex}
              onChange={value => {
                const curItem = stakList[value];
                setCurStakeItem(curItem);
                setLockIndex(value);
              }}
            />
            <AmountCard
              data={{
                value:
                  selectedClaimType === 'rebaseReward'
                    ? rewardAmount
                    : boostAmount,
                desc:
                  selectedClaimType === 'rebaseReward'
                    ? Number(curStakeItem?.blockReward || 0) * olyPrice
                    : Number(curStakeItem?.interest || 0) * olyPrice,
                balance:
                  selectedClaimType === 'rebaseReward'
                    ? curStakeItem
                      ? Number(
                          formatNumbedecimalScale(curStakeItem?.blockReward, 2)
                        )
                      : 0
                    : curStakeItem
                      ? Number(formatNumbedecimalScale(curStakeItem?.interest))
                      : 0,
              }}
              onChange={value => {
                if (selectedClaimType === 'rebaseReward') {
                  if (Number(value) > Number(curStakeItem?.blockReward)) {
                    setRewardAmount(
                      curStakeItem?.blockReward?.toString() || '0'
                    );
                  } else {
                    setRewardAmount(value);
                  }
                } else {
                  if (Number(value) > Number(curStakeItem?.interest)) {
                    setBoostAmount(curStakeItem?.interest?.toString() || '0');
                  } else {
                    setBoostAmount(value);
                  }
                }
              }}
              description={'余额'}
            />
            <Notification>{tLockedStaking('claimInfo')}</Notification>
            <ClaimSelect
              options={periodList || []}
              value={lockClaimIndex}
              onChange={value => {
                if (periodList) {
                  setRate(Number(periodList[value].rate.split('%')[0]));
                }
                setLockClaimIndex(value);
              }}
            />
            <ClaimSummary
              data={{
                amount: reciveAmount,
                taxRate: rate,
                incomeTax: rateAmount,
              }}
            />

            {/* 领取按钮 */}
            {selectedClaimType === 'rebaseReward' && (
              <Button
                clipDirection='topRight-bottomLeft'
                className='w-full'
                variant={
                  (curStakeItem && curStakeItem.blockReward < 0.01) ||
                  isDisabled ||
                  curStakeItem?.blockReward === 0 ||
                  Number(rewardAmount) === 0
                    ? 'disabled'
                    : 'primary'
                }
                disabled={
                  (curStakeItem && curStakeItem.blockReward < 0.01) ||
                  isDisabled ||
                  curStakeItem?.blockReward === 0 ||
                  Number(rewardAmount) === 0
                }
                onClick={() => {
                  if (curStakeItem && curStakeItem.type === 'longStake') {
                    claimReward(curStakeItem.index, curStakeItem.period);
                  } else {
                    claimNodeReward();
                  }
                }}
              >
                {t('claimTitle')}
              </Button>
            )}
            {selectedClaimType === 'rebaseBoost' && (
              <Button
                clipDirection='topRight-bottomLeft'
                className='w-full'
                variant={
                  (curStakeItem && curStakeItem.interest < 0.01) ||
                  isDisabled ||
                  curStakeItem?.interest === 0 ||
                  Number(boostAmount) === 0
                    ? 'disabled'
                    : 'primary'
                }
                disabled={
                  (curStakeItem && curStakeItem.interest < 0.01) ||
                  isDisabled ||
                  curStakeItem?.interest === 0 ||
                  Number(boostAmount) === 0
                }
                onClick={() => {
                  if (curStakeItem) {
                    claimInerest(curStakeItem.index, curStakeItem.period);
                  }
                }}
              >
                {curStakeItem?.type == 'nodeStake'
                  ? t('nobkRward')
                  : t('claim')}
              </Button>
            )}
          </Card>
        </div>

        {/* 右侧钱包摘要 */}
        <div>
          <WalletSummary />
        </div>
      </div>
    </div>
  );
}

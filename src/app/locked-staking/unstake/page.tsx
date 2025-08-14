'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi } from 'viem';
import { usePublicClient } from 'wagmi';
import {
  Alert,
  Button,
  Card,
  CountdownDisplay,
  Notification,
} from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { getCurrentBlock } from '~/lib/multicall';
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
import { AmountTicker } from '~/widgets/amount-ticker';
import { DurationSelect } from '~/widgets/select-lockMyList';

export default function UnstakePage() {
  const t = useTranslations('staking');
  const tLockedStaking = useTranslations('lockedStaking');
  const t2 = useTranslations('common');
  const { userAddress } = useUserAddress();
  const [stakList, setstakList] = useState<StakingItem[]>([]);
  const [curStakeItem, setCurStakeItem] = useState<StakingItem>();
  const [lockIndex, setLockIndex] = useState<'' | number>('');
  const { olyPrice } = useLockStore();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();
  const { handleContractError, isContractError } = useContractError();

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

  //领取长期本金
  const claimLongPending = async (type: string) => {
    if (!publicClient || !userAddress) return;
    //长期质押

    if (curStakeItem && curStakeItem.claimableBalance === 0) {
      toast.warning(t('no_claimable'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    setIsLoading(true);
    try {
      const stakTokenInfo = depositDayList.find(item => item.day === type);
      if (!stakTokenInfo) {
        toast.error(t('noType'), { id: toastId });
        return;
      }
      const hash = await writeContractAsync({
        abi: longStaking as Abi,
        address: stakTokenInfo?.token as `0x${string}`,
        functionName: 'unstakePrincipal',
        args: [curStakeItem && curStakeItem.index],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t2('toast.unpledge_sucess'), {
          id: toastId,
        });
        await queryClient.invalidateQueries({
          queryKey: ['UserStakes', userAddress],
        });
      } else {
        toast.error(t2('toast.unpledge_fail'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        toast.error('error', {
          id: toastId,
        });
        console.log(error);
      }
    } finally {
      setIsDisabled(false);
      setIsLoading(false);
    }
  };
  // node提取本金
  const claimNodePending = async () => {
    if (!publicClient || !userAddress) return;
    setIsDisabled(true);
    setIsLoading(true);
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    try {
      const hash = await writeContractAsync({
        abi: NodeStakingAbi as Abi,
        address: nodeStaking as `0x${string}`,
        functionName: 'unstakePrincipal',
        args: [],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t2('toast.unpledge_sucess'), {
          id: toastId,
        });

        queryClient.invalidateQueries({
          queryKey: ['UserNodeStakes', 1, userAddress],
        });
      } else {
        toast.error(t2('toast.unpledge_fail'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        toast.error('error', {
          id: toastId,
        });
        console.log(error);
      }
    } finally {
      setIsDisabled(false);
      setIsLoading(false);
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
  return (
    <div className='space-y-6'>
      <Alert
        icon='unstake'
        title={t('unstakeTitle')}
        description={tLockedStaking('unstakeDescription')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div>
          <Card>
            <DurationSelect
              options={stakList}
              value={lockIndex}
              onChange={value => {
                const curItem = stakList[value];
                setCurStakeItem(curItem);
                setLockIndex(value);
              }}
            />
            <AmountTicker
              data={{
                title: tLockedStaking('pendingAmount'),
                value: (curStakeItem && Number(curStakeItem?.pending)) || 0,
                desc:
                  (curStakeItem && Number(curStakeItem?.pending) * olyPrice) ||
                  0,
              }}
              disabled
            >
              {curStakeItem && (
                <CountdownDisplay
                  blocks={BigInt(Number(curStakeItem.time))}
                ></CountdownDisplay>
              )}
            </AmountTicker>
            <AmountTicker
              data={{
                title: tLockedStaking('releasedAmount'),
                value:
                  (curStakeItem && Number(curStakeItem?.claimableBalance)) || 0,
                desc:
                  (curStakeItem &&
                    Number(curStakeItem?.claimableBalance) * olyPrice) ||
                  0,
              }}
            >
              {curStakeItem && (
                <Button
                  clipDirection='topRight-bottomLeft'
                  className='font-mono w-40'
                  variant={
                    isDisabled || Number(curStakeItem.claimableBalance) < 0.01
                      ? 'disabled'
                      : 'primary'
                  }
                  disabled={
                    isDisabled || Number(curStakeItem.claimableBalance) < 0.01
                  }
                  onClick={() => {
                    if (curStakeItem && curStakeItem.type === 'longStake') {
                      claimLongPending(curStakeItem.period);
                    } else {
                      claimNodePending();
                    }
                  }}
                >
                  {isLoading ? t('unpledgeing') : t('unpledge')}
                </Button>
              )}
            </AmountTicker>
            {/* 信息提示 */}
            <Notification>{tLockedStaking('unstakeInfo')}</Notification>
          </Card>
        </div>
        <div>
          <WalletSummary />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '~/components';
import { formatNumbedecimalScale } from '~/lib/utils';
import { TurbineCard } from '~/widgets/turbine-card';
import { ClaimTicker } from '~/widgets';
import { receiveList } from '~/wallet/lib/web3/turbine';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { turbine } from '~/wallet/constants/tokens';
import { toast } from 'sonner';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { getCurrentBlock } from '~/lib/multicall';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import TurbineAbi from '~/wallet/constants/TurbineAbi.json';
import { Abi } from 'viem';
import { turbineMess } from '~/services/auth/turbine';

interface ReciveItem extends Record<string, unknown> {
  amount: string;
  isLockOver: boolean;
  lastBlock: number;
  index: number;
  vestingTerm: number;
}
interface Props {
  unitPrice: number;
}
export const ReciveTable = ({ unitPrice }: Props) => {
  const t = useTranslations('reciveTable');
  const t2 = useTranslations('turbine');
  const { userAddress } = useUserAddress();
  const [myReciveList, setMyReciveList] = useState<ReciveItem[]>([]);
  const publicClient = usePublicClient();
  const [current, setCurrent] = useState<number>(10000);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();

  //当前块的高度
  const { data: currentBlock } = useQuery({
    queryKey: ['currentBlock'],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
  });

  //列表
  const { data: ReceiveList } = useQuery({
    queryKey: ['userReceiveList', userAddress],
    queryFn: () => receiveList({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 24000,
  });

  //统计已领取和进入涡轮的数量
  const { data: turbineMessOp } = useQuery({
    queryKey: ['getTurbineMess', userAddress],
    queryFn: async () => {
      if (!userAddress) {
        throw new Error('Missing address');
      }
      const response = await turbineMess(userAddress);
      return response || [];
    },
    enabled: !!userAddress,
    retry: 1,
    retryDelay: 42000,
  });

  //领取本金
  const claim = async (item: ReciveItem) => {
    if (!publicClient || !userAddress) return;
    if (item.amount === '0') {
      toast.warning(t('toast.no_claimable'));
      return;
    }
    const toastId = toast.loading(t('toast.confirm_in_wallet'));
    setCurrent(item.index);
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: TurbineAbi as Abi,
        address: turbine as `0x${string}`,
        functionName: 'redeemSilence',
        args: [userAddress, item.index],
      });
      toast.loading(t('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t('toast.claim_success'), {
          id: toastId,
        });
        queryClient.invalidateQueries({
          queryKey: ['getTurbineRecord', 1, userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: ['currentBlock'],
        });
        queryClient.invalidateQueries({
          queryKey: ['userReceiveList', userAddress],
        });
        queryClient.invalidateQueries({
          queryKey: ['getTurbineMess', userAddress],
        });
      } else {
        toast.error(t('toast.claim_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error('error', {
        id: toastId,
      });
    } finally {
      setCurrent(10000);
      setIsDisabled(false);
    }
  };

  useEffect(() => {
    if (ReceiveList?.length) {
      setMyReciveList(ReceiveList.reverse());
    } else {
      setMyReciveList([]);
    }
    console.log(ReceiveList, 'ReceiveList111');
  }, [ReceiveList]);

  return (
    <Card
      className='flex flex-col gap-4 pb-6 pt-10 px-[2px]'
      containerClassName='flat-body'
    >
      {myReciveList.map((item, index) => (
        <div className='flex flex-col' key={index}>
          <ClaimTicker
            index={item.index}
            current={current}
            isDisabled={isDisabled}
            currentBlock={currentBlock ? currentBlock : 0}
            lockedAmount={formatNumbedecimalScale(item.amount, 4)}
            isLockOver={item.isLockOver}
            vestingTerm={item.vestingTerm}
            lastBlock={item.lastBlock}
            usdValue={formatNumbedecimalScale(
              Number(item.amount) * unitPrice,
              2
            )}
            onClaim={() => {
              claim(item);
            }}
          />
          <div className='h-2 bg-[#131420] w-full mt-4'></div>
        </div>
      ))}
      <TurbineCard
        lockedAmount={
          turbineMessOp
            ? formatNumbedecimalScale(turbineMessOp.receivedAmount, 4)
            : 0
        }
        title={t2('reciveNum')}
        usdValue={formatNumbedecimalScale(
          Number(turbineMessOp ? turbineMessOp.receivedAmount : 0) * unitPrice,
          2
        )}
        onClick={() => {}}
      />
      <div className='border-t mx-4 border-foreground/20'></div>
      <TurbineCard
        lockedAmount={
          turbineMessOp
            ? formatNumbedecimalScale(turbineMessOp.claimedAmount, 4)
            : 0
        }
        title={t2('claimNum')}
        usdValue={formatNumbedecimalScale(
          Number(turbineMessOp ? turbineMessOp.claimedAmount : 0) * unitPrice,
          2
        )}
      />
    </Card>
  );
};

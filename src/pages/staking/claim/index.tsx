import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Abi, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';
import { Alert, Button, Card, Notification } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import { formatNumbedecimalScale } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import DemandStakingAbi from '~/wallet/constants/DemandStakingAbi.json';
import { demandStaking } from '~/wallet/constants/tokens';
import type { periodItem } from '~/wallet/lib/web3/claim';
import { getClaimPeriod } from '~/wallet/lib/web3/claim';
import { WalletSummary } from '~/widgets';
import { AmountCard } from '~/widgets/amount-card';
import { ClaimSummary } from '~/widgets/claim-summary';
import { DurationSelect } from '~/widgets/select';
import StakingLayout from '../layout';

interface StakInfo {
  stakNum: number;
}
export default function ClaimPage() {
  const t = useTranslations('staking');
  const t2 = useTranslations('common');
  const { demandProfitInfo, olyPrice, hotDataStakeNum } = useNolockStore();
  const tNoLockedStaking = useTranslations('noLockedStaking');
  const [claimAmount, setClaimAmount] = useState('');
  const [allProfit, setAllProfitAmount] = useState<number>(0);
  const [normalProfit, setNormalProfit] = useState<number>(0);
  const [rebalseProfit, setRebalseProfit] = useState<number>(0);
  const [hotDataInfo, setStakeInfo] = useState<StakInfo>({ stakNum: 0 });
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [lockIndex, setLockIndex] = useState<number>(100);
  const { userAddress } = useUserAddress();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();
  const [periodList, setPeriodList] = useState<periodItem[]>([]);
  // const [curPeriod, setCurPeriod] = useState<periodItem | null>(null);
  const [rate, setRate] = useState(0);
  const { handleContractError, isContractError } = useContractError();

  const { data: list } = useQuery({
    queryKey: ['claimPeriod'],
    queryFn: () => getClaimPeriod(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  //领取静态收益方法
  const claimInterest = async () => {
    if (!publicClient || !userAddress) return;
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: 'claimInterest',
        args: [lockIndex, parseUnits(claimAmount || '0', 9).toString()],
      });
      toast.loading(t('toast.confirming_transaction'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t2('toast.claim_success'), {
          id: toastId,
        });
        setClaimAmount('');
        setLockIndex(100);
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['UserDemandProfit', userAddress],
          }),
        ]);
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
        toast.error('error', {
          id: toastId,
        });
        console.log(error);
      }
    } finally {
      // toast.dismiss(toastId)
      setIsDisabled(false);
    }
  };
  useEffect(() => {
    if (list?.length) {
      setPeriodList(list);
      if (lockIndex !== 100) {
        setRate(Number(list[lockIndex].rate.split('%')[0]));
      }
    }
  }, [list, lockIndex]);
  useEffect(() => {
    if (demandProfitInfo) {
      setAllProfitAmount(demandProfitInfo.allProfit);
      setNormalProfit(demandProfitInfo.normalProfit);
      setRebalseProfit(demandProfitInfo.rebalseProfit);
    }
  }, [demandProfitInfo]);
  useEffect(() => {
    if (hotDataStakeNum) {
      setStakeInfo({ stakNum: hotDataStakeNum });
    }
  }, [hotDataStakeNum]);

  // useEffect(()=>{
  //   if(curPeriod){
  //     const rate =  curPeriod.rate.split("%")[0]

  //   }

  // },[claimAmount])
  return (
    <StakingLayout>
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
              <AmountCard
                data={{
                  value: claimAmount,
                  desc: Number(claimAmount || 0) * olyPrice,
                  balance: normalProfit
                    ? Number(formatNumbedecimalScale(normalProfit, 4))
                    : 0,
                }}
                onChange={value => {
                  if (Number(value) > allProfit) {
                    setClaimAmount(allProfit.toString());
                  } else {
                    setClaimAmount(value);
                  }
                }}
                description={t('balance')}
              />
              <Notification>{tNoLockedStaking('claimInfo')}</Notification>
              <DurationSelect
                options={periodList}
                value={lockIndex}
                placeholder={tNoLockedStaking('selectReleasePeriod')}
                onChange={value => {
                  setRate(Number(periodList[value].rate.split('%')[0]));
                  setLockIndex(value);
                }}
              />
              <ClaimSummary
                data={{
                  amount: Number(claimAmount) * ((100 - rate) / 100),
                  taxRate: rate,
                  incomeTax: Number(claimAmount) * (rate / 100),
                }}
              />

              {/* 领取按钮 */}
              <Button
                clipDirection='topRight-bottomLeft'
                className='w-full'
                variant={
                  normalProfit < 0.0001 ||
                  isDisabled ||
                  (rebalseProfit > 0 && hotDataInfo.stakNum > 0) ||
                  Number(claimAmount) === 0
                    ? 'disabled'
                    : 'primary'
                }
                disabled={
                  normalProfit < 0.0001 ||
                  isDisabled ||
                  (rebalseProfit > 0 && hotDataInfo.stakNum > 0) ||
                  Number(claimAmount) === 0 ||
                  lockIndex === 100
                }
                onClick={claimInterest}
              >
                {t('claimButton')}
              </Button>
            </Card>
          </div>

          {/* 右侧钱包摘要 */}
          <div>
            <WalletSummary />
          </div>
        </div>
      </div>
    </StakingLayout>
  );
}

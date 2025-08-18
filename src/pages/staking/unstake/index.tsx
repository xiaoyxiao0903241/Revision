import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  List,
  Notification,
  Segments,
  RoundedLogo,
  View,
  CountdownDisplay,
} from '~/components';
import { formatDecimal } from '~/lib/utils';
import { AmountCard, WalletSummary } from '~/widgets';
import { useNolockStore } from '~/store/noLock';
import CountDownTimer from './component/countDownTimer';
import { useQueryClient } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { formatNumbedecimalScale } from '~/lib/utils';
import { usePublicClient } from 'wagmi';
import { toast } from 'sonner';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import DemandStakingAbi from '~/wallet/constants/DemandStakingAbi.json';
import { demandStaking } from '~/wallet/constants/tokens';
import { Abi, parseUnits } from 'viem';
import { useContractError } from '~/hooks/useContractError';
import StakingLayout from '../layout';

interface StakInfo {
  stakNum: number;
}

export default function UnstakePage() {
  const t = useTranslations('staking');
  const {
    olyPrice,
    time,
    lastStakeTimestamp,
    nextBlock,
    currentBlock,
    AllolyStakeNum,
    allnetReabalseNum,
    hotDataStakeNum,
    demandProfitInfo,
    afterHotData,
  } = useNolockStore();
  const tNoLockedStaking = useTranslations('noLockedStaking');
  const t2 = useTranslations('common');
  const { userAddress } = useUserAddress();
  const [disabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [selectedStakeType, setSelectedStakeType] = useState<
    'release' | 'unstake'
  >('release');
  const stakeOptions = [
    { value: 'release', label: tNoLockedStaking('release') },
    { value: 'unstake', label: t('unstake') },
  ];
  const [hotDataInfo, setStakeInfo] = useState<StakInfo>({ stakNum: 0 });
  const [isClaim, setisClaim] = useState<boolean>(false);
  const [apy, setApy] = useState<string>('0');
  // const [myAllStakeNum, setMyAllStakeNum] = useState(0);
  const [nextEarnAmount, setNextEarnAmount] = useState<number>(0);
  const [allProfit, setAllProfitAmount] = useState<number>(0);
  const [principal, setPrincipal] = useState<number>(0);
  const [UnstakeAmount, setUnstakeAmount] = useState('');
  const [cutDownTime, setCutDownTime] = useState<number>(0);
  const publicClient = usePublicClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const queryClient = useQueryClient();
  const { handleContractError, isContractError } = useContractError();

  //领取本金
  const claimPrincipal = async () => {
    if (!publicClient || !userAddress) return;
    if (Number(principal) === 0) {
      toast.success(tNoLockedStaking('onOly'));
      return;
    }
    if (Number(principal) < Number(UnstakeAmount)) {
      toast.success(tNoLockedStaking('overMore'));
      return;
    }
    if (Number(UnstakeAmount) === 0) {
      toast.success(tNoLockedStaking('addInOly'));
      return;
    }
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: 'unstakePrincipal',
        args: [parseUnits(UnstakeAmount, 9)],
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      if (result.status === 'success') {
        toast.success(tNoLockedStaking('unLock_sucess'), {
          id: toastId,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['UserDemandInfo', userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ['DemandAfterHot', userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ['UserDemandProfit', userAddress],
          }),
        ]);
        setUnstakeAmount('');
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
      setIsLoading(false);
    }
  };

  //释放
  const claimToStakes = async () => {
    if (!publicClient || !userAddress) return;
    if (!isClaim) {
      toast.warning(tNoLockedStaking('cant_unclock'));
      return;
    }

    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    setIsDisabled(true);
    setIsLoading(true);
    try {
      const hash = await writeContractAsync({
        abi: DemandStakingAbi as Abi,
        address: demandStaking as `0x${string}`,
        functionName: 'claim',
        args: [],
      });
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(tNoLockedStaking('unlock_sucess'), {
          id: toastId,
        });
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ['DemandAfterHot', userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ['UserDemandInfo', userAddress],
          }),
          queryClient.invalidateQueries({
            queryKey: ['UserDemandProfit', userAddress],
          }),
        ]);
      } else {
        toast.error(tNoLockedStaking('unlock_fail'), {
          id: toastId,
        });
        // toast.dismiss(toastId)
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const myAsNum =
      Number(afterHotData?.principal || 0) + Number(hotDataInfo.stakNum || 0);
    // setMyAllStakeNum(myAsNum);
    const NextEarnAmount = formatNumbedecimalScale(
      ((myAsNum + allProfit) * Number(apy)) / 100,
      6
    );
    setNextEarnAmount(Number(NextEarnAmount));
    if (afterHotData?.principal) {
      setPrincipal(afterHotData?.principal);
      return;
    }
    setPrincipal(0);
  }, [afterHotData, apy, hotDataInfo.stakNum, allProfit]);

  useEffect(() => {
    if (demandProfitInfo) {
      setAllProfitAmount(demandProfitInfo.allProfit);
      setisClaim(demandProfitInfo.isClaim);
    }
  }, [demandProfitInfo]);

  useEffect(() => {
    console.log(hotDataStakeNum, 'hotDataStakeNum');
    if (hotDataStakeNum) {
      setStakeInfo({ stakNum: hotDataStakeNum });
    }
  }, [hotDataStakeNum]);

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
    <StakingLayout>
      <div className='space-y-6'>
        <Alert
          icon='unstake'
          title={t('unstakeTitle')}
          description={tNoLockedStaking('unstakeDescription')}
        />

        {/* 主要内容区域 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <Card>
              <Segments
                options={stakeOptions}
                value={selectedStakeType}
                onChange={value =>
                  setSelectedStakeType(value as 'release' | 'unstake')
                }
              />
              {selectedStakeType === 'release' ? (
                <>
                  <View
                    className='bg-[#22285E] px-4'
                    clipDirection='topRight-bottomLeft'
                  >
                    <div className='flex items-center justify-between py-4'>
                      <div className='flex flex-col gap-2'>
                        <span className='text-foreground/70 text-sm'>
                          {t('amount')}
                        </span>
                        <div className='flex items-center gap-2'>
                          <RoundedLogo className='w-6 h-6' />
                          <span className='text-foreground text-3xl font-mono'>
                            {hotDataInfo.stakNum
                              ? formatNumbedecimalScale(hotDataInfo.stakNum, 2)
                              : 0}
                          </span>
                        </div>
                        <span className='text-foreground/70 text-sm'>
                          $
                          {formatNumbedecimalScale(
                            hotDataInfo.stakNum * olyPrice,
                            2
                          )}
                        </span>
                      </div>
                      {lastStakeTimestamp &&
                      lastStakeTimestamp > 0 &&
                      hotDataInfo.stakNum > 0 &&
                      !isClaim ? (
                        <span className='text-white'>
                          <CountDownTimer time={time}></CountDownTimer>
                        </span>
                      ) : (
                        <Button
                          className='h-10'
                          disabled={
                            hotDataInfo.stakNum === 0 || !isClaim || isDisabled
                          }
                          clipDirection='topRight-bottomLeft'
                          variant='primary'
                          onClick={claimToStakes}
                        >
                          {isLoading ? 'Release...' : 'Release'}
                        </Button>
                      )}
                    </div>
                  </View>
                  {/* 信息提示 */}
                  <Notification>
                    {tNoLockedStaking(
                      disabled ? 'unstakeDisabledInfo' : 'unstakeInfo'
                    )}
                  </Notification>
                </>
              ) : (
                <>
                  <AmountCard
                    data={{
                      value: UnstakeAmount,
                      desc: Number(UnstakeAmount) * olyPrice,
                      balance: principal
                        ? Number(formatNumbedecimalScale(principal, 2))
                        : 0,
                    }}
                    onChange={value => {
                      if (Number(value) > principal) {
                        setUnstakeAmount(principal.toString());
                      } else {
                        setUnstakeAmount(value);
                      }
                    }}
                    description={t('balance')}
                  />
                  <List>
                    <List.Item>
                      <List.Label>{t('youWillReceive')}</List.Label>
                      <List.Value className='text-xl font-mono'>{`${formatDecimal(
                        Number(UnstakeAmount),
                        4
                      )} OLY`}</List.Value>
                    </List.Item>
                    <List.Item>
                      <List.Label>{t2('nextBlockRate')}</List.Label>
                      <List.Value className='font-mono'>
                        {Number(apy) > 0 ? apy : 0}%
                      </List.Value>
                    </List.Item>
                    <List.Item>
                      <List.Label>{t2('next_earnings')}</List.Label>
                      <List.Value className='text-success'>
                        {nextEarnAmount > 0
                          ? formatNumbedecimalScale(nextEarnAmount, 2)
                          : 0}{' '}
                        OLY
                      </List.Value>
                    </List.Item>

                    <List.Item>
                      <List.Label>{t('countdownToNextRebase')}</List.Label>
                      <List.Value className='font-mono'>
                        <CountdownDisplay
                          blocks={BigInt(cutDownTime)}
                          isShowDay={false}
                        />
                      </List.Value>
                    </List.Item>
                  </List>
                  <Button
                    clipDirection='topRight-bottomLeft'
                    variant={
                      principal == 0 ||
                      isDisabled ||
                      Number(UnstakeAmount) === 0
                        ? 'disabled'
                        : 'primary'
                    }
                    disabled={
                      principal == 0 ||
                      isDisabled ||
                      Number(UnstakeAmount) === 0
                    }
                    onClick={claimPrincipal}
                  >
                    {isLoading ? t2('unpledgeing') : t2('unpledge')}
                  </Button>
                </>
              )}
            </Card>
          </div>
          <div>
            <WalletSummary />
          </div>
        </div>
      </div>
    </StakingLayout>
  );
}

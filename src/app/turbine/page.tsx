'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Alert, Button, Card } from '~/components';
import { cn, formatDecimal, formatAddress } from '~/lib/utils';
import { AmountCard, TurbineRecords, TurbineSummary } from '~/widgets';
import { RateCard } from '~/widgets/rate-card';
import { Slippage } from '~/widgets/slippage';
import { getTokenPrice } from '~/wallet/lib/web3/bond';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { getAllowance, getBalanceToken } from '~/wallet/lib/web3/stake';
import { turbine, DAI } from '~/wallet/constants/tokens';
import { formatNumbedecimalScale } from '~/lib/utils';
import { getStakeNum } from '~/wallet/lib/web3/turbine';
import { useWriteContract, usePublicClient } from 'wagmi';
import TurbineAbi from '~/wallet/constants/TurbineAbi.json';
import { erc20Abi, parseUnits, formatUnits } from 'viem';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ReciveTable } from './component/reciveTable';

export default function TurbinePage() {
  const t = useTranslations('turbine');
  const [isRefreshUSDT, setIsRefreshUSDT] = useState(false);
  const [isRefreshOLY, setIsRefreshOLY] = useState(false);
  const [isSlippage, setIsSlippage] = useState(false);
  const { userAddress } = useUserAddress();
  const [balanceDai, setBalanceDai] = useState<number>(0);
  const [unitPrice, setOlyPrice] = useState(0);
  const [amount, setAmount] = useState<string>('');
  const [myStakeNum, setMyStakeNum] = useState<number>(0);
  const [usdtAmount, setUsdtAmount] = useState<string>('0'); //估值的USDT的值
  const publicClient = usePublicClient();
  const [slippage, setSlippage] = useState(0.5);
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const queryClient = useQueryClient();

  //USDT余额
  const { data: balance, refetch: refetchBalance } = useQuery({
    queryKey: ['DaitokenBalance', userAddress],
    queryFn: () =>
      getBalanceToken({
        address: userAddress as `0x${string}`,
        TOKEN_ADDRESSES: DAI,
        decimal: 18,
      }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 27000,
  });

  // 获取可解锁的数量
  const { data: stakeAmount, refetch: refetchStakeAmount } = useQuery({
    queryKey: ['userStakeNum', userAddress],
    queryFn: () => getStakeNum({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 25000,
  });

  // oly单价
  const { data: olyPrice, refetch: refetchOlyPrice } = useQuery({
    queryKey: ['olyPrice'],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 10000,
  });

  //授权长度
  const { data: allowance } = useQuery({
    queryKey: ['userAllowance'],
    queryFn: () =>
      getAllowance({
        address: userAddress as `0x${string}`,
        fromAddress: DAI,
        toAddress: turbine,
        decimal: 18,
      }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 29000,
  });

  //解锁
  const trand = async () => {
    if (!publicClient || !userAddress) return;
    if (myStakeNum < Number(amount)) {
      toast.warning(t('toast.insufficient_unlockable'));
      return;
    }
    const toastId = toast.loading(t('toast.confirm_in_wallet'));
    setIsDisabled(true);
    try {
      setIsLoading(true);
      const futureTimestamp = Math.floor(Date.now() / 1000) + 5 * 60;
      const hash = await writeContractAsync({
        abi: TurbineAbi,
        address: turbine as `0x${string}`,
        functionName: 'silence',
        args: [
          userAddress,
          parseUnits(String(usdtAmount), 18),
          futureTimestamp,
        ],
      });
      toast.loading(t('toast.confirming'), {
        id: toastId,
      });
      const result = await publicClient.waitForTransactionReceipt({ hash });
      if (result.status === 'success') {
        toast.success(t('toast.trade_success'), {
          id: toastId,
        });
        setAmount('0');
        setUsdtAmount('0');
        await refetchStakeAmount();
        await refetchBalance();
        await queryClient.invalidateQueries({
          queryKey: ['currentBlock'],
        });
        await queryClient.invalidateQueries({
          queryKey: ['userReceiveList', userAddress],
        });
      } else {
        toast.error(t('toast.trade_failed'), {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      console.log(error);
      toast.error('error', {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  //授权dai给涡轮并一起调用解锁方法
  const approveUsdt = async () => {
    if (!publicClient || !userAddress) return;

    if (!isApprove) {
      setIsDisabled(true);
      try {
        setIsLoading(true);
        const hash = await writeContractAsync({
          abi: erc20Abi,
          address: DAI as `0x${string}`,
          functionName: 'approve',
          args: [turbine, parseUnits(Number.MAX_SAFE_INTEGER.toString(), 18)],
        });
        const result = await publicClient.waitForTransactionReceipt({ hash });
        if (result.status === 'success') {
          toast.success(t('toast.approve_success'));
          await queryClient.invalidateQueries({
            queryKey: ['userAllowance'],
          });
        }
      } catch (error: unknown) {
        console.log(error);
        toast.error('error');
      } finally {
        setIsLoading(false);
        setIsDisabled(false);
      }
      return;
    }

    if (isApprove) {
      if (!Number(amount)) {
        toast.warning(t('toast.enter_amount'));
        return;
      }
      if (Number(amount) > myStakeNum) {
        toast.warning(t('toast.insufficient_unlockable'));
        return;
      }
      if (Number(usdtAmount) > Number(balanceDai)) {
        toast.warning(t('toast.insufficient_balance'));
        return;
      }
      trand();
    }
  };

  //估值
  const getTokenValueDebounced = useCallback(
    async (value: number) => {
      if (!value) {
        setUsdtAmount('0');
        return;
      }
      if (value > 0) {
        if (!publicClient) return;
        const emistAmount = await publicClient.readContract({
          abi: TurbineAbi,
          address: turbine as `0x${string}`,
          functionName: 'getSilenceUSDTAmount',
          args: [parseUnits(String(value), 9).toString()],
        });
        const exchangeNum = formatUnits(emistAmount as bigint, 18);
        const num = Number(exchangeNum) * (1 - slippage / 100);

        setUsdtAmount(String(num));
        await refetchStakeAmount();
        await refetchBalance();
      }
    },
    [publicClient, refetchStakeAmount, refetchBalance, slippage]
  );
  const debouncedGetTokenValue = useMemo(() => {
    return debounce(getTokenValueDebounced, 300);
  }, [getTokenValueDebounced]);

  //刷新USDT
  const refreshUsdt = async () => {
    await refetchBalance();
  };

  //刷新oly单价
  const refreshOlyPrice = async () => {
    await refetchOlyPrice();
  };

  useEffect(() => {
    if (
      allowance !== undefined &&
      Number(usdtAmount) > 0 &&
      Number(amount) > 0 &&
      Number(allowance) > 0 &&
      Number(allowance) > Number(usdtAmount)
    ) {
      console.log('111');
      setIsApprove(true);
    } else {
      setIsApprove(false);
    }
  }, [allowance, amount, usdtAmount]);

  useEffect(() => {
    if (balance) {
      setBalanceDai(balance);
    }
  }, [balance]);

  useEffect(() => {
    if (olyPrice) {
      setOlyPrice(Number(olyPrice));
    }
  }, [olyPrice]);

  useEffect(() => {
    setMyStakeNum(Number(stakeAmount));
  }, [stakeAmount]);

  useEffect(() => {
    if (Number(amount)) {
      debouncedGetTokenValue(Number(amount));
    } else {
      setUsdtAmount('0');
    }
  }, [amount]);

  //刷新icon的动画
  const onToggle = async (callback: () => void, type: string) => {
    if (type === 'USDT') {
      setIsRefreshUSDT(true);
    }
    if (type === 'OLY') {
      setIsRefreshOLY(true);
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (type === 'USDT') {
      setIsRefreshUSDT(false);
    }
    if (type === 'OLY') {
      setIsRefreshOLY(false);
    }
    callback();
  };
  return (
    <div className='space-y-6'>
      {/* 页面标题和描述 */}
      <Alert
        icon='turbine'
        title={t('title')}
        description={t('alertDescription')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 左侧界面 */}
        <div>
          <Card className='p-6 flex flex-col gap-3 pt-10'>
            {/* 钱包余额 */}
            <div className='text-sm text-foreground/50 flex items-center gap-1'>
              <span>{t('myWallet')}</span>
              <span className='text-white'>
                {formatDecimal(balanceDai, 2)} USDT
              </span>
              <span
                className='cursor-pointer'
                onClick={() => {
                  onToggle(refreshUsdt, 'USDT');
                }}
              >
                <Image
                  src='/images/icon/refresh.png'
                  alt='refresh'
                  width={12}
                  height={12}
                  className={cn('w-3 h-3', isRefreshUSDT && 'animate-spin')}
                />
              </span>
            </div>

            {/* 金额输入 */}
            <AmountCard
              data={{
                value: amount,
                desc: usdtAmount,
                balance: myStakeNum,
              }}
              description={t('unlockableAmount')}
              onChange={value => {
                setAmount(value);
              }}
            />
            <RateCard
              description={`1USDT = ${formatNumbedecimalScale(1 / Number(olyPrice), 4)} OLY`}
              isLoading={isRefreshOLY}
              onRefresh={() => {
                onToggle(refreshOlyPrice, 'OLY');
              }}
              value={isSlippage}
              onTogleSlippage={value => {
                setIsSlippage(value);
              }}
            />
            {isSlippage && (
              <Slippage
                options={[
                  { value: '0.5', label: '0.5%' },
                  { value: '0.1', label: '1%' },
                  { value: '3', label: '3%' },
                  { value: '5', label: '5%' },
                ]}
                value={slippage}
                onChange={value => {
                  setSlippage(Number(value));
                }}
              />
            )}

            {/* 按钮组 */}
            <div className='flex gap-5 py-4'>
              {!isApprove && (
                <Button
                  disabled={
                    isDisabled ||
                    Number(amount) === 0 ||
                    Number(myStakeNum) === 0
                  }
                  clipDirection='topRight-bottomLeft'
                  className='flex-1'
                  onClick={approveUsdt}
                >
                  {isLoading && Number(allowance) < Number(usdtAmount)
                    ? t('approving')
                    : t('approve')}
                </Button>
              )}
              <Button
                clipDirection='topRight-bottomLeft'
                className='flex-1'
                disabled={
                  isDisabled ||
                  Number(amount) === 0 ||
                  Number(allowance) === 0 ||
                  Number(allowance) < Number(usdtAmount) ||
                  Number(myStakeNum) === 0
                }
                onClick={approveUsdt}
              >
                {isLoading && isApprove ? t('trading') : t('trade')}
              </Button>
            </div>

            {/* 涡轮信息 */}
            <TurbineSummary
              data={{
                amountToSend: (
                  <span className='uppercase'>
                    {`${formatNumbedecimalScale(amount, 4)}  ${'OLY'}`}
                    <span className='text-foreground/50 pl-2'>
                      ($
                      {formatNumbedecimalScale(
                        Number(amount) * Number(unitPrice),
                        2
                      )}
                      )
                    </span>
                  </span>
                ),
                minToReceive: (
                  <span className='uppercase'>
                    {`${formatNumbedecimalScale(Number(amount) * (1 - slippage / 100), 4)}  ${'OLY'}`}
                    <span className='text-foreground/50 pl-2'>
                      ($
                      {formatNumbedecimalScale(
                        Number(amount) *
                          (1 - slippage / 100) *
                          Number(unitPrice),
                        2
                      )}
                      )
                    </span>
                  </span>
                ),
                yakSwapFee: '0 USDT',
                contractSpender: formatAddress(turbine),
                recipient: (userAddress && formatAddress(userAddress)) || '',
                tokenIn: 'OLY Token',
                tokenOut: 'BSC USDT',
              }}
            />
          </Card>
        </div>

        {/* 右侧：锁定金额和接收信息 */}
        <div>
          <ReciveTable unitPrice={unitPrice}></ReciveTable>
        </div>
      </div>

      {/* 底部：交易历史 */}
      <div>
        <TurbineRecords />
      </div>
    </div>
  );
}

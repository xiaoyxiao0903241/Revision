import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Alert, Button, RoundedLogo, View } from '~/components';
import { Card } from '~/components/card';
import { useMock } from '~/hooks/useMock';
import { formatDecimal, formatNumbedecimalScale } from '~/lib/utils';
import { useMockStore } from '~/store/mock';
import { BalanceCard } from '~/widgets/balance-card';
// import { CandlestickChart } from "~/widgets/charts";
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Abi, erc20Abi, parseUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useContractError } from '~/hooks/useContractError';
import { useWriteContractWithGasBuffer } from '~/hooks/useWriteContractWithGasBuffer';
import PANCAKESWAP_ROUTER_ABI from '~/wallet/constants/RouterAbi.json';
import { DEX_ADDRESS, TOKEN_ADDRESSES } from '~/wallet/constants/tokens';
import { getTokenPrice } from '~/wallet/lib/web3/bond';
import {
  calculateMinOutput,
  checkNeedsApproval,
  fetchTokenData,
  formatTokenBalance,
} from '~/wallet/lib/web3/swap';
import { RateCard } from '~/widgets/rate-card';
import { Slippage } from '~/widgets/slippage';
import { Balance, SwapCard } from '~/widgets/swap-card';
import { SwapSummary } from '~/widgets/swap-summary';

const SwapButton = dynamic(() => import('./component/SwapButton'), {
  loading: () => (
    <div className='h-14 bg-neutral-800 rounded-xl animate-pulse' />
  ),
  ssr: false,
});

export default function SwapPage() {
  const t = useTranslations('swap');
  const t2 = useTranslations('exchange');
  const t3 = useTranslations('navigation');
  const { decimal, walletConnected: isLoading } = useMock();
  const [source, setSource] = React.useState<'USDT' | 'OLY'>('USDT');
  const [amount, setAmount] = useState('');
  const [fromToken, setFromToken] = useState('DAI');
  const [toToken, setToToken] = useState('OLY');
  const [fromTokenDecimals, setFromTokenDecimals] = useState<number>(18);
  const [toTokenDecimals, setToTokenDecimals] = useState<number>(9);
  const [slippage, setSlippage] = useState('1');
  const [estimatedOutput, setEstimatedOutput] = useState('0');

  const [fromTokenBalance, setFromTokenBalance] = useState<bigint>(BigInt(0));
  const [toTokenBalance, setToTokenBalance] = useState<bigint>(BigInt(0));
  const { isConnected } = useAccount();
  const { userAddress } = useUserAddress();
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);
  const [closePer, setClosePer] = useState(false);
  const [showSlippage, setShowSlippage] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const { handleContractError, isContractError } = useContractError();
  const publicClient = usePublicClient();
  const [isApproving, setIsApproving] = useState(false);
  const { writeContractAsync } = useWriteContractWithGasBuffer(1.5, BigInt(0));
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChange, setIsChange] = useState(false);
  const [refreshSymbol, setRefreshSymbol] = useState('');

  // 获取路由参数
  const type = searchParams?.get('type') || 'buy';

  // 根据参数设置初始状态
  useEffect(() => {
    if (type === 'buy') {
      setFromToken('DAI');
      setToToken('OLY');
      setSource('USDT');
    } else if (type === 'sell') {
      setFromToken('OLY');
      setToToken('DAI');
      setSource('OLY');
    }
  }, [type]);

  console.log('Route type:', type);
  console.log(router, 'router');

  const [exchangeMess, setExchangeMess] = useState({
    //底部显示的信息
    send: {
      amount: '0',
      usdt: '0',
    },
    recive: {
      amount: '0',
      usdt: '0',
    },
    rate: '0',
  });
  const onToggle = async () => {
    useMockStore.setState({
      walletConnected: true,
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    useMockStore.setState({
      walletConnected: false,
    });
  };

  const options: Balance[] = [
    {
      symbol: 'USDT',
      icon: (
        <Image src='/images/icon/usdt.png' alt='usdt' width={48} height={48} />
      ),
      profit: -3,
      description: t('usdtDescription'),
      address: TOKEN_ADDRESSES.DAI,
    },
    {
      symbol: 'OLY',
      icon: <RoundedLogo className='w-12 h-12' />,

      profit: -3,
      description: t('olyDescription'),
      address: TOKEN_ADDRESSES.OLY,
    },
  ];

  const sourceOption = options.find(item => item.symbol === source);
  const destinationOption = options.find(item => item.symbol !== source);

  // oly单价
  const { data: olyPrice } = useQuery({
    queryKey: ['olyPrice'],
    queryFn: getTokenPrice,
    enabled: true,
    retry: 1,
    retryDelay: 10000,
  });

  // 处理代币交换
  const handleTokenSwap = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    // 重置输入和输出值
    setAmount('');
    setEstimatedOutput('0');
    if (fromToken === 'OLY') {
      setSlippage('1');
    } else {
      setSlippage('5');
    }
    setSource(source =>
      source === sourceOption?.symbol
        ? destinationOption!.symbol
        : sourceOption!.symbol
    );
    setClosePer(true);
  };

  // 检查是否需要授权
  const needsApproval = checkNeedsApproval(
    allowance,
    amount,
    fromTokenDecimals
  );

  // 处理授权
  const handleApprove = async () => {
    if (!amount || !fromTokenDecimals || !publicClient || !userAddress) return;
    try {
      setIsApproving(true);
      const amountToApprove = parseUnits(amount, fromTokenDecimals);
      const hash = await writeContractAsync({
        abi: erc20Abi as Abi,
        address: TOKEN_ADDRESSES[
          fromToken as keyof typeof TOKEN_ADDRESSES
        ] as `0x${string}`,
        functionName: 'approve',
        args: [DEX_ADDRESS, amountToApprove],
      });

      // 等待交易确认
      const result = await publicClient.waitForTransactionReceipt({
        hash,
      });
      if (result.status === 'success') {
        toast.success(t2('toast.approval_success'));
        // 重新获取 token 数据以更新授权状态
        const data = await fetchTokenData({
          address: userAddress,
          fromToken,
          toToken,
          amount: parseUnits(amount, fromTokenDecimals).toString(),
        });
        setAllowance(data.allowance);
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage);
      } else {
        toast.error(t2('toast.approval_failed'));
        console.error('Approval failed:', error);
      }
    } finally {
      setIsApproving(false);
    }
  };

  // 处理交换按钮点击
  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0 || !userAddress || !publicClient) {
      toast.error(t2('toast.enter_valid_amount'));
      return;
    }

    if (needsApproval) {
      handleApprove();
      return;
    }

    // 显示交易发送中的提示
    const toastId = toast.loading(t2('toast.confirm_in_wallet'));
    try {
      setIsSwapping(true);
      const amountIn = parseUnits(amount, fromTokenDecimals);
      // 计算最小输出金额，考虑滑点
      const amountOutMin = estimatedOutput
        ? calculateMinOutput(parseUnits(estimatedOutput, toTokenDecimals))
        : BigInt(0);
      const path = [
        TOKEN_ADDRESSES[fromToken as keyof typeof TOKEN_ADDRESSES],
        TOKEN_ADDRESSES[toToken as keyof typeof TOKEN_ADDRESSES],
      ] as `0x${string}`[];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20分钟后过期

      // 发送交易
      const hash = await writeContractAsync({
        abi: PANCAKESWAP_ROUTER_ABI as Abi,
        address: DEX_ADDRESS as `0x${string}`,
        functionName: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
        args: [amountIn, amountOutMin, path, userAddress, BigInt(deadline)],
      });

      if (!hash) {
        toast.error(t2('toast.swap_failed'), {
          id: toastId,
        });
        return;
      }

      // 更新提示为确认中
      toast.loading(t2('toast.confirming'), {
        id: toastId,
      });

      // 等待交易确认
      const txReceipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      // 根据交易状态更新提示
      if (txReceipt.status === 'success') {
        toast.success(t('swap_success'), {
          id: toastId,
        });
        // 重新获取 token 数据以更新余额
        const data = await fetchTokenData({
          address: userAddress,
          fromToken,
          toToken,
          amount: '0', // 重置输入金额
        });
        setFromTokenBalance(data.fromTokenBalance);
        setToTokenBalance(data.toTokenBalance);
        setAmount('');
        setEstimatedOutput('0');
      } else {
        toast.error(t2('toast.swap_failed'), {
          id: toastId,
        });
        console.error('Transaction failed:', txReceipt);
      }
    } catch (error: unknown) {
      if (isContractError(error as Error)) {
        const errorMessage = handleContractError(error as Error);
        toast.error(errorMessage, { id: toastId });
      } else {
        const err = error as { message?: string };
        if (err?.message?.includes('User rejected')) {
          toast.error(t2('toast.user_rejected'), {
            id: toastId,
          });
        } else {
          console.error(error);
          toast.error(t2('toast.swap_error'), {
            id: toastId,
          });
        }
      }
    } finally {
      setIsSwapping(false);
    }
  };

  // 执行 multicall 并更新状态
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !userAddress) {
        // 重置状态
        setFromTokenBalance(BigInt(0));
        setToTokenBalance(BigInt(0));
        setAllowance(BigInt(0));
        return;
      }

      setIsCheckingApproval(true);
      try {
        console.log('Fetching token data for:', {
          fromToken,
          toToken,
          userAddress,
          amount,
        });
        const data = await fetchTokenData({
          address: userAddress,
          fromToken,
          toToken,
          amount: parseUnits(amount, fromTokenDecimals).toString(),
        });
        console.log('Token data fetched:', data);

        setFromTokenBalance(data.fromTokenBalance);
        setToTokenBalance(data.toTokenBalance);
        setAllowance(data.allowance);
        setFromTokenDecimals(data.fromTokenDecimals);
        setToTokenDecimals(data.toTokenDecimals);
        // 如果有兑换比例数据，更新预估输出，考虑滑点
        if (data.rateData && data.rateData[1]) {
          const slippageValue = parseFloat(slippage) || 1;
          const minOutput = calculateMinOutput(data.rateData[1], slippageValue);
          console.log(minOutput, 'minOutput');
          setEstimatedOutput(
            formatTokenBalance(minOutput, data.toTokenDecimals)
          );
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      } finally {
        setIsCheckingApproval(false);
      }
    };

    fetchData();
  }, [
    isConnected,
    userAddress,
    fromToken,
    toToken,
    amount,
    fromTokenDecimals,
    slippage,
  ]);

  useEffect(() => {
    if (amount === '') {
      setEstimatedOutput('');
    }
  }, [amount]);

  //刷新余额
  const refreshTokenBalance = async () => {
    if (userAddress) {
      const data = await fetchTokenData({
        address: userAddress,
        fromToken,
        toToken,
        amount: parseUnits(amount, fromTokenDecimals).toString(),
      });
      setFromTokenBalance(data.fromTokenBalance);
      setToTokenBalance(data.toTokenBalance);
    }
  };
  // 格式化余额显示
  const formattedFromBalance = formatTokenBalance(
    fromTokenBalance,
    fromTokenDecimals
  );
  const formattedToBalance = formatTokenBalance(
    toTokenBalance,
    toTokenDecimals
  );

  useEffect(() => {
    if (Number(amount) > 0) {
      if (sourceOption?.symbol === 'USDT') {
        setExchangeMess({
          send: {
            amount: amount,
            usdt: amount,
          },
          recive: {
            amount: estimatedOutput,
            usdt: formatNumbedecimalScale(
              Number(estimatedOutput) * Number(olyPrice),
              2
            ),
          },
          rate: '0',
        });
      } else {
        setExchangeMess({
          send: {
            amount: amount,
            usdt: formatNumbedecimalScale(Number(amount) * Number(olyPrice), 2),
          },
          recive: {
            amount: formatNumbedecimalScale(
              Number(amount) * Number(olyPrice) * 0.97,
              2
            ),
            usdt: formatNumbedecimalScale(
              Number(amount) * Number(olyPrice) * 0.97,
              2
            ),
          },
          rate: formatNumbedecimalScale(
            Number(amount) * Number(olyPrice) * 0.03,
            2
          ),
        });
      }
    }
  }, [fromToken, amount, estimatedOutput, olyPrice, sourceOption?.symbol]);

  return (
    <div className='space-y-6'>
      {/* 页面标题和描述 */}
      <Alert
        icon='swap'
        title={t3('swap')}
        description={t('searchBestPrice')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 左侧：交换界面 */}
        <div className='h-min'>
          <Card className='flex flex-col gap-5'>
            {/* 交换输入区域 */}
            <View className='relative -space-y-3'>
              {/* USDT 输入 */}
              <SwapCard
                data={{
                  type: 'source',
                  ...sourceOption!,
                  value: amount,
                  profit: undefined,
                  olyPrice: Number(olyPrice) || 0,
                }}
                onChange={value => {
                  setAmount(value);
                  setClosePer(true);
                }}
              >
                <BalanceCard
                  balance={formattedFromBalance}
                  symbol={sourceOption!.symbol}
                  closePer={closePer}
                  onChange={value => {
                    if (Number(formattedFromBalance) > 0) {
                      setAmount(value);
                    }
                  }}
                  refreshSymbol={refreshSymbol}
                  onRefreshSymbol={setRefreshSymbol}
                  refreshTokenBalance={refreshTokenBalance}
                />
              </SwapCard>

              {/* 交换图标 - 浮动在两个卡片之间 */}
              <div
                className=' z-20 cursor-pointer w-full flex items-center justify-center'
                onClick={handleTokenSwap}
              >
                <Image
                  src='/images/icon/arrow_d.png'
                  alt='swap'
                  className='z-20'
                  width={55}
                  height={55}
                />
              </div>

              {/* OLY 输入 */}
              <SwapCard
                data={{
                  type: 'destination',
                  value: estimatedOutput,
                  ...destinationOption!,
                  olyPrice: Number(olyPrice) || 0,
                }}
                onChange={() => {}}
              >
                <BalanceCard
                  balance={formattedToBalance}
                  symbol={destinationOption!.symbol}
                  refreshTokenBalance={refreshTokenBalance}
                  refreshSymbol={refreshSymbol}
                  onRefreshSymbol={setRefreshSymbol}
                />
              </SwapCard>
            </View>

            <RateCard
              // description={`1 USDT= ${olyPrice ? formatNumbedecimalScale(1 / Number(olyPrice), 4) : 0} OLY`}
              description={`${isChange ? '1 OLY = ' + formatNumbedecimalScale(1 / (1 / Number(olyPrice)), 4) + ' USDT' : '1 USDT = ' + formatNumbedecimalScale(1 / Number(olyPrice), 4) + ' OLY'}`}
              isLoading={isLoading}
              onRefresh={onToggle}
              value={showSlippage}
              onTogleSlippage={setShowSlippage}
              onTogChange={setIsChange}
              isChange={isChange}
              type='swap'
              refreshSymbol={refreshSymbol}
              onRefreshSymbol={setRefreshSymbol}
            ></RateCard>

            {/* 滑点设置 */}
            {showSlippage && (
              <Slippage
                options={[
                  { value: '1', label: '1%' },
                  { value: '3', label: '3%' },
                  { value: '5', label: '5%' },
                ]}
                value={slippage}
                onChange={value => {
                  setSlippage(value);
                }}
              />
            )}

            {/* 交换按钮 */}
            {/* <Button clipDirection="topRight-bottomLeft">
              {t("swapButton")}
            </Button> */}
            <SwapButton
              amount={amount}
              isSwapping={isSwapping}
              isApproving={isApproving}
              isCheckingApproval={isCheckingApproval}
              needsApproval={needsApproval}
              onSwap={handleSwap}
            ></SwapButton>
            {/* 交换信息 */}

            <SwapSummary
              data={{
                amountToSend: (
                  <span className='uppercase'>
                    {`${exchangeMess.send.amount}  ${sourceOption?.symbol}`}
                    <span className='text-foreground/50 pl-2'>
                      {`$${exchangeMess.send.usdt}`}
                    </span>
                  </span>
                ),
                minToReceive: (
                  <span className='uppercase'>
                    {`${exchangeMess.recive.amount}  ${
                      destinationOption?.symbol
                    }`}
                    <span className='text-foreground/50 pl-2'>
                      {`$${exchangeMess.recive.usdt}`}
                    </span>
                  </span>
                ),
                yakSwapFee: `${formatDecimal(Number(decimal))} ${
                  sourceOption?.symbol
                }`,
                contractSpender: sourceOption!.address,
                recipient: destinationOption!.address,
                tokenIn: sourceOption!.description,
                tokenOut: destinationOption!.description,
              }}
            />
          </Card>
        </div>
        <div>
          <Card className='flex flex-col gap-5'>
            <iframe
              height='600px'
              width='100%'
              id='geckoterminal-embed'
              title='GeckoTerminal Embed'
              src='https://www.geckoterminal.com/bsc/pools/0x6865704ff097b1105ed42b8517020e14fe9a2abd?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1d'
              frameBorder='0'
              allow='clipboard-write'
              allowFullScreen
            ></iframe>
          </Card>
          <Button
            clipDirection='topRight-bottomLeft'
            className='font-mono w-full mt-4'
            variant='default'
            onClick={() => {
              window.open(
                'https://pancakeswap.finance/swap?chain=bsc&inputCurrency=0x55d398326f99059fF775485246999027B3197955&outputCurrency=0x544028231562a43b106FbceCA722B65Cb5C861b0'
              );
            }}
          >
            <div className='flex gap-x-3 items-center justify-between w-full'>
              <div></div>
              <div className='flex items-center gap-x-3'>
                <Image
                  alt=''
                  src='/images/icon/exchange.png'
                  width={24}
                  height={18}
                ></Image>
                <span className='font-normal'>Trade on PancakeSwap</span>
              </div>
              <Image
                alt=''
                src='/images/icon/share.png'
                width={24}
                height={18}
              ></Image>
            </div>
          </Button>
          {/* 右侧：价格图表 */}
          {/* <Card className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold">{t("priceChart")}</h3>
            <CandlestickChart />
          </Card> */}
        </div>
      </div>
    </div>
  );
}

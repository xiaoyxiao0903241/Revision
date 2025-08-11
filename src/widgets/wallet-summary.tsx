import { useTranslations } from 'next-intl';
import { Card, CardHeader, List, Statistics } from '~/components';
import { FC, useEffect, useState } from 'react';
import { formatCurrency } from '~/lib/utils';
import { infoItems } from '~/hooks/useMock';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { getTotalSupply } from '~/wallet/lib/web3/stake';
import { useNolockStore } from '~/store/noLock';
import { formatNumbedecimalScale } from '~/lib/utils';
import { stakerNum, personStakeAmount } from '~/services/auth/dashboard';
import { OLY } from '~/wallet/constants/tokens';
import { AddToWallet } from './addToWallet';

export const WalletSummary: FC = () => {
  const t = useTranslations('staking');
  const {
    olyBalance,
    olyPrice,
    afterHotData,
    AllolyStakeNum,
    allnetReabalseNum,
    demandProfitInfo,
  } = useNolockStore();
  const [principal, setPrincipal] = useState(0);
  const [yearApy, setYearApy] = useState<string>('0');
  const [yearRate, setYearRate] = useState<string>('0');
  const { userAddress } = useUserAddress();
  const [rebalseProfit, setRebalseProfit] = useState<number>(0);

  //活期的质押人数
  const { data: stakerAmount } = useQuery({
    queryKey: ['getStakerAmount'],
    queryFn: async () => {
      const response = await stakerNum();
      return response || null;
    },
    retry: 1,
    retryDelay: 10000000,
  });

  //oly的总量
  const { data: totalOlyNum } = useQuery({
    queryKey: ['totalSupply', userAddress],
    queryFn: async () => {
      const response = await getTotalSupply({
        TOKEN_ADDRESSES: OLY,
        decimal: 9,
      });
      return response || null;
    },
    retry: 1,
    retryDelay: 10000000,
  });

  //我的长期总奖励
  const { data: myStakeAmount } = useQuery({
    queryKey: ['getMyStakeAmount', userAddress],
    queryFn: async () => {
      const response = await personStakeAmount(userAddress as `0x${string}`);
      return response || null;
    },
    enabled: Boolean(userAddress),
  });

  useEffect(() => {
    if (afterHotData?.principal) {
      setPrincipal(afterHotData?.principal);
      return;
    }
    setPrincipal(0);
  }, [afterHotData]);

  //计算下一次爆块收益率
  useEffect(() => {
    if (allnetReabalseNum && AllolyStakeNum) {
      const rate = allnetReabalseNum / AllolyStakeNum;
      const yearApy = (Math.pow(1 + Number(rate), 720) - 1) * 100;
      const yearRate = rate * 2 * 360 * 100;
      setYearApy(formatNumbedecimalScale(yearApy, 2));
      setYearRate(formatNumbedecimalScale(yearRate, 2));
    }
  }, [allnetReabalseNum, AllolyStakeNum]);

  //rebase收益
  useEffect(() => {
    if (demandProfitInfo) {
      setRebalseProfit(demandProfitInfo.rebalseProfit);
    }
  }, [demandProfitInfo]);
  return (
    <Card>
      <CardHeader className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-2 flex-1'>
            <Statistics
              title={t('availableToStake')}
              value={`${formatCurrency(olyBalance, false)} OLY`}
            />
            <div className='h-px bg-border/20 w-full'></div>
            <Statistics
              title={t('stakedAmount')}
              value={`${formatCurrency(principal, false)} OLY`}
              desc={formatCurrency(principal * olyPrice)}
              info={
                <div className='flex flex-col space-y-2'>
                  {infoItems.map(item => (
                    <div key={item.label} className='flex justify-between'>
                      <span className='text-foreground/50'>{item.label}</span>
                      <span className='text-secondary'>{item.value}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Statistics title={t('apr')} value={`${yearApy}%`} />
            <div className='h-px bg-border/20 w-full'></div>
            <Statistics
              title={t('rebaseRewards')}
              value={`${formatCurrency(myStakeAmount?.unlockReward, false)} OLY`}
              desc={formatCurrency(
                Number(myStakeAmount?.unlockReward * olyPrice)
              )}
              info={
                <div className='flex flex-col space-y-2'>
                  {infoItems.map(item => (
                    <div key={item.label} className='flex justify-between'>
                      <span className='text-foreground/50'>{item.label}</span>
                      <span className='text-secondary'>{item.value}</span>
                    </div>
                  ))}
                </div>
              }
            />
          </div>
        </div>

        {/* <Button
          variant="accent"
          size="sm"
          clipSize={8}
          className="gap-2"
          clipDirection="topLeft-bottomRight"
        >
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <Image
              src="/images/widgets/logo.png"
              alt="logo"
              width={16}
              height={16}
            />
          </div>
          <span className="text-black">{t("addToMetaMask")}</span>
        </Button> */}
        <AddToWallet></AddToWallet>
        <Statistics
          title={'Unreleased Rewards'}
          value={`${formatCurrency(rebalseProfit, false)} OLY`}
          desc={formatCurrency(Number(rebalseProfit * olyPrice))}
        ></Statistics>
      </CardHeader>
      <List className='py-4'>
        <List.Item className='font-semibold'>
          <List.Label className='font-chakrapetch text-white text-base'>
            {t('statistics')}
          </List.Label>
          <List.Label className='text-gradient text-base'>
            {t('viewOnBscScan')}
          </List.Label>
        </List.Item>
        <List.Item>
          <List.Label>{t('annualPercentageRate')}</List.Label>
          <List.Value className='text-success'>{yearRate}%</List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t('totalStaked')}</List.Label>
          <List.Value className='text-secondary'>
            {AllolyStakeNum
              ? `${formatCurrency(AllolyStakeNum, false)} OLY`
              : '0 OLY'}
          </List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t('stakers')}</List.Label>
          <List.Value>{stakerAmount?.unlockUniqueCount || 0}</List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t('olyMarketCap')}</List.Label>
          {totalOlyNum ? formatCurrency(totalOlyNum * olyPrice) : 0}
        </List.Item>
      </List>
    </Card>
  );
};

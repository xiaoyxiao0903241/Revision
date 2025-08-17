import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import {
  BscScanLook,
  Card,
  CardHeader,
  InfoPopover,
  List,
  Statistics,
} from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import {
  formatCurrency,
  formatNumbedecimalScale,
  shortenAddress,
} from '~/lib/utils';
import { personStakeAmount, stakerNum } from '~/services/auth/dashboard';
import { useNolockStore } from '~/store/noLock';
import { demandStaking, OLY } from '~/wallet/constants/tokens';
import { getTotalSupply } from '~/wallet/lib/web3/stake';
import { AddToWallet } from './addToWallet';

export const WalletSummary: FC = () => {
  const t = useTranslations('staking');
  const t2 = useTranslations('tooltip');
  // const t3 = useTranslations('common');
  const {
    olyBalance,
    olyPrice,
    afterHotData,
    AllolyStakeNum,
    allnetReabalseNum,
    demandProfitInfo,
    hotDataStakeNum,
  } = useNolockStore();
  const [myStakeNum, setMyStakeNum] = useState(0);
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
    const myStakeNum = hotDataStakeNum + afterHotData?.principal;
    setMyStakeNum(myStakeNum);
  }, [afterHotData, hotDataStakeNum]);

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
              value={`${formatCurrency(myStakeNum, false)} OLY`}
              desc={formatCurrency(myStakeNum * olyPrice)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Statistics
              title={t('apr')}
              value={`${yearApy}%`}
              info={<span>{t2('stake.year_reate')}</span>}
            />
            <div className='h-px bg-border/20 w-full'></div>
            <Statistics
              title={t('rebaseRewards')}
              value={`${formatCurrency(myStakeAmount?.unlockReward, false)} OLY`}
              desc={formatCurrency(
                Number(myStakeAmount?.unlockReward * olyPrice)
              )}
            />
          </div>
        </div>
        <AddToWallet></AddToWallet>
        <Statistics
          title={t('Unreleased-Rewards')}
          value={`${formatCurrency(rebalseProfit, false)} OLY`}
          desc={formatCurrency(Number(rebalseProfit * olyPrice))}
          info={<span>{t2('stake.unreabase_rwards')}</span>}
        ></Statistics>
      </CardHeader>
      <List className='py-4'>
        <List.Item className='font-semibold'>
          <List.Label className='font-chakrapetch text-white text-base'>
            {t('statistics')}
          </List.Label>
          <List.Label className='text-gradient text-base  flex items-center gap-x-2'>
            <BscScanLook className='right-[10px] w-auto'>
              <div
                className='flex justify-between cursor-pointer'
                onClick={() => {
                  window.open(`https://bscscan.com/address/${demandStaking}`);
                }}
              >
                <div className='flex items-center gap-x-2'>
                  <span>{shortenAddress(demandStaking)}</span>
                </div>
              </div>
            </BscScanLook>
          </List.Label>
        </List.Item>
        <List.Item>
          <List.Label className='flex items-center gap-1'>
            {t('annualPercentageRate')}
            <InfoPopover>
              <div className='flex flex-col space-y-2'>{t2('stake.APR')}</div>
            </InfoPopover>
          </List.Label>
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

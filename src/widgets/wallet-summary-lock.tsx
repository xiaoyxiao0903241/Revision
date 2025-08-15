import { useQuery } from '@tanstack/react-query';
import { useSafeState } from 'ahooks';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { Card, CardHeader, List, Statistics } from '~/components';
import { InfoPopover } from '~/components/';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { infoItems } from '~/hooks/useMock';
import {
  formatCurrency,
  formatNumbedecimalScale,
  shortenAddress,
} from '~/lib/utils';
import { personStakeAmount, stakerNum } from '~/services/auth/dashboard';
import { useLockStore } from '~/store/lock';
import { OLY, staking } from '~/wallet/constants/tokens';
import type { StakingItem } from '~/wallet/lib/web3/stake';
import {
  depositDayList,
  getAllnetReabalseNum,
  getBalanceToken,
  getNodeStakes,
  getTotalSupply,
  getUserStakes,
} from '~/wallet/lib/web3/stake';
import { AddToWallet } from './addToWallet';

export const WalletSummaryLock: FC = () => {
  const t = useTranslations('staking');
  const t2 = useTranslations('tooltip');
  const { olyBalance, olyPrice } = useLockStore();
  const { userAddress } = useUserAddress();
  const [allStakeAmount, setAllStakeAmount] = useSafeState(0);
  const [yearApy, setYearApy] = useState<string>('0');
  const [yearRate, setYearRate] = useState<string>('0');

  //长期的质押人数
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

  //质押列表
  const { data: myStakingList } = useQuery({
    queryKey: ['UserStakes', userAddress],
    queryFn: () => getUserStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 42000,
  });

  //  节点质押
  const { data: myNodeStakingList } = useQuery({
    queryKey: ['UserNodeStakes', userAddress],
    queryFn: () => getNodeStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });

  //获取全网质押的的oly数量
  const { data: AllolyStakeNum } = useQuery({
    queryKey: ['AllolyStakeNum', userAddress],
    queryFn: () =>
      getBalanceToken({
        address: staking as `0x${string}`,
        TOKEN_ADDRESSES: OLY,
        decimal: 9,
      }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 600000,
  });

  // 获取全网oly的rebase数量
  const { data: allnetReabalseNum } = useQuery({
    queryKey: ['allnetReabalseNum'],
    queryFn: () => getAllnetReabalseNum(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 600000,
  });

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

  //获取质押总数量
  useEffect(() => {
    const updateList = async () => {
      let allStakeAmount = 0;
      if (myStakingList?.myStakingList || myNodeStakingList?.length) {
        const list =
          (myStakingList?.myStakingList.length &&
            (myStakingList?.myStakingList as StakingItem[])) ||
          [];
        const nodeList = myNodeStakingList?.length
          ? (myNodeStakingList as StakingItem[])
          : [];

        const allList = [...nodeList, ...list];
        allList.forEach(it => (allStakeAmount += it.pending));
        setAllStakeAmount(allStakeAmount);
      }
    };
    updateList();
  }, [
    myStakingList?.myStakingList,
    myStakingList,
    setAllStakeAmount,
    myNodeStakingList,
  ]);

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
              value={`${formatCurrency(allStakeAmount, false)} OLY`}
              desc={formatCurrency(olyPrice * allStakeAmount)}
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
            <Statistics
              title={t('apr')}
              value={`${yearApy}%`}
              info={<span>{t2('stake.year_reate')}</span>}
            />
            <div className='h-px bg-border/20 w-full'></div>
            <Statistics
              title={t('rebaseRewards')}
              value={`${formatCurrency(myStakeAmount?.lockReward, false)} OLY`}
              desc={formatCurrency(
                Number(myStakeAmount?.lockReward * olyPrice)
              )}
            />
          </div>
        </div>
        <AddToWallet></AddToWallet>
      </CardHeader>
      <List className='py-4'>
        <List.Item className='font-semibold'>
          <List.Label className='font-chakrapetch text-white text-base'>
            {t('statistics')}
          </List.Label>
          <List.Label className='text-gradient text-base flex items-center gap-x-2'>
            <span>{t('viewOnBscScan')}</span>
            <InfoPopover className='right-[70px]'>
              {depositDayList.map((it, index) => (
                <div
                  className='flex justify-between cursor-pointer'
                  key={index}
                  onClick={() => {
                    window.open(`https://bscscan.com/address/${it.token}`);
                  }}
                >
                  <span className='text-foreground/50'>
                    {it.day}&nbsp;
                    {t('days')}
                  </span>
                  <div className='flex items-center gap-x-2'>
                    <span>{shortenAddress(it.token)}</span>
                  </div>
                </div>
              ))}
            </InfoPopover>
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
          <List.Value>
            {(stakerAmount?.lockUniqueCount || 0) +
              (stakerAmount?.nodeUniqueCount || 0)}
          </List.Value>
        </List.Item>
        <List.Item>
          <List.Label>{t('olyMarketCap')}</List.Label>
          <List.Value>
            {totalOlyNum ? formatCurrency(totalOlyNum * olyPrice) : 0}
          </List.Value>
        </List.Item>
      </List>
    </Card>
  );
};

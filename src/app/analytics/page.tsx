'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Alert, Card, InfoPopover, View } from '~/components';
import { TVLChart, SmallChart, TVLStats } from '~/widgets';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { dashMess } from '~/services/auth/dashboard';
import { homeBaseData } from '~/services/auth/home';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { getBalanceToken } from '~/wallet/lib/web3/stake';
import { OLY, staking } from '~/wallet/constants/tokens';
import { useNolockStore } from '~/store/noLock';

type DepositItem = {
  createdAt: string;
  amount: string | number;
};

type smallChartData = {
  dates: string[];
  data: number[];
};
export default function AnalyticsPage() {
  const t = useTranslations('analytics');
  const { userAddress } = useUserAddress();
  const [depositList, setDepositList] = useState<Array<[string, number]>>([]);
  // const [priceList, setPriceList] = useState<smallChartData>({dates: [], data: []});
  const [marketList, setMarketList] = useState<smallChartData>({
    dates: [],
    data: [],
  });
  const [treasuryList, setTreasuryList] = useState<smallChartData>({
    dates: [],
    data: [],
  });
  const [lpBondMarketCapList, setLpBondMarketCapList] =
    useState<smallChartData>({ dates: [], data: [] });
  const [supplyList, setSupplyList] = useState<smallChartData>({
    dates: [],
    data: [],
  });
  const [baseInfo, setBaseInfo] = useState({});

  const { AllolyStakeNum } = useNolockStore();

  //质押列表
  const { data: dashMessInfo } = useQuery({
    queryKey: ['dashMess', userAddress],
    queryFn: () =>
      dashMess(
        dayjs().subtract(1, 'y').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });
  const { data: homeBaseInfo } = useQuery({
    queryKey: ['homeBaseData', userAddress],
    queryFn: () => homeBaseData(),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });

  //获取全网锁定质押的的oly数量
  const { data: AllLockOlyStakeNum } = useQuery({
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

  useEffect(() => {
    setBaseInfo({
      ...homeBaseInfo,
      AllolyStakeNum: AllolyStakeNum,
      AllLockOlyStakeNum: AllLockOlyStakeNum || 0,
    });
  }, [AllolyStakeNum, AllolyStakeNum, homeBaseInfo, AllLockOlyStakeNum]);

  const formatData = (data: DepositItem[]) => {
    const dateArr: string[] = [];
    const dataArr: number[] = [];
    data.forEach(item => {
      dateArr.push(dayjs(item.createdAt).format('YYYY-MM-DD'));
      dataArr.push(Number(item.amount));
    });
    return { dates: dateArr, data: dataArr };
  };

  useEffect(() => {
    const depositList = dashMessInfo?.depositList || [];
    // const priceList = dashMessInfo?.priceList || [];
    const marketList = dashMessInfo?.marketList || [];
    const treasuryList = dashMessInfo?.treasuryList || [];
    const lpBondMarketCapList = dashMessInfo?.lpBondMarketCapList || [];
    const supplyList = dashMessInfo?.supplyList || [];
    if (depositList?.length) {
      const formattedList = depositList.map(item => {
        return [
          dayjs(item.createdAt).format('YYYY-MM-DD'),
          Number(item.amount),
        ] as [string, number];
      });
      setDepositList(formattedList);
    }
    // if (priceList?.length) {
    //   const formattedList = formatData(priceList);
    //   setPriceList(formattedList);
    // }
    // 流通市值
    if (marketList?.length) {
      const formattedList = formatData(marketList);
      setMarketList(formattedList);
    }
    if (treasuryList?.length) {
      const formattedList = formatData(treasuryList);
      setTreasuryList(formattedList);
    }
    if (lpBondMarketCapList?.length) {
      const formattedList = formatData(lpBondMarketCapList);
      setLpBondMarketCapList(formattedList);
    }
    // 流通量
    if (supplyList?.length) {
      const formattedList = formatData(supplyList);
      setSupplyList(formattedList);
    }
  }, [dashMessInfo]);

  return (
    <div className='space-y-6'>
      {/* 顶部Alert */}
      <Alert
        icon='blocks'
        iconSize={24}
        title={t('title')}
        description={t('analytics_description')}
      />

      {/* 主要内容区域 */}
      <div className='space-y-6'>
        {/* Overview区域 */}
        <Card className='flex flex-col'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/icon/overview.png'
              alt='overview'
              width={24}
              height={24}
            />
            <h3 className='text-xl font-bold text-white'>{t('overview')}</h3>
          </div>
          <div className='flex flex-col lg:flex-row gap-6'>
            <div className='w-full lg:w-7/12'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-sm text-gray-400'>
                  {t('total_value_locked')}
                </span>
                <InfoPopover>
                  <p className='text-white font-mono text-sm break-all whitespace-normal'>
                    预览图表说明
                  </p>
                </InfoPopover>
              </div>
              <TVLChart height={300} dataSource={depositList || []} />
            </div>

            <div className='w-full lg:w-5/12'>
              {/* 右侧：TVL统计 */}
              <View
                clipDirection='topLeft-bottomRight'
                className='w-full py-5 px-6 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
              >
                <TVLStats dataSource={baseInfo} />
              </View>
            </div>
          </div>
        </Card>

        {/* 底部4个小图表 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* OLY流通市值 */}
          <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('oly_market_cap')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('oly_market_cap')}
              dataSource={marketList}
            />
          </Card>

          {/* OLY流通量 */}
          <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('oly_circulation')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('oly_circulation')}
              dataSource={supplyList}
            />
          </Card>

          {/* 国库无风险价值 */}
          <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('treasury_risk_free_value')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('treasury_risk_free_value')}
              dataSource={lpBondMarketCapList || []}
            />
          </Card>

          {/* 国库??? ① */}
          <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('treasury_unknown')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('treasury_unknown')}
              dataSource={treasuryList || []}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

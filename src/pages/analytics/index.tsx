import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Alert, Card, InfoPopover, View } from '~/components';
import { TVLChart, SmallChart, TVLStats } from '~/widgets';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useNolockStore } from '~/store/noLock';
import {
  dashMess,
  responseItem,
  responseItemDefault,
} from '~/services/auth/dashboard';
// import { homeBaseData } from '~/services/auth/home';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
// import { getBalanceToken, getTotalSupply } from '~/wallet/lib/web3/stake';
// import { OLY, staking } from '~/wallet/constants/tokens';
// import { useNolockStore } from '~/store/noLock';

type DepositItem = {
  createdAt: string;
  amount: string | number;
};

type smallChartData = {
  dates: string[];
  data: number[];
};

export type TVLDataSourceType = {
  tokenMarketCap?: number;
  lpMarketCap?: number;
  treasuryMarketCap?: number;
  AllolyStakeNum?: number;
  AllLockOlyStakeNum?: number;
  flexibleStakedAmount: number;
  longStakedAmount: number;
};
export default function AnalyticsPage() {
  const t = useTranslations('analytics');
  const t2 = useTranslations('tooltip');
  const { userAddress } = useUserAddress();
  const { olyPrice } = useNolockStore();
  const [depositList, setDepositList] = useState<Array<[string, string]>>([]);
  const [todayObj, setTodayObj] = useState<responseItem>(responseItemDefault);
  const [yesterdayObj, setYesterdayObj] =
    useState<responseItem>(responseItemDefault);

  // const [priceList, setPriceList] = useState<smallChartData>({dates: [], data: []});
  // const { olyPrice, AllolyStakeNum } = useNolockStore();
  const [marketList, setMarketList] = useState<smallChartData>({
    dates: [],
    data: [],
  });
  // const [treasuryList, setTreasuryList] = useState<smallChartData>({
  //   dates: [],
  //   data: [],
  // });

  // const [lpBondMarketCapList, setLpBondMarketCapList] =
  //   useState<smallChartData>({ dates: [], data: [] });
  const [supplyList, setSupplyList] = useState<smallChartData>({
    dates: [],
    data: [],
  });
  // const [backingPriceList, setBackingPriceList] = useState<smallChartData>({
  //   dates: [],
  //   data: [],
  // });
  // const [premiumList, setPremiumList] = useState<smallChartData>({
  //   dates: [],
  //   data: [],
  // });
  // const [baseInfo, setBaseInfo] = useState<TVLDataSourceType>({
  //   flexibleStakedAmount: 0,
  //   longStakedAmount: 0
  // });

  //质押列表
  const { data: dashMessInfo } = useQuery({
    queryKey: ['analyticsDashMess', userAddress],
    queryFn: () =>
      dashMess(
        dayjs().subtract(1, 'y').format('YYYY-MM-DD'),
        dayjs().format('YYYY-MM-DD')
      ),
    enabled: Boolean(userAddress),
    // retry: 1,
    // refetchInterval: 20000,
  });
  // const { data: homeBaseInfo } = useQuery({
  //   queryKey: ['homeBaseData', userAddress],
  //   queryFn: () => homeBaseData(),
  //   enabled: Boolean(userAddress),
  //   // retry: 1,
  //   // refetchInterval: 20000,
  // });

  console.log(dashMessInfo, 'dashMessInfodashMessInfo');

  //获取全网锁定质押的的oly数量
  // const { data: AllLockOlyStakeNum } = useQuery({
  //   queryKey: ['analyticsAllolyStakeNum', userAddress],
  //   queryFn: () =>
  //     getBalanceToken({
  //       address: staking as `0x${string}`,
  //       TOKEN_ADDRESSES: OLY,
  //       decimal: 9,
  //     }),
  //   enabled: Boolean(userAddress),
  //   // retry: 1,
  //   // refetchInterval: 600000,
  // });

  //oly的总量
  // const { data: totalOlyNum } = useQuery({
  //   queryKey: ['analyticsTotalSupply', userAddress],
  //   queryFn: async () => {
  //     const response = await getTotalSupply({
  //       TOKEN_ADDRESSES: OLY,
  //       decimal: 9,
  //     });
  //     return response || null;
  //   },
  // });

  // useEffect(() => {
  //   setBaseInfo({
  //     ...homeBaseInfo,
  //     AllolyStakeNum: AllolyStakeNum,
  //     AllLockOlyStakeNum: AllLockOlyStakeNum || 0,
  //     tokenMarketCap: (totalOlyNum || 0) * olyPrice,
  //   });
  //   console.log(baseInfo, 'baseInfo');
  // }, [
  //   AllolyStakeNum,
  //   AllolyStakeNum,
  //   homeBaseInfo,
  //   AllLockOlyStakeNum,
  //   totalOlyNum,
  //   olyPrice,
  // ]);

  const formatData = (data: DepositItem[], type?: string) => {
    const dateArr: string[] = [];
    const dataArr: number[] = [];
    data.forEach(item => {
      dateArr.push(dayjs(item.createdAt).format('YYYY-MM-DD'));
      if (type) {
        dataArr.push(
          Math.floor(Number(item.amount || 0) * Number(olyPrice || 0))
        );
      } else {
        dataArr.push(Math.floor(Number(item.amount || 0)));
      }
    });
    return { dates: dateArr, data: dataArr };
  };

  useEffect(() => {
    const depositList = dashMessInfo?.depositList || [];
    // const priceList = dashMessInfo?.priceList || [];
    const marketList = dashMessInfo?.marketList || [];
    // const treasuryList = dashMessInfo?.treasuryList || [];
    // const lpBondMarketCapList = dashMessInfo?.lpBondMarketCapList || [];
    const supplyList = dashMessInfo?.supplyList || [];
    // const backingPriceList = dashMessInfo?.backingPriceList || [];
    // const premiumList = dashMessInfo?.PremiumList || [];
    const newTodayObj = dashMessInfo?.todayObj
      ? {
          amount: dashMessInfo.todayObj.amount || 0,
          createdAt: dashMessInfo.todayObj.createdAt || '',
          week: dashMessInfo.todayObj.week || '',
          tokenTotalSupply: dashMessInfo.todayObj.tokenTotalSupply || 0,
          tokenPrice: dashMessInfo.todayObj.tokenPrice || 0,
          treasuryMarketCap: dashMessInfo.todayObj.treasuryMarketCap || 0,
          lpMarketCap: dashMessInfo.todayObj.lpMarketCap || 0,
          longStakedAmount:
            Number(dashMessInfo.todayObj.longStakedAmount || 0) *
            Number(olyPrice || 0),
          flexibleStakedAmount:
            Number(dashMessInfo.todayObj.flexibleStakedAmount || 0) *
            Number(olyPrice || 0),
          lpBondMarketCap: dashMessInfo.todayObj.lpBondMarketCap || 0,
          liquidityBondMarketCap:
            dashMessInfo.todayObj.liquidityBondMarketCap || 0,
          stableBondMarketCap: dashMessInfo.todayObj.stableBondMarketCap || 0,
          TVL: Number(dashMessInfo.todayObj.TVL || 0) * Number(olyPrice || 0),
        }
      : responseItemDefault;

    const newYesterdayObj = dashMessInfo?.yesterdayObj
      ? {
          amount: dashMessInfo.yesterdayObj.amount || 0,
          createdAt: dashMessInfo.yesterdayObj.createdAt || '',
          week: dashMessInfo.yesterdayObj.week || '',
          tokenTotalSupply: dashMessInfo.yesterdayObj.tokenTotalSupply || 0,
          tokenPrice: dashMessInfo.yesterdayObj.tokenPrice || 0,
          treasuryMarketCap: dashMessInfo.yesterdayObj.treasuryMarketCap || 0,
          lpMarketCap: dashMessInfo.yesterdayObj.lpMarketCap || 0,
          longStakedAmount:
            Number(dashMessInfo.yesterdayObj.longStakedAmount || 0) *
            Number(olyPrice || 0),
          flexibleStakedAmount:
            Number(dashMessInfo.yesterdayObj.flexibleStakedAmount || 0) *
            Number(olyPrice || 0),
          lpBondMarketCap: dashMessInfo.yesterdayObj.lpBondMarketCap || 0,
          liquidityBondMarketCap:
            dashMessInfo.yesterdayObj.liquidityBondMarketCap || 0,
          stableBondMarketCap:
            dashMessInfo.yesterdayObj.stableBondMarketCap || 0,
          TVL:
            Number(dashMessInfo.yesterdayObj.TVL || 0) * Number(olyPrice || 0),
        }
      : responseItemDefault;
    console.log(newTodayObj, newYesterdayObj, 'dashMessInfo?.todayObj');
    setTodayObj(newTodayObj || responseItemDefault);
    setYesterdayObj(newYesterdayObj || responseItemDefault);

    if (depositList?.length) {
      const formattedList = depositList.map(item => {
        return [
          dayjs(item.createdAt).format('YYYY-MM-DD'),
          (Number(item.amount || 0) * Number(olyPrice || 0)).toFixed(0),
        ] as [string, string];
      });
      setDepositList(formattedList);
    }
    // if (priceList?.length) {
    //   const formattedList = formatData(priceList);
    //   setPriceList(formattedList);
    // }
    // 流通市值
    if (marketList?.length) {
      const formattedList = formatData(marketList, 'market');
      setMarketList(formattedList);
    }
    // if (treasuryList?.length) {
    //   const formattedList = formatData(treasuryList);
    //   setTreasuryList(formattedList);
    // }
    // if (lpBondMarketCapList?.length) {
    //   const formattedList = formatData(lpBondMarketCapList);
    //   setLpBondMarketCapList(formattedList);
    // }
    // 流通量
    if (supplyList?.length) {
      const formattedList = formatData(supplyList);
      setSupplyList(formattedList);
    }
    // 托底价格
    // if (backingPriceList?.length) {
    //   const formattedList = formatData(backingPriceList);
    //   setBackingPriceList(formattedList);
    // }
    // 托底价格
    // if (premiumList?.length) {
    //   const formattedList = formatData(premiumList);
    //   setPremiumList(formattedList);
    // }
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
                    {t2('analytics.total_value')}
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
                <TVLStats todayObj={todayObj} yesterdayObj={yesterdayObj} />
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
                  {t2('analytics.circulation_market')}
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('oly_market_cap')}
              dataSource={marketList}
              currency='$'
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
                  {t2('analytics.oly_circulation')}
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
          {/* <Card>
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
          </Card> */}

          {/* 国库??? ① */}
          {/* <Card>
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
          </Card> */}

          {/* 托底价格 */}
          {/* <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('backingPrice')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('backingPrice')}
              dataSource={backingPriceList || []}
            />
          </Card> */}

          {/* 溢价指数 */}
          {/* <Card>
            <div className='flex items-center gap-2 '>
              <h4 className='text-xl font-semibold text-white'>
                {t('Premium')}
              </h4>
              <InfoPopover>
                <p className='text-white font-mono text-sm break-all whitespace-normal'>
                  分析页面说明
                </p>
              </InfoPopover>
            </div>
            <SmallChart
              className='h-[272px]'
              title={t('Premium')}
              dataSource={premiumList || []}
            />
          </Card> */}
        </div>
      </div>
    </div>
  );
}

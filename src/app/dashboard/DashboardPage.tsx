'use client';
import { useQuery } from '@tanstack/react-query';
import { useSafeState } from 'ahooks';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Alert, Statistics } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { dayjs, formatNumbedecimalScale } from '~/lib/utils';
import { myMess } from '~/services/auth/dashboard';
import { nodeSummary } from '~/services/auth/node';
// import { getSaleOverview } from '~/wallet/lib/web3/node';
import Bonus from './components/bonus';
import Market from './components/market';
import Stake from './components/stake';
import { useNolockStore } from '~/store/noLock';

export type myMessDataType = {
  bondRewardAmount: string;
  claimableBonus: string;
  communityLevel: string;
  market: string;
  marketList: unknown;
  referralCount: number;
  salesAmount: string;
  smallMarket: string;
  stakedRewardAmount: string;
  teamCount: string;
  totalBonus: string;
  validReferralCount: number;
  maxBonus: string;
};

const defaultMyMessData: myMessDataType = {
  bondRewardAmount: '0',
  claimableBonus: '0',
  communityLevel: '0',
  market: '0',
  marketList: '0',
  referralCount: 0,
  salesAmount: '0',
  smallMarket: '0',
  stakedRewardAmount: '0',
  teamCount: '0',
  totalBonus: '0',
  validReferralCount: 0,
  maxBonus: '0',
};
export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const t2 = useTranslations('tooltip');
  const { olyPrice } = useNolockStore();
  const [myMessInfo, setMyMessInfo] = useSafeState<myMessDataType>();
  const [saleAmount, setSaleAmount] = useState<number>(0);
  const [nodeAmount, setNodeAmount] = useState<number>(0);
  const [startTime] = useState<string>(
    dayjs().subtract(1, 'month').format('YYYY-MM-DD')
  );
  const [endTime] = useState<string>(
    dayjs().add(1, 'day').format('YYYY-MM-DD')
  );
  const { userAddress } = useUserAddress();

  const { data: myMessData } = useQuery({
    queryKey: ['dashboardMyMess', userAddress],
    queryFn: () => {
      return myMess(startTime, endTime, userAddress as `0x${string}`);
    },
    enabled: Boolean(userAddress && startTime && endTime),
    // refetchInterval: 20000,
  });
  console.log(myMessData, 'mymyMessData');

  // 获取当前总价
  // const { data: saleOverview } = useQuery({
  //   queryKey: ['getSaleOverview', userAddress],
  //   queryFn: () => getSaleOverview({ address: userAddress as `0x${string}` }),
  //   enabled: Boolean(userAddress),
  //   // refetchInterval: 34000,
  // });

  // 我的节点总额
  const { data: nodeSummaryData } = useQuery({
    queryKey: ['nodeSummary', userAddress],
    queryFn: () => nodeSummary(1, 50, userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
    // refetchInterval: 34000,
  });

  useEffect(() => {
    let nodeTotal = 0;
    const records = nodeSummaryData?.records || [];
    if (records?.length) {
      records.forEach(
        (item: { amount: string | number }) =>
          (nodeTotal += Number(item.amount))
      );
    }
    setSaleAmount(nodeTotal * (olyPrice || 0));
    setNodeAmount(nodeTotal);
  }, [nodeSummaryData, olyPrice]);

  // useEffect(() => {
  //   if (saleOverview?.salesInfo) {
  //     let amount = BigInt(0);
  //     const salesInfo = saleOverview.salesInfo;
  //     Object.keys(salesInfo)
  //       .map(key => Number(key) as keyof typeof salesInfo)
  //       .forEach(key => {
  //         const item = salesInfo[key];
  //         if (item !== null) {
  //           amount += item.amount;
  //         }
  //       });
  //     const formattedAmount = (Number(amount) / 1e18).toFixed(2);

  //   }
  // }, [saleOverview]);

  useEffect(() => {
    setMyMessInfo(myMessData);
  }, [myMessData]);

  return (
    <div className='space-y-6'>
      {/* 页面标题和描述 */}
      <Alert
        icon='dashboard'
        title={t('title')}
        description={t('description')}
      />
      {/* 质押和债券仓位区域 */}
      <Stake myMessInfo={myMessInfo || defaultMyMessData} />

      {/* 社区和众筹计划区域 */}
      <div className='nine-patch-frame alert relative w-full grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* 社区 */}
        <div className='p-6 flex flex-col gap-6 border-b lg:border-r border-secondary/20 border-dashed'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/icon/community.png'
              alt='community'
              width={24}
              height={24}
            />
            <span className='text-white text-xl font-semibold'>
              {t('community')}
            </span>
          </div>
          <div className='flex justify-between'>
            <Statistics
              title={t('directReferral')}
              info=''
              value={`${myMessInfo?.validReferralCount || 0}/${myMessInfo?.referralCount || 0}`}
              size='sm'
            />
            <Statistics
              title={t('communityAddressCount')}
              value={String(myMessInfo?.teamCount || 0)}
              size='sm'
            />
          </div>
        </div>
        <div className='p-6 flex flex-col gap-6 lg:border-r lg:border-secondary/20 lg:border-dashed'>
          <div className='flex items-center gap-2'>
            <Image
              src='/images/icon/rocket.png'
              alt='rocket'
              width={24}
              height={24}
            />
            <span className='text-white text-xl font-semibold'>
              {t('crowdfundingProgram')}
            </span>
          </div>
          <div className='flex justify-between'>
            <Statistics
              title={t('genesisSize')}
              value={`${formatNumbedecimalScale(nodeAmount, 2)} USDT`}
              size='sm'
              info={<span>{t2('dash.invite_serving')}</span>}
            />
            <Statistics
              title={t('currentTotalValue')}
              value={`${formatNumbedecimalScale(saleAmount?.toString(), 2)} USDT`}
              size='sm'
              info={<span>{t2('dash.all_value')}</span>}
            />
          </div>
        </div>
      </div>
      {/* 业绩区域 */}
      <Market myMessInfo={myMessInfo || defaultMyMessData} />
      {/* 奖金区域 */}
      <Bonus myMessInfo={myMessInfo || defaultMyMessData} />
    </div>
  );
}

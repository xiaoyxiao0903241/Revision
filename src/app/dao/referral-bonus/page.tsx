'use client';
import { useTranslations } from 'next-intl';
import { Alert, Card, Statistics } from '~/components';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useNolockStore } from '~/store/noLock';
import { serviceReward } from '~/services/auth/dao';
import { formatNumbedecimalScale, formatte2Num } from '~/lib/utils';
import { ClaimSection } from '../components/ClaimSection';
import DaoRecords from '../components/DaoRecords';

export default function SuperBonusPage() {
  const t = useTranslations('dao');
  const { userAddress } = useUserAddress();
  const { olyPrice } = useNolockStore();

  // 奖励信息
  const { data: serviceRewardData, refetch } = useQuery({
    queryKey: ['leadReward', userAddress],
    queryFn: () => serviceReward(userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
  });
  console.log(serviceRewardData, 'serviceRewardData');

  return (
    <div className='space-y-6'>
      {/* 顶部Alert */}
      <Alert
        icon='blocks'
        iconSize={24}
        title={t('referral_bonus_title')}
        description={t('referral_bonus_description')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* 左侧：领取区域 */}
        <div className='space-y-6'>
          <ClaimSection
            refetch={refetch}
            rewardData={serviceRewardData}
            type='service'
          />
        </div>
        {/* 右侧：账户摘要 */}
        <div className='space-y-4'>
          <Card containerClassName='flat-body'>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('net_holding')}
                value={`${formatte2Num.format(serviceRewardData?.totalDepositAmount || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((serviceRewardData?.totalDepositAmount || 0) * olyPrice, 2)}`}
              />
              <Statistics
                title={t('evangelist_level')}
                value={`V${serviceRewardData?.communityLevel ? (serviceRewardData?.communityLevel <= 10 ? serviceRewardData?.communityLevel : 10) : 0}`}
              />
            </div>
            <div className='border-t border-foreground/20 w-full'></div>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('total_bonus_amount')}
                value={`${formatte2Num.format(serviceRewardData?.totalBonus || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((serviceRewardData?.totalBonus || 0) * olyPrice, 2)}`}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 底部：记录表格 */}
      <DaoRecords type='service' />
    </div>
  );
}

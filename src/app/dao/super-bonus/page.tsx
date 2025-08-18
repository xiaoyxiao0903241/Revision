'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Alert, Card, Statistics } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { formatNumbedecimalScale } from '~/lib/utils';
import { leadReward } from '~/services/auth/dao';
import { useNolockStore } from '~/store/noLock';
import { ClaimSection } from '../components/ClaimSection';
import DaoRecords, { DaoRecordsRef } from '../components/DaoRecords';

export default function SuperBonusPage() {
  const t = useTranslations('dao');
  const { userAddress } = useUserAddress();
  const { olyPrice } = useNolockStore();
  const daoRecordsRef = useRef<DaoRecordsRef>(null);
  // 奖励信息
  const { data: leadRewardData, refetch } = useQuery({
    queryKey: ['leadReward', userAddress],
    queryFn: () => leadReward(userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
  });

  const handleManualRefresh = () => {
    console.log(daoRecordsRef, 'daoRecordsRef');
    if (daoRecordsRef.current) {
      daoRecordsRef.current.handleManualRefresh();
    }
  };

  return (
    <div className='space-y-6'>
      {/* 顶部Alert */}
      <Alert
        icon='blocks'
        iconSize={24}
        title={t('super_bonus_title')}
        description={t('super_bonus_description')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* 左侧：领取区域 */}
        <div className='space-y-6'>
          <ClaimSection
            refetch={refetch}
            rewardData={leadRewardData}
            type='lead'
            onSuccess={handleManualRefresh}
          />
        </div>
        {/* 右侧：账户摘要 */}
        <div className='space-y-4'>
          <Card containerClassName='flat-body'>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('evangelist_level')}
                value={`V${leadRewardData?.communityLevel ? (leadRewardData?.communityLevel <= 10 ? leadRewardData?.communityLevel : 10) : 0}`}
              />
              <Statistics
                title={t('v_level_members_within_10_layers')}
                value={leadRewardData?.levelTierCount}
              />
            </div>
            <div className='border-t border-foreground/20 w-full'></div>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('total_bonus_amount')}
                value={`${formatNumbedecimalScale(leadRewardData?.totalBonus || 0, 2)} OLY`}
                desc={`$${formatNumbedecimalScale((leadRewardData?.totalBonus || 0) * olyPrice, 2)}`}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 底部：记录表格 */}
      <DaoRecords ref={daoRecordsRef} type='lead' />
    </div>
  );
}

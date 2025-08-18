import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Alert, Card, Statistics } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { formatNumbedecimalScale } from '~/lib/utils';
import { rewardPromotion } from '~/services/auth/dao';
import { useNolockStore } from '~/store/noLock';
import { ClaimSection } from '../components/ClaimSection';
import DaoRecords, { DaoRecordsRef } from '../components/DaoRecords';
import DaoLayout from '../layout';

export default function EvangelistBonusPage() {
  const t = useTranslations('dao');
  const daoRecordsRef = useRef<DaoRecordsRef>(null);
  const { userAddress } = useUserAddress();
  const { olyPrice } = useNolockStore();

  // 奖励信息
  const { data: rewardPromotionData, refetch } = useQuery({
    queryKey: ['rewardMatrix', userAddress],
    queryFn: () => rewardPromotion(userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
  });
  console.log(rewardPromotionData, 'rewardPromotionData');

  const handleManualRefresh = () => {
    console.log(daoRecordsRef, 'daoRecordsRef');
    if (daoRecordsRef.current) {
      daoRecordsRef.current.handleManualRefresh();
    }
  };

  return (
    <DaoLayout>
      <div className='space-y-6'>
        {/* 顶部Alert */}
        <Alert
          icon='blocks'
          iconSize={24}
          title={t('evangelist_bonus')}
          description={t('evangelist_bonus_description')}
        />

        {/* 主要内容区域 */}
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
          {/* 左侧：领取区域 */}
          <div className='space-y-6'>
            <ClaimSection
              refetch={refetch}
              rewardData={rewardPromotionData}
              type='promotion'
              onSuccess={handleManualRefresh}
            />
          </div>
          {/* 右侧：账户摘要 */}
          <div className='space-y-4'>
            <Card containerClassName='flat-body'>
              <div className='grid grid-cols-2 gap-4'>
                <Statistics
                  title={t('net_holding')}
                  value={`${formatNumbedecimalScale(rewardPromotionData?.totalDepositAmount || 0, 2)} OLY`}
                  desc={`$${formatNumbedecimalScale((rewardPromotionData?.totalDepositAmount || 0) * olyPrice, 2)}`}
                />
                <Statistics
                  title={t('direct_referral_count')}
                  value={rewardPromotionData?.referralCount || 0}
                />
              </div>
              <div className='border-t border-foreground/20 w-full'></div>
              <div className='grid grid-cols-2 gap-4'>
                <Statistics
                  title={t('evangelist_level')}
                  value={`V${rewardPromotionData?.communityLevel ? (rewardPromotionData?.communityLevel <= 10 ? rewardPromotionData?.communityLevel : 10) : 0}`}
                />
                <Statistics
                  title={t('small_team_performance')}
                  value={`${formatNumbedecimalScale(rewardPromotionData?.smallMarket || 0, 2)} OLY`}
                  desc={`$${formatNumbedecimalScale((rewardPromotionData?.smallMarket || 0) * olyPrice, 2)}`}
                />
              </div>
              <div className='border-t border-foreground/20 w-full mt-4'></div>
              <div className='grid grid-cols-2 gap-4 mt-4'>
                <Statistics
                  title={t('total_performance')}
                  value={`${formatNumbedecimalScale(rewardPromotionData?.market || 0, 2)} OLY`}
                  desc={`$${formatNumbedecimalScale((rewardPromotionData?.market || 0) * olyPrice, 2)}`}
                />
                <Statistics
                  title={t('total_bonus_amount')}
                  value={`${formatNumbedecimalScale(rewardPromotionData?.totalBonus || 0, 2)} OLY`}
                  desc={`$${formatNumbedecimalScale((rewardPromotionData?.totalBonus || 0) * olyPrice, 2)}`}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* 底部：记录表格 */}
        <DaoRecords ref={daoRecordsRef} type='promotion' />
      </div>
    </DaoLayout>
  );
}

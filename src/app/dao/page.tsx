'use client';
import { useTranslations } from 'next-intl';
import { Alert, Card, Statistics } from '~/components';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { rewardMatrix } from '~/services/auth/dao';
import { formatNumbedecimalScale, formatte2Num } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import DaoRecords, { DaoRecordsRef } from './components/DaoRecords';
import { ClaimSection } from './components/ClaimSection';
import { useRef } from 'react';

export default function DaoPage() {
  const t = useTranslations('dao');
  const { userAddress } = useUserAddress();
  const { olyPrice } = useNolockStore();
  const daoRecordsRef = useRef<DaoRecordsRef>(null);
  // 奖励信息
  const { data: rewardMatrixData, refetch: refetchLeadReward } = useQuery({
    queryKey: ['rewardMatrix', userAddress],
    queryFn: () => rewardMatrix(userAddress as `0x${string}`),
    enabled: Boolean(userAddress),
  });
  const handleManualRefresh = () => {
    console.log(daoRecordsRef, 'daoRecordsRef');
    if (daoRecordsRef.current) {
      daoRecordsRef.current.handleManualRefresh();
    } else {
      console.log('daoRecordsRef.current is null or undefined');
    }
  };
  return (
    <div className='space-y-6'>
      {/* 顶部Alert */}
      <Alert
        icon='blocks'
        title={t('matrix_bonus')}
        iconSize={24}
        description={t('matrix_bonus_description')}
      />

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        {/* 左侧：领取区域 - 使用新组件 */}
        <div className='space-y-6'>
          <ClaimSection
            refetch={refetchLeadReward}
            rewardData={rewardMatrixData}
            type='matrix'
            onSuccess={handleManualRefresh}
          />
        </div>

        {/* 右侧：账户摘要 */}
        <div className='space-y-4'>
          <Card containerClassName='flat-body'>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('net_holding')}
                value={`${formatte2Num.format(rewardMatrixData?.totalDepositAmount || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((rewardMatrixData?.totalDepositAmount || 0) * olyPrice, 2)}`}
              />
              <Statistics
                title={t('direct_referral_count')}
                value={rewardMatrixData?.referralCount || 0}
              />
            </div>
            <div className='border-t border-foreground/20 w-full'></div>
            <div className='grid grid-cols-2 gap-4'>
              <Statistics
                title={t('unlock_layers')}
                value={
                  (rewardMatrixData?.validReferralCount || 0) <= 10
                    ? rewardMatrixData?.validReferralCount || 0
                    : 10
                }
              />
              <Statistics
                title={t('total_bonus_amount')}
                value={`${formatte2Num.format(rewardMatrixData?.totalBonus || 0)} OLY`}
                desc={`$${formatNumbedecimalScale((rewardMatrixData?.totalBonus || 0) * olyPrice, 2)}`}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* 底部：记录表格 */}
      <DaoRecords ref={daoRecordsRef} type='matrix' />
    </div>
  );
}

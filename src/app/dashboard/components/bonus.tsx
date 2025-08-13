'use client';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Card, Statistics, Button } from '~/components';
import { useUserAddress } from '~/contexts/UserAddressContext';
import { useQuery } from '@tanstack/react-query';
import { myMessDataType } from '../DashboardPage';
import { formatNumbedecimalScale } from '~/lib/utils';
import { useNolockStore } from '~/store/noLock';
import { newRewardList } from '~/wallet/lib/web3/claim';
// import { coolAllCLaimAmount } from "~/services/auth/claim";
import { getStakeNum } from '~/wallet/lib/web3/turbine';
import { turbineMess } from '~/services/auth/turbine';
import { useRouter } from 'next/navigation';

const Bonus = ({ myMessInfo }: { myMessInfo: myMessDataType }) => {
  const safeMyMessInfo = myMessInfo || {};
  const t = useTranslations('dashboard');
  const router = useRouter();
  const { olyPrice } = useNolockStore();
  const { userAddress } = useUserAddress();

  const { data: myReward } = useQuery({
    queryKey: ['getRewardList', userAddress],
    queryFn: () => newRewardList({ address: userAddress as string }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  // const { data: coolAllCLaimAmountData } = useQuery({
  //   queryKey: ["coolAllCLaimAmount", userAddress],
  //   queryFn: () => coolAllCLaimAmount(userAddress as string),
  //   enabled: Boolean(userAddress),
  //   retry: 1,
  //   refetchInterval: 30000,
  // });

  // 获取涡轮中的奖金信息
  const { data: turbineMessData } = useQuery({
    queryKey: ['turbineMess', userAddress],
    queryFn: () => turbineMess(userAddress as string),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 30000,
  });

  // 获取涡轮可解锁的数量
  const { data: stakeAmount } = useQuery({
    queryKey: ['userStakeNum', userAddress],
    queryFn: () => getStakeNum({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 25000,
  });

  return (
    <Card className='flex flex-col gap-6'>
      <div className='flex items-center gap-2'>
        <Image
          src='/images/icon/medal.png'
          alt='medal'
          width={24}
          height={24}
        />
        <span className='text-white text-xl font-semibold'>{t('rewards')}</span>
      </div>
      {/* 顶部统计 */}
      <div className='grid grid-cols-2 gap-6 w-full xl:w-1/2'>
        <Statistics
          title={t('totalRewardsAmount')}
          value={`${formatNumbedecimalScale(safeMyMessInfo?.totalBonus || 0, 2)} OLY`}
          size='md'
        />
        <Statistics
          title={t('maxRewardsAmount')}
          value={`${formatNumbedecimalScale(Number(safeMyMessInfo?.maxBonus || 0), 2)} OLY`}
          size='md'
        />
      </div>

      {/* 奖金卡片网格 */}
      <div className='grid grid-cols-1 lg:grid-cols-4'>
        {/* 奖金池 - 占据左侧整个高度 */}
        <div className='lg:row-span-3 nine-patch-frame grid-body relative w-full h-full flex flex-col items-center justify-center'>
          <div className='flex flex-col gap-2 items-center justify-center'>
            <div>{t('rewardPool')}</div>
            <div className='font-mono text-2xl font-bold text-gradient'>
              {formatNumbedecimalScale(safeMyMessInfo?.totalBonus || 0, 2)} OLY
            </div>
            <div className='text-foreground/50 text-xs'>
              $
              {formatNumbedecimalScale(
                Number(safeMyMessInfo?.totalBonus || 0) * olyPrice,
                2
              )}
            </div>
          </div>
        </div>

        {/* 可领取的奖金数量 */}
        <div className='lg:row-span-3 relative gap-2 bg-[#1E204C] flex flex-col items-start justify-center px-6'>
          <Statistics
            title={t('claimableRewardsAmount')}
            value={
              safeMyMessInfo?.claimableBonus
                ? `${formatNumbedecimalScale(safeMyMessInfo?.claimableBonus || 0, 2)} OLY`
                : '0 OLY'
            }
            desc={`$${formatNumbedecimalScale(Number(safeMyMessInfo?.claimableBonus || 0) * olyPrice, 2)}`}
            size='sm'
          />
          <Button
            variant='primary'
            clipSize={8}
            clipDirection='topLeft-bottomRight'
            className='h-6 px-3'
            onClick={() => {
              router.push('/dao');
            }}
            disabled={Number(safeMyMessInfo?.claimableBonus || 0) <= 0}
          >
            {t('claim')}
          </Button>
          <div className='absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary'></div>
        </div>

        {/* 释放中的奖金数量 */}
        <div className='col-span-2 relative'>
          <div className='px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center w-full'>
            <Statistics
              title={t('rewardsInRelease')}
              value={
                myReward?.allPending
                  ? `${formatNumbedecimalScale(myReward?.allPending || 0, 2)} OLY`
                  : '0 OLY'
              }
              desc={`$${formatNumbedecimalScale((myReward?.allPending || 0) * olyPrice, 2)}`}
              size='sm'
            />
          </div>
          <div className='absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50'></div>
        </div>

        {/* 已经释放的奖金数量 */}
        <div className='lg:row-span-2 relative'>
          <div className='px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between'>
            <Statistics
              title={t('releasedRewardsAmount')}
              value={
                myReward?.allClaimable
                  ? `${formatNumbedecimalScale(myReward?.allClaimable || 0, 2)} OLY`
                  : '0 OLY'
              }
              desc={`$${formatNumbedecimalScale((myReward?.allClaimable || 0) * olyPrice, 2)}`}
              size='sm'
            />
            <Button
              variant='primary'
              size='sm'
              clipDirection='topRight-bottomLeft'
              onClick={() => {
                router.push('/cooling-pool');
              }}
              disabled={Number(myReward?.allClaimable || 0) <= 0}
            >
              {t('claim')}
            </Button>
          </div>
          <div className='absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary'></div>
        </div>

        {/* 涡轮中的奖金数量 */}

        <div className='relative'>
          <div className='px-6 py-7 bg-[#1E204C] mb-[5px] flex flex-col items-start justify-center'>
            <div className='text-foreground/50 text-xs'>
              {t('turbineRewardsAmount')}
            </div>
            <div className='text-foreground/50 font-mono text-xl'>
              {formatNumbedecimalScale(
                (turbineMessData?.receivedAmount || 0) +
                  (turbineMessData?.claimedAmount || 0),
                2
              )}{' '}
              OLY
            </div>
            <div className='text-foreground/50 text-xs'>
              $
              {formatNumbedecimalScale(
                ((turbineMessData?.receivedAmount || 0) +
                  (turbineMessData?.claimedAmount || 0)) *
                  olyPrice,
                2
              )}
            </div>
          </div>
          <div className='absolute left-0 top-0 bottom-[5px] w-[5px] bg-foreground/50'></div>
        </div>

        {/* 已解锁的奖金数量 */}
        <div className='relative'>
          <div className='px-6 w-full h-full bg-[#1E204C] py-7 flex gap-4 items-center justify-between'>
            <div>
              <div className='text-foreground/50 text-xs'>
                {t('unlockedRewardsAmount')}
              </div>
              <div className='text-foreground/50 font-mono text-xl'>
                {formatNumbedecimalScale(stakeAmount || 0, 2)} OLY
              </div>
              <div className='text-foreground/50 text-xs'>
                ${formatNumbedecimalScale((stakeAmount || 0) * olyPrice, 2)}
              </div>
            </div>
            <Button
              variant='primary'
              size='sm'
              clipDirection='topRight-bottomLeft'
              disabled={Number(stakeAmount || 0) <= 0}
              onClick={() => {
                router.push('/turbine');
              }}
            >
              {t('claim')}
            </Button>
          </div>
          <div className='absolute left-0 top-0 bottom-0 w-[5px] bg-gradient-to-b from-primary to-secondary'></div>
        </div>
      </div>
    </Card>
  );
};

export default Bonus;

'use client';
import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import GrayLogo from '~/assets/gray-logo.svg';
import { Button, Card, Statistics, View } from '~/components';
import { formatCurrency, formatNumbedecimalScale } from '~/lib/utils';
import { PositionDetails } from '~/widgets/position-details';
import { useNolockStore } from '~/store/noLock';
import { useQuery } from '@tanstack/react-query';
import { useUserAddress } from '~/contexts/UserAddressContext';
import type { StakingItem } from '~/wallet/lib/web3/stake';
import { useSafeState } from 'ahooks';
import { blocks as blocksNum } from '~/wallet/constants/tokens';
import { getUserStakes, getNodeStakes } from '~/wallet/lib/web3/stake';
import { myMessDataType } from '../DashboardPage';
import { getCurrentBlock } from '~/lib/multicall';
import { useRouter } from 'next/navigation';

const Stake = ({ myMessInfo }: { myMessInfo: myMessDataType }) => {
  const safeMyMessInfo = myMessInfo || {};
  const t = useTranslations('dashboard');
  const router = useRouter();
  const [allStakeAmount, setAllStakeAmount] = useSafeState(0);
  // const [stakList, setstakList] = useState<StakingItem[]>([]);
  const [totalDays, setTotalDays] = useState<number>(0);
  // 活期质押
  const {
    // olyBalance,
    olyPrice,
    afterHotData,
    // AllolyStakeNum,
    // allnetReabalseNum,
    // demandProfitInfo,
  } = useNolockStore();
  const { userAddress } = useUserAddress();

  //质押列表
  const { data: myStakingList } = useQuery({
    queryKey: ['dashboardUserStakes', userAddress],
    queryFn: () => getUserStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    // retry: 1,
    refetchInterval: 20000,
  });

  //当前块
  const { data: currentBlock } = useQuery({
    queryKey: ['dashboarCurrentBlock'],
    queryFn: () => getCurrentBlock(),
    enabled: Boolean(userAddress),
  });

  //  节点质押
  const { data: myNodeStakingList } = useQuery({
    queryKey: ['dashboarUserNodeStakes', userAddress],
    queryFn: () => getNodeStakes({ address: userAddress as `0x${string}` }),
    enabled: Boolean(userAddress),
    retry: 1,
    refetchInterval: 20000,
  });

  //获取质押总数量
  useEffect(() => {
    const updateList = async () => {
      let allStakeAmount = 0;
      let totalDays = 0;
      console.log(myStakingList, myNodeStakingList, '5555555');
      if (myStakingList?.myStakingList || myNodeStakingList?.length) {
        const list =
          (myStakingList?.myStakingList.length &&
            (myStakingList?.myStakingList as StakingItem[])) ||
          [];
        const nodeList = myNodeStakingList?.length
          ? (myNodeStakingList as StakingItem[])
          : [];
        const curBlock = Number(currentBlock);
        const allList = [...nodeList, ...list];
        const updatedList = allList.map(it => {
          allStakeAmount += it.pending;
          const time = String(
            Number(it.expiry) - curBlock < 0
              ? '0'
              : Number(it.expiry) - curBlock
          );
          const remainingSeconds = Number(time) * blocksNum;
          const days = Math.floor(remainingSeconds / (24 * 60 * 60));
          // it.period
          totalDays += Number(it.period || 0) - days;
          return {
            ...it,
            time,
            isShow: false,
          };
        });
        // allList.forEach((it) => (allStakeAmount += it.pending));
        if (afterHotData?.principal) {
          allStakeAmount =
            allStakeAmount + Number(afterHotData?.principal ?? 0);
        }
        console.log(updatedList, totalDays, 'updatedList');
        // setstakList(updatedList);
        setTotalDays(totalDays);
        setAllStakeAmount(allStakeAmount);
      }
    };
    updateList();
  }, [
    myStakingList?.myStakingList,
    myStakingList,
    setAllStakeAmount,
    myNodeStakingList,
    afterHotData,
    currentBlock,
  ]);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
      {/* 质押仓位 */}
      <Card className='flex flex-col gap-4 relative'>
        <div className='grid grid-cols-2 gap-14'>
          <div className='flex flex-col gap-2 items-start'>
            <div className='w-6 h-6 rounded-full bg-foreground flex items-center justify-center'>
              <Image
                src='/images/widgets/logo.png'
                alt='oly'
                width={16}
                height={6}
              />
            </div>
            <span className='text-white'>{t('stakingPosition')}</span>
            <Button
              clipDirection='topLeft-bottomRight'
              clipSize={8}
              className='font-mono h-6 text-xs'
              onClick={() => {
                router.push('/swap');
              }}
            >
              {t('getOlyToken')}
            </Button>
          </div>
          <View
            clipDirection='topRight-bottomLeft'
            className='p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
          >
            <Statistics
              title={t('pendingRewardsBalance')}
              value={`${formatNumbedecimalScale(safeMyMessInfo?.claimableBonus ?? 0, 2)} OLY`}
              desc={`${formatCurrency(olyPrice * Number(safeMyMessInfo?.claimableBonus ?? 0))}`}
              size='md'
            />
          </View>
        </div>
        <div className='border-t border-foreground/10 w-full'></div>
        <PositionDetails
          data={{
            myStakedAmount: `${formatNumbedecimalScale(allStakeAmount || 0, 2)} OLY`,
            lifetimeRewards: `${formatNumbedecimalScale(safeMyMessInfo?.stakedRewardAmount || 0, 2)} OLY`,
            timeInPool: `${totalDays} d`,
            olyPrice: olyPrice || 0,
          }}
        />
        <GrayLogo className='w-[76px] absolute right-6 bottom-2' />
      </Card>
      {/* 债券仓位 */}
      <Card className='flex flex-col gap-4 relative'>
        <div className='grid grid-cols-2 gap-14'>
          <div className='flex flex-col gap-2 items-start'>
            <div className='flex items-center'>
              <span className="bg-[url('/images/icon/usdt.png')] bg-cover bg-center w-6 h-6"></span>
              <span className="bg-[url('/images/widgets/one.png')] bg-cover bg-center w-6 h-6 -translate-x-2"></span>
            </div>
            <span className='text-white'>{t('bondsPosition')}</span>
            <View
              clipDirection='topLeft-bottomRight'
              border={true}
              clipSize={8}
              borderWidth={2}
              borderColor='#434c8c'
              className='px-6 h-5 flex bg-[#1b1f48]  items-center justify-center  shadow-[inset_0_0_20px_rgba(84,119,247,0.5)] cursor-pointer'
            >
              <span className='text-xs text-white'>{t('getBonds')}</span>
            </View>
          </div>
          <View
            clipDirection='topRight-bottomLeft'
            className='p-4 bg-gradient-to-b from-[#333E8E]/30 to-[#576AF4]/30'
          >
            <Statistics
              title={t('pendingRewardsBalance')}
              value={`${formatNumbedecimalScale(safeMyMessInfo?.bondRewardAmount ?? 0, 2)} OLY`}
              desc='$0.00'
              size='md'
            />
          </View>
        </div>
        <div className='border-t border-foreground/10 w-full'></div>

        <PositionDetails
          data={{
            myStakedAmount: '0.00 OLY',
            lifetimeRewards: `${formatNumbedecimalScale(safeMyMessInfo?.bondRewardAmount || 0, 2)} OLY`,
            timeInPool: '0 d',
            olyPrice: olyPrice || 0,
          }}
        />
      </Card>
    </div>
  );
};

export default Stake;
